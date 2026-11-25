"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart";
import { SaveButton } from "@/components/save-button";
import type { CartLine } from "@/components/cart/cart-provider";
import type { SavedItem } from "@/lib/saved";

export type QuickProduct = {
  title: string;
  href: string;
  priceLabel: string;
  availability: string;
  images: string[];
  cart: Omit<CartLine, "qty"> | null;
  saved: SavedItem;
};

export function QuickView({ product }: { product: QuickProduct }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-ink"
        aria-label={`Vista rápida de ${product.title}`}
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-3 sm:items-center"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="grid w-full max-w-3xl gap-5 rounded-3xl bg-paper p-4 sm:grid-cols-[16rem_1fr] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-blush/50">
              {product.images[0] ? (
                <Image src={product.images[0]} alt="" fill sizes="256px" className="object-cover" />
              ) : null}
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="flex items-start justify-between gap-3">
                <h2 id={titleId} className="font-serif text-3xl leading-tight">
                  {product.title}
                </h2>
                <button type="button" className="text-sm text-muted" onClick={() => setOpen(false)}>
                  Cerrar
                </button>
              </div>
              <p className="mt-3 text-lg">{product.priceLabel}</p>
              <p className="mt-1 text-sm text-muted">{product.availability}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {product.cart ? (
                  <AddToCartButton
                    item={product.cart}
                    label="Agregar al carrito"
                    className="h-11 rounded-full bg-ink px-5 text-sm text-ivory"
                  />
                ) : null}
                <SaveButton
                  item={product.saved}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line"
                />
              </div>
              <Link href={product.href} className="mt-4 text-sm underline-offset-4 hover:underline">
                Ver ficha completa
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
