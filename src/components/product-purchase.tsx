"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { formatSize } from "@/lib/catalog-model";
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
  sizeLabel?: string;
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
  const [zoom, setZoom] = useState(false);
  const current = images[active] ?? images[0];

  useEffect(() => {
    if (!zoom) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setZoom(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

  if (!current) {
    return <div className="aspect-[6/5] rounded-3xl bg-blush/60 md:aspect-[4/5]" />;
  }
  return (
    <div>
      <button
        type="button"
        className="relative block aspect-[6/5] w-full overflow-hidden rounded-3xl bg-blush/40 shadow-soft md:aspect-[4/5]"
        onClick={() => setZoom(true)}
        aria-label={`Ampliar foto de ${name}`}
      >
        <Image
          src={current}
          alt={`${name}, foto ${active + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </button>
      {zoom ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
          role="presentation"
          onClick={() => setZoom(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Foto ampliada de ${name}`}
            className="relative h-[min(88vh,52rem)] w-full max-w-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image src={current} alt={`${name}, foto ampliada`} fill sizes="100vw" className="object-contain" />
            <button type="button" className="absolute right-2 top-2 rounded-full bg-paper px-3 py-2 text-sm" onClick={() => setZoom(false)}>
              Cerrar
            </button>
          </div>
        </div>
      ) : null}
      {images.length > 1 ? (
        <div className="mt-3 flex gap-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              className={`relative h-16 w-14 overflow-hidden rounded-xl border ${index === active ? "border-ink" : "border-transparent"}`}
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
      sizeLabel: product.sizeLabel,
      utm,
    });
  }
  return buildRestockMessage({ name: product.name, brand: product.brand, utm });
}

export function ProductActions({ product }: { product: PurchaseTarget }) {
  const { addItem, setDrawerOpen } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  if (product.isReference) return null;
  const href = whatsappUrl(inquiryMessage(product, {}));
  const canBuy = product.inStock && hasShelfPrice(product.price);
  const label = !product.inStock
    ? "Avísame por WhatsApp"
    : canBuy
      ? "Pedir por WhatsApp"
      : "Consultar precio";
  const line = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    price: product.price,
    image: product.images[0] ?? null,
    sizeLabel: formatSize(product) ?? undefined,
  };

  function openChat(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    window.open(whatsappUrl(inquiryMessage(product, storedUtm())), "_blank", "noopener,noreferrer");
  }

  function add() {
    if (!canBuy) return;
    addItem(line, qty);
  }

  function buyNow() {
    if (!canBuy) return;
    addItem(line, qty);
    setDrawerOpen(false);
    router.push("/carrito");
  }

  const quantity = canBuy ? (
    <div className="flex items-center rounded-full border border-line">
      <button type="button" className="h-11 w-10" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Reducir cantidad">
        −
      </button>
      <span className="w-8 text-center text-sm">{qty}</span>
      <button type="button" className="h-11 w-10" onClick={() => setQty((value) => Math.min(10, value + 1))} aria-label="Aumentar cantidad">
        +
      </button>
    </div>
  ) : null;

  const priceLabel = !product.inStock
    ? "Agotado"
    : hasShelfPrice(product.price)
      ? formatPrice(product.price)
      : "Precio por confirmar";

  return (
    <>
      <div className="mt-6 space-y-3">
        {quantity}
        <div className="hidden flex-wrap items-center gap-3 md:flex">
          {canBuy ? (
            <button type="button" onClick={add} className="h-12 flex-1 rounded-full bg-ink px-5 text-sm text-ivory">
              Agregar al carrito
            </button>
          ) : null}
          {canBuy ? (
            <button type="button" onClick={buyNow} className="h-12 rounded-full border border-ink px-5 text-sm">
              Comprar ahora
            </button>
          ) : null}
          <a href={href} onClick={openChat} target="_blank" rel="noopener noreferrer" className="flex h-12 flex-1 items-center justify-center rounded-full border border-line px-5 text-sm">
            {label}
          </a>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 p-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 text-sm font-medium">{priceLabel}</p>
          {canBuy ? (
            <button type="button" onClick={buyNow} className="h-11 rounded-full bg-ink px-4 text-sm text-ivory">
              Comprar
            </button>
          ) : null}
          <a href={href} onClick={openChat} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center rounded-full border border-ink px-3 text-xs">
            {!product.inStock ? "Avísame" : canBuy ? "WhatsApp" : "Consultar"}
          </a>
        </div>
      </div>
    </>
  );
}
