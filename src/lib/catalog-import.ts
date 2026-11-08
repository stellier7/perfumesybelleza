import * as cheerio from "cheerio";
import { GENDERS, PRODUCT_TYPES, type Gender, type ProductType } from "@/types/catalog";
import { emptyNotes } from "@/lib/catalog-model";
import { fold } from "@/lib/text";
import type { FragranceNotes } from "@/types/catalog";

export type ImportedProduct = {
  name: string;
  brand: string;
  cost: number;
  listPrice: number | null;
  imageSources: string[];
  category: string;
  type: ProductType;
  gender: Gender;
  description: string;
  sizeMl: number | null;
  inStock: boolean | null;
  inspiredBy: string[];
  tags: string[];
  notes: FragranceNotes;
};

type CheerioRoot = ReturnType<typeof cheerio.load>;

function parsePrice(value: string): number | null {
  const cleaned = value.replace(/[^\d,.-]/g, "").trim();
  if (!cleaned) return null;
  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");
  let normalized = cleaned;
  if (lastComma >= 0 && lastDot >= 0) {
    normalized =
      lastComma > lastDot
        ? cleaned.replace(/\./g, "").replace(",", ".")
        : cleaned.replace(/,/g, "");
  } else if (lastComma >= 0) {
    const decimals = cleaned.length - lastComma - 1;
    normalized = decimals === 3 ? cleaned.replace(/,/g, "") : cleaned.replace(",", ".");
  } else if (lastDot >= 0) {
    const decimals = cleaned.length - lastDot - 1;
    normalized = decimals === 3 ? cleaned.replace(/\./g, "") : cleaned;
  }
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}

function parseType(value: string): ProductType | null {
  const folded = fold(value);
  if (folded === "designer" || folded === "disenador" || folded === "disenadora") return "designer";
  if (folded === "arabic" || folded === "arabe" || folded === "arabes") return "arabic";
  if (folded === "beauty" || folded === "belleza" || folded === "cuidado" || folded === "cuidado personal") return "beauty";
  if ((PRODUCT_TYPES as readonly string[]).includes(folded)) return folded as ProductType;
  return null;
}

function parseGender(value: string): Gender {
  const folded = fold(value);
  if (folded === "hombre" || folded === "h" || folded === "masculino") return "hombre";
  if (folded === "mujer" || folded === "m" || folded === "femenino") return "mujer";
  if ((GENDERS as readonly string[]).includes(folded)) return folded as Gender;
  return "unisex";
}

function parseStock(value: string): boolean | null {
  const folded = fold(value);
  if (!folded) return null;
  if (["1", "true", "si", "sí", "yes", "disponible", "en stock"].includes(folded)) return true;
  if (["0", "false", "no", "agotado", "sin stock"].includes(folded)) return false;
  return null;
}

