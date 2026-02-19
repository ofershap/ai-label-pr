import { describe, expect, it } from "vitest";
import { getSizeLabel } from "../src/labels.js";

describe("getSizeLabel", () => {
  it("returns size/XS for total < 10", () => {
    expect(getSizeLabel(0, 0)).toBe("size/XS");
    expect(getSizeLabel(5, 0)).toBe("size/XS");
    expect(getSizeLabel(0, 4)).toBe("size/XS");
    expect(getSizeLabel(5, 4)).toBe("size/XS");
  });

  it("returns size/S for total 10–49", () => {
    expect(getSizeLabel(10, 0)).toBe("size/S");
    expect(getSizeLabel(25, 24)).toBe("size/S");
    expect(getSizeLabel(0, 49)).toBe("size/S");
  });

  it("returns size/M for total 50–199", () => {
    expect(getSizeLabel(50, 0)).toBe("size/M");
    expect(getSizeLabel(100, 50)).toBe("size/M");
    expect(getSizeLabel(150, 49)).toBe("size/M");
  });

  it("returns size/L for total 200–499", () => {
    expect(getSizeLabel(200, 0)).toBe("size/L");
    expect(getSizeLabel(250, 249)).toBe("size/L");
    expect(getSizeLabel(499, 0)).toBe("size/L");
  });

  it("returns size/XL for total 500–999", () => {
    expect(getSizeLabel(500, 0)).toBe("size/XL");
    expect(getSizeLabel(500, 499)).toBe("size/XL");
    expect(getSizeLabel(999, 0)).toBe("size/XL");
  });

  it("returns size/XXL for total >= 1000", () => {
    expect(getSizeLabel(1000, 0)).toBe("size/XXL");
    expect(getSizeLabel(500, 500)).toBe("size/XXL");
    expect(getSizeLabel(10000, 5000)).toBe("size/XXL");
  });
});
