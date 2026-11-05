import { MARKUP_BY_TYPE, MIN_PROFIT_BY_TYPE, PRICE_MARKUP, PRICE_ROUND_TO } from "@/config";
import type { ProductType } from "@/types/catalog";

/** Redondea a la decena. Un monto positivo no queda en cero. */
export function roundPrice(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  const rounded = Math.round(amount / PRICE_ROUND_TO) * PRICE_ROUND_TO;
  if (rounded <= 0) return PRICE_ROUND_TO;
  return rounded;
}

/** Precio público a partir del mayorista y el tipo. El mayorista no se expone. */
export function publicPrice(cost: number, type: ProductType = "designer"): number {
  if (!Number.isFinite(cost) || cost <= 0) return 0;
  const markup = MARKUP_BY_TYPE[type] ?? PRICE_MARKUP;
  const minProfit = MIN_PROFIT_BY_TYPE[type] ?? 0;
  return roundPrice(Math.max(cost * markup, cost + minProfit));
}

/** Si el producto trae `price`, ese es el precio de venta. Si no, se calcula. */
export function shelfPrice(product: { cost: number; type: ProductType; price?: number }): number {
  if (product.price !== undefined && product.price > 0) return roundPrice(product.price);
  return publicPrice(product.cost, product.type);
}

/** Un precio en cero todavía no está definido. No se muestra ni se vende. */
export function hasShelfPrice(price: number): boolean {
  return Number.isFinite(price) && price > 0;
}

export function formatPrice(amount: number): string {
  const negative = amount < 0;
  const [whole, fraction] = Math.abs(amount).toFixed(2).split(".");
  const withSeparators = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${negative ? "-" : ""}L ${withSeparators}.${fraction}`;
}
