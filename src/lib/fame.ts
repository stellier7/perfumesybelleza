import { fold } from "@/lib/text";

/** Un número menor sale primero. 500 es un producto sin fama reconocida. */
export const FAME_UNKNOWN = 500;

export type FameSubject = {
  id: string;
  brand: string;
  name: string;
  category: string;
  featured?: boolean;
};

type FameRule = {
  rank: number;
  phrase: string;
  brands: string[];
  /** line: un riel por fragancia. brand: el héroe de esa marca, sin repetir la marca. */
  group: "line" | "brand";
  pattern: RegExp;
  brandPatterns: RegExp[];
};

/**
 * Líneas que más se venden en 2026, con la fuente al lado del bloque.
 * Perfumes: LVMH (Sauvage), Circana/WWD (Good Girl en América y Europa),
 * L'Oréal (Libre, La Vie Est Belle) y el retail árabe (Yara y Khamrah).
 * Cuidado y belleza: lo que está en este catálogo y también en el circuito viral
 * (Anua, Skin1004, Beauty of Joseon, COSRX, Karseell, Beauty Creations).
 */
const LINE_RULES: Array<Omit<FameRule, "pattern" | "brandPatterns" | "group">> = [
  { rank: 1, phrase: "sauvage", brands: ["dior"] },
  { rank: 2, phrase: "good girl", brands: ["carolina herrera"] },
  { rank: 3, phrase: "libre", brands: ["yves saint laurent", "ysl"] },
  { rank: 4, phrase: "yara", brands: ["lattafa"] },
  { rank: 5, phrase: "khamrah", brands: ["lattafa"] },
  { rank: 6, phrase: "asad", brands: ["lattafa"] },
  { rank: 7, phrase: "le male", brands: ["jean paul gaultier", "gaultier"] },
  { rank: 8, phrase: "one million", brands: ["paco rabanne", "rabanne"] },
  { rank: 8, phrase: "1 million", brands: ["paco rabanne", "rabanne"] },
  { rank: 9, phrase: "black opium", brands: ["yves saint laurent", "ysl"] },
  { rank: 10, phrase: "acqua di gio", brands: ["armani"] },
  { rank: 11, phrase: "cloud", brands: ["ariana grande"] },
  { rank: 12, phrase: "eros", brands: ["versace"] },
  { rank: 13, phrase: "invictus", brands: ["paco rabanne", "rabanne"] },
  { rank: 14, phrase: "club de nuit intense", brands: ["armaf"] },
  { rank: 15, phrase: "sillage", brands: ["armaf"] },
  { rank: 16, phrase: "milestone", brands: ["armaf"] },
  { rank: 17, phrase: "club de nuit", brands: ["armaf"] },
  { rank: 18, phrase: "scandal", brands: ["jean paul gaultier", "gaultier"] },
  { rank: 19, phrase: "light blue", brands: ["dolce"] },
  { rank: 20, phrase: "daisy", brands: ["marc jacobs"] },
  { rank: 21, phrase: "la vie est belle", brands: ["lancome"] },
  { rank: 22, phrase: "born in roma", brands: ["valentino"] },
  { rank: 23, phrase: "bad boy", brands: ["carolina herrera"] },
  { rank: 24, phrase: "spicebomb", brands: ["viktor"] },
  { rank: 25, phrase: "stronger with you", brands: ["armani"] },
  { rank: 26, phrase: "badee al oud", brands: ["lattafa"] },
  { rank: 27, phrase: "hawas", brands: ["hawas", "lattafa", "rasasi"] },
  { rank: 28, phrase: "9pm", brands: ["afnan"] },
  { rank: 29, phrase: "supremacy", brands: ["afnan"] },
  { rank: 30, phrase: "qaed al fursan", brands: ["lattafa"] },
  { rank: 31, phrase: "mayar", brands: ["lattafa"] },
  { rank: 32, phrase: "amber oud gold", brands: ["haramain"] },
  { rank: 33, phrase: "amber oud", brands: ["haramain"] },
  { rank: 34, phrase: "bleu de chanel", brands: ["chanel"] },
  { rank: 35, phrase: "coco mademoiselle", brands: ["chanel"] },
  { rank: 36, phrase: "miss dior", brands: ["dior"] },
  { rank: 37, phrase: "jadore", brands: ["dior"] },
  { rank: 38, phrase: "idole", brands: ["lancome"] },
  { rank: 39, phrase: "olympea", brands: ["rabanne"] },
  { rank: 40, phrase: "linterdit", brands: ["givenchy"] },
  { rank: 51, phrase: "one", brands: ["calvin klein"] },
  { rank: 41, phrase: "dylan blue", brands: ["versace"] },
  { rank: 42, phrase: "phantom", brands: ["rabanne"] },
  { rank: 43, phrase: "fame", brands: ["rabanne"] },
  { rank: 44, phrase: "black xs", brands: ["rabanne"] },
  { rank: 45, phrase: "toy boy", brands: ["moschino"] },
  { rank: 46, phrase: "la belle", brands: ["gaultier"] },
  { rank: 47, phrase: "le beau", brands: ["gaultier"] },
  { rank: 48, phrase: "ultra male", brands: ["gaultier"] },
  { rank: 49, phrase: "angel", brands: ["mugler"] },
  { rank: 50, phrase: "cool water", brands: ["davidoff"] },
  { rank: 51, phrase: "ck one", brands: ["calvin klein"] },
  { rank: 52, phrase: "boss bottled", brands: ["hugo boss", "boss"] },
  { rank: 53, phrase: "polo", brands: ["ralph lauren"] },
  { rank: 54, phrase: "212", brands: ["carolina herrera"] },
  { rank: 55, phrase: "eternity", brands: ["calvin klein"] },
  { rank: 56, phrase: "gentleman", brands: ["givenchy"] },
  { rank: 57, phrase: "luna rossa", brands: ["prada"] },
  { rank: 58, phrase: "hypnotic poison", brands: ["dior"] },
  { rank: 59, phrase: "viva la juicy", brands: ["viva la juicy", "juicy"] },
  { rank: 60, phrase: "blue seduction", brands: ["banderas"] },
  { rank: 61, phrase: "thank u next", brands: ["ariana grande"] },
  { rank: 62, phrase: "devotion", brands: ["dolce"] },
  { rank: 63, phrase: "aventus", brands: ["creed"] },
  { rank: 64, phrase: "delina", brands: ["marly"] },
  { rank: 65, phrase: "fakhar", brands: ["lattafa"] },
  { rank: 66, phrase: "turathi", brands: ["afnan"] },
  { rank: 67, phrase: "hayaati", brands: ["lattafa"] },
  { rank: 68, phrase: "the kingdom", brands: ["lattafa"] },
  { rank: 69, phrase: "raghba", brands: ["lattafa"] },
  { rank: 70, phrase: "voyage", brands: ["nautica"] },
  { rank: 71, phrase: "360", brands: ["perry ellis"] },
  { rank: 72, phrase: "her secret", brands: ["banderas"] },
  { rank: 115, phrase: "relief sun", brands: ["joseon"] },
  { rank: 116, phrase: "heartleaf 77", brands: ["anua"] },
  { rank: 118, phrase: "centella", brands: ["skin1004"] },
  { rank: 139, phrase: "maca", brands: ["karseell"] },
];

