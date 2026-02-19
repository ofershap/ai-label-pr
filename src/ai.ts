export interface AiConfig {
  provider: "openai" | "anthropic";
  model: string;
  apiKey: string;
}

export async function classifyPrType(
  config: AiConfig,
  title: string,
  diff: string,
): Promise<string> {
  const systemPrompt = `You classify pull requests into exactly one type. Respond with ONLY the type label, nothing else.

Types:
- feature: New functionality or capability
- fix: Bug fix or error correction
- docs: Documentation changes only
- refactor: Code restructuring without behavior change
- test: Adding or updating tests only
- chore: Build, CI, dependencies, or maintenance`;

  const userPrompt = `PR title: ${title}\n\nDiff (first 3000 chars):\n${diff.slice(0, 3000)}`;

  if (config.provider === "openai") {
    return callOpenAI(config, systemPrompt, userPrompt);
  }
  return callAnthropic(config, systemPrompt, userPrompt);
}

async function callOpenAI(
  config: AiConfig,
  system: string,
  user: string,
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0,
      max_tokens: 20,
    }),
  });
  if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);
  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };
  return (data.choices[0]?.message?.content ?? "chore").trim().toLowerCase();
}

async function callAnthropic(
  config: AiConfig,
  system: string,
  user: string,
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 20,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!response.ok) throw new Error(`Anthropic error: ${response.status}`);
  const data = (await response.json()) as { content: { text: string }[] };
  return (data.content[0]?.text ?? "chore").trim().toLowerCase();
}
