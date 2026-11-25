import { SHIPPING_LPS, store } from "@/config";
import { formatPrice } from "@/lib/pricing";

export function storeFaqs(): Array<{ question: string; answer: string }> {
  return [
    {
      question: "¿Cómo se paga?",
      answer:
        "Por transferencia. El pedido se aparta cuando vemos el comprobante en WhatsApp. Los datos de la cuenta se envían al confirmar.",
    },
    {
      question: "¿Cuánto cuesta el envío?",
      answer: `El envío cuesta ${formatPrice(SHIPPING_LPS)} a cualquier departamento de Honduras, con ${store.carrier}. Los pedidos confirmados se arman todos los días a las ${store.orderFillTime} y la entrega tarda ${store.shippingDays}.`,
    },
    {
      question: "¿Cómo hago el pedido?",
      answer:
        "Agregas los productos al carrito y envías el pedido por WhatsApp con tus datos. También puedes escribirnos directo si quieres consultar un producto.",
    },
    {
      question: "¿Puedo devolver un producto?",
      answer:
        "Si el producto sellado no es el que pediste o llegó dañado, escríbenos por WhatsApp dentro de las 48 horas de recibirlo. Los perfumes, brumas y productos de labios o cabello abiertos no tienen cambio, por higiene.",
    },
  ];
}
