import { slugify } from "@/lib/text";

const READY = new Set([
  "perfumes",
  "cuidado",
  "perfumes-arabes",
  "perfumes-disenador",
  "perfumes-sets",
  "perfumes-inspiraciones",
  "cuidado-unas",
  "cuidado-maquillaje",
  "cuidado-tratamiento-para-cabello",
  "cuidado-hidratacion-capilar",
  "cuidado-accesorio",
  "cuidado-crema-corporal",
  "cuidado-shampoo",
  "cuidado-crema-facial",
  "cuidado-skincare-coreano",
  "cuidado-accesorios-de-barberia",
  "cuidado-acondicionador",
  "cuidado-plancha-para-cabello",
  "cuidado-mascarilla-facial",
  "cuidado-cuidado-para-ninos",
  "cuidado-tinte-para-cabello",
  "cuidado-limpiador-facial",
  "cuidado-protector-solar",
  "cuidado-suero-facial",
  "cuidado-depilacion",
  "cuidado-keratina",
  "cuidado-cuidado-bucal",
  "cuidado-mueble-de-salon",
  "cuidado-gel-de-bano",
  "cuidado-tonico-facial",
  "cuidado-maquina-para-cabello",
  "cuidado-decolorante",
  "cuidado-exfoliante-facial",
  "cuidado-desodorante",
  "cuidado-cuidado-intimo",
  "cuidado-secadora-de-cabello",
]);

const ALIAS: Record<string, string> = {
  belleza: "cuidado-maquillaje",
  "skincare-coreano": "cuidado-skincare-coreano",
};

export function homeImage(id: string): string | null {
  const slug = ALIAS[id] ?? slugify(id);
  if (!READY.has(slug)) return null;
  return `/home/${slug}.webp`;
}
