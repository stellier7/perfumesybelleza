"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { CART_STORAGE_KEY } from "@/config";
import { trackPixel } from "@/lib/pixel";
import { offerPrice } from "@/lib/sale";

export type CartLine = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  /** Lo que se cobra ahora. */
  price: number;
  /** Precio de lista, antes de la oferta. Si falta, `price` es ese precio. */
  listPrice?: number;
  image: string | null;
  qty: number;
  /** Tamaño para mostrar. El nombre guardado sigue siendo el de la distribuidora. */
  sizeLabel?: string;
};

type CartContextValue = {
  lines: CartLine[];
  hydrated: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const MAX_QTY = 10;
const EMPTY: CartLine[] = [];

let cartLines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function readCart(): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];
      const line = entry as Partial<CartLine>;
      if (!line.id || !line.slug || !line.name || !line.brand || typeof line.price !== "number" || line.price <= 0) return [];
      const listPrice = typeof line.listPrice === "number" && line.listPrice > 0 ? line.listPrice : line.price;
      const price = offerPrice(listPrice);
      if (price <= 0) return [];
      return [
        {
          id: line.id,
          slug: line.slug,
          name: line.name,
          brand: line.brand,
          price,
          listPrice,
          image: line.image ?? null,
          qty: Math.min(MAX_QTY, Math.max(1, Number(line.qty) || 1)),
          sizeLabel: typeof line.sizeLabel === "string" && line.sizeLabel.trim() ? line.sizeLabel.trim() : undefined,
        },
      ];
    });
  } catch {
    return [];
  }
}

function ensureLoaded(): void {
  if (loaded || typeof window === "undefined") return;
  cartLines = readCart();
  loaded = true;
}

function emit(): void {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartLines));
  for (const listener of listeners) listener();
}

function updateCart(updater: (current: CartLine[]) => CartLine[]): void {
  ensureLoaded();
  cartLines = updater(cartLines);
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): CartLine[] {
  ensureLoaded();
  return cartLines;
}

function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

function subscribeHydration(): () => void {
  return () => undefined;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.qty, 0);
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
    return {
      lines,
      hydrated,
      drawerOpen,
      setDrawerOpen,
      count,
      subtotal,
      addItem: (item, qty = 1) => {
        const listPrice = item.listPrice !== undefined && item.listPrice > 0 ? item.listPrice : item.price;
        const price = offerPrice(listPrice);
        if (price <= 0) return;
        const priced = { ...item, listPrice, price };
        updateCart((current) => {
          const existing = current.find((line) => line.id === priced.id);
          if (!existing) return [...current, { ...priced, qty: Math.min(MAX_QTY, qty) }];
          return current.map((line) =>
            line.id === priced.id
              ? {
                  ...line,
                  price: priced.price,
                  listPrice: priced.listPrice,
                  sizeLabel: line.sizeLabel ?? priced.sizeLabel,
                  qty: Math.min(MAX_QTY, line.qty + qty),
                }
              : line,
          );
        });
        setDrawerOpen(true);
        trackPixel("AddToCart", {
          content_ids: [priced.id],
          content_name: priced.name,
          content_type: "product",
          value: priced.price,
          currency: "HNL",
        });
      },
      setQty: (id, qty) => {
        updateCart((current) =>
          current.flatMap((line) => {
            if (line.id !== id) return [line];
            if (qty <= 0) return [];
            return [{ ...line, qty: Math.min(MAX_QTY, qty) }];
          }),
        );
      },
      remove: (id) => updateCart((current) => current.filter((line) => line.id !== id)),
      clear: () => updateCart(() => []),
    };
  }, [drawerOpen, hydrated, lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart debe usarse dentro de CartProvider.");
  return value;
}
