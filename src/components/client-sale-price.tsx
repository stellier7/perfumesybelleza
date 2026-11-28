"use client";

import { PriceMarkup } from "@/components/price-markup";
import { offerPrice } from "@/lib/sale";

/** Precio de oferta en listas que solo existen en el navegador: búsqueda, favoritos, vistos. */
export function ClientSalePrice({
  list,
  className,
  compareClassName,
}: {
  list: number;
  className?: string;
  compareClassName?: string;
}) {
  return <PriceMarkup list={list} pay={offerPrice(list)} className={className} compareClassName={compareClassName} />;
}
