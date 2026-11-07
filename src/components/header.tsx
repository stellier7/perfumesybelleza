"use client";

import Link from "next/link";
import { useState } from "react";
import { CartButton } from "@/components/cart/cart-drawer";
import { Logo } from "@/components/logo";
import { SearchBox } from "@/components/search-box";
import { Shell } from "@/components/shell";
import { store } from "@/config";
import type { SearchRecord } from "@/types/catalog";

const links = [
  { href: "/tienda", label: "Tienda" },
  { href: "/tienda?tipo=arabic", label: "Árabes" },
  { href: "/tienda?categoria=Inspiraciones", label: "Inspiraciones" },
  { href: "/tienda?tipo=designer", label: "Diseñador" },
  { href: "/tienda?seccion=cuidado", label: "Cuidado" },
  { href: "/comparaciones", label: "Comparaciones" },
];

export function Header({ records }: { records: SearchRecord[] }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ivory/90 backdrop-blur">
      <p className="bg-night px-4 py-2 text-center text-xs tracking-wide text-champagne-soft">
        Envío a todo Honduras en {store.shippingDays} con {store.carrier}
      </p>
      <Shell className="flex h-16 items-center gap-3">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Menú</span>
          <span aria-hidden="true">{open ? "✕" : "☰"}</span>
        </button>
        <Logo />
        <nav className="ml-6 hidden items-center gap-5 text-sm lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-gold">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <SearchBox records={records} variant="header" />
          <CartButton />
        </div>
      </Shell>
      {open ? (
        <nav className="border-t border-line bg-paper px-4 py-3 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-lg"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