/** Marcas conocidas cuando el producto no es una línea de las de arriba. */
const BRAND_RULES: Array<{ rank: number; phrase: string }> = [
  { rank: 120, phrase: "joseon" },
  { rank: 121, phrase: "anua" },
  { rank: 122, phrase: "skin1004" },
  { rank: 123, phrase: "cosrx" },
  { rank: 124, phrase: "mixsoon" },
  { rank: 125, phrase: "round lab" },
  { rank: 126, phrase: "missha" },
  { rank: 127, phrase: "etude" },
  { rank: 128, phrase: "unleashia" },
  { rank: 129, phrase: "skinfood" },
  { rank: 140, phrase: "karseell" },
  { rank: 141, phrase: "salon line" },
  { rank: 142, phrase: "skala" },
  { rank: 150, phrase: "beauty creations" },
  { rank: 160, phrase: "remington" },
  { rank: 161, phrase: "babyliss" },
  { rank: 170, phrase: "instituto espanol" },
  { rank: 180, phrase: "bioaqua" },
  { rank: 181, phrase: "dr. rashel" },
  { rank: 181, phrase: "dr rashel" },
  { rank: 190, phrase: "staleks" },
  { rank: 220, phrase: "dior" },
  { rank: 220, phrase: "chanel" },
  { rank: 220, phrase: "yves saint laurent" },
  { rank: 220, phrase: "carolina herrera" },
  { rank: 220, phrase: "versace" },
  { rank: 220, phrase: "jean paul gaultier" },
  { rank: 220, phrase: "paco rabanne" },
  { rank: 220, phrase: "rabanne" },
  { rank: 220, phrase: "armani" },
  { rank: 220, phrase: "dolce" },
  { rank: 220, phrase: "valentino" },
  { rank: 220, phrase: "givenchy" },
  { rank: 220, phrase: "lancome" },
  { rank: 220, phrase: "prada" },
  { rank: 220, phrase: "mugler" },
  { rank: 220, phrase: "creed" },
  { rank: 220, phrase: "tom ford" },
  { rank: 220, phrase: "marly" },
  { rank: 220, phrase: "burberry" },
  { rank: 220, phrase: "marc jacobs" },
  { rank: 220, phrase: "ariana grande" },
  { rank: 220, phrase: "calvin klein" },
  { rank: 220, phrase: "hugo boss" },
  { rank: 220, phrase: "ralph lauren" },
  { rank: 220, phrase: "azzaro" },
  { rank: 220, phrase: "bvlgari" },
  { rank: 220, phrase: "issey miyake" },
  { rank: 220, phrase: "montblanc" },
  { rank: 220, phrase: "mont blanc" },
  { rank: 220, phrase: "lattafa" },
  { rank: 220, phrase: "armaf" },
  { rank: 220, phrase: "haramain" },
  { rank: 220, phrase: "afnan" },
  { rank: 220, phrase: "maison alhambra" },
  { rank: 220, phrase: "rasasi" },
  { rank: 220, phrase: "orientica" },
  { rank: 220, phrase: "perry ellis" },
  { rank: 220, phrase: "antonio banderas" },
  { rank: 220, phrase: "davidoff" },
  { rank: 220, phrase: "nautica" },
  { rank: 220, phrase: "victorias secret" },
  { rank: 220, phrase: "victoria secret" },
];

