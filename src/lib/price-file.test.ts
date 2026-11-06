import assert from "node:assert/strict";
import test from "node:test";
import { applyPriceBatch, listPrices, nextUnpriced, setProductCost, setProductPrice } from "./price-file";

const file = `export const rawProducts = [
  {
      slug: "uno",
      name: "Uno",
      brand: "Armaf",
      type: "arabic",
      cost: 0,
      sizeMl: 100,
    },
  {
      slug: "dos",
      name: "Dos",
      brand: "Armaf",
      type: "arabic",
      cost: 460,
      sizeMl: 100,
    },
  {
      slug: "tres",
      name: "Tres",
      brand: "Armaf",
      type: "arabic",
      cost: 0,
      sizeMl: null,
    },
];
`;

test("elige solo los que no tienen mayorista ni precio", () => {
  assert.deepEqual(
    nextUnpriced(file, 10).map((row) => row.slug),
    ["uno", "tres"],
  );
});

test("escribe el precio de venta después del costo", () => {
  const priced = setProductPrice(file, "uno", 890);
  const row = listPrices(priced).find((item) => item.slug === "uno");
  assert.equal(row?.price, 890);
  assert.match(priced, /cost: 0,\n\s*price: 890,/);
  const replaced = setProductPrice(priced, "uno", 900);
  assert.equal(listPrices(replaced).find((item) => item.slug === "uno")?.price, 900);
});

test("un lote guarda en orden y un guion salta el producto", () => {
  const batch = applyPriceBatch(file, [{ kind: "sale", amount: 890 }, null]);
  assert.deepEqual(batch.applied, [{ slug: "uno", kind: "sale", amount: 890 }]);
  assert.deepEqual(
    nextUnpriced(batch.source, 10).map((row) => row.slug),
    ["tres"],
  );
});

test("el mayorista queda en cost", () => {
  const next = setProductCost(file, "tres", 320);
  assert.equal(listPrices(next).find((row) => row.slug === "tres")?.cost, 320);
  assert.equal(nextUnpriced(next, 10).some((row) => row.slug === "tres"), false);
});
