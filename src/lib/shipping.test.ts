import assert from "node:assert/strict";
import test from "node:test";
import { DEPARTMENTS, SHIPPING_LPS } from "@/config";
import { isDepartment, lowestShippingCost, shippingCost } from "./shipping";

test("el envío cuesta 150 lempiras en todos los departamentos", () => {
  assert.equal(SHIPPING_LPS, 150);
  assert.equal(lowestShippingCost(), 150);
  assert.equal(shippingCost(), 150);
  assert.equal(DEPARTMENTS.length, 18);
  for (const department of DEPARTMENTS) {
    assert.equal(isDepartment(department), true);
  }
  assert.equal(isDepartment("Madrid"), false);
});
