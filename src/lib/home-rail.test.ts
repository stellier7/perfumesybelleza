import assert from "node:assert/strict";
import test from "node:test";
import { CATALOG_SECTIONS } from "./catalog-section";
import { homeDepartments, type ShelfItem } from "./home-rail";

function item(type: ShelfItem["type"], category: string, inspired = false): ShelfItem {
  return { type, category, inspired };
}

const shelf: ShelfItem[] = [
  item("arabic", "Eau de Parfum"),
  item("designer", "Eau de Parfum"),
  item("arabic", "Set", true),
  item("designer", "Set"),
  item("beauty", "Shampoo"),
  item("beauty", "Skincare coreano"),
  item("beauty", "Skincare coreano"),
  item("beauty", "Acondicionador"),
];

function hrefOf(path: string): string {
  return decodeURIComponent(path.replaceAll("+", " "));
}

test("las categorías del inicio entran directo a la tienda", () => {
  const departments = homeDepartments(shelf);
  assert.deepEqual(
    departments.map((department) => department.title),
    ["Perfumes", "Cuidado personal", "Skincare coreano"],
  );
  const perfumes = hrefOf(departments[0]?.href ?? "");
  assert.match(perfumes, /seccion=perfumes/);
  assert.doesNotMatch(perfumes, /categoria=/);
  assert.doesNotMatch(perfumes, /tipo=/);
  const cuidado = departments.find((department) => department.id === "cuidado");
  assert.equal(cuidado?.text, "Cabello, cuerpo y el cuidado de todos los días.");
  assert.match(hrefOf(cuidado?.href ?? ""), /seccion=cuidado/);
  assert.doesNotMatch(hrefOf(cuidado?.href ?? ""), /categoria=/);
});

test("belleza y skincare coreano son tarjetas, no una segunda fila", () => {
  const departments = homeDepartments([
    ...shelf,
    item("beauty", "Maquillaje"),
    item("beauty", "Uñas"),
    item("beauty", "Crema facial"),
  ]);
  assert.deepEqual(
    departments.map((department) => department.title),
    ["Perfumes", "Cuidado personal", "Belleza", "Skincare coreano"],
  );
  const belleza = departments.find((department) => department.id === "belleza");
  assert.ok(belleza);
  assert.equal(belleza.image, "/home/cuidado-maquillaje.webp");
  assert.match(hrefOf(belleza.href), /seccion=cuidado/);
  assert.doesNotMatch(hrefOf(belleza.href), /categoria=/);
  const korean = departments.find((department) => department.id === "skincare-coreano");
  assert.ok(korean);
  assert.equal(korean.image, "/home/cuidado-skincare-coreano.webp");
  const href = hrefOf(korean.href);
  assert.match(href, /seccion=cuidado/);
  assert.match(href, /categoria=Skincare coreano/);
});

test("sin maquillaje ni skincare no se inventan esas tarjetas", () => {
  const titles = homeDepartments([item("arabic", "Eau de Parfum"), item("beauty", "Shampoo")]).map(
    (department) => department.title,
  );
  assert.deepEqual(titles, ["Perfumes", "Cuidado personal"]);
});

test("cada sección de la tienda tiene un departamento", () => {
  const ids = homeDepartments(shelf).map((department) => department.id);
  for (const section of CATALOG_SECTIONS) assert.ok(ids.includes(section));
});
