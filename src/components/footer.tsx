import Link from "next/link";
import { Logo } from "@/components/logo";
import { Shell } from "@/components/shell";
import { store } from "@/config";

const shop = [
  { href: "/tienda", label: "Tienda" },
  { href: "/tienda?tipo=arabic", label: "Perfumes árabes" },
  { href: "/tienda?categoria=Inspiraciones", label: "Inspiraciones" },
  { href: "/tienda?tipo=designer", label: "Perfumes de diseñador" },
  { href: "/tienda?seccion=cuidado", label: "Cuidado personal" },
  { href: "/comparaciones", label: "Comparaciones" },
];

const help = [
  { href: "/envios", label: "Envíos" },
  { href: "/como-pagar", label: "Cómo pagar" },
  { href: "/politica-de-devoluciones", label: "Devoluciones" },
  { href: "/contacto", label: "Contacto" },
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
];

const legal = [
  { href: "/terminos", label: "Términos" },
  { href: "/privacidad", label: "Privacidad" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-paper">
      <Shell className="grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-4 text-sm leading-6 text-muted">{store.description}</p>
        </div>
        <LinkList title="Tienda" links={shop} />
        <LinkList title="Ayuda" links={help} />
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold">Contacto</p>
          <p className="mt-3 text-sm leading-6">{store.hours}</p>
          <a
            className="mt-2 block text-sm hover:text-gold"
            href={`https://wa.me/${store.whatsappNumber}`}
          >
            WhatsApp {store.whatsappDisplay}
          </a>
          <a className="mt-1 block text-sm hover:text-gold" href={`mailto:${store.email}`}>
            {store.email}
          </a>
          <a className="mt-2 block text-sm hover:text-gold" href={store.instagram}>
            Instagram
          </a>
          <a className="mt-1 block text-sm hover:text-gold" href={store.facebook}>
            Facebook
          </a>
          <div className="mt-4 flex flex-col gap-2 text-sm text-muted">
            {legal.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Shell>
      <div className="border-t border-line px-4 py-4 text-center text-xs text-muted">
        <p>© {store.name}. Precios en lempiras.</p>
        <p className="mt-1">
          Hecho por{" "}
          <a
            href="https://www.iagodigital.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold"
          >
            iAGO Digital
          </a>
        </p>
      </div>
    </footer>
  );
}

function LinkList({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-gold">{title}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-gold">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
