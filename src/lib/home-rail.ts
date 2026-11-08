import {
  catalogFilterQuery,
  INSPIRATIONS_CATEGORY,
  type CatalogFilters,
} from "@/lib/catalog-query";
import { catalogSection, sectionLabel } from "@/lib/catalog-section";
import { homeImage } from "@/lib/home-images";
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

const KOREAN_SKINCARE = "Skincare coreano";

/** Maquillaje y belleza en general. Cabello, cuerpo y herramientas siguen en cuidado personal. */
const BELLEZA_CATEGORIES = new Set([
  "Maquillaje",
  "Uñas",
  "Crema facial",
  "Mascarilla facial",
  "Limpiador facial",
  "Protector solar",
  "Suero facial",
  "Tónico facial",
  "Exfoliante facial",
]);

type CareShelf = "cuidado" | "belleza" | "skincare";

const sectionCopy = {
  perfumes: {
    text: "Árabes, diseñador, sets e inspiraciones.",
    className: "bg-night text-ivory",
  },
  cuidado: {
    text: "Cabello, cuerpo y el cuidado de todos los días.",
    className: "bg-champagne-soft text-ink",
  },
  belleza: {
    text: "Maquillaje, uñas y belleza en general.",
    className: "bg-blush text-ink",
  },
  skincare: {
    text: "La rutina coreana para la piel.",
    className: "bg-paper text-ink",
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

function careShelf(category: string): CareShelf {
  if (category === KOREAN_SKINCARE) return "skincare";
  if (BELLEZA_CATEGORIES.has(category)) return "belleza";
  return "cuidado";
}

function categoryChildren(products: ShelfItem[], shelf: CareShelf, pinned: string[]): HomeCard[] {
  const counts = new Map<string, number>();
  for (const product of products) {
    if (catalogSection(product.type) !== "cuidado") continue;
    const name = product.category.trim();
    if (!name || careShelf(name) !== shelf) continue;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  const names = [
    ...pinned.filter((name) => counts.has(name)),
    ...[...counts.keys()].filter((name) => !pinned.includes(name)).sort((a, b) => a.localeCompare(b, "es")),
  ];
  return names.map((name, index) => {
    const id = `cuidado-${name}`;
    return {
      id,
      title: name,
      text: countLabel(counts.get(name) ?? 0),
      className: tone(index),
      href: shopHref({ seccion: "cuidado", categoria: name }),
      image: homeImage(id),
    };
  });
}

export function homeDepartments(products: ShelfItem[]): HomeDepartment[] {
  const departments: HomeDepartment[] = [
    {
      id: "perfumes",
      title: sectionLabel("perfumes"),
      text: sectionCopy.perfumes.text,
      className: sectionCopy.perfumes.className,
      href: shopHref({ seccion: "perfumes" }),
      image: homeImage("perfumes"),
      children: perfumeChildren(products),
    },
    {
      id: "cuidado",
      title: sectionLabel("cuidado"),
      text: sectionCopy.cuidado.text,
      className: sectionCopy.cuidado.className,
      href: shopHref({ seccion: "cuidado" }),
      image: homeImage("cuidado"),
      children: categoryChildren(products, "cuidado", []),
    },
  ];
  const belleza = categoryChildren(products, "belleza", ["Maquillaje", "Uñas"]);
  if (belleza.length > 0) {
    departments.push({
      id: "belleza",
      title: "Belleza",
      text: sectionCopy.belleza.text,
      className: sectionCopy.belleza.className,
      href: shopHref({ seccion: "cuidado" }),
      image: homeImage("belleza"),
      children: belleza,
    });
  }
  if (categoryChildren(products, "skincare", []).length > 0) {
    departments.push({
      id: "skincare-coreano",
      title: KOREAN_SKINCARE,
      text: sectionCopy.skincare.text,
      className: sectionCopy.skincare.className,
      href: shopHref({ seccion: "cuidado", categoria: KOREAN_SKINCARE }),
      image: homeImage("skincare-coreano"),
      children: [],
    });
  }
  return departments;
}
