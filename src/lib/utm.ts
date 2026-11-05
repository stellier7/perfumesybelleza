import { UTM_KEYS, type UtmKey } from "@/config";

export function pickUtm(params: { get(name: string): string | null }): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) result[key] = value.slice(0, 200);
  }
  return result;
}

export function mergeUtm(
  stored: Record<string, string>,
  incoming: Record<string, string>,
): Record<string, string> {
  const next: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = incoming[key] || stored[key];
    if (value) next[key] = value;
  }
  return next;
}

export function sanitizeUtm(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object") return {};
  const source = value as Record<string, unknown>;
  const result: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const entry: unknown = source[key satisfies UtmKey];
    if (typeof entry === "string" && entry.trim()) result[key] = entry.trim().slice(0, 200);
  }
  return result;
}
