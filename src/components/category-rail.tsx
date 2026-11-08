import Image from "next/image";
import Link from "next/link";
import { AutoRail } from "@/components/auto-rail";
import type { HomeCard } from "@/lib/home-rail";

const plainClass =
  "flex h-full w-[18rem] flex-col rounded-3xl p-6 text-left shadow-soft transition duration-300 motion-safe:hover:-translate-y-0.5 hover:shadow-lift";
const photoClass =
  "group relative flex h-[23rem] w-[18rem] flex-col justify-end overflow-hidden rounded-3xl p-6 text-left text-ivory shadow-soft transition duration-300 motion-safe:hover:-translate-y-0.5 hover:shadow-lift";

export function CategoryRail({ departments }: { departments: HomeCard[] }) {
  return (
    <AutoRail
      direction="right"
      label="Categorías"
      title={
        <h2 id="categorias" className="font-serif text-4xl">
          Categorías
        </h2>
      }
    >
      {departments.map((card) => (
        <Link key={card.id} href={card.href} className={card.image ? photoClass : `${plainClass} ${card.className}`}>
          <CardFace card={card} />
        </Link>
      ))}
    </AutoRail>
  );
}

function CardFace({ card }: { card: HomeCard }) {
  const copy = (
    <>
      <p className="font-serif text-3xl leading-none">{card.title}</p>
      <p className={`mt-3 text-sm leading-6 ${card.image ? "text-ivory/90" : "opacity-80"}`}>{card.text}</p>
    </>
  );
  if (!card.image) return copy;
  return (
    <>
      <Image
        src={card.image}
        alt=""
        fill
        sizes="288px"
        className="object-cover transition duration-500 motion-safe:group-hover:scale-[1.04]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
      <span className="relative">{copy}</span>
    </>
  );
}
