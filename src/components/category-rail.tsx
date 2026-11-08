"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AutoRail } from "@/components/auto-rail";
import type { HomeCard, HomeDepartment } from "@/lib/home-rail";

const plainClass =
  "flex h-full w-[18rem] flex-col rounded-3xl p-6 text-left shadow-soft transition duration-300 motion-safe:hover:-translate-y-0.5 hover:shadow-lift";
const photoClass =
  "group relative flex h-[23rem] w-[18rem] flex-col justify-end overflow-hidden rounded-3xl p-6 text-left text-ivory shadow-soft transition duration-300 motion-safe:hover:-translate-y-0.5 hover:shadow-lift";

export function CategoryRail({ departments }: { departments: HomeDepartment[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [animate, setAnimate] = useState(false);
  const current = departments.find((department) => department.id === openId) ?? null;
  const cards: HomeCard[] = current ? current.children : departments;

  function open(id: string) {
    setDirection("forward");
    setAnimate(true);
    setOpenId(id);
  }

  function back() {
    setDirection("back");
    setAnimate(true);
    setOpenId(null);
  }

  return (
    <div className={animate ? (direction === "forward" ? "rail-in" : "rail-back") : undefined} key={openId ?? "inicio"}>
      <AutoRail
        direction="right"
        label={current ? current.title : "Categorías"}
        title={
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            {current ? (
              <button
                type="button"
                onClick={back}
                className="inline-flex h-11 items-center rounded-full border border-line bg-paper px-4 text-sm text-ink"
              >
                Volver
              </button>
            ) : null}
            <h2 id="categorias" className="font-serif text-4xl">
              {current ? current.title : "Categorías"}
            </h2>
          </div>
        }
      >
        {cards.map((card) => {
          const nested = departments.find((department) => department.id === card.id);
          const className = card.image ? photoClass : `${plainClass} ${card.className}`;
          if (nested && nested.children.length > 0) {
            return (
              <button key={card.id} type="button" className={className} onClick={() => open(card.id)}>
                <CardFace card={card} />
              </button>
            );
          }
          return (
            <Link key={card.id} href={card.href} className={className}>
              <CardFace card={card} />
            </Link>
          );
        })}
      </AutoRail>
    </div>
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
