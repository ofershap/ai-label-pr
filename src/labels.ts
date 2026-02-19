export type SizeLabel =
  | "size/XS"
  | "size/S"
  | "size/M"
  | "size/L"
  | "size/XL"
  | "size/XXL";

export function getSizeLabel(additions: number, deletions: number): SizeLabel {
  const total = additions + deletions;
  if (total < 10) return "size/XS";
  if (total < 50) return "size/S";
  if (total < 200) return "size/M";
  if (total < 500) return "size/L";
  if (total < 1000) return "size/XL";
  return "size/XXL";
}

export const ALL_SIZE_LABELS: SizeLabel[] = [
  "size/XS",
  "size/S",
  "size/M",
  "size/L",
  "size/XL",
  "size/XXL",
];
export const ALL_TYPE_LABELS = [
  "type/feature",
  "type/fix",
  "type/docs",
  "type/refactor",
  "type/test",
  "type/chore",
] as const;
export type TypeLabel = (typeof ALL_TYPE_LABELS)[number];
