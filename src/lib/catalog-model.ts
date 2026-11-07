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
  left: { inspirationRank?: number; name: string; price?: number },
  right: { inspirationRank?: number; name: string; price?: number },
): number {
  const rank = (left.inspirationRank ?? 100) - (right.inspirationRank ?? 100);
  if (rank !== 0) return rank;
  const leftPrice = left.price && left.price > 0 ? left.price : Number.POSITIVE_INFINITY;
  const rightPrice = right.price && right.price > 0 ? right.price : Number.POSITIVE_INFINITY;
  if (leftPrice !== rightPrice) return leftPrice - rightPrice;
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

/** Lo más específico va primero. Un estuche con varios aromas no entra en una sola familia. */
const SCENT_RULES: Array<[RegExp, string]> = [
  [/\bsauvage elixir\b/, "sauvage-elixir"],
  [/\bsauvage\b/, "sauvage"],
  [/\baventus for her\b/, "aventus-for-her"],
  [/\baventus\b/, "aventus"],
  [/\bbleu de chanel\b/, "bleu-de-chanel"],
  [/\binvictus victory\b/, "invictus-victory"],
  [/\binvictus aqua\b/, "invictus-aqua"],
  [/\binvictus\b/, "invictus"],
  [/\bacqua di gio profondo\b/, "acqua-di-gio-profondo"],
  [/\bacqua di gio elixir\b/, "acqua-di-gio-elixir"],
  [/\bacqua di gioia\b/, "acqua-di-gioia"],
  [/\bacqua di gio\b/, "acqua-di-gio"],
  [/\bvery good girl\b/, "very-good-girl"],
  [/\bgood\s?girl\b/, "good-girl"],
  [/\bblack opium\b/, "black-opium"],
  [/\bblack xs\b/, "black-xs"],
  [/\bultra male\b/, "ultra-male"],
  [/\ble beau\b/, "le-beau"],
  [/\ble male\b/, "le-male"],
  [/\beros energy\b/, "eros-energy"],
  [/\beros\b/, "eros"],
  [/\bangel elixir\b/, "angel-elixir"],
  [/\bange ou\b|\bangel y demonio\b/, "ange-ou-demon"],
  [/\bangel\b/, "angel"],
  [/\bthe most wanted\b|\bmost wanted\b/, "most-wanted"],
  [/\bbad boy\b/, "bad-boy"],
  [/\bscandal\b/, "scandal"],
  [/\bdylan blue\b/, "dylan-blue"],
  [/\b1 million\b|\bone million\b/, "1-million"],
  [/\bcoco mademoiselle\b/, "coco-mademoiselle"],
  [/\blady million\b/, "lady-million"],
  [/\bphantom\b/, "phantom"],
  [/\binterdit\b/, "l-interdit"],
  [/\bdelina\b/, "delina"],
  [/\bspicebomb\b|\bspice bomb\b/, "spicebomb"],
  [/\bpolo red\b/, "polo-red"],
  [/\bcool water\b/, "cool-water"],
  [/\b212 vip\b/, "212-vip"],
  [/\b212\b/, "212"],
  [/\berba gold\b/, "erba-gold"],
  [/\berba pura\b/, "erba-pura"],
  [/\bbaccarat rouge\b|\bbr540\b|\bbr 540\b/, "baccarat-rouge"],
  [/\bmillesime imperial\b/, "millesime"],
  [/\bsilver mountain water\b/, "silver-mountain"],
  [/\bgreen irish tweed\b/, "green-irish-tweed"],
  [/\bvoce viva\b/, "voce-viva"],
  [/\bombre leather\b/, "ombre-leather"],
  [/\bangels'? share\b/, "angels-share"],
  [/\bbianco latte\b/, "bianco-latte"],
  [/\boud for greatness\b/, "oud-for-greatness"],
  [/\boud satin mood\b/, "oud-satin-mood"],
  [/\bvalentina\b/, "valentina"],
  [/\bjoop\b/, "joop"],
  [/\bla belle\b/, "la-belle"],
  [/\bfame\b/, "fame"],
  [/\bopium\b/, "opium"],
];

const SCENT_PARENT: Record<string, string> = {
  "sauvage-elixir": "sauvage",
};

export function scentKey(name: string, brand: string): string | null {
  const blob = fold(`${brand} ${name}`);
  if (blob.includes("+") || blob.includes("wardrobe")) return null;
  for (const [pattern, key] of SCENT_RULES) {
    if (pattern.test(blob)) return key;
  }
  return null;
}

export function buildCatalog(rawProducts: RawProduct[]): PublicProduct[] {
  const products = rawProducts.map(toPublicBase);
  const byId = new Map(products.map((product) => [product.id, product]));
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const byName = new Map(products.map((product) => [fold(product.name), product]));
  const references = new Map<string, PublicProduct>();

  function stockedScent(name: string, brand: string): PublicProduct | undefined {
    const key = scentKey(name, brand);
    if (!key) return undefined;
    const matches = products.filter((item) => {
      if (item.type !== "designer" || item.category === "Set") return false;
      if (item.sizeMl !== null && item.sizeMl < 30) return false;
      return scentKey(item.name, item.brand) === key;
    });
    const exact = matches.find((item) => fold(item.name) === fold(name));
    if (exact) return exact;
    const extra = ["blush", "elixir", "intense", "profondo", "aqua", "victory", "absolu", "extreme", "glam"];
    const penalty = (item: PublicProduct) => {
      const folded = fold(item.name);
      const wanted = fold(name);
      return extra.reduce(
        (score, word) => score + (folded.includes(word) && !wanted.includes(word) ? 1 : 0),
        0,
      );
    };
    return [...matches].sort(
      (left, right) =>
        penalty(left) - penalty(right) ||
        left.name.length - right.name.length ||
        left.name.localeCompare(right.name, "es"),
    )[0];
  }

  function resolve(token: string): PublicProduct {
    const folded = fold(token);
    const parsed = parseInspiredLabel(token);
    const direct = byId.get(token) ?? bySlug.get(token);
    if (direct && !direct.isReference) return direct;
    const named = byName.get(folded) ?? byName.get(fold(parsed.name));
    if (named && named.type === "designer" && !named.isReference) return named;
    const stocked = stockedScent(parsed.name, parsed.brand);
    if (stocked) return stocked;

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

/** Clones del mismo aroma, también en las otras presentaciones de ese diseñador. */
export function sameScentAlternatives(product: PublicProduct, catalog: PublicProduct[]): PublicProduct[] {
  const ids = new Set(product.alternatives.map((item) => item.id));
  const key = product.type === "designer" || product.isReference ? scentKey(product.name, product.brand) : null;
  if (key) {
    const keys = new Set([key]);
    for (const [child, parent] of Object.entries(SCENT_PARENT)) {
      if (parent === key) keys.add(child);
    }
    for (const item of catalog) {
      if (item.type !== "designer" && !item.isReference) continue;
      const itemKey = scentKey(item.name, item.brand);
      if (!itemKey || !keys.has(itemKey)) continue;
      for (const alternative of item.alternatives) ids.add(alternative.id);
    }
  }
  const byId = new Map(catalog.map((item) => [item.id, item]));
  return [...ids]
    .flatMap((id) => {
      const item = byId.get(id);
      return item && item.id !== product.id && item.type !== "designer" ? [item] : [];
    })
    .sort(inspirationOrder);
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
