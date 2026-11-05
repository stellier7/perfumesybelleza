import Fuse from "fuse.js";
import { fold } from "@/lib/text";
import type { SearchRecord } from "@/types/catalog";

export type SearchPresentation = {
  query: string;
  products: SearchRecord[];
  stockedOriginals: SearchRecord[];
  missingOriginals: SearchRecord[];
  alternatives: SearchRecord[];
};

function editDistance(left: string, right: string): number {
  if (Math.abs(left.length - right.length) > 2) return 3;
  const rows = Array.from({ length: left.length + 1 }, (_, index) => index);
  for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
    let previous = rows[0];
    rows[0] = rightIndex;
    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
      const current = rows[leftIndex];
      const cost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      rows[leftIndex] = Math.min(rows[leftIndex] + 1, rows[leftIndex - 1] + 1, previous + cost);
      previous = current;
    }
  }
  return rows[left.length];
}

function tokensMatch(haystack: string, query: string): boolean {
  const queryWords = query.split(" ").filter((word) => word.length >= 3);
  if (queryWords.length === 0) return haystack.includes(query);
  const haystackWords = haystack.split(" ");
  return queryWords.every((word) =>
    haystackWords.some((token) => {
      if (token.includes(word) || word.includes(token)) return true;
      return editDistance(token, word) <= 1;
    }),
  );
}

function matchRecords(records: SearchRecord[], query: string): SearchRecord[] {
  const folded = fold(query);
  if (folded.length < 2) return [];
  const direct = records.filter((record) => tokensMatch(record.haystack, folded));
  const fuse = new Fuse(records, {
    keys: ["name"],
    threshold: 0.45,
    ignoreLocation: true,
    minMatchCharLength: 2,
    includeScore: true,
  });
  const fuzzy = fuse
    .search(folded)
    .filter((result) => (result.score ?? 1) <= 0.45)
    .map((result) => result.item);
  const seen = new Set<string>();
  const merged: SearchRecord[] = [];
  for (const record of [...direct, ...fuzzy]) {
    if (seen.has(record.id)) continue;
    seen.add(record.id);
    merged.push(record);
  }
  return merged;
}

export function searchCatalog(records: SearchRecord[], query: string): SearchPresentation {
  const trimmed = query.trim();
  const hits = matchRecords(records, trimmed);
  const byId = new Map(records.map((record) => [record.id, record]));
  const originals = hits.filter((hit) => hit.type === "designer" || hit.isReference);
  const stockedOriginals = originals.filter((hit) => !hit.isReference);
  const missingOriginals = originals.filter((hit) => hit.isReference);
  const alternativeIds = new Set<string>();
  for (const original of originals) {
    for (const id of original.alternativeIds) alternativeIds.add(id);
  }
  const alternatives = [...alternativeIds].flatMap((id) => {
    const record = byId.get(id);
    return record && !record.isReference ? [record] : [];
  });
  const alternativeSet = new Set(alternatives.map((item) => item.id));
  const products = hits.filter((hit) => !hit.isReference && !alternativeSet.has(hit.id));
  return {
    query: trimmed,
    products,
    stockedOriginals,
    missingOriginals,
    alternatives,
  };
}

export function suggestionItems(presentation: SearchPresentation, limit = 6): SearchRecord[] {
  const ordered = [
    ...presentation.products,
    ...presentation.stockedOriginals.filter(
      (item) => !presentation.products.some((product) => product.id === item.id),
    ),
    ...presentation.alternatives,
  ];
  const seen = new Set<string>();
  const items: SearchRecord[] = [];
  for (const item of ordered) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    items.push(item);
    if (items.length >= limit) break;
  }
  return items;
}
