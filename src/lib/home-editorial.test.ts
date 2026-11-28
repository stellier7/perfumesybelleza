import assert from "node:assert/strict";
import test from "node:test";
import { editorialTiles, topBrands } from "./home-editorial";

test("el mosaico solo muestra categorías que existen", () => {
  const titles = editorialTiles([
    { type: "arabic", category: "Eau de Parfum", brand: "Lattafa" },
    { type: "beauty", category: "Shampoo", brand: "Karseell" },
  ]).map((tile) => tile.title);
  assert.deepEqual(titles, ["Perfumes", "Esenciales", "Todos"]);
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
  assert.deepEqual(titles, [
    "Perfumes",
    "Korean Skincare",
    "Maquillaje",
    "Cuidado facial",
    "Uñas",
    "Esenciales",
    "Todos",
  ]);
});

test("todos abre la tienda cuando hay catálogo", () => {
  const tiles = editorialTiles([{ type: "beauty", category: "Shampoo", brand: "Karseell" }]);
  const todos = tiles.find((tile) => tile.id === "todos");
  assert.ok(todos);
  assert.equal(todos.title, "Todos");
  assert.equal(todos.href, "/tienda?seccion=perfumes");
  assert.equal(todos.image, "/home/perfumes-sets.webp");
});

test("sin productos el mosaico queda vacío", () => {
  assert.deepEqual(editorialTiles([]), []);
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
