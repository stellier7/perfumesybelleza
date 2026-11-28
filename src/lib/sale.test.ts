import assert from "node:assert/strict";
import test from "node:test";
import { discounted, isSaleActive, offerPrice, SALE } from "./sale";

const before = new Date("2026-11-27T23:59:59-06:00");
const start = new Date(SALE.startsAt);
const during = new Date("2026-11-28T12:00:00-06:00");
const lastMinute = new Date("2026-11-30T23:59:59-06:00");
const end = new Date(SALE.endsAt);

test("el 10% se redondea a la decena", () => {
  assert.equal(discounted(1095), 990);
  assert.equal(discounted(320), 290);
  assert.equal(discounted(0), 0);
  assert.equal(discounted(-20), -20);
});

test("la oferta abre el sábado 28 y cierra al empezar el martes 1", () => {
  assert.equal(isSaleActive(before), false);
  assert.equal(isSaleActive(start), true);
  assert.equal(isSaleActive(during), true);
  assert.equal(isSaleActive(lastMinute), true);
  assert.equal(isSaleActive(end), false);
  assert.equal(offerPrice(1095, before), 1095);
  assert.equal(offerPrice(1095, during), 990);
  assert.equal(offerPrice(320, during), 290);
  assert.equal(offerPrice(1095, end), 1095);
  assert.equal(offerPrice(0, during), 0);
});
