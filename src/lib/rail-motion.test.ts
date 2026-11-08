import assert from "node:assert/strict";
import test from "node:test";
import { advanceRail, containRail, railOrigin, railTrackOrder } from "./rail-motion";

test("el carril hacia la izquierda acumula fracciones de píxel y vuelve al inicio", () => {
  assert.equal(railOrigin(320, "left"), 0);
  assert.equal(advanceRail(0, 320, 0.5, "left"), 0.5);
  assert.equal(advanceRail(319.5, 320, 0.75, "left"), 0.25);
});

test("el carril hacia la derecha sale del duplicado y entra por el otro extremo", () => {
  assert.equal(railOrigin(320, "right"), 320);
  assert.equal(advanceRail(320, 320, 0.5, "right"), 319.5);
  assert.equal(advanceRail(0.25, 320, 0.5, "right"), 319.75);
});

test("hacia la derecha la copia va primero y hacia la izquierda va después", () => {
  assert.deepEqual(railTrackOrder("right"), ["loop", "live"]);
  assert.deepEqual(railTrackOrder("left"), ["live", "loop"]);
});

test("sin ancho el carril se queda quieto", () => {
  assert.equal(railOrigin(0, "left"), 0);
  assert.equal(advanceRail(12, 0, 4, "right"), 0);
  assert.equal(containRail(12, 0), 0);
});

test("el scroll manual da la vuelta dentro de una sola copia", () => {
  assert.equal(containRail(320, 320), 0);
  assert.equal(containRail(340, 320), 20);
  assert.equal(containRail(-10, 320), 310);
  assert.equal(containRail(10 - 25, 320), 305);
});
