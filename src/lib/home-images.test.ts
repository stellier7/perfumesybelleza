import assert from "node:assert/strict";
import test from "node:test";
import { homeImage } from "./home-images";

test("el inicio tiene foto para perfumes, cuidado y sus categorías", () => {
  assert.equal(homeImage("perfumes"), "/home/perfumes.webp");
  assert.equal(homeImage("cuidado"), "/home/cuidado.webp");
  assert.equal(homeImage("perfumes-arabes"), "/home/perfumes-arabes.webp");
  assert.equal(homeImage("cuidado-Uñas"), "/home/cuidado-unas.webp");
  assert.equal(homeImage("cuidado-Skincare coreano"), "/home/cuidado-skincare-coreano.webp");
  assert.equal(homeImage("cuidado-Secadora de cabello"), "/home/cuidado-secadora-de-cabello.webp");
  assert.equal(homeImage("belleza"), "/home/cuidado-maquillaje.webp");
  assert.equal(homeImage("skincare-coreano"), "/home/cuidado-skincare-coreano.webp");
});

test("una categoría nueva sigue en color hasta tener foto", () => {
  assert.equal(homeImage("cuidado-Algo nuevo"), null);
});
