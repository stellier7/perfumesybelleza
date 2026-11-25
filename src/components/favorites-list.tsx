"use client";

import Link from "next/link";
import { toggleWishlist, useSaved } from "@/components/saved-store";
import { displayTitle } from "@/lib/catalog-model";
import { formatPrice, hasShelfPrice } from "@/lib/pricing";
import Image from "next/image";

export function FavoritesList() {
  const items = useSaved("wishlist");
  if (items.length === 0) {
    return (
      <div>
        <p className="max-w-md leading-7 text-muted">Todavía no guardas productos. El corazón de cada ficha los deja en este dispositivo.</p>
        <Link href="/tienda" className="mt-6 inline-flex h-12 items-center bg-ink px-5 text-sm text-ivory">
          Ir a la tienda
        </Link>
      </div>
    );
  }
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-4 py-4">
          <Link href={`/producto/${item.slug}`} className="relative h-20 w-16 shrink-0 overflow-hidden bg-stone">
            {item.image ? <Image src={item.image} alt="" fill sizes="64px" className="object-cover" /> : null}
          </Link>
          <div className="min-w-0 flex-1">
            <Link href={`/producto/${item.slug}`} className="font-serif text-2xl leading-tight">
              {displayTitle({ name: item.name, brand: item.brand, sizeMl: null, sizeLabel: item.sizeLabel })}
            </Link>
            <p className="mt-1 text-sm text-muted">
              {item.inStock ? "Disponible" : "Agotado"}
              {" · "}
              {hasShelfPrice(item.price) ? formatPrice(item.price) : "Precio por confirmar"}
            </p>
          </div>
          <button type="button" className="text-sm text-muted" onClick={() => toggleWishlist(item)}>
            Quitar
          </button>
        </li>
      ))}
    </ul>
  );
}
