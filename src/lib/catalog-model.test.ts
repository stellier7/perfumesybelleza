import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCatalog,
  comparisonPairs,
  nameWithBrand,
  parseComparisonSlug,
  productSuggestions,
  sameScentAlternatives,
  toSearchRecord,
} from "./catalog-model";
import { queryNamesOriginal, searchCatalog, searchPath, searchSections, suggestionItems, suggestionsForQuery } from "./search";
import { catalogSection } from "./catalog-section";
import { applyCatalogFilters, catalogFilterQuery, INSPIRATIONS_CATEGORY, parseCatalogFilters } from "./catalog-query";
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

test("la inspiración se escribe con la marca delante del nombre", () => {
  assert.equal(nameWithBrand("Aventus", "Creed"), "Creed Aventus");
  assert.equal(nameWithBrand("Acqua di Gio", "Giorgio Armani"), "Giorgio Armani Acqua di Gio");
  assert.equal(nameWithBrand("Bleu de Chanel", "Chanel"), "Bleu de Chanel");
  assert.equal(nameWithBrand("Y", "Yves Saint Laurent"), "Yves Saint Laurent Y");
});

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
  assert.match(
    productSuggestions(intense, catalog).find((group) => group.kind === "original")?.caption ?? "",
    /No lo tenemos/,
  );
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

test("buscar la marca enseña los perfumes sin avisar cada referencia", () => {
  const catalog = buildCatalog([
    product({ id: "aventus-her", name: "Aventus for Her", brand: "Creed", type: "designer" }),
    product({
      id: "milestone",
      name: "Milestone",
      brand: "Armaf",
      type: "arabic",
      inspiredBy: ["Millésime Impérial (Creed)"],
    }),
    product({
      id: "knight",
      name: "Knight",
      brand: "Al Haramain",
      type: "arabic",
      inspiredBy: ["Aventus (Creed)"],
    }),
    product({ id: "red", name: "Red", brand: "Lacoste", type: "designer" }),
    product({ id: "le-male", name: "Le Male", brand: "Jean Paul Gaultier", type: "designer", category: "Eau de Toilette" }),
  ]);
  const records = catalog.map(toSearchRecord);
  const brand = searchCatalog(records, "Creed");
  assert.equal(
    brand.missingOriginals.filter((item) => queryNamesOriginal("Creed", item)).length,
    0,
  );
  assert.ok(brand.products.some((item) => item.id === "aventus-her"));
  assert.equal(brand.products.some((item) => item.id === "red"), false);
  assert.ok(brand.groups.length >= 2);
  const specific = searchCatalog(records, "Millésime");
  const named = specific.missingOriginals.filter((item) => queryNamesOriginal("Millésime", item));
  assert.equal(named.length, 1);
  assert.equal(named[0]?.name, "Millésime Impérial");
  assert.equal(specific.products.some((item) => item.id === "le-male"), false);
});

test("ordena las inspiraciones de la más cercana a la más libre y deja el set abajo", () => {
  const ranked: RawProduct[] = [
    product({ id: "bleu-de-chanel", name: "Bleu de Chanel", brand: "Chanel", type: "designer" }),
    product({
      id: "lejos",
      name: "Lejos",
      type: "arabic",
      inspiredBy: ["bleu-de-chanel"],
      inspirationRank: 3,
    }),
    product({
      id: "cerca",
      name: "Cerca",
      type: "arabic",
      inspiredBy: ["bleu-de-chanel"],
      inspirationRank: 1,
    }),
    product({
      id: "set-bleu",
      name: "Set Bleu",
      type: "arabic",
      category: "Set",
      inspiredBy: ["bleu-de-chanel"],
      inspirationRank: 2,
    }),
  ];
  const catalog = buildCatalog(ranked);
  const bleu = catalog.find((item) => item.id === "bleu-de-chanel");
  assert.deepEqual(
    bleu?.alternatives.map((item) => item.id),
    ["cerca", "set-bleu", "lejos"],
  );
  const result = searchCatalog(catalog.map(toSearchRecord), "Bleu de Chanel");
  assert.equal(result.groups[0]?.original.name, "Bleu de Chanel");
  assert.deepEqual(
    result.groups[0]?.clones.map((item) => item.id),
    ["cerca", "lejos"],
  );
  assert.deepEqual(
    result.groups[0]?.sets.map((item) => item.id),
    ["set-bleu"],
  );
});

