import { Shell } from "@/components/shell";

export default function Loading() {
  return (
    <Shell className="py-12">
      <p className="text-xs uppercase tracking-[0.28em] text-gold">Tienda</p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">Cargando la tienda…</h1>
    </Shell>
  );
}
