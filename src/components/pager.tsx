import Link from "next/link";

export function Pager({
  page,
  pages,
  hrefFor,
  label,
}: {
  page: number;
  pages: number;
  hrefFor: (page: number) => string;
  label: string;
}) {
  if (pages <= 1) return null;
  return (
    <nav className="mt-8 flex items-center justify-between text-sm" aria-label={label}>
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="rounded-full border border-line px-4 py-2">
          Anterior
        </Link>
      ) : (
        <span />
      )}
      <span>
        {page} de {pages}
      </span>
      {page < pages ? (
        <Link href={hrefFor(page + 1)} className="rounded-full border border-line px-4 py-2">
          Siguiente
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
