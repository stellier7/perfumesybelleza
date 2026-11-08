import assert from "node:assert/strict";
import test from "node:test";
import { buildCatalog } from "./catalog-model";
import { applyCatalogFilters, parseCatalogFilters } from "./catalog-query";
import { compareFame, fameRank, pickFamous, trendingScore, type FameSubject } from "./fame";
import type { RawProduct } from "../types/catalog";

function item(id: string, brand: string, name: string, category = "Eau de Parfum"): FameSubject {
  return { id, brand, name, category };
}

function raw(id: string, brand: string, name: string, type: RawProduct["type"], category: string): RawProduct {
  return {
    id,
    slug: id,
    name,
    brand,
    type,
    gender: "unisex",
    cost: 100,
    images: [],
    description: "Descripción",
    notes: { top: [], heart: [], base: [] },
    sizeMl: 100,
    inStock: true,
    category,
    tags: [],
  };
}

test("la tendencia baja desde la línea más buscada hasta el producto desconocido", () => {
  const sauvage = trendingScore(item("sauvage", "Dior", "Sauvage"));
  const yara = trendingScore(item("yara", "Lattafa", "Yara"));
  const maca = trendingScore(item("maca", "Karseell", "Maca shampoo", "Shampoo"));
  const cuba = trendingScore(item("cuba", "Cuba", "Jungle Zebra"));
  assert.equal(sauvage, 100);
  assert.ok(sauvage > yara);
  assert.ok(yara > maca);
  assert.ok(maca > cuba);
  assert.ok(cuba <= 20);
});

test("sauvage, good girl, libre y yara salen antes que un perfume desconocido", () => {
  const products = [
    item("cuba", "Cuba", "Jungle Zebra"),
    item("yara", "Lattafa", "Yara"),
    item("libre", "Yves Saint Laurent", "Libre"),
    item("good", "Carolina Herrera", "Good Girl"),
    item("sauvage", "Dior", "Sauvage"),
    item("khamrah", "Lattafa", "Khamrah"),
  ].sort(compareFame);
  assert.deepEqual(
    products.map((product) => product.id),
    ["sauvage", "good", "libre", "yara", "khamrah", "cuba"],
  );
  assert.ok(fameRank(item("libre-falso", "Camis", "Libre")) > fameRank(item("libre", "Yves Saint Laurent", "Libre")));
});

test("el frasco de la línea va antes del flanker, del set y del nombre cortado", () => {
  const products = [
    item("moi", "Lattafa", "Yara Moi", "Perfume en spray"),
    item("yara", "Lattafa", "LATTAFA YARA EDP SP"),
    item("ver", "Carolina Herrera", "CAROLINA HERRERA GOOD GIRL VER", "Perfumería"),
    item("good", "Carolina Herrera", "CAROLINA HERRERA GOOD GIRL(W)EDP SP 2.7oz"),
    item("set", "Dior", "Set Sauvage", "Set"),
    item("corto", "Dior", "Sauvage"),
  ].sort(compareFame);
  assert.deepEqual(
    products.map((product) => product.id),
    ["corto", "set", "good", "ver", "yara", "moi"],
  );
});

test("el riel no repite la misma línea y mezcla las marcas conocidas de cuidado", () => {
  const picks = pickFamous([
    item("sauvage-grande", "Dior", "DIOR SAUVAGE MEN 6.7 OZ. EDT SPRAY"),
    item("sauvage", "Dior", "Sauvage"),
    item("good", "Carolina Herrera", "Good Girl"),
    item("karseell-2", "Karseell", "Maca acondicionador", "Acondicionador"),
    item("karseell", "Karseell", "Maca shampoo", "Shampoo"),
    item("skala", "Skala", "Crema para peinar", "Tratamiento para cabello"),
    item("raro", "Marca X", "Shampoo genérico", "Shampoo"),
    item("skin", "Skin1004", "Centella ampoul", "Skincare coreano"),
  ]);
  assert.deepEqual(
    picks.map((product) => product.id),
    ["sauvage", "good", "skin", "karseell", "skala", "raro", "sauvage-grande", "karseell-2"],
  );
});

test("la tienda ordena cada categoría con lo famoso primero", () => {
  const catalog = buildCatalog([
    raw("cuba", "Cuba", "Jungle Zebra", "designer", "Eau de Toilette"),
    raw("elixir", "Dior", "Sauvage Elixir", "designer", "Eau de Parfum"),
    raw("sauvage", "Dior", "Sauvage", "designer", "Eau de Toilette"),
    raw("good", "Carolina Herrera", "Good Girl", "designer", "Eau de Parfum"),
    raw("febble", "Febble", "Labial", "beauty", "Maquillaje"),
    raw("creations", "Beauty Creations", "Labial mate", "beauty", "Maquillaje"),
    raw("shampoo", "Marca X", "Shampoo diario", "beauty", "Shampoo"),
    raw("karseell", "Karseell", "Maca shampoo", "beauty", "Shampoo"),
  ]);
  assert.deepEqual(
    applyCatalogFilters(catalog, parseCatalogFilters({})).items.map((product) => product.id),
    ["sauvage", "good", "cuba", "elixir"],
  );
  assert.deepEqual(
    applyCatalogFilters(catalog, parseCatalogFilters({ seccion: "cuidado", categoria: "Maquillaje" })).items.map(
      (product) => product.id,
    ),
    ["creations", "febble"],
  );
  assert.deepEqual(
    applyCatalogFilters(catalog, parseCatalogFilters({ seccion: "cuidado", categoria: "Shampoo" })).items.map(
      (product) => product.id,
    ),
    ["karseell", "shampoo"],
  );
});
