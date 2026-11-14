"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { SHIPPING_LPS } from "@/config";
import { formatPrice } from "@/lib/pricing";
import { useCart } from "@/components/cart/cart-provider";

export function CartButton() {
  const { count, setDrawerOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => setDrawerOpen(true)}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-line"
      aria-label={`Abrir carrito, ${count} productos`}
    >
      <BagIcon />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[0.65rem] text-ivory">
          {count}
        </span>
      ) : null}
    </button>
  );
}

export function CartDrawer() {
  const { lines, drawerOpen, setDrawerOpen, setQty, remove, subtotal } = useCart();

  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, setDrawerOpen]);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40" role="presentation" onClick={() => setDrawerOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
        className="flex h-full w-full max-w-md flex-col bg-paper shadow-lift"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="font-serif text-2xl">Tu carrito</h2>
          <button type="button" onClick={() => setDrawerOpen(false)} className="text-sm">
            Cerrar
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {lines.length === 0 ? (
            <p className="text-muted">Todavía no agregas productos.</p>
          ) : (
            <ul className="space-y-3">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-blush/50">
                    {line.image ? (
                      <Image src={line.image} alt="" fill sizes="64px" className="object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted">{line.brand}</p>
                    <p className="line-clamp-2 text-sm font-medium leading-5">{line.name}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <p className="text-sm">{formatPrice(line.price)}</p>
                      <button type="button" className="h-8 w-8 rounded-full border border-line" onClick={() => setQty(line.id, line.qty - 1)} aria-label="Quitar uno">
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{line.qty}</span>
                      <button type="button" className="h-8 w-8 rounded-full border border-line" onClick={() => setQty(line.id, line.qty + 1)} aria-label="Agregar uno">
                        +
                      </button>
                      <button type="button" className="ml-auto text-xs text-muted" onClick={() => remove(line.id)}>
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-line px-4 py-4 pb-8">
          <div className="mb-1 flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="mb-4 text-xs text-muted">Envío de {formatPrice(SHIPPING_LPS)} a todo Honduras.</p>
          <Link
            href="/carrito"
            onClick={() => setDrawerOpen(false)}
            className="flex h-12 items-center justify-center rounded-full bg-ink text-sm text-ivory"
          >
            Ver carrito y pedir
          </Link>
        </div>
      </div>
    </div>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path d="M6 8h12l-1 12H7L6 8z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
