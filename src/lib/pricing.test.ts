import assert from "node:assert/strict";
import test from "node:test";
import { formatPrice, publicPrice, shelfPrice } from "./pricing";

test("aplica el margen del tipo y redondea a la decena", () => {
  assert.equal(publicPrice(1860, "designer"), 2790);
  assert.equal(publicPrice(460, "arabic"), 920);
  assert.equal(publicPrice(120, "beauty"), 240);
  assert.equal(publicPrice(40, "beauty"), 80);
  assert.equal(publicPrice(0), 0);
  assert.equal(publicPrice(-10), 0);
});

test("un costo pequeño no queda en cero después del redondeo", () => {
  assert.equal(publicPrice(1), 10);
});

test("un precio escrito a mano reemplaza el margen", () => {
  assert.equal(shelfPrice({ cost: 460, type: "arabic", price: 750 }), 750);
  assert.equal(shelfPrice({ cost: 460, type: "arabic" }), 920);
});

test("formatea lempiras con miles y dos decimales", () => {
  assert.equal(formatPrice(1250), "L 1,250.00");
  assert.equal(formatPrice(680), "L 680.00");
  assert.equal(formatPrice(0), "L 0.00");
});