function termPattern(term: string): RegExp {
  const needle = fold(term).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z0-9])${needle}(?:[^a-z0-9]|$)`);
}

const LINES: FameRule[] = LINE_RULES.map((rule) => ({
  ...rule,
  group: rule.rank < 100 ? "line" : "brand",
  pattern: termPattern(rule.phrase),
  brandPatterns: rule.brands.map(termPattern),
}));

const BRANDS = BRAND_RULES.map((rule) => ({
  ...rule,
  pattern: termPattern(rule.phrase),
}));

type FameHit = { rank: number; key: string; phrase: string };

const FLANKERS = ["moi", "tous", "candy", "elixir", "blush", "glam", "very", "splash", "bowtastic", "dukhan", "qahwa", "hairmist", "hair mist", "perfumed spray"];

function haystack(product: Pick<FameSubject, "brand" | "name">): string {
  return fold(`${product.brand} ${product.name}`).replace(/['’.-]/g, "");
}

function bestHit(product: Pick<FameSubject, "brand" | "name">): FameHit {
  const hay = haystack(product);
  let best: FameHit = { rank: FAME_UNKNOWN, key: "", phrase: "" };
  for (const line of LINES) {
    if (line.rank >= best.rank) continue;
    if (!line.pattern.test(hay)) continue;
    if (!line.brandPatterns.some((pattern) => pattern.test(hay))) continue;
    const key = line.group === "line" ? `line:${line.rank}` : `brand:${fold(line.brands[0] ?? line.phrase)}`;
    best = { rank: line.rank, key, phrase: line.phrase };
  }
  for (const brand of BRANDS) {
    if (brand.rank >= best.rank) continue;
    if (!brand.pattern.test(hay)) continue;
    best = { rank: brand.rank, key: `brand:${fold(brand.phrase)}`, phrase: "" };
  }
  return best;
}

export function fameRank(product: Pick<FameSubject, "brand" | "name">): number {
  return bestHit(product).rank;
}

export function fameKey(product: FameSubject): string {
  const hit = bestHit(product);
  if (hit.key) return hit.key;
  return `item:${product.id}`;
}

function isShouty(name: string): boolean {
  const letters = name.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "");
  if (letters.length < 4) return false;
  const upper = letters.replace(/[^A-ZÁÉÍÓÚÜÑ]/g, "").length;
  return upper / letters.length > 0.8;
}

function isSideItem(category: string): boolean {
  return category === "Set" || category === "Desodorante" || category === "Accesorio" || category === "Accesorios de barbería" || category === "Mueble de salón";
}

function formPenalty(category: string): number {
  switch (category) {
    case "Eau de Parfum":
    case "Eau de Toilette":
    case "Parfum":
    case "Extrait de Parfum":
    case "Pure Parfum":
      return 0;
    case "Set":
    case "Desodorante":
      return 3;
    case "Perfume en spray":
    case "Perfumería":
    case "Crema perfumada":
      return 2;
    default:
      return 1;
  }
}

function flankerPenalty(product: Pick<FameSubject, "brand" | "name">, phrase: string): number {
  if (!phrase) return 0;
  const extra = haystack(product).replace(fold(phrase).replace(/['’.-]/g, ""), "");
  return FLANKERS.some((word) => termPattern(word).test(extra)) ? 1 : 0;
}

export function isSpotlightFiller(product: FameSubject): boolean {
  if (isSideItem(product.category)) return true;
  if (fold(product.name).startsWith("set ")) return true;
  const words = fold(product.name).split(" ").filter((word) => word.length > 0);
  return words.length < 2 && fameRank(product) >= 100;
}

/** Famosos primero. Dentro de la misma línea, el frasco con nombre corto va antes del set. */
export function compareFame(left: FameSubject, right: FameSubject): number {
  const leftHit = bestHit(left);
  const rightHit = bestHit(right);
  const rank = leftHit.rank - rightHit.rank;
  if (rank !== 0) return rank;
  const flanker = flankerPenalty(left, leftHit.phrase) - flankerPenalty(right, rightHit.phrase);
  if (flanker !== 0) return flanker;
  const form = formPenalty(left.category) - formPenalty(right.category);
  if (form !== 0) return form;
  const shouty = Number(isShouty(left.name)) - Number(isShouty(right.name));
  if (shouty !== 0) return shouty;
  const words = fold(left.name).split(" ").length - fold(right.name).split(" ").length;
  if (fold(left.name).split(" ").length < 2 || fold(right.name).split(" ").length < 2) {
    if (words !== 0) return words;
  }
  const length = fold(left.name).length - fold(right.name).length;
  if (length !== 0) return length;
  const featured = Number(Boolean(right.featured)) - Number(Boolean(left.featured));
  if (featured !== 0) return featured;
  return left.name.localeCompare(right.name, "es") || left.id.localeCompare(right.id);
}

/** El mejor de cada línea famosa va primero. El resto de tallas sigue después. */
export function orderByFame<T extends FameSubject>(products: T[]): T[] {
  const sorted = [...products].sort(compareFame);
  const first: T[] = [];
  const rest: T[] = [];
  const seen = new Set<string>();
  for (const product of sorted) {
    const key = fameKey(product);
    if (seen.has(key)) rest.push(product);
    else {
      seen.add(key);
      first.push(product);
    }
  }
  return [...first, ...rest];
}

export function pickFamous<T extends FameSubject>(products: T[], limit = 10): T[] {
  const sorted = [...products].sort(compareFame);
  const picked: T[] = [];
  const seen = new Set<string>();
  const counts = new Map<string, number>();
  const take = (maxPerKey: number) => {
    for (const product of sorted) {
      if (picked.length >= limit) return;
      if (seen.has(product.id)) continue;
      const key = fameKey(product);
      const count = counts.get(key) ?? 0;
      if (count >= maxPerKey) continue;
      counts.set(key, count + 1);
      seen.add(product.id);
      picked.push(product);
    }
  };
  take(1);
  take(2);
  take(Number.POSITIVE_INFINITY);
  return picked;
}
