import Image from "next/image";
import Link from "next/link";
import { TYPE_LABEL } from "@/config";
import { displayTitle, formatSize, nameWithBrand } from "@/lib/catalog-model";
import { formatPrice, hasShelfPrice } from "@/lib/pricing";
import { sentenceCase } from "@/lib/text";
import type { PublicProduct } from "@/types/catalog";

export function ProductCard({ product }: { product: PublicProduct }) {
  const image = product.images[0];
  const inspired = product.inspiredBy[0];
  const size = formatSize(product);
  return (
    <article className="flex flex-col">
      <Link
        href={`/producto/${product.slug}`}
        className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-blush/50 shadow-soft transition duration-300 hover:shadow-lift"
      >
        {image ? (
          <Image
            src={image}
            alt={displayTitle(product)}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
          />
        ) : null}
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.14em]">
          {product.inStock ? TYPE_LABEL[product.type] : "Agotado"}
        </span>
      </Link>
      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-sm text-muted">{sentenceCase(product.brand)}</p>
        <p className="mt-1 text-xs text-gold">Tendencia {product.trending}</p>
        <Link href={`/producto/${product.slug}`} className="mt-1 font-serif text-2xl leading-tight">
          {sentenceCase(product.name)}
        </Link>
        {size ? <p className="mt-1 text-sm text-muted">{size}</p> : null}
        {inspired ? (
          <p className="mt-2 text-sm text-muted">Inspirado en {sentenceCase(nameWithBrand(inspired.name, inspired.brand))}</p>
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
