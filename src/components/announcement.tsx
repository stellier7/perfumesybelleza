import { io } from "next/cache";
import { SHIPPING_LPS, store } from "@/config";
import { formatPrice } from "@/lib/pricing";
import { isSaleActive, SALE } from "@/lib/sale";

export function SaleBar() {
  return (
    <p className="bg-ink px-4 py-2 text-center text-[0.72rem] leading-5 tracking-wide text-champagne">
      {SALE.banner}
    </p>
  );
}

function ShippingBar() {
  return (
    <p className="bg-ink px-4 py-2 text-center text-[0.72rem] leading-5 tracking-wide text-champagne">
      <span className="block sm:inline">Envío de {formatPrice(SHIPPING_LPS)} con {store.carrier}.</span>{" "}
      <span className="block sm:inline">Pedidos listos a las {store.orderFillTime}</span>{" "}
      <span className="block sm:inline">Entrega en {store.shippingDays}.</span>
    </p>
  );
}

export async function Announcement() {
  await io();
  return isSaleActive(new Date()) ? <SaleBar /> : <ShippingBar />;
}
