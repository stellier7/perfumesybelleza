"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/buscar", label: "Buscar" },
  { href: "/favoritos", label: "Favoritos" },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const { count, setDrawerOpen } = useCart();
  if (pathname.startsWith("/producto") || pathname === "/carrito") return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur md:hidden"
      aria-label="Navegación principal"
    >
      <ul className="grid grid-cols-5">
        {links.map((link) => {
          const current = link.href === "/" ? pathname === "/" : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`flex h-16 items-center justify-center text-[0.68rem] tracking-wide ${current ? "text-ink" : "text-muted"}`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-16 w-full flex-col items-center justify-center text-[0.68rem] tracking-wide text-muted"
            aria-label={`Abrir carrito, ${count} productos`}
          >
            Carrito
            {count > 0 ? <span className="text-[0.62rem] text-ink">{count}</span> : null}
          </button>
        </li>
      </ul>
    </nav>
  );
}
