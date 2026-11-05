import assert from "node:assert/strict";
import test from "node:test";
import { formatPrice, publicPrice } from "./pricing";

test("aplica el margen y redondea a la decena", () => {
  assert.equal(publicPrice(800), 1200);
  assert.equal(publicPrice(833), 1250);
  assert.equal(publicPrice(1860), 2790);
  assert.equal(publicPrice(0), 0);
  assert.equal(publicPrice(-10), 0);
});

test("un costo pequeño no queda en cero después del redondeo", () => {
  assert.equal(publicPrice(1), 10);
});

test("formatea lempiras con miles y dos decimales", () => {
  assert.equal(formatPrice(1250), "L 1,250.00");
  assert.equal(formatPrice(680), "L 680.00");
  assert.equal(formatPrice(0), "L 0.00");
});
