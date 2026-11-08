import Fuse from "fuse.js";
import { inspirationOrder } from "@/lib/catalog-model";
import { CATALOG_SECTIONS, type CatalogSection } from "@/lib/catalog-section";
import { fold } from "@/lib/text";
import type { SearchRecord } from "@/types/catalog";

export type InspirationGroup = {
  original: SearchRecord;
  clones: SearchRecord[];
  sets: SearchRecord[];
};

export type SearchPresentation = {
  query: string;
  products: SearchRecord[];
  stockedOriginals: SearchRecord[];
  missingOriginals: SearchRecord[];
  alternatives: SearchRecord[];
  groups: InspirationGroup[];
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
      if (token.includes(word)) return true;
      if (token.length >= 4 && word.includes(token)) return true;
      return editDistance(token, word) <= 1;
    }),
  );
}

/** La búsqueda nombra este perfume, no solo su marca. «Creed» no nombra Aventus; «Millésime» sí. */
export function queryNamesOriginal(query: string, original: SearchRecord): boolean {
  const foldedQuery = fold(query);
  const brand = fold(original.brand);
  const name = fold(original.name);
  let rest = foldedQuery;
  if (brand && rest.includes(brand)) rest = rest.replace(brand, " ");
  rest = rest.replace(/\s+/g, " ").trim();
  if (rest.length < 2) return rest.length > 0 && rest === name;
  const nameWords = name.split(" ").filter((word) => word.length >= 3);
  const words = nameWords.length > 0 ? nameWords : name ? [name] : [];
  const queryWords = rest.split(" ").filter((word) => word.length >= 2);
  return words.some((word) =>
    queryWords.some(
      (token) => token.includes(word) || word.includes(token) || editDistance(token, word) <= 1,
    ),
  );
}

const NAME_NOISE = new Set([
  "edp",
  "edt",
  "edc",
  "sp",
  "parfum",
  "eau",
  "de",
  "toilette",
  "pour",
  "homme",
  "femme",
  "men",
  "man",
  "ml",
  "oz",
  "set",
  "est",
]);

function coreName(record: SearchRecord): string {
  const brand = fold(record.brand);
  const words = fold(record.name)
    .split(" ")
    .filter((word) => word.length > 0 && word !== brand && !NAME_NOISE.has(word) && !/^\d+(?:[.,]\d+)?$/.test(word));
  return words.join(" ");
}

/** Qué tanto el producto es lo que se escribió. 100 es el nombre, sin la marca ni el tamaño. */
function resemblance(record: SearchRecord, query: string): number {
  const folded = fold(query);
  const name = fold(record.name);
  const full = fold(`${record.brand} ${record.name}`);
  const core = coreName(record);
  if (core === folded || name === folded || full === folded) return 100;
  if (fold(record.brand) === folded) return 60;
  if (core.startsWith(`${folded} `) || name.startsWith(`${folded} `)) return 92;
  if (core.includes(folded) || name.includes(folded) || full.includes(folded)) {
    const extra = Math.max(0, core.split(" ").filter(Boolean).length - folded.split(" ").filter(Boolean).length);
    return Math.max(70, 88 - extra * 4);
  }
  const words = folded.split(" ").filter((word) => word.length >= 2);
  if (words.length === 0) return 0;
  const tokens = full.split(" ").filter((word) => word.length > 0);
  let covered = 0;
  for (const word of words) {
    if (tokens.some((token) => token === word || token.includes(word) || word.includes(token))) {
      covered += 1;
      continue;
    }
    if (tokens.some((token) => editDistance(token, word) <= 1)) covered += 0.6;
  }
  const ratio = Math.round((covered / words.length) * 50);
  if (fold(record.brand) === folded) return Math.max(60, ratio);
  return ratio;
}

function byPrompt(query: string): (left: SearchRecord, right: SearchRecord) => number {
  return (left, right) => {
    const closeness = resemblance(right, query) - resemblance(left, query);
    if (closeness !== 0) return closeness;
    const trending = right.trending - left.trending;
    if (trending !== 0) return trending;
    const side =
      Number(left.category === "Set" || left.category === "Desodorante") -
      Number(right.category === "Set" || right.category === "Desodorante");
    if (side !== 0) return side;
    const coreLength = coreName(left).length - coreName(right).length;
    if (coreLength !== 0) return coreLength;
    const nameLength = fold(left.name).length - fold(right.name).length;
    if (nameLength !== 0) return nameLength;
    return left.name.localeCompare(right.name, "es") || left.id.localeCompare(right.id);
  };
}

function matchRecords(records: SearchRecord[], query: string): SearchRecord[] {
  const folded = fold(query);
  if (folded.length < 2) return [];
  const direct = records.filter((record) => tokensMatch(record.haystack, folded));
  if (direct.length > 0) return direct;
  const fuse = new Fuse(records, {
    keys: ["name"],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 3,
    includeScore: true,
  });
  return fuse
    .search(folded)
    .filter((result) => (result.score ?? 1) <= 0.35)
    .map((result) => result.item);
}

