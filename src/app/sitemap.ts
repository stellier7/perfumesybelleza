import type { MetadataRoute } from "next";
import { store } from "@/config";
import { getCatalog, getComparisonPairs } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/tienda",
    "/comparaciones",
    "/envios",
    "/como-pagar",
    "/sobre-nosotros",
    "/contacto",
    "/politica-de-devoluciones",
    "/terminos",
    "/privacidad",
  ];
  return [
    ...staticPaths.map((path) => ({
      url: `${store.url}${path || "/"}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.6,
    })),
    ...getCatalog().map((product) => ({
      url: `${store.url}/producto/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: product.isReference ? 0.4 : 0.8,
    })),
    ...getComparisonPairs().map((pair) => ({
      url: `${store.url}/comparar/${pair.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
