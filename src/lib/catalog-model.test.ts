import assert from "node:assert/strict";
import test from "node:test";
import { buildCatalog, comparisonPairs, parseComparisonSlug } from "./catalog-model";
import { searchCatalog } from "./search";
import { toSearchRecord } from "./catalog-model";
import type { RawProduct } from "../types/catalog";

function product(overrides: Partial<RawProduct> & Pick<RawProduct, "id" | "name" | "type">): RawProduct {
  return {
    slug: overrides.slug ?? overrides.id,
    brand: overrides.brand ?? "Casa",
    gender: overrides.gender ?? "unisex",
    cost: overrides.cost ?? 100,
    images: overrides.images ?? [],
    description: overrides.description ?? "Descripción",
    notes: overrides.notes ?? { top: ["Limón"], heart: ["Rosa"], base: ["Almizcle"] },
    sizeMl: overrides.sizeMl ?? 100,
    inStock: overrides.inStock ?? true,
    category: overrides.category ?? "Eau de Parfum",
    tags: overrides.tags ?? [],
    ...overrides,
  };
}

const raw: RawProduct[] = [
  product({
    id: "bleu-de-chanel",
    name: "Bleu de Chanel",
    brand: "Chanel",
    type: "designer",
    gender: "hombre",
    cost: 1860,
    inStock: true,
  }),
  product({
    id: "tag-him",
    name: "Tag Him",
    brand: "Armaf",
    type: "arabic",
    gender: "hombre",
    cost: 460,
    inspiredBy: ["bleu-de-chanel"],
  }),
  product({
    id: "club-de-nuit-bleu",
    name: "Club de Nuit Bleu",
    brand: "Armaf",
    type: "arabic",
    cost: 540,
    inspiredBy: ["Bleu de Chanel"],
  }),
  product({
    id: "club-de-nuit-intense-man",
    name: "Club de Nuit Intense Man",
    brand: "Armaf",
    type: "arabic",
    cost: 580,
    inspiredBy: ["Aventus (Creed)"],
  }),
];

test("calcula alternativas y una referencia si el diseñador no está en el catálogo", () => {
  const catalog = buildCatalog(raw);
  const bleu = catalog.find((item) => item.id === "bleu-de-chanel");
  const tag = catalog.find((item) => item.id === "tag-him");
  const aventus = catalog.find((item) => item.slug === "aventus");
  assert.ok(bleu);
  assert.deepEqual(
    bleu.alternatives.map((item) => item.id).sort(),
    ["club-de-nuit-bleu", "tag-him"],
  );
  assert.equal(tag?.inspiredBy[0]?.slug, "bleu-de-chanel");
  assert.ok(aventus);
  assert.equal(aventus.isReference, true);
  assert.equal(aventus.inStock, false);
  assert.equal(aventus.price, 0);
  assert.equal("cost" in aventus, false);
  assert.equal("cost" in bleu, false);
  const intense = catalog.find((item) => item.id === "club-de-nuit-intense-man");
  assert.equal(intense?.inspiredBy[0]?.id, "ref-aventus");
  assert.equal(aventus.alternatives[0]?.id, "club-de-nuit-intense-man");
});

test("arma el slug de comparación y lo vuelve a leer", () => {
  const catalog = buildCatalog(raw);
  const pairs = comparisonPairs(catalog);
  const bleuPair = pairs.find((pair) => pair.slug === "bleu-de-chanel-vs-tag-him");
  assert.ok(bleuPair);
  assert.equal(parseComparisonSlug(bleuPair.slug)?.alternative, "tag-him");
  const aventusPair = pairs.find((pair) => pair.original.slug === "aventus");
  assert.ok(aventusPair);
});

test("buscar un diseñador en existencia muestra el perfume y sus alternativas", () => {
  const records = buildCatalog(raw).map(toSearchRecord);
  const result = searchCatalog(records, "Bleu de Chanel");
  assert.deepEqual(
    result.products.map((item) => item.id),
    ["bleu-de-chanel"],
  );
  assert.deepEqual(
    result.alternatives.map((item) => item.id).sort(),
    ["club-de-nuit-bleu", "tag-him"],
  );
  assert.equal(result.missingOriginals.length, 0);
});

test("buscar un diseñador que no vendemos deja solo las alternativas", () => {
  const records = buildCatalog(raw).map(toSearchRecord);
  const result = searchCatalog(records, "Aventus");
  assert.equal(result.products.length, 0);
  assert.equal(result.missingOriginals[0]?.name, "Aventus");
  assert.equal(result.alternatives[0]?.id, "club-de-nuit-intense-man");
});

test("tolera tildes y un error de escritura", () => {
  const records = buildCatalog(raw).map(toSearchRecord);
  assert.equal(searchCatalog(records, "árabe").alternatives.length + searchCatalog(records, "árabe").products.length > 0, true);
  const typo = searchCatalog(records, "blu de chanel");
  assert.ok(
    typo.products.some((item) => item.id === "bleu-de-chanel") ||
      typo.stockedOriginals.some((item) => item.id === "bleu-de-chanel") ||
      typo.alternatives.length > 0,
  );
});
