import { Checkout } from "@/components/cart/checkout";
import { Shell } from "@/components/shell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Carrito",
  description: "Revisa tu pedido y envíalo por WhatsApp. Pago por transferencia y envío a todo Honduras.",
  path: "/carrito",
  index: false,
});

export default function CartPage() {
  return (
    <Shell className="py-5 md:py-8">
      <Checkout />
    </Shell>
  );
}
