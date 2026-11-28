import assert from "node:assert/strict";
import test from "node:test";
import { mosaicImageSizes, mosaicSpan, mosaicTileClass } from "./mosaic-layout";

test("un solo recuadro ocupa el ancho", () => {
  assert.deepEqual(mosaicSpan(0, 1), { mobileColumns: 2, desktopColumns: 4, desktopRows: 1 });
  assert.equal(mosaicTileClass(0, 1), "col-span-2 md:col-span-4");
});

test("dos recuadros se parten el escritorio", () => {
  assert.deepEqual(mosaicSpan(0, 2), { mobileColumns: 2, desktopColumns: 2, desktopRows: 2 });
  assert.deepEqual(mosaicSpan(1, 2), { mobileColumns: 2, desktopColumns: 2, desktopRows: 2 });
});

test("cinco recuadros cierran el bloque sin estirar", () => {
  assert.deepEqual(
    [0, 1, 2, 3, 4].map((index) => mosaicSpan(index, 5)),
    [
      { mobileColumns: 2, desktopColumns: 2, desktopRows: 2 },
      { mobileColumns: 1, desktopColumns: 1, desktopRows: 1 },
      { mobileColumns: 1, desktopColumns: 1, desktopRows: 1 },
      { mobileColumns: 1, desktopColumns: 1, desktopRows: 1 },
      { mobileColumns: 1, desktopColumns: 1, desktopRows: 1 },
    ],
  );
});

test("el séptimo recuadro, Todos, completa la fila de abajo", () => {
  const spans = [0, 1, 2, 3, 4, 5, 6].map((index) => mosaicSpan(index, 7));
  assert.deepEqual(spans[0], { mobileColumns: 2, desktopColumns: 2, desktopRows: 2 });
  assert.deepEqual(spans.slice(1, 5), [
    { mobileColumns: 1, desktopColumns: 1, desktopRows: 1 },
    { mobileColumns: 1, desktopColumns: 1, desktopRows: 1 },
    { mobileColumns: 1, desktopColumns: 1, desktopRows: 1 },
    { mobileColumns: 1, desktopColumns: 1, desktopRows: 1 },
  ]);
  assert.deepEqual(spans[5], { mobileColumns: 1, desktopColumns: 2, desktopRows: 1 });
  assert.deepEqual(spans[6], { mobileColumns: 1, desktopColumns: 2, desktopRows: 1 });
  assert.equal(mosaicTileClass(0, 7), "col-span-2 md:col-span-2 md:row-span-2 min-h-80 md:min-h-[34rem]");
  assert.equal(mosaicTileClass(6, 7), "col-span-1 md:col-span-2 md:min-h-64");
  assert.equal(mosaicImageSizes(0, 7), "(max-width: 768px) 100vw, 50vw");
  assert.equal(mosaicImageSizes(6, 7), "(max-width: 768px) 50vw, 50vw");
});

test("si falta un recuadro, el último se estira y no deja hueco", () => {
  assert.deepEqual(mosaicSpan(5, 6), { mobileColumns: 2, desktopColumns: 4, desktopRows: 1 });
  assert.equal(mosaicTileClass(5, 6), "col-span-2 md:col-span-4 md:min-h-64");
  assert.deepEqual(mosaicSpan(3, 4), { mobileColumns: 2, desktopColumns: 2, desktopRows: 1 });
});
