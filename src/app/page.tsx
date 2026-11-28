import Image from "next/image";
import Link from "next/link";
import { CategoryMosaic } from "@/components/home/category-mosaic";
import { HomeHero } from "@/components/home/hero";
import { NewsletterInvite } from "@/components/home/newsletter";
import { ProductRail, TextLink } from "@/components/home/product-rail";
import { FaqList } from "@/components/faq";
import { JsonLd } from "@/components/json-ld";
import { RecentRail } from "@/components/recent-rail";
import { SalePrice } from "@/components/sale-price";
import { Shell } from "@/components/shell";
import { SHIPPING_LPS, store } from "@/config";
import { getComparisonPairs, getFeaturedProducts, getSellableProducts } from "@/lib/catalog";
import { displayTitle } from "@/lib/catalog-model";
import { editorialTiles, topBrands } from "@/lib/home-editorial";
import { homeShelf } from "@/lib/home-rail";
import { isSpotlightFiller, pickFamous } from "@/lib/fame";
import { formatPrice } from "@/lib/pricing";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { storeFaqs } from "@/lib/store-copy";
import { KOREAN_CATEGORY } from "@/lib/routine-finder";

export const metadata = pageMetadata({
  title: "Perfumes y belleza en Honduras",
  description:
    "Fragancias de diseñador, casas árabes, skincare coreano y belleza. Envío a todo Honduras y pedidos por WhatsApp.",
  path: "/",
});

function brandHref(type: "designer" | "arabic", brand: string): string {
  const params = new URLSearchParams({ seccion: "perfumes", tipo: type, marca: brand });
  return `/tienda?${params.toString()}`;
}

