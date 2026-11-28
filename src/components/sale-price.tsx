import { Suspense } from "react";
import { io } from "next/cache";
import { PriceMarkup } from "@/components/price-markup";
import { hasShelfPrice } from "@/lib/pricing";
import { discounted, offerPrice, SALE } from "@/lib/sale";

export function SalePrice({
  list,
  className,
  compareClassName,
}: {
  list: number;
  className?: string;
  compareClassName?: string;
}) {
  return (
    <Suspense fallback={<PriceMarkup list={list} pay={discounted(list)} className={className} compareClassName={compareClassName} />}>
      <SalePriceLive list={list} className={className} compareClassName={compareClassName} />
    </Suspense>
  );
}

async function SalePriceLive({
  list,
  className,
  compareClassName,
}: {
  list: number;
  className?: string;
  compareClassName?: string;
}) {
  await io();
  return <PriceMarkup list={list} pay={offerPrice(list)} className={className} compareClassName={compareClassName} />;
}

export function SaleBadge({ list }: { list: number }) {
  return (
    <Suspense fallback={<Badge list={list} pay={discounted(list)} />}>
      <SaleBadgeLive list={list} />
    </Suspense>
  );
}

async function SaleBadgeLive({ list }: { list: number }) {
  await io();
  return <Badge list={list} pay={offerPrice(list)} />;
}

function Badge({ list, pay }: { list: number; pay: number }) {
  if (!hasShelfPrice(list) || pay === list) return null;
  return (
    <span className="rounded-full bg-ink px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-ivory">
      {SALE.badge}
    </span>
  );
}
