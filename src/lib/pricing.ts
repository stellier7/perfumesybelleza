import { PRICE_MARKUP, PRICE_ROUND_TO } from "@/config";

/** Precio público a partir del costo. El costo no se redondea ni se expone. */
export function publicPrice(cost: number): number {
  if (!Number.isFinite(cost) || cost <= 0) return 0;
  const raw = cost * PRICE_MARKUP;
  const rounded = Math.round(raw / PRICE_ROUND_TO) * PRICE_ROUND_TO;
  if (rounded <= 0) return PRICE_ROUND_TO;
  return rounded;
}

export function formatPrice(amount: number): string {
  const negative = amount < 0;
  const [whole, fraction] = Math.abs(amount).toFixed(2).split(".");
  const withSeparators = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${negative ? "-" : ""}L ${withSeparators}.${fraction}`;
}
