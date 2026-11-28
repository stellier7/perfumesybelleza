import { formatPrice, hasShelfPrice } from "@/lib/pricing";

export function PriceMarkup({
  list,
  pay,
  className = "",
  compareClassName = "text-muted",
}: {
  list: number;
  pay: number;
  className?: string;
  compareClassName?: string;
}) {
  if (!hasShelfPrice(list)) return <span className={className}>Precio por confirmar</span>;
  if (!(pay > 0) || pay === list) return <span className={className}>{formatPrice(list)}</span>;
  return (
    <span className={`inline-flex max-w-full flex-wrap items-baseline gap-x-2 gap-y-0.5 ${className}`}>
      <span className={`line-through ${compareClassName}`}>{formatPrice(list)}</span>
      <span>{formatPrice(pay)}</span>
    </span>
  );
}
