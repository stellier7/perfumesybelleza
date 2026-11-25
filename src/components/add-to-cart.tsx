"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import type { CartLine } from "@/components/cart/cart-provider";

export function AddToCartButton({
  item,
  qty = 1,
  label = "Agregar",
  className,
}: {
  item: Omit<CartLine, "qty">;
  qty?: number;
  label?: string;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        addItem(item, qty);
        setAdded(true);
      }}
    >
      {added ? "En el carrito" : label}
    </button>
  );
}
