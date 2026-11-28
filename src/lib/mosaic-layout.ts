import { assertNever } from "@/lib/text";

type Span = 1 | 2 | 4;

export type MosaicSpan = {
  mobileColumns: Span;
  desktopColumns: Span;
  desktopRows: 1 | 2;
};

const MOBILE_COLUMNS = 2;
const DESKTOP_COLUMNS = 4;
const BESIDE_CAPACITY = 4;

/** Cierra el mosaico: el primer recuadro es el grande y la última fila no deja hueco. */
export function mosaicSpan(index: number, count: number): MosaicSpan {
  if (count <= 1) return { mobileColumns: 2, desktopColumns: 4, desktopRows: 1 };
  if (index <= 0) return { mobileColumns: 2, desktopColumns: 2, desktopRows: 2 };

  const restIndex = index - 1;
  const restCount = count - 1;
  return {
    mobileColumns: fillSpan(restIndex, restCount, MOBILE_COLUMNS),
    desktopColumns: desktopColumns(restIndex, restCount),
    desktopRows: restCount === 1 ? 2 : 1,
  };
}

export function mosaicTileClass(index: number, count: number): string {
  const span = mosaicSpan(index, count);
  const feature = index === 0 && count > 1;
  return [
    columnClass(span.mobileColumns, ""),
    columnClass(span.desktopColumns, "md:"),
    span.desktopRows === 2 ? "md:row-span-2" : "",
    feature ? "min-h-80 md:min-h-[34rem]" : "",
    !feature && count > 1 ? "md:min-h-64" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function mosaicImageSizes(index: number, count: number): string {
  const span = mosaicSpan(index, count);
  const mobile = span.mobileColumns === 1 ? "50vw" : "100vw";
  return `(max-width: 768px) ${mobile}, ${desktopShare(span.desktopColumns)}`;
}

function desktopColumns(restIndex: number, restCount: number): Span {
  const beside = Math.min(restCount, BESIDE_CAPACITY);
  if (restIndex < beside) return besideSpan(restIndex, beside);
  return fillSpan(restIndex - beside, restCount - beside, DESKTOP_COLUMNS);
}

function besideSpan(restIndex: number, beside: number): Span {
  if (beside <= 2) return 2;
  if (beside === 3) return restIndex === beside - 1 ? 2 : 1;
  return 1;
}

function fillSpan(index: number, count: number, columns: number): Span {
  const remainder = count % columns;
  if (remainder === 0 || index < count - remainder) return 1;
  const position = index - (count - remainder);
  const base = Math.floor(columns / remainder);
  const extra = columns % remainder;
  return asSpan(base + (position >= remainder - extra ? 1 : 0));
}

function asSpan(span: number): Span {
  if (span === 1 || span === 2 || span === 4) return span;
  throw new Error(`Ancho de mosaico no válido: ${span}`);
}

function columnClass(span: Span, breakpoint: "" | "md:"): string {
  switch (span) {
    case 1:
      return `${breakpoint}col-span-1`;
    case 2:
      return `${breakpoint}col-span-2`;
    case 4:
      return `${breakpoint}col-span-4`;
    default:
      return assertNever(span);
  }
}

function desktopShare(span: Span): "25vw" | "50vw" | "100vw" {
  switch (span) {
    case 1:
      return "25vw";
    case 2:
      return "50vw";
    case 4:
      return "100vw";
    default:
      return assertNever(span);
  }
}