function containsPhrase(query: string, phrase: string): boolean {
  return query === phrase || query.startsWith(`${phrase} `) || query.endsWith(` ${phrase}`) || query.includes(` ${phrase} `);
}

/** La marca pertenece a una sola sección. */
function brandMatches(brand: string, query: string): boolean {
  const foldedBrand = fold(brand);
  const foldedQuery = fold(query);
  if (foldedBrand.length < 2 || foldedQuery.length < 2) return false;
  if (containsPhrase(foldedQuery, foldedBrand)) return true;
  return foldedQuery.length >= 3 && foldedBrand.startsWith(foldedQuery);
}

function sectionsWithField(
  records: SearchRecord[],
  query: string,
  field: "brand" | "category",
  matches: (value: string, query: string) => boolean,
): CatalogSection[] {
  const found = new Set<CatalogSection>();
  for (const record of records) {
    if (record.isReference) continue;
    if (matches(record[field], query)) found.add(record.section);
  }
  return CATALOG_SECTIONS.filter((section) => found.has(section));
}

function categoryMatches(category: string, query: string): boolean {
  const foldedCategory = fold(category);
  const foldedQuery = fold(query);
  if (foldedCategory.length < 3 || foldedQuery.length < 3) return false;
  return containsPhrase(foldedQuery, foldedCategory);
}

/** Secciones que responden esta búsqueda. Si la sección viene fija, se respeta. */
export function searchSections(
  records: SearchRecord[],
  query: string,
  locked?: CatalogSection,
): CatalogSection[] {
  if (locked) return [locked];
  if (fold(query).length < 2) return [];
  const byBrand = sectionsWithField(records, query, "brand", brandMatches);
  if (byBrand.length > 0) return byBrand;
  const byCategory = sectionsWithField(records, query, "category", categoryMatches);
  if (byCategory.length > 0) return byCategory;
  return CATALOG_SECTIONS.filter(
    (section) => matchRecords(records.filter((record) => record.section === section), query).length > 0,
  );
}

export function searchPath(records: SearchRecord[], query: string): string {
  const trimmed = query.trim();
  const params = new URLSearchParams({ q: trimmed });
  const sections = searchSections(records, trimmed);
  if (sections.length === 1) params.set("seccion", sections[0]);
  return `/buscar?${params}`;
}

export function suggestionsForQuery(
  records: SearchRecord[],
  query: string,
  limit = 6,
  locked?: CatalogSection,
): SearchRecord[] {
  const sections = searchSections(records, query, locked);
  if (sections.length === 0) return [];
  const perSection = Math.max(1, Math.ceil(limit / sections.length));
  const seen = new Set<string>();
  const items: SearchRecord[] = [];
  for (const section of sections) {
    for (const item of suggestionItems(searchCatalog(records, query, section), perSection)) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      items.push(item);
      if (items.length >= limit) return items;
    }
  }
  return items;
}

export function searchCatalog(
  records: SearchRecord[],
  query: string,
  section?: CatalogSection,
): SearchPresentation {
  const scoped = section ? records.filter((record) => record.section === section) : records;
  const trimmed = query.trim();
  const hits = matchRecords(scoped, trimmed);
  const byId = new Map(scoped.map((record) => [record.id, record]));
  const order = byPrompt(trimmed);
  const originals = hits.filter((hit) => hit.type === "designer" || hit.isReference);
  const stockedOriginals = originals.filter((hit) => !hit.isReference).sort(order);
  const missingOriginals = originals.filter((hit) => hit.isReference).sort(order);
  const alternativeIds = new Set<string>();
  for (const original of originals) {
    for (const id of original.alternativeIds) alternativeIds.add(id);
  }
  const alternatives = [...alternativeIds].flatMap((id) => {
    const record = byId.get(id);
    return record && !record.isReference ? [record] : [];
  });
  alternatives.sort(inspirationOrder);
  const groups = [...stockedOriginals, ...missingOriginals].flatMap((original) => {
    const linked = original.alternativeIds.flatMap((id) => {
      const record = byId.get(id);
      return record && !record.isReference ? [record] : [];
    });
    if (linked.length === 0) return [];
    const ordered = [...linked].sort(inspirationOrder);
    return [
      {
        original,
        clones: ordered.filter((item) => item.category !== "Set"),
        sets: ordered.filter((item) => item.category === "Set"),
      },
    ];
  });
  const alternativeSet = new Set(alternatives.map((item) => item.id));
  const products = hits.filter((hit) => !hit.isReference && !alternativeSet.has(hit.id)).sort(order);
  return {
    query: trimmed,
    products,
    stockedOriginals,
    missingOriginals,
    alternatives,
    groups,
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