function splitList(value: string): string[] {
  return value
    .split(/[|;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  const source = text.replace(/^\uFEFF/, "");
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (inQuotes) {
      if (char === '"') {
        if (source[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
      continue;
    }
    if (char === ",") {
      row.push(cell.trim());
      cell = "";
      continue;
    }
    if (char === "\n" || char === "\r") {
      if (char === "\r" && source[index + 1] === "\n") index += 1;
      row.push(cell.trim());
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += char;
  }
  row.push(cell.trim());
  if (row.some((value) => value.length > 0)) rows.push(row);
  return rows;
}

const HEADER_MAP: Record<string, string> = {
  name: "name",
  nombre: "name",
  brand: "brand",
  marca: "brand",
  price: "cost",
  costo: "cost",
  cost: "cost",
  wholesale: "cost",
  "precio mayorista": "cost",
  preciomayorista: "cost",
  "precio publico": "listPrice",
  "precio de venta": "listPrice",
  "precio venta": "listPrice",
  image: "image",
  imagen: "image",
  "image path": "image",
  "ruta de imagen": "image",
  "imagen 2": "image2",
  imagen2: "image2",
  "foto 2": "image2",
  "image 2": "image2",
  category: "category",
  categoria: "category",
  type: "type",
  tipo: "type",
  gender: "gender",
  genero: "gender",
  description: "description",
  descripcion: "description",
  size: "size",
  tamano: "size",
  ml: "size",
  stock: "stock",
  instock: "stock",
  existencia: "stock",
  inspiredby: "inspiredBy",
  "inspirado en": "inspiredBy",
  tags: "tags",
  etiquetas: "tags",
  top: "top",
  salida: "top",
  heart: "heart",
  corazon: "heart",
  base: "base",
  fondo: "base",
};

function headerKey(value: string, headers: string[]): string {
  const folded = fold(value);
  if (folded === "precio") {
    const hasWholesale = headers.some((header) =>
      ["precio mayorista", "preciomayorista", "costo", "cost", "price", "wholesale"].includes(fold(header)),
    );
    return hasWholesale ? "listPrice" : "cost";
  }
  return HEADER_MAP[folded] ?? folded;
}

export function parseCatalogCsv(text: string): ImportedProduct[] {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];
  const headers = rows[0].map((header) => headerKey(header, rows[0]));
  return rows.slice(1).flatMap((row) => {
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = row[index] ?? "";
    });
    const name = record.name?.trim() ?? "";
    const brand = record.brand?.trim() ?? "";
    const type = parseType(record.type ?? "");
    const cost = parsePrice(record.cost ?? "");
    if (!name || !brand || !type || cost === null) return [];
    const size = record.size ? Number(record.size.replace(/[^\d.]/g, "")) : null;
    return [
      {
        name,
        brand,
        cost,
        listPrice: parsePrice(record.listPrice ?? ""),
        imageSources: [...splitList(record.image ?? ""), ...splitList(record.image2 ?? "")],
        category: record.category?.trim() || "General",
        type,
        gender: parseGender(record.gender ?? ""),
        description: record.description?.trim() || `${name} de ${brand}.`,
        sizeMl: size && Number.isFinite(size) ? size : null,
        inStock: parseStock(record.stock ?? ""),
        inspiredBy: splitList(record.inspiredBy ?? ""),
        tags: splitList(record.tags ?? ""),
        notes: {
          top: splitList(record.top ?? ""),
          heart: splitList(record.heart ?? ""),
          base: splitList(record.base ?? ""),
        },
      },
    ];
  });
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function collectNodes(value: unknown, into: Record<string, unknown>[]): void {
  if (Array.isArray(value)) {
    for (const item of value) collectNodes(item, into);
    return;
  }
  const record = asRecord(value);
  if (!record) return;
  into.push(record);
  if (record["@graph"]) collectNodes(record["@graph"], into);
}

function textValue(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  const record = asRecord(value);
  if (!record) return "";
  if (typeof record.name === "string") return record.name;
  return "";
}

function productFromJsonLd(node: Record<string, unknown>): ImportedProduct | null {
  const type = node["@type"];
  const types = Array.isArray(type) ? type.map(String) : [String(type ?? "")];
  if (!types.some((item) => item.toLowerCase() === "product")) return null;
  const name = textValue(node.name);
  const brand = textValue(node.brand);
  const offers = asRecord(Array.isArray(node.offers) ? node.offers[0] : node.offers);
  const cost = parsePrice(String(offers?.price ?? node.price ?? ""));
  if (!name || cost === null) return null;
  const images = Array.isArray(node.image)
    ? node.image.map(String)
    : node.image
      ? [String(node.image)]
      : [];
  const availability = String(offers?.availability ?? "");
  const inStock = availability
    ? !/outofstock|agotado/i.test(availability)
    : null;
  const category = textValue(node.category) || "General";
  const guessed = /arabe|árabe/i.test(`${category} ${name}`)
    ? "arabic"
    : /belleza|labial|bruma|serum|sérum/i.test(`${category} ${name}`)
      ? "beauty"
      : "designer";
  return {
    name,
    brand: brand || "Sin marca",
    cost,
    listPrice: null,
    imageSources: images,
    category,
    type: guessed,
    gender: "unisex",
    description: textValue(node.description) || `${name}.`,
    sizeMl: null,
    inStock,
    inspiredBy: [],
    tags: [],
    notes: emptyNotes(),
  };
}

function extractJsonLd($: CheerioRoot): ImportedProduct[] {
  const products: ImportedProduct[] = [];
  $('script[type="application/ld+json"]').each((_, element) => {
    const raw = $(element).text();
    if (!raw.trim()) return;
    try {
      const parsed: unknown = JSON.parse(raw);
      const nodes: Record<string, unknown>[] = [];
      collectNodes(parsed, nodes);
      for (const node of nodes) {
        const product = productFromJsonLd(node);
        if (product) products.push(product);
      }
    } catch {
      // El bloque no es JSON de producto.
    }
  });
  return products;
}

function extractCards($: CheerioRoot): ImportedProduct[] {
  const products: ImportedProduct[] = [];
  const cards = $(
    "[itemtype*='Product'], article.product, .product-card, .producto, .product",
  );
  cards.each((_, element) => {
    const card = $(element);
    const name =
      card.find("[itemprop='name'], .product-name, .nombre, h2, h3").first().text().trim() ||
      card.find("img").attr("alt")?.trim() ||
      "";
    const brand =
      card.find("[itemprop='brand'], .brand, .marca").first().text().trim() || "Sin marca";
    const priceText =
      card.find("[itemprop='price'], .price, .precio").first().text() ||
      card.find("[itemprop='price']").attr("content") ||
      "";
    const cost = parsePrice(priceText);
    if (!name || cost === null) return;
    const image = card.find("img").first().attr("src") || card.find("img").first().attr("data-src");
    const description = card.find("[itemprop='description'], .description, p").first().text().trim();
    products.push({
      name,
      brand,
      cost,
      listPrice: null,
      imageSources: image ? [image] : [],
      category: card.find(".category, .categoria").first().text().trim() || "General",
      type: "designer",
      gender: "unisex",
      description: description || `${name} de ${brand}.`,
      sizeMl: null,
      inStock: null,
      inspiredBy: [],
      tags: [],
      notes: emptyNotes(),
    });
  });
  return products;
}

export function extractProductsFromHtml(html: string): ImportedProduct[] {
  const $ = cheerio.load(html);
  const fromJsonLd = extractJsonLd($);
  if (fromJsonLd.length > 0) return fromJsonLd;
  return extractCards($);
}

export function htmlLooksLikeEmptyShell(html: string): boolean {
  const $ = cheerio.load(html);
  const text = $("body").text().replace(/\s+/g, " ").trim();
  const shell = html.includes("<app-root") || $("app-root").length > 0;
  return shell && text.length < 120;
}
