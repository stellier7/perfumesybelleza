import {
  catalogFilterQuery,
  INSPIRATIONS_CATEGORY,
  type CatalogFilters,
} from "@/lib/catalog-query";
import { CATALOG_SECTIONS, sectionLabel, type CatalogSection } from "@/lib/catalog-section";

export type HomeRailItem = {
  href: string;
  title: string;
  text: string;
  className: string;
};

const SECTION_ORDER: CatalogSection[] = ["perfumes", "cuidado"];

const sectionCopy: Record<CatalogSection, Pick<HomeRailItem, "text" | "className">> = {
  perfumes: {
    text: "Árabes, diseñador e inspiraciones, en un mismo estante.",
    className: "bg-night text-ivory",
  },
  cuidado: {
    text: "Cabello, piel y cuerpo, con sus propias marcas y categorías.",
    className: "bg-champagne-soft text-ink",
  },
};

function shopHref(filters: Pick<CatalogFilters, "seccion"> & Partial<CatalogFilters>): string {
  return `/tienda${catalogFilterQuery({
    seccion: filters.seccion,
    tipo: filters.tipo ?? "",
    marca: filters.marca ?? "",
    genero: filters.genero ?? "",
    categoria: filters.categoria ?? "",
    min: filters.min ?? null,
    max: filters.max ?? null,
    stock: filters.stock ?? false,
    orden: filters.orden ?? "destacados",
    pagina: 1,
  })}`;
}

const spotlights: HomeRailItem[] = [
  {
    href: shopHref({ seccion: "cuidado", categoria: "Skincare coreano" }),
    title: "Skincare coreano",
    text: "Joseon, COSRX, SKIN1004 y el resto del cuidado coreano.",
    className: "bg-night-soft text-ivory",
  },
  {
    href: shopHref({ seccion: "perfumes", tipo: "arabic" }),
    title: "Perfumes árabes",
    text: "Alternativas para quienes buscan un aroma similar, con precios de uso frecuente.",
    className: "bg-paper text-ink",
  },
  {
    href: shopHref({ seccion: "perfumes", tipo: "designer" }),
    title: "Perfumes de diseñador",
    text: "Piezas de casa para regalo o para quien ya tiene su firma.",
    className: "bg-blush text-ink",
  },
  {
    href: shopHref({ seccion: "perfumes", categoria: INSPIRATIONS_CATEGORY }),
    title: "Inspiraciones",
    text: "Perfumes de la tienda inspirados en un aroma de diseñador, del más cercano al más libre.",
    className: "bg-paper text-ink",
  },
];

function sectionItem(section: CatalogSection): HomeRailItem {
  return {
    href: shopHref({ seccion: section }),
    title: sectionLabel(section),
    text: sectionCopy[section].text,
    className: sectionCopy[section].className,
  };
}

export function homeRailItems(): HomeRailItem[] {
  const ordered = [
    ...SECTION_ORDER.filter((section) => CATALOG_SECTIONS.includes(section)),
    ...CATALOG_SECTIONS.filter((section) => !SECTION_ORDER.includes(section)),
  ];
  const sections = ordered.map(sectionItem);
  const cuidado = sections.findIndex((item) => item.href === shopHref({ seccion: "cuidado" }));
  const items = [...sections];
  items.splice(cuidado === -1 ? items.length : cuidado + 1, 0, ...spotlights);
  return items;
}