export default function HomePage() {
  const sellable = getSellableProducts();
  const stocked = sellable.filter((product) => product.inStock);
  const featured = getFeaturedProducts();
  const featuredIds = new Set(featured.map((product) => product.id));
  const perfumes = pickFamous(
    stocked.filter(
      (product) => homeShelf(product) === "perfumes" && !isSpotlightFiller(product) && !featuredIds.has(product.id),
    ),
    8,
  );
  const korean = stocked.filter((product) => product.category === KOREAN_CATEGORY);
  const koreanRail = pickFamous(
    korean.filter((product) => !isSpotlightFiller(product)),
    8,
  );
  const makeup = pickFamous(
    stocked.filter((product) => product.category === "Maquillaje" && !isSpotlightFiller(product)),
    8,
  );
  const tiles = editorialTiles(sellable);
  const designers = topBrands(sellable, "designer", 8);
  const pairs = getComparisonPairs().slice(0, 3);
  const faqs = storeFaqs();
  const benefits = [
    ["Envío", `${formatPrice(SHIPPING_LPS)} a todo Honduras con ${store.carrier}. Pedidos listos a las ${store.orderFillTime}. Entrega en ${store.shippingDays}.`],
    ["Pago", "Transferencia bancaria. Te enviamos los datos de la cuenta al confirmar el pedido por WhatsApp."],
    ["Atención", `${store.hours}. El pedido se arma en la tienda y llega listo al chat.`],
    ["Claridad", "Una alternativa se presenta como alternativa. No la describimos como el perfume de la casa."],
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Store",
          name: store.name,
          description: store.description,
          url: store.url,
          telephone: `+${store.whatsappNumber}`,
          email: store.email,
          areaServed: "Honduras",
          currenciesAccepted: "HNL",
        }}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <HomeHero />
      <Shell className="py-12 md:py-16">
        <p className="text-[0.7rem] uppercase tracking-[0.22em] text-gold">Categorías</p>
        <h2 className="mt-2 max-w-xl font-serif text-4xl md:text-5xl">Entra directo a lo que buscas.</h2>
        <div className="mt-8">
          <CategoryMosaic tiles={tiles} />
        </div>
      </Shell>

      <section className="border-y border-line">
        <Shell className="grid items-center gap-8 py-14 md:grid-cols-2 md:py-16">
          <div className="relative min-h-80 overflow-hidden rounded-[2rem] bg-night shadow-lift ring-4 ring-paper md:min-h-[32rem]">
            <Image
              src="/home/perfumes-disenador.webp"
              alt="Frascos de perfumería de diseñador"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.22em] text-gold">Perfumería</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">Diseñador y casas árabes, en el mismo mostrador.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted">
              Elige por casa, concentración o una palabra del nombre. Las notas de salida, corazón y fondo se
              muestran solo cuando el producto las trae.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <TextLink href="/tienda?seccion=perfumes&tipo=designer">Diseñador</TextLink>
              <TextLink href="/tienda?seccion=perfumes&tipo=arabic">Árabes</TextLink>
              <TextLink href="/encontrar">Encontrar perfume</TextLink>
            </div>
            {designers.length > 0 ? (
              <ul className="mt-8 flex flex-wrap gap-2">
                {designers.map((entry) => (
                  <li key={entry.brand}>
                    <Link href={brandHref("designer", entry.brand)} className="inline-flex h-10 items-center rounded-full border border-line bg-paper px-3 text-sm">
                      {entry.brand}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </Shell>
      </section>

      <Shell className="pt-12 pb-4 md:pt-16">
        <ProductRail
          id="seleccion"
          eyebrow="Casa"
          title="Selección de la casa"
          href="/tienda?seccion=perfumes"
          products={featured}
        />
      </Shell>

      <Shell className="py-8">
        <ProductRail
          id="buscados"
          eyebrow="Perfumería"
          title="Las líneas más buscadas"
          href="/tienda?seccion=perfumes"
          products={perfumes}
        />
      </Shell>

      {korean.length > 0 ? (
        <section className="mt-8 bg-sage">
          <Shell className="grid items-center gap-8 py-14 md:grid-cols-2 md:py-16">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-gold">Korean Beauty</p>
              <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">Cuidado coreano, con ficha y paso de rutina.</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-muted">
                {korean.length} productos en skincare coreano. La rutina agrupa limpiadores, sérums, cremas y
                solares según el nombre o la categoría. No inventamos tipo de piel ni ingredientes que la ficha no
                menciona.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <TextLink href="/rutina">Armar una rutina</TextLink>
                <TextLink href={`/tienda?seccion=cuidado&categoria=${encodeURIComponent(KOREAN_CATEGORY)}`}>
                  Ver la categoría
                </TextLink>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-paper shadow-lift ring-4 ring-sage">
              <Image
                src="/home/cuidado-skincare-coreano.webp"
                alt="Productos de skincare coreano"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Shell>
        </section>
      ) : null}

      {koreanRail.length > 0 ? (
        <Shell className="py-12">
          <ProductRail title="Skincare coreano" href={`/tienda?seccion=cuidado&categoria=${encodeURIComponent(KOREAN_CATEGORY)}`} products={koreanRail} />
        </Shell>
      ) : null}

      {makeup.length > 0 ? (
        <Shell className="py-12">
          <ProductRail title="Maquillaje" href="/tienda?seccion=cuidado&categoria=Maquillaje" products={makeup} />
        </Shell>
      ) : null}

      {pairs.length > 0 ? (
        <section className="bg-night text-ivory">
          <Shell className="py-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="max-w-lg font-serif text-4xl leading-tight">Si buscas un perfume famoso, mira su alternativa.</h2>
              <Link href="/comparaciones" className="text-sm text-champagne underline-offset-4 hover:underline">
                Ver comparaciones
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {pairs.map((pair) => (
                <Link key={pair.slug} href={`/comparar/${pair.slug}`} className="rounded-3xl border border-white/15 bg-night-soft p-5">
                  <p className="text-sm text-champagne">{displayTitle(pair.original)}</p>
                  <p className="mt-3 font-serif text-2xl">
                    {displayTitle(pair.alternative)}
                    <span className="text-champagne"> · alternativa</span>
                  </p>
                  <p className="mt-2 text-sm text-champagne/80">
                    <SalePrice
                      list={pair.alternative.price}
                      className="text-sm text-champagne"
                      compareClassName="text-champagne/60"
                    />
                  </p>
                </Link>
              ))}
            </div>
          </Shell>
        </section>
      ) : null}

      <Shell className="grid gap-4 py-14 md:grid-cols-4">
        {benefits.map(([title, text]) => (
          <article key={title} className="rounded-3xl border border-line bg-paper p-5 shadow-soft">
            <h2 className="font-serif text-2xl">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
          </article>
        ))}
      </Shell>

      <section className="bg-night text-ivory">
        <Shell className="grid items-center gap-8 py-14 md:grid-cols-[1.2fr_auto]">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.22em] text-champagne">Novedades</p>
            <h2 className="mt-3 max-w-xl font-serif text-4xl leading-tight">Lanzamientos y promociones, por WhatsApp.</h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-champagne/85">
              La tienda no tiene una lista de correo. Si quieres avisos, el mensaje se abre en el chat de{" "}
              {store.whatsappDisplay}.
            </p>
          </div>
          <NewsletterInvite />
        </Shell>
      </section>

      <Shell id="preguntas" className="py-14">
        <h2 className="font-serif text-4xl">Preguntas frecuentes</h2>
        <div className="mt-6 max-w-3xl">
          <FaqList items={faqs} />
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/envios" className="underline-offset-4 hover:underline">Envíos</Link>
          <Link href="/como-pagar" className="underline-offset-4 hover:underline">Cómo pagar</Link>
          <Link href="/politica-de-devoluciones" className="underline-offset-4 hover:underline">Devoluciones</Link>
        </div>
      </Shell>
      <RecentRail />
    </>
  );
}
