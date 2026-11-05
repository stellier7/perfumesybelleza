import assert from "node:assert/strict";
import test from "node:test";
import { extractProductsFromHtml, htmlLooksLikeEmptyShell, parseCatalogCsv } from "./catalog-import";

test("lee un CSV con el precio como costo", () => {
  const csv = [
    "name,brand,price,image path,category,type,gender,inspiredBy",
    'Tag Him,Armaf,"L 1,250.00",/tmp/tag.jpg,Eau de Parfum,arabic,hombre,bleu-de-chanel',
  ].join("\n");
  const [product] = parseCatalogCsv(csv);
  assert.equal(product?.cost, 1250);
  assert.equal(product?.listPrice, null);
  assert.equal(product?.type, "arabic");
  assert.equal(product?.gender, "hombre");
  assert.deepEqual(product?.inspiredBy, ["bleu-de-chanel"]);
  assert.deepEqual(product?.imageSources, ["/tmp/tag.jpg"]);
});

test("separa el precio mayorista del precio de venta", () => {
  const csv = [
    "nombre,marca,precio mayorista,precio,imagen,imagen 2,categoria,tipo,salida,corazon,fondo",
    "Tag Him,Armaf,460,750,tag-him.jpg,tag-him-2.jpg,Eau de Parfum,arabe,Bergamota,Jengibre,Cedro",
    "Yara,Lattafa,440,,,yara.jpg,Eau de Parfum,arabic,,,",
  ].join("\n");
  const [custom, automatic] = parseCatalogCsv(csv);
  assert.equal(custom?.cost, 460);
  assert.equal(custom?.listPrice, 750);
  assert.deepEqual(custom?.imageSources, ["tag-him.jpg", "tag-him-2.jpg"]);
  assert.deepEqual(automatic?.imageSources, ["yara.jpg"]);
  assert.deepEqual(custom?.notes.top, ["Bergamota"]);
  assert.equal(automatic?.cost, 440);
  assert.equal(automatic?.listPrice, null);
});

test("lee productos desde JSON-LD y detecta una página vacía", () => {
  const html = `<!doctype html><html><head>
    <script type="application/ld+json">
      {"@type":"Product","name":"Yara","brand":{"@type":"Brand","name":"Lattafa"},"offers":{"@type":"Offer","price":"440","priceCurrency":"HNL"},"image":"https://example.com/yara.jpg"}
    </script>
  </head><body><h1>Yara</h1></body></html>`;
  const [product] = extractProductsFromHtml(html);
  assert.equal(product?.name, "Yara");
  assert.equal(product?.brand, "Lattafa");
  assert.equal(product?.cost, 440);
  assert.equal(htmlLooksLikeEmptyShell(html), false);

  const shell = "<html><body><app-root></app-root></body></html>";
  assert.deepEqual(extractProductsFromHtml(shell), []);
  assert.equal(htmlLooksLikeEmptyShell(shell), true);
});
