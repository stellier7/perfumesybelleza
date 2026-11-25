"use client";

import Link from "next/link";
import { useState } from "react";
import { CartButton } from "@/components/cart/cart-drawer";
import { Logo } from "@/components/logo";
import { SearchBox } from "@/components/search-box";
import { Shell } from "@/components/shell";
import { SHIPPING_LPS, store } from "@/config";
import { formatPrice } from "@/lib/pricing";

const links = [
  { href: "/tienda?seccion=perfumes", label: "Perfumes" },
  { href: "/tienda?seccion=cuidado&categoria=Skincare+coreano", label: "K-Beauty" },
  { href: "/tienda?seccion=cuidado&categoria=Maquillaje", label: "Maquillaje" },
  { href: "/facial", label: "Facial" },
  { href: "/marcas", label: "Marcas" },
  { href: "/encontrar", label: "Encontrar" },
];

const menu = [
  ...links,
  { href: "/rutina", label: "Rutina" },
  { href: "/tienda?seccion=cuidado", label: "Cuidado" },
  { href: "/comparaciones", label: "Comparaciones" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ivory/90 backdrop-blur">
      <p className="bg-ink px-4 py-2 text-center text-[0.72rem] tracking-wide text-champagne">
        Envío de {formatPrice(SHIPPING_LPS)} con {store.carrier}. Pedidos listos a las {store.orderFillTime} Entrega en{" "}
        {store.shippingDays}.
      </p>
      <Shell className="flex h-16 items-center gap-3">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center border border-line lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true">{open ? "✕" : "☰"}</span>
        </button>
        <Logo />
        <nav className="ml-4 hidden items-center gap-4 text-sm lg:flex" aria-label="Secciones">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-gold">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <SearchBox variant="header" />
          <CartButton />
        </div>
      </Shell>
      {open ? (
        <nav className="border-t border-line bg-paper px-4 py-2 lg:hidden" aria-label="Menú">
          {menu.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block py-3 text-lg">
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