test("el clon aparece debajo de cada presentación del diseñador", () => {
  const catalog = buildCatalog([
    product({ id: "sauvage", name: "Sauvage", brand: "Dior", type: "designer" }),
    product({ id: "sauvage-edp", name: "Dior Sauvage Eau de Parfum", brand: "Dior", type: "designer" }),
    product({ id: "aventus-her", name: "Aventus For Her", brand: "Creed", type: "designer" }),
    product({
      id: "asad",
      name: "Asad",
      brand: "Lattafa",
      type: "arabic",
      price: 1330,
      inspiredBy: ["Sauvage (Dior)"],
    }),
    product({
      id: "set-asad",
      name: "Set Asad",
      brand: "Lattafa",
      type: "arabic",
      category: "Set",
      price: 1500,
      inspiredBy: ["Sauvage (Dior)"],
    }),
    product({
      id: "cdni",
      name: "Club de Nuit Intense Man",
      brand: "Armaf",
      type: "arabic",
      inspiredBy: ["Aventus (Creed)"],
    }),
  ]);
  const bottle = catalog.find((item) => item.id === "sauvage-edp");
  const main = catalog.find((item) => item.id === "sauvage");
  const her = catalog.find((item) => item.id === "aventus-her");
  assert.ok(bottle && main && her);
  assert.deepEqual(
    sameScentAlternatives(bottle, catalog).map((item) => item.id),
    ["asad", "set-asad"],
  );
  assert.deepEqual(
    sameScentAlternatives(main, catalog).map((item) => item.id),
    ["asad", "set-asad"],
  );
  assert.equal(main.alternatives.some((item) => item.id === "asad"), true);
  assert.deepEqual(sameScentAlternatives(her, catalog), []);
});

test("una ficha siempre sugiere algo y el clon muestra el diseñador", () => {
  const catalog = buildCatalog([
    product({ id: "sauvage", name: "Sauvage", brand: "Dior", type: "designer", gender: "hombre" }),
    product({
      id: "sauvage-elixir",
      name: "Sauvage Elixir",
      brand: "Dior",
      type: "designer",
      gender: "hombre",
    }),
    product({ id: "poison", name: "Hypnotic Poison", brand: "Dior", type: "designer", gender: "mujer" }),
    product({
      id: "asad",
      name: "Asad",
      brand: "Lattafa",
      type: "arabic",
      gender: "hombre",
      price: 1330,
      inspiredBy: ["Sauvage (Dior)"],
    }),
    product({
      id: "asad-lote",
      name: "Asad",
      brand: "Lattafa",
      type: "arabic",
      gender: "hombre",
      price: 1200,
    }),
    product({
      id: "asad-zanzibar",
      name: "Asad Zanzibar",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
    }),
    product({
      id: "set-asad",
      name: "Set Asad",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      category: "Set",
      inspiredBy: ["Sauvage (Dior)"],
    }),
    product({ id: "eros", name: "Eros", brand: "Versace", type: "designer", gender: "hombre", featured: true }),
    product({
      id: "eros-femme",
      name: "Eros Pour Femme",
      brand: "Versace",
      type: "designer",
      gender: "mujer",
    }),
    product({
      id: "set-eros-energy",
      name: "Set Eros Energy",
      brand: "Versace",
      type: "designer",
      gender: "hombre",
      category: "Set",
    }),
    product({ id: "champu", name: "Champú", brand: "Nazca", type: "beauty", category: "Champú" }),
  ]);
  const asad = catalog.find((item) => item.id === "asad");
  const sauvage = catalog.find((item) => item.id === "sauvage");
  const elixir = catalog.find((item) => item.id === "sauvage-elixir");
  const lonely = catalog.find((item) => item.id === "eros");
  const shampoo = catalog.find((item) => item.id === "champu");
  assert.ok(asad && sauvage && elixir && lonely && shampoo);

  const fromClone = productSuggestions(asad, catalog);
  assert.equal(fromClone[0]?.kind, "original");
  assert.match(fromClone[0]?.caption ?? "", /también en la tienda/);
  assert.deepEqual(
    fromClone[0]?.products.map((item) => item.id),
    ["sauvage"],
  );
  assert.deepEqual(fromClone.find((group) => group.kind === "sets")?.products.map((item) => item.id), ["set-asad"]);
  assert.ok(fromClone.find((group) => group.kind === "line")?.products.some((item) => item.id === "asad-zanzibar"));
  assert.ok(fromClone.find((group) => group.kind === "line")?.products.some((item) => item.id === "asad-lote"));
  assert.equal(fromClone.some((group) => group.kind === "couple"), false);

  const fromDesigner = productSuggestions(sauvage, catalog);
  assert.equal(fromDesigner[0]?.kind, "clones");
  assert.equal(fromDesigner[0]?.products.some((item) => item.id === "asad"), true);
  assert.ok(fromDesigner.findIndex((group) => group.kind === "clones") < fromDesigner.findIndex((group) => group.kind === "sets"));
  assert.deepEqual(fromDesigner.find((group) => group.kind === "couple")?.products.map((item) => item.id), ["poison"]);
  assert.equal(fromDesigner.find((group) => group.kind === "line")?.products.some((item) => item.id === "sauvage-elixir"), true);

  const femme = catalog.find((item) => item.id === "eros-femme");
  assert.ok(femme);
  const fromFemme = productSuggestions(femme, catalog).flatMap((group) => group.products.map((item) => item.id));
  assert.equal(fromFemme.includes("eros"), true);
  assert.equal(fromFemme.includes("set-eros-energy"), false);

  const fromLonely = productSuggestions(lonely, catalog);
  assert.ok(fromLonely.length > 0);
  assert.equal(fromLonely.some((group) => group.kind === "clones"), false);
  assert.equal(fromLonely.some((group) => group.kind === "more"), true);
  assert.equal(productSuggestions(shampoo, catalog).length, 0);

  for (const groups of [fromClone, fromDesigner, fromLonely]) {
    const ids = groups.flatMap((group) => group.products.map((item) => item.id));
    assert.equal(new Set(ids).size, ids.length);
  }
  assert.equal(fromClone.some((group) => group.products.some((item) => item.id === "asad")), false);
});

