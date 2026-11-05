import Link from "next/link";
import { Shell } from "@/components/shell";

export default function NotFound() {
  return (
    <Shell className="py-20">
      <h1 className="font-serif text-5xl">No encontramos esa página</h1>
      <p className="mt-4 text-muted">Puede que el enlace esté viejo o que el producto ya no esté publicado.</p>
      <Link href="/tienda" className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-5 text-sm text-ivory">
        Ir a la tienda
      </Link>
    </Shell>
  );
}
