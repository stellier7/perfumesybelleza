import { TYPE_LABEL, GENDER_LABEL } from "@/config";
import { shelfPrice } from "@/lib/pricing";
import { fold, slugify } from "@/lib/text";
import type {
  FragranceNotes,
  FragranceRef,
  PublicProduct,
  RawProduct,
  SearchRecord,
} from "@/types/catalog";

const INSPIRED_PATTERN = /^(.*?)\s*\(([^)]+)\)\s*$/;

export function emptyNotes(): FragranceNotes {
  return { top: [], heart: [], base: [] };
}

export function parseInspiredLabel(value: string): { name: string; brand: string } {
  const trimmed = value.trim();
  const match = trimmed.match(INSPIRED_PATTERN);
  if (!match) return { name: trimmed, brand: "" };
  return { name: match[1].trim(), brand: match[2].trim() };
}

function toRef(product: PublicProduct): FragranceRef {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    inStock: product.inStock,
    isReference: product.isReference,
  };
}

function toPublicBase(raw: RawProduct): PublicProduct {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    brand: raw.brand,
    type: raw.type,
    gender: raw.gender,
    price: shelfPrice(raw),
    images: raw.images,
    description: raw.description,
    notes: raw.notes,
    sizeMl: raw.sizeMl,
    sizeLabel: raw.sizeLabel,
    inStock: raw.inStock,
    category: raw.category,
    tags: raw.tags,
    longevity: raw.longevity,
    projection: raw.projection,
    bestFor: raw.bestFor,
    pros: raw.pros,
    cons: raw.cons,
    verdict: raw.verdict,
    featured: raw.featured,
    isReference: false,
    inspiredBy: [],
    alternatives: [],
    inspirationRank: raw.inspirationRank,
  };
}

export function inspirationOrder(
  left: { inspirationRank?: number; name: string },
  right: { inspirationRank?: number; name: string },
): number {
  const rank = (left.inspirationRank ?? 100) - (right.inspirationRank ?? 100);
  if (rank !== 0) return rank;
  return left.name.localeCompare(right.name, "es");
}

/** «Creed Aventus». Si el nombre ya trae la marca, no la repite. */
export function nameWithBrand(name: string, brand: string): string {
  const trimmed = brand.trim();
  if (!trimmed) return name;
  if (fold(name).includes(fold(trimmed))) return name;
  return `${trimmed} ${name}`;
}

function referenceProduct(name: string, brand: string): PublicProduct {
  const slug = slugify(name);
  return {
    id: `ref-${slug}`,
    slug,
    name,
    brand,
    type: "designer",
    gender: "unisex",
    price: 0,
    images: [],
    description: `${nameWithBrand(name, brand)} es una referencia de aroma. No lo tenemos en el catálogo. Más abajo encuentras alternativas para quienes buscan un aroma similar.`,
    notes: emptyNotes(),
    sizeMl: null,
    inStock: false,
    category: "Referencia",
    tags: [name, brand].filter(Boolean),
    isReference: true,
    inspiredBy: [],
    alternatives: [],
  };
}

export function buildCatalog(rawProducts: RawProduct[]): PublicProduct[] {
  const products = rawProducts.map(toPublicBase);
  const byId = new Map(products.map((product) => [product.id, product]));
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const byName = new Map(products.map((product) => [fold(product.name), product]));
  const references = new Map<string, PublicProduct>();

  function resolve(token: string): PublicProduct {
    const folded = fold(token);
    const parsed = parseInspiredLabel(token);
    const direct =
      byId.get(token) ??
      bySlug.get(token) ??
      byName.get(folded) ??
      byName.get(fold(parsed.name));
    if (direct && !direct.isReference) return direct;

    const slug = slugify(parsed.name);
    const id = `ref-${slug}`;
    const existing = references.get(id);
    if (existing) return existing;
    const created = referenceProduct(parsed.name, parsed.brand);
    references.set(id, created);
    return created;
  }

  for (const raw of rawProducts) {
    if (!raw.inspiredBy?.length) continue;
    const product = byId.get(raw.id);
    if (!product) continue;
    const resolved = raw.inspiredBy.map(resolve);
    product.inspiredBy = resolved.map(toRef);
    for (const original of resolved) {
      if (original.type !== "designer" && !original.isReference) continue;
      if (original.alternatives.some((item) => item.id === product.id)) continue;
      original.alternatives.push(toRef(product));
    }
  }

  const catalog = [...products, ...references.values()];
  const ranked = new Map(catalog.map((product) => [product.id, product]));
  for (const product of catalog) {
    product.alternatives.sort((left, right) => inspirationOrder(ranked.get(left.id) ?? left, ranked.get(right.id) ?? right));
  }
  return catalog;
}

export function toSearchRecord(product: PublicProduct): SearchRecord {
  const inspired = product.inspiredBy.map((item) => `${item.name} ${item.brand}`.trim());
  const haystack = fold(
    [
      product.name,
      product.brand,
      product.category,
      TYPE_LABEL[product.type],
      GENDER_LABEL[product.gender],
      product.tags.join(" "),
      product.sizeLabel ?? "",
      inspired.join(" "),
    ].join(" "),
  );
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    type: product.type,
    gender: product.gender,
    price: product.price,
    image: product.images[0] ?? null,
    inStock: product.inStock,
    isReference: product.isReference,
    category: product.category,
    tags: product.tags,
    haystack,
    alternativeIds: product.alternatives.map((item) => item.id),
    inspiredNames: product.inspiredBy.map((item) => item.name),
    inspirationRank: product.inspirationRank,
  };
}

export type ComparisonPair = {
  slug: string;
  original: PublicProduct;
  alternative: PublicProduct;
};

export function formatSize(product: { sizeMl: number | null; sizeLabel?: string }): string | null {
  if (product.sizeLabel) return product.sizeLabel;
  if (product.sizeMl) return `${product.sizeMl} ml`;
  return null;
}

export function comparisonSlug(originalSlug: string, alternativeSlug: string): string {
  return `${originalSlug}-vs-${alternativeSlug}`;
}

export function parseComparisonSlug(
  pair: string,
): { original: string; alternative: string } | null {
  const marker = "-vs-";
  const index = pair.indexOf(marker);
  if (index <= 0) return null;
  const original = pair.slice(0, index);
  const alternative = pair.slice(index + marker.length);
  if (!original || !alternative) return null;
  return { original, alternative };
}

export function comparisonPairs(products: PublicProduct[]): ComparisonPair[] {
  const byId = new Map(products.map((product) => [product.id, product]));
  const pairs: ComparisonPair[] = [];
  for (const product of products) {
    if (product.type !== "arabic" || product.isReference) continue;
    for (const inspired of product.inspiredBy) {
      const original = byId.get(inspired.id);
      if (!original) continue;
      pairs.push({
        slug: comparisonSlug(original.slug, product.slug),
        original,
        alternative: product,
      });
    }
  }
  return pairs;
}
