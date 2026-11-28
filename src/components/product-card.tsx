import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart";
import { QuickView } from "@/components/quick-view";
import { SaleBadge, SalePrice } from "@/components/sale-price";
import { SaveButton } from "@/components/save-button";
import { displayTitle, formatSize } from "@/lib/catalog-model";
import { hasShelfPrice } from "@/lib/pricing";
import { fold } from "@/lib/text";
import type { SavedItem } from "@/lib/saved";
import type { PublicProduct } from "@/types/catalog";

function savedItem(product: PublicProduct): SavedItem {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    price: product.price,
    image: product.images[0] ?? null,
    inStock: product.inStock,
    sizeLabel: formatSize(product) ?? undefined,
  };
}

export function ProductCard({ product }: { product: PublicProduct }) {
  const image = product.images[0];
  const alternate = product.images.find((item) => item !== image);
  const inspired = product.inspiredBy[0];
  const title = displayTitle(product);
  const size = formatSize(product);
  const showBrand = product.brand.trim().length > 0 && !fold(title).includes(fold(product.brand));
  const showSize = size !== null && !fold(title).replace(/\s+/g, "").includes(fold(size).replace(/\s+/g, ""));
  const canBuy = !product.isReference && product.inStock && hasShelfPrice(product.price);
  const priceLabel = product.isReference
    ? "Referencia de aroma"
    : hasShelfPrice(product.price)
      ? null
      : "Precio por confirmar";
  const availability = product.isReference ? "Para comparar" : product.inStock ? "Disponible" : "Agotado";
  const saved = savedItem(product);
  const cart = canBuy
    ? {
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.price,
        listPrice: product.price,
        image: product.images[0] ?? null,
        sizeLabel: size ?? undefined,
      }
    : null;

  return (
    <article className="flex h-full min-w-0 flex-col">
      <div className="relative">
        <Link
          href={`/producto/${product.slug}`}
          className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-blush/50 shadow-soft"
        >
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={`object-cover transition duration-500 ease-out motion-safe:group-hover:scale-[1.03] ${alternate ? "motion-safe:group-hover:opacity-0" : ""}`}
            />
          ) : null}
          {alternate ? (
            <Image
              src={alternate}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover opacity-0 transition duration-500 ease-out motion-safe:group-hover:opacity-100"
            />
          ) : null}
        </Link>
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {!product.isReference ? <SaleBadge list={product.price} /> : null}
          {product.featured && product.inStock ? (
            <span className="rounded-full bg-paper/95 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.16em]">Destacado</span>
          ) : null}
          {!product.inStock && !product.isReference ? (
            <span className="rounded-full bg-ink/90 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-ivory">Agotado</span>
          ) : null}
        </div>
        <SaveButton
          item={saved}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink"
        />
      </div>
      <div className="mt-3 flex flex-1 flex-col">
        {showBrand ? <p className="text-[0.72rem] uppercase tracking-[0.16em] text-muted">{product.brand}</p> : null}
        <Link href={`/producto/${product.slug}`} className="mt-1 break-words text-balance font-serif text-xl leading-tight md:text-[1.45rem]">
          {title}
        </Link>
        {showSize ? <p className="mt-1 text-sm text-muted">{size}</p> : null}
        {inspired ? (
          <p className="mt-2 text-sm text-muted">
            Inspirado en {displayTitle({ name: inspired.name, brand: inspired.brand, sizeMl: null })}
          </p>
        ) : null}
        <p className="mt-auto pt-3 text-sm">
          {priceLabel === null ? <SalePrice list={product.price} className="text-sm" /> : priceLabel}
        </p>
        <p className="mt-0.5 text-xs text-muted">{availability}</p>
        <div className="mt-3 flex items-center gap-2">
          {cart ? (
            <AddToCartButton item={cart} className="h-10 flex-1 rounded-full bg-ink text-sm text-ivory" />
          ) : (
            <Link
              href={`/producto/${product.slug}`}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-line text-sm"
            >
              Ver ficha
            </Link>
          )}
          <QuickView
            product={{
              title,
              href: `/producto/${product.slug}`,
              priceLabel: priceLabel ?? "",
              listPrice: priceLabel === null ? product.price : undefined,
              availability,
              images: product.images,
              cart,
              saved,
            }}
          />
        </div>
      </div>
    </article>
  );
}
