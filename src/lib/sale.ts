import { roundPrice } from "@/lib/pricing";

/**
 * Black Friday sobre el precio de hoy.
 * Abre el sábado 28 de noviembre de 2026 a las 12:00 a.m. de Honduras
 * y cierra al empezar el martes 1 de diciembre.
 */
export const SALE = {
  percent: 10,
  startsAt: "2026-11-28T00:00:00-06:00",
  endsAt: "2026-12-01T00:00:00-06:00",
  badge: "−10%",
  banner: "Black Friday · 10% en todo el catálogo · hasta el lunes 30 de noviembre.",
  note: "Black Friday · −10% · hasta el lunes 30 de noviembre.",
} as const;

const START = Date.parse(SALE.startsAt);
const END = Date.parse(SALE.endsAt);

export function isSaleActive(at: Date): boolean {
  const time = at.getTime();
  return time >= START && time < END;
}

/** Precio con el 10%, redondeado a la decena. No mira el calendario. */
export function discounted(listPrice: number): number {
  if (!Number.isFinite(listPrice) || listPrice <= 0) return listPrice;
  return roundPrice(listPrice * (1 - SALE.percent / 100));
}

/** Lo que se cobra. Fuera de la oferta es el precio de lista. */
export function offerPrice(listPrice: number, at: Date = new Date()): number {
  if (!isSaleActive(at)) return listPrice;
  return discounted(listPrice);
}
