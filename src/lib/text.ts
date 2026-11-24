export function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Primera letra en mayúscula y el resto en minúscula. No reescribe el texto guardado. */
export function sentenceCase(value: string): string {
  const lower = value.trim().replace(/\s+/g, " ").toLocaleLowerCase("es-HN");
  const letter = /\p{L}/u.exec(lower);
  if (!letter) return lower;
  const index = letter.index;
  return lower.slice(0, index) + lower.charAt(index).toLocaleUpperCase("es-HN") + lower.slice(index + 1);
}

export function slugify(value: string): string {
  const slug = fold(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "producto";
}

export function assertNever(value: never): never {
  throw new Error(`Valor no manejado: ${String(value)}`);
}
