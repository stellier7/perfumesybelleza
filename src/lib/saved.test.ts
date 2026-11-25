import assert from "node:assert/strict";
import test from "node:test";
import { parseSaved, rememberRecent, toggleSaved, type SavedItem } from "./saved";

const item: SavedItem = {
  id: "yara",
  slug: "yara",
  name: "Yara",
  brand: "Lattafa",
  price: 1200,
  image: "/products/yara.webp",
  inStock: true,
};

test("un favorito se agrega y se quita", () => {
  const saved = toggleSaved([], item);
  assert.equal(saved.length, 1);
  assert.deepEqual(toggleSaved(saved, item), []);
});

test("un json inválido no rompe la lista", () => {
  assert.deepEqual(parseSaved("{"), []);
  assert.deepEqual(parseSaved("null"), []);
});

test("lo visto reciente no duplica y respeta el límite", () => {
  const first = rememberRecent([], item, 2);
  const second = rememberRecent(first, { ...item, id: "asad", slug: "asad", name: "Asad" }, 2);
  const again = rememberRecent(second, item, 2);
  assert.deepEqual(
    again.map((entry) => entry.id),
    ["yara", "asad"],
  );
});
