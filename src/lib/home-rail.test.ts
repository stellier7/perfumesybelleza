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
  assert.equal(belleza.image, null);
  assert.match(hrefOf(belleza.href), /seccion=cuidado/);
  assert.doesNotMatch(hrefOf(belleza.href), /categoria=/);
  const korean = departments.find((department) => department.id === "skincare-coreano");
  assert.ok(korean);
  assert.equal(korean.image, null);
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

test("la foto de la categoría es un producto de esa sección", () => {
  const departments = homeDepartments([
    {
      id: "sauvage",
      type: "designer",
      category: "Eau de Parfum",
      inspired: false,
      name: "Sauvage",
      brand: "Dior",
      image: "/products/sauvage.webp",
      inStock: true,
    },
    {
      id: "otro",
      type: "designer",
      category: "Eau de Parfum",
      inspired: false,
      name: "Algo distinto",
      brand: "Otra casa",
      image: "/products/otro.webp",
      inStock: true,
    },
    {
      id: "agotado",
      type: "designer",
      category: "Eau de Parfum",
      inspired: false,
      name: "Sauvage",
      brand: "Dior",
      image: "/products/agotado.webp",
      inStock: false,
    },
    {
      id: "shampoo",
      type: "beauty",
      category: "Shampoo",
      inspired: false,
      name: "Maca Shampoo",
      brand: "Karseell",
      image: "/products/shampoo.webp",
      inStock: true,
    },
    {
      id: "cushion",
      type: "beauty",
      category: "Maquillaje",
      inspired: false,
      name: "Cushion Solar Suave",
      brand: "Round Lab",
      image: "/products/cushion.webp",
      inStock: true,
    },
    {
      id: "mascara",
      type: "beauty",
      category: "Maquillaje",
      inspired: false,
      name: "4D Mascara",
      brand: "Missha",
      image: "/products/mascara.webp",
      inStock: true,
    },
    {
      id: "sun",
      type: "beauty",
      category: "Skincare coreano",
      inspired: false,
      name: "Relief Sun",
      brand: "Beauty of Joseon",
      image: "/products/sun.webp",
      inStock: true,
    },
  ]);
  assert.equal(departments.find((department) => department.id === "perfumes")?.image, "/products/sauvage.webp");
  assert.equal(departments.find((department) => department.id === "cuidado")?.image, "/products/shampoo.webp");
  assert.equal(departments.find((department) => department.id === "belleza")?.image, "/products/mascara.webp");
  assert.equal(departments.find((department) => department.id === "skincare-coreano")?.image, "/products/sun.webp");
});

test("cada sección de la tienda tiene un departamento", () => {
  const ids = homeDepartments(shelf).map((department) => department.id);
  for (const section of CATALOG_SECTIONS) assert.ok(ids.includes(section));
});
