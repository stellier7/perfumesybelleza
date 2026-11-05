import assert from "node:assert/strict";
import test from "node:test";
import { serializeProducts } from "./serialize-catalog.ts";
import { listStock, setProductStock } from "./stock-file.ts";
import type { RawProduct } from "../types/catalog.ts";

const sample: RawProduct = {
  id: "tag-him",
  slug: "tag-him",
  name: 'Tag "Him"',
  brand: "Armaf",
  type: "arabic",
  gender: "hombre",
  cost: 460,
  images: ["/products/tag-him.webp"],
  description: "Aroma fresco.",
  notes: { top: ["Limón"], heart: [], base: ["Cedro"] },
  sizeMl: 100,
  inStock: true,
  category: "Eau de Parfum",
  tags: ["fresco"],
  inspiredBy: ["bleu-de-chanel"],
};

test("alterna inStock por slug sin perder el resto del archivo", () => {
  const file = serializeProducts([sample]);
  assert.deepEqual(listStock(file), [{ slug: "tag-him", name: 'Tag "Him"', inStock: true }]);
  const toggled = setProductStock(file, "tag-him", "toggle");
  assert.equal(toggled.inStock, false);
  assert.match(toggled.source, /inStock: false/);
  assert.match(toggled.source, /cost: 460/);
  const forced = setProductStock(toggled.source, "tag-him", "on");
  assert.equal(forced.inStock, true);
});

test("avisa si el slug no existe", () => {
  const file = serializeProducts([sample]);
  assert.throws(() => setProductStock(file, "no-existe", "off"), /no-existe/);
});
