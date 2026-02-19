import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { classifyPrType } from "../src/ai.js";

describe("classifyPrType", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns type from OpenAI response", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "feature" } }],
      }),
    } as Response);

    const result = await classifyPrType(
      { provider: "openai", model: "gpt-4o-mini", apiKey: "test" },
      "Add new login flow",
      "diff content",
    );

    expect(result).toBe("feature");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.openai.com/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test",
        }),
        body: expect.stringContaining("Add new login flow"),
      }),
    );
  });

  it("returns chore when OpenAI returns empty content", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{}] }),
    } as Response);

    const result = await classifyPrType(
      { provider: "openai", model: "gpt-4o-mini", apiKey: "test" },
      "Fix stuff",
      "diff",
    );

    expect(result).toBe("chore");
  });

  it("returns type from Anthropic response", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        content: [{ text: "fix" }],
      }),
    } as Response);

    const result = await classifyPrType(
      {
        provider: "anthropic",
        model: "claude-3-haiku",
        apiKey: "test",
      },
      "Fix null pointer",
      "diff",
    );

    expect(result).toBe("fix");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.anthropic.com/v1/messages",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "x-api-key": "test",
        }),
      }),
    );
  });

  it("throws on OpenAI error response", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    } as Response);

    await expect(
      classifyPrType(
        { provider: "openai", model: "gpt-4o-mini", apiKey: "bad" },
        "Title",
        "diff",
      ),
    ).rejects.toThrow("OpenAI error: 401");
  });

  it("throws on Anthropic error response", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
    } as Response);

    await expect(
      classifyPrType(
        {
          provider: "anthropic",
          model: "claude-3-haiku",
          apiKey: "bad",
        },
        "Title",
        "diff",
      ),
    ).rejects.toThrow("Anthropic error: 403");
  });

  it("truncates diff to 3000 chars", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "docs" } }],
      }),
    } as Response);

    const longDiff = "x".repeat(5000);
    await classifyPrType(
      { provider: "openai", model: "gpt-4o-mini", apiKey: "test" },
      "Update README",
      longDiff,
    );

    const call = mockFetch.mock.calls[0];
    const callBody = call
      ? JSON.parse((call[1] as RequestInit)?.body as string)
      : {};
    const userContent = callBody.messages.find(
      (m: { role: string }) => m.role === "user",
    )?.content;
    expect(userContent).toContain("x".repeat(3000));
    expect(userContent?.length).toBeLessThanOrEqual(3500); // title + diff prefix + 3000
  });
});