test("la categoría Inspiraciones muestra solo los que tienen inspiración", () => {
  const catalog = buildCatalog(raw);
  const result = applyCatalogFilters(catalog, parseCatalogFilters({ categoria: INSPIRATIONS_CATEGORY }));
  assert.ok(result.items.length > 0);
  assert.ok(result.items.every((item) => item.inspiredBy.length > 0));
  assert.equal(result.items.some((item) => item.id === "tag-him"), true);
  assert.equal(result.items.some((item) => item.id === "bleu-de-chanel"), false);
});

test("la búsqueda pone primero lo que más se parece y desempata con la tendencia", () => {
  const records = buildCatalog([
    product({ id: "esraa", name: "Esraa", brand: "Lattafa", type: "arabic", cost: 100, price: 200 }),
    product({ id: "yara", name: "Yara", brand: "Lattafa", type: "arabic", cost: 900, price: 1800 }),
    product({ id: "moi", name: "Yara Moi", brand: "Lattafa", type: "arabic", cost: 1200, price: 2400 }),
    product({ id: "elixir", name: "Yara Elixir", brand: "Lattafa", type: "arabic", cost: 1500, price: 3000 }),
    product({ id: "set-yara", name: "LATTAFA SET YARA 100ML", brand: "Lattafa", type: "arabic", category: "Set", cost: 80, price: 160 }),
    product({ id: "candy", name: "LATTAFA YARA CANDY EDP SP", brand: "Lattafa", type: "arabic", cost: 50, price: 120 }),
    product({ id: "bottle", name: "LATTAFA YARA EDP SP", brand: "Lattafa", type: "arabic", cost: 800, price: 1600 }),
  ]).map(toSearchRecord);
  assert.ok((records.find((item) => item.id === "yara")?.trending ?? 0) > (records.find((item) => item.id === "esraa")?.trending ?? 0));
  const brand = searchCatalog(records, "Lattafa");
  assert.ok(brand.products.findIndex((item) => item.id === "yara") < brand.products.findIndex((item) => item.id === "esraa"));
  assert.equal(suggestionItems(brand, 1)[0]?.id, "yara");
  assert.ok(brand.products.findIndex((item) => item.id === "bottle") < brand.products.findIndex((item) => item.id === "candy"));
  assert.ok(brand.products.findIndex((item) => item.id === "bottle") < brand.products.findIndex((item) => item.id === "set-yara"));
  assert.equal(searchCatalog(records, "Yara Elixir").products[0]?.id, "elixir");
  assert.equal(searchCatalog(records, "Yara").products[0]?.id, "yara");
});

