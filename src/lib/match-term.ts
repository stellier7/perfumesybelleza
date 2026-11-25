import { fold } from "@/lib/text";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** True when `term` starts a word in `haystack`. Accents and case are ignored. */
export function haystackIncludes(haystack: string, term: string): boolean {
  const needle = fold(term);
  if (!needle) return false;
  const pattern = new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(needle)}`);
  return pattern.test(fold(haystack));
}

export function matchesAnyTerm(haystack: string, terms: readonly string[]): boolean {
  return terms.some((term) => haystackIncludes(haystack, term));
}
