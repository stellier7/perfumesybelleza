import { catalogFilterQuery, type CatalogFilters } from "@/lib/catalog-query";
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

export type HomeShelf = "perfumes" | CareShelf;

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

function careShelf(category: string): CareShelf {
  if (category === KOREAN_SKINCARE) return "skincare";
  if (BELLEZA_CATEGORIES.has(category)) return "belleza";
  return "cuidado";
}

export function homeShelf(product: { type: ProductType; category: string }): HomeShelf {
  if (catalogSection(product.type) === "perfumes") return "perfumes";
  return careShelf(product.category.trim());
}

export const SPOTLIGHTS: { id: HomeShelf; title: string; href: string }[] = [
  { id: "perfumes", title: "Destacados de perfumería", href: shopHref({ seccion: "perfumes" }) },
  { id: "cuidado", title: "Destacados de cuidado personal", href: shopHref({ seccion: "cuidado" }) },
  { id: "belleza", title: "Destacados de belleza", href: shopHref({ seccion: "cuidado" }) },
  {
    id: "skincare",
    title: "Destacados de skincare coreano",
    href: shopHref({ seccion: "cuidado", categoria: KOREAN_SKINCARE }),
  },
];

function hasCareShelf(products: ShelfItem[], shelf: CareShelf): boolean {
  return products.some((product) => {
    if (catalogSection(product.type) !== "cuidado") return false;
    return careShelf(product.category.trim()) === shelf;
  });
}

export function homeDepartments(products: ShelfItem[]): HomeCard[] {
  const departments: HomeCard[] = [
    {
      id: "perfumes",
      title: sectionLabel("perfumes"),
      text: sectionCopy.perfumes.text,
      className: sectionCopy.perfumes.className,
      href: shopHref({ seccion: "perfumes" }),
      image: homeImage("perfumes"),
    },
    {
      id: "cuidado",
      title: sectionLabel("cuidado"),
      text: sectionCopy.cuidado.text,
      className: sectionCopy.cuidado.className,
      href: shopHref({ seccion: "cuidado" }),
      image: homeImage("cuidado"),
    },
  ];
  if (hasCareShelf(products, "belleza")) {
    departments.push({
      id: "belleza",
      title: "Belleza",
      text: sectionCopy.belleza.text,
      className: sectionCopy.belleza.className,
      href: shopHref({ seccion: "cuidado" }),
      image: homeImage("belleza"),
    });
  }
  if (hasCareShelf(products, "skincare")) {
    departments.push({
      id: "skincare-coreano",
      title: KOREAN_SKINCARE,
      text: sectionCopy.skincare.text,
      className: sectionCopy.skincare.className,
      href: shopHref({ seccion: "cuidado", categoria: KOREAN_SKINCARE }),
      image: homeImage("skincare-coreano"),
    });
  }
  return departments;
}
