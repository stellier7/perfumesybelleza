import assert from "node:assert/strict";
import test from "node:test";
import { BRUMA_CATEGORY } from "@/config";
import {
  applyCatalogFilters,
  catalogCategoryGroups,
  catalogFilterQuery,
  parseCatalogFilters,
  type CatalogFilters,
} from "./catalog-query";
import type { PublicProduct } from "@/types/catalog";

function product(name: string, type: PublicProduct["type"], category: string): PublicProduct {
  return {
    id: name,
    slug: name,
    name,
    brand: "Marca",
    type,
    gender: "unisex",
    price: 100,
    images: [],
    description: "",
    notes: { top: [], heart: [], base: [] },
    sizeMl: 100,
    inStock: true,
    category,
    tags: [],
    isReference: false,
    inspiredBy: [],
    alternatives: [],
  };
}

const filters = (overrides: Partial<CatalogFilters> = {}): CatalogFilters => ({
  seccion: "",
  tipo: "",
  marca: "",
  genero: "",
  categoria: "",
  min: null,
  max: null,
  stock: false,
  orden: "nombre",
  pagina: 1,
  ...overrides,
});

const catalog = [
  product("Gorgeous", "designer", "Eau de Parfum"),
  product("Ciao", "beauty", BRUMA_CATEGORY),
  product("Gossip", "beauty", "Perfume en spray"),
];

test("perfumería incluye las brumas y deja fuera el resto de belleza", () => {
  const result = applyCatalogFilters(catalog, filters({ seccion: "perfumeria" }));
  assert.deepEqual(
    result.items.map((item) => item.name),
    ["Ciao", "Gorgeous"],
  );
});

test("dentro de perfumería la categoría Brumas deja solo las brumas", () => {
  const result = applyCatalogFilters(
    catalog,
    filters({ seccion: "perfumeria", categoria: BRUMA_CATEGORY }),
  );
  assert.deepEqual(
    result.items.map((item) => item.name),
    ["Ciao"],
  );
});

test("las brumas quedan en el grupo Perfumería del filtro", () => {
  const groups = catalogCategoryGroups(catalog);
  assert.equal(groups.perfumeria.includes(BRUMA_CATEGORY), true);
  assert.equal(groups.perfumeria.includes("Eau de Parfum"), true);
  assert.deepEqual(groups.belleza, ["Perfume en spray"]);
});

test("la sección se conserva en el enlace de páginas", () => {
  const parsed = parseCatalogFilters({ seccion: "perfumeria", categoria: BRUMA_CATEGORY });
  assert.equal(catalogFilterQuery(parsed), "?seccion=perfumeria&categoria=Brumas");
});
