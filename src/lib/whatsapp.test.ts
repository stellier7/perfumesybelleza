import assert from "node:assert/strict";
import test from "node:test";
import { buildOrderMessage, whatsappUrl } from "./whatsapp";

test("el pedido incluye piezas, envío, total, datos y la transferencia", () => {
  const message = buildOrderMessage({
    lines: [{ name: "Tag Him", brand: "Armaf", qty: 2, price: 690 }],
    shipping: 150,
    customer: {
      name: "Ana López",
      phone: "99990000",
      department: "Cortés",
      city: "San Pedro Sula",
      address: "Col. Trejo, casa 12",
      notes: "Dejar en recepción",
    },
    utm: { utm_source: "instagram", utm_campaign: "verano" },
  });
  assert.match(message, /Tag Him \(Armaf\) × 2 — L 1,380\.00/);
  assert.match(message, /Total: L 1,380\.00\nEnvío: L 150\.00\nTotal con envío: L 1,530\.00/);
  assert.match(message, /Ana López/);
  assert.match(message, /Pago por transferencia\./);
  assert.match(message, /utm_source=instagram/);
  assert.match(message, /utm_campaign=verano/);
  const url = whatsappUrl(message, "50400000000");
  assert.ok(url.startsWith("https://wa.me/50400000000?text="));
  assert.equal(decodeURIComponent(url.split("text=")[1] ?? ""), message);
});