test("perfumes y cuidado personal no comparten marcas ni resultados", () => {
  const catalog = buildCatalog([
    product({ id: "asad", name: "Asad", brand: "Lattafa", type: "arabic", category: "Eau de Parfum" }),
    product({
      id: "crema",
      name: "Crema facial",
      brand: "Bioaqua",
      type: "beauty",
      category: "Crema facial",
    }),
    product({ id: "bio", name: "Bio", brand: "Otra Casa", type: "arabic", category: "Eau de Toilette" }),
    product({
      id: "crema-perfume",
      name: "Crema perfumada",
      brand: "Lattafa",
      type: "arabic",
      category: "Crema perfumada",
    }),
  ]);
  const perfumeFilters = parseCatalogFilters({});
  assert.equal(perfumeFilters.seccion, "perfumes");
  assert.deepEqual(
    applyCatalogFilters(catalog, perfumeFilters).items.map((item) => item.id),
    ["asad", "crema-perfume", "bio"],
  );
  const perfumeBrands = new Set(
    catalog.filter((item) => catalogSection(item.type) === "perfumes").map((item) => item.brand),
  );
  assert.deepEqual(perfumeBrands, new Set(["Lattafa", "Otra Casa"]));
  assert.equal(perfumeBrands.has("Bioaqua"), false);

  const cuidado = applyCatalogFilters(catalog, parseCatalogFilters({ seccion: "cuidado" }));
  assert.deepEqual(
    cuidado.items.map((item) => item.id),
    ["crema"],
  );
  assert.equal(applyCatalogFilters(catalog, parseCatalogFilters({ seccion: "cuidado", marca: "Lattafa" })).total, 0);
  assert.equal(applyCatalogFilters(catalog, parseCatalogFilters({ marca: "Bioaqua" })).total, 0);
  assert.equal(applyCatalogFilters(catalog, parseCatalogFilters({ categoria: "Crema facial" })).total, 0);
  assert.equal(parseCatalogFilters({ tipo: "beauty" }).seccion, "cuidado");
  assert.equal(parseCatalogFilters({ tipo: "arabic" }).seccion, "perfumes");
  assert.equal(parseCatalogFilters({ seccion: "cuidado", tipo: "designer" }).tipo, "");
  assert.match(catalogFilterQuery(parseCatalogFilters({ seccion: "cuidado" }), 2), /seccion=cuidado/);
  assert.match(catalogFilterQuery(parseCatalogFilters({ seccion: "cuidado" }), 2), /pagina=2/);

  const records = catalog.map(toSearchRecord);
  assert.deepEqual(searchSections(records, "Bioaqua"), ["cuidado"]);
  assert.deepEqual(searchCatalog(records, "Bioaqua", "cuidado").products.map((item) => item.id), ["crema"]);
  assert.equal(searchCatalog(records, "Bioaqua", "perfumes").products.length, 0);
  assert.deepEqual(
    suggestionsForQuery(records, "Bioaqua").map((item) => item.id),
    ["crema"],
  );
  assert.equal(searchPath(records, "Bioaqua"), "/buscar?q=Bioaqua&seccion=cuidado");
  assert.deepEqual(searchSections(records, "Crema facial"), ["cuidado"]);
  assert.deepEqual(searchSections(records, "Lattafa"), ["perfumes"]);
  assert.equal(
    searchCatalog(records, "Lattafa", "perfumes").products.some((item) => item.section === "cuidado"),
    false,
  );
});

test("inspiraciones sigue dentro de perfumes", () => {
  const catalog = buildCatalog([
    product({
      id: "clone",
      name: "Asad",
      brand: "Lattafa",
      type: "arabic",
      inspiredBy: ["Sauvage (Dior)"],
    }),
    product({
      id: "bruma",
      name: "Bruma",
      brand: "Bioaqua",
      type: "beauty",
      category: "Bruma",
      inspiredBy: ["Sauvage (Dior)"],
    }),
  ]);
  const result = applyCatalogFilters(catalog, parseCatalogFilters({ categoria: INSPIRATIONS_CATEGORY }));
  assert.deepEqual(
    result.items.map((item) => item.id),
    ["clone"],
  );
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
