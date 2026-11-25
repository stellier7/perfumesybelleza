"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { rememberProduct, useSaved } from "@/components/saved-store";
import { Shell } from "@/components/shell";
import { displayTitle } from "@/lib/catalog-model";
import { formatPrice, hasShelfPrice } from "@/lib/pricing";
import type { SavedItem } from "@/lib/saved";

export function RememberProduct({ item }: { item: SavedItem }) {
  const { id, slug, name, brand, price, image, inStock, sizeLabel } = item;
  useEffect(() => {
    rememberProduct({ id, slug, name, brand, price, image, inStock, sizeLabel });
  }, [id, slug, name, brand, price, image, inStock, sizeLabel]);
  return null;
}

export function RecentRail() {
  const items = useSaved("recent");
  if (items.length === 0) return null;
  return (
    <section className="border-t border-line" aria-label="Vistos recientemente">
      <Shell className="py-12">
        <h2 className="font-serif text-3xl">Vistos recientemente</h2>
        <ul className="mt-6 flex gap-4 overflow-x-auto pb-2">
          {items.map((item) => (
            <li key={item.id} className="w-36 shrink-0">
              <Link href={`/producto/${item.slug}`} className="block">
                <span className="relative block aspect-[4/5] overflow-hidden rounded-3xl bg-blush/50">
                  {item.image ? <Image src={item.image} alt="" fill sizes="144px" className="object-cover" /> : null}
                </span>
                <span className="mt-2 block font-serif text-lg leading-tight">
                  {displayTitle({ name: item.name, brand: item.brand, sizeMl: null, sizeLabel: item.sizeLabel })}
                </span>
                <span className="mt-1 block text-sm text-muted">
                  {hasShelfPrice(item.price) ? formatPrice(item.price) : "Precio por confirmar"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Shell>
    </section>
  );
}
