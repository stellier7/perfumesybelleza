import Image from "next/image";
import Link from "next/link";
import { BRUMA_CATEGORY, TYPE_LABEL } from "@/config";
import { formatPrice, hasShelfPrice } from "@/lib/pricing";
import type { PublicProduct } from "@/types/catalog";

export function ProductCard({ product }: { product: PublicProduct }) {
  const image = product.images[0];
  const inspired = product.inspiredBy[0];
  const badge = !product.inStock
    ? "Agotado"
    : product.category === BRUMA_CATEGORY
      ? "Bruma"
      : TYPE_LABEL[product.type];
  return (
    <article className="flex flex-col">
      <Link
        href={`/producto/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-3xl bg-blush/50"
      >
        {image ? (
          <Image
            src={image}
            alt={`${product.name} de ${product.brand}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        ) : null}
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.14em]">
          {badge}
        </span>
      </Link>
      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">{product.brand}</p>
        <Link href={`/producto/${product.slug}`} className="mt-1 font-serif text-2xl leading-none">
          {product.name}
        </Link>
        {inspired ? (
          <p className="mt-2 text-sm text-muted">Inspirado en {inspired.name}</p>
        ) : null}
        <p className="mt-2 text-sm font-medium">
          {product.isReference
            ? "Referencia de aroma"
            : hasShelfPrice(product.price)
              ? formatPrice(product.price)
              : "Precio por confirmar"}
        </p>
      </div>
    </article>
  );
}
