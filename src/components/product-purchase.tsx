"use client";

import Image from "next/image";
import { useEffect, useState, type MouseEvent } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice, hasShelfPrice } from "@/lib/pricing";
import { trackPixel } from "@/lib/pixel";
import { UTM_STORAGE_KEY } from "@/config";
import { sanitizeUtm } from "@/lib/utm";
import {
  buildProductInquiry,
  buildRestockMessage,
  whatsappUrl,
} from "@/lib/whatsapp";

export type PurchaseTarget = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
  inStock: boolean;
  isReference: boolean;
  sizeMl: number | null;
};

function storedUtm(): Record<string, string> {
  try {
    return sanitizeUtm(JSON.parse(localStorage.getItem(UTM_STORAGE_KEY) ?? "{}"));
  } catch {
    return {};
  }
}

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  if (!current) {
    return <div className="aspect-[4/5] rounded-3xl bg-blush/60" />;
  }
  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-blush/40">
        <Image
          src={current}
          alt={`${name}, foto ${active + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 ? (
        <div className="mt-3 flex gap-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              className={`relative h-16 w-14 overflow-hidden rounded-xl border ${index === active ? "border-gold" : "border-transparent"}`}
              aria-label={`Ver foto ${index + 1}`}
            >
              <Image src={image} alt="" fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ViewContent({ product }: { product: PurchaseTarget }) {
  useEffect(() => {
    if (product.isReference) return;
    trackPixel("ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: product.price,
      currency: "HNL",
    });
  }, [product.id, product.name, product.price, product.isReference]);
  return null;
}

function inquiryMessage(product: PurchaseTarget, utm: Record<string, string>): string {
  if (product.inStock) {
    return buildProductInquiry({
      name: product.name,
      brand: product.brand,
      price: product.price,
      sizeMl: product.sizeMl,
      utm,
    });
  }
  return buildRestockMessage({ name: product.name, brand: product.brand, utm });
}

export function ProductActions({ product }: { product: PurchaseTarget }) {
  const { addItem } = useCart();
  if (product.isReference) return null;
  const href = whatsappUrl(inquiryMessage(product, {}));
  const canBuy = product.inStock && hasShelfPrice(product.price);
  const label = !product.inStock
    ? "Avísame por WhatsApp"
    : canBuy
      ? "Pedir por WhatsApp"
      : "Consultar precio";

  function openChat(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    window.open(whatsappUrl(inquiryMessage(product, storedUtm())), "_blank", "noopener,noreferrer");
  }

  function add() {
    if (!canBuy) return;
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.images[0] ?? null,
      },
      1,
    );
  }

  return (
    <>
      <div className="mt-6 hidden gap-3 md:flex">
        {canBuy ? (
          <button type="button" onClick={add} className="h-12 flex-1 rounded-full bg-ink px-5 text-sm text-ivory">
            Agregar al carrito
          </button>
        ) : null}
        <a href={href} onClick={openChat} target="_blank" rel="noopener noreferrer" className="flex h-12 flex-1 items-center justify-center rounded-full border border-ink px-5 text-sm">
          {label}
        </a>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 p-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-2 pr-20">
          <p className="min-w-0 flex-1 text-sm font-medium">
            {!product.inStock
              ? "Agotado"
              : hasShelfPrice(product.price)
                ? formatPrice(product.price)
                : "Precio por confirmar"}
          </p>
          <a href={href} onClick={openChat} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center rounded-full border border-ink px-3 text-xs">
            {!product.inStock ? "Avísame" : canBuy ? "WhatsApp" : "Consultar"}
          </a>
          {canBuy ? (
            <button type="button" onClick={add} className="h-11 rounded-full bg-ink px-4 text-sm text-ivory">
              Agregar
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}
