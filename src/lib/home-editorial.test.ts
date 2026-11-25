import assert from "node:assert/strict";
import test from "node:test";
import { editorialTiles, topBrands } from "./home-editorial";

test("el mosaico solo muestra categorías que existen", () => {
  const titles = editorialTiles([
    { type: "arabic", category: "Eau de Parfum", brand: "Lattafa" },
    { type: "beauty", category: "Shampoo", brand: "Karseell" },
  ]).map((tile) => tile.title);
  assert.deepEqual(titles, ["Perfumes", "Esenciales"]);
});

test("maquillaje, facial, uñas y skincare entran cuando hay productos", () => {
  const titles = editorialTiles([
    { type: "designer", category: "Eau de Parfum", brand: "Dior" },
    { type: "beauty", category: "Maquillaje", brand: "Beauty Creations" },
    { type: "beauty", category: "Crema facial", brand: "Bioaqua" },
    { type: "beauty", category: "Skincare coreano", brand: "Anua" },
    { type: "beauty", category: "Uñas", brand: "Staleks" },
    { type: "beauty", category: "Shampoo", brand: "Karseell" },
  ]).map((tile) => tile.title);
  assert.deepEqual(titles, ["Perfumes", "Korean Skincare", "Maquillaje", "Cuidado facial", "Uñas", "Esenciales"]);
});

test("las marcas se ordenan por cantidad", () => {
  const brands = topBrands(
    [
      { type: "designer", category: "Eau de Parfum", brand: "Dior" },
      { type: "designer", category: "Eau de Parfum", brand: "Dior" },
      { type: "arabic", category: "Eau de Parfum", brand: "Lattafa" },
      { type: "designer", category: "Eau de Parfum", brand: "Versace" },
    ],
    "designer",
    2,
  );
  assert.deepEqual(brands, [
    { brand: "Dior", count: 2 },
    { brand: "Versace", count: 1 },
  ]);
});
