import {
  catalogFilterQuery,
  INSPIRATIONS_CATEGORY,
  type CatalogFilters,
} from "@/lib/catalog-query";
import { CATALOG_SECTIONS, catalogSection, sectionLabel, type CatalogSection } from "@/lib/catalog-section";
import { homeImage } from "@/lib/home-images";
import { assertNever } from "@/lib/text";
import type { ProductType } from "@/types/catalog";

export type ShelfItem = {
  type: ProductType;
  category: string;
  inspired: boolean;
};

export type HomeCard = {
  id: string;
  title: string;
  text: string;
  className: string;
  href: string;
  image: string | null;
};

export type HomeDepartment = HomeCard & {
  children: HomeCard[];
};

const SECTION_ORDER: CatalogSection[] = ["perfumes", "cuidado"];

const sectionCopy: Record<CatalogSection, Pick<HomeCard, "text" | "className">> = {
  perfumes: {
    text: "Árabes, diseñador, sets e inspiraciones.",
    className: "bg-night text-ivory",
  },
  cuidado: {
    text: "Cabello, piel, maquillaje, uñas y skincare coreano.",
    className: "bg-champagne-soft text-ink",
  },
};

const tones = [
  "bg-night text-ivory",
  "bg-champagne-soft text-ink",
  "bg-blush text-ink",
  "bg-paper text-ink",
  "bg-night-soft text-ivory",
];

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

function countLabel(count: number): string {
  return count === 1 ? "1 producto" : `${count} productos`;
}

function tone(index: number): string {
  return tones[index % tones.length] ?? tones[0];
}

function perfumeChildren(products: ShelfItem[]): HomeCard[] {
  const perfumes = products.filter((product) => catalogSection(product.type) === "perfumes");
  const cards: HomeCard[] = [];
  if (perfumes.some((product) => product.type === "arabic")) {
    cards.push({
      id: "perfumes-arabes",
      title: "Árabes",
      text: "Alternativas para quienes buscan un aroma similar.",
      className: tone(cards.length),
      href: shopHref({ seccion: "perfumes", tipo: "arabic" }),
      image: homeImage("perfumes-arabes"),
    });
  }
  if (perfumes.some((product) => product.type === "designer")) {
    cards.push({
      id: "perfumes-disenador",
      title: "Diseñador",
      text: "Piezas de casa para regalo o para quien ya tiene su firma.",
      className: tone(cards.length),
      href: shopHref({ seccion: "perfumes", tipo: "designer" }),
      image: homeImage("perfumes-disenador"),
    });
  }
  const sets = perfumes.filter((product) => product.category === "Set").length;
  if (sets > 0) {
    cards.push({
      id: "perfumes-sets",
      title: "Sets",
      text: "Sets de perfume, árabes y de diseñador.",
      className: tone(cards.length),
      href: shopHref({ seccion: "perfumes", categoria: "Set" }),
      image: homeImage("perfumes-sets"),
    });
  }
  const inspired = perfumes.filter((product) => product.inspired).length;
  if (inspired > 0) {
    cards.push({
      id: "perfumes-inspiraciones",
      title: INSPIRATIONS_CATEGORY,
      text: "Del más cercano al aroma de diseñador, hasta el más libre.",
      className: tone(cards.length),
      href: shopHref({ seccion: "perfumes", categoria: INSPIRATIONS_CATEGORY }),
      image: homeImage("perfumes-inspiraciones"),
    });
  }
  return cards;
}

function categoryChildren(products: ShelfItem[], section: CatalogSection, pinned: string[]): HomeCard[] {
  const counts = new Map<string, number>();
  for (const product of products) {
    if (catalogSection(product.type) !== section) continue;
    const name = product.category.trim();
    if (!name) continue;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  const names = [
    ...pinned.filter((name) => counts.has(name)),
    ...[...counts.keys()].filter((name) => !pinned.includes(name)).sort((a, b) => a.localeCompare(b, "es")),
  ];
  return names.map((name, index) => {
    const id = `${section}-${name}`;
    return {
      id,
      title: name,
      text: countLabel(counts.get(name) ?? 0),
      className: tone(index),
      href: shopHref({ seccion: section, categoria: name }),
      image: homeImage(id),
    };
  });
}

function childrenFor(section: CatalogSection, products: ShelfItem[]): HomeCard[] {
  switch (section) {
    case "perfumes":
      return perfumeChildren(products);
    case "cuidado":
      return categoryChildren(products, section, ["Skincare coreano"]);
    default:
      return assertNever(section);
  }
}

export function homeDepartments(products: ShelfItem[]): HomeDepartment[] {
  const ordered = [
    ...SECTION_ORDER.filter((section) => CATALOG_SECTIONS.includes(section)),
    ...CATALOG_SECTIONS.filter((section) => !SECTION_ORDER.includes(section)),
  ];
  return ordered.map((section) => ({
    id: section,
    title: sectionLabel(section),
    text: sectionCopy[section].text,
    className: sectionCopy[section].className,
    href: shopHref({ seccion: section }),
    image: homeImage(section),
    children: childrenFor(section, products),
  }));
}
