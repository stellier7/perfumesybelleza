"use client";

import type { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { UTM_STORAGE_KEY } from "@/config";
import { useCart } from "@/components/cart/cart-provider";
import { sanitizeUtm } from "@/lib/utm";
import { buildGreeting, whatsappUrl } from "@/lib/whatsapp";

function storedUtm(): Record<string, string> {
  try {
    return sanitizeUtm(JSON.parse(localStorage.getItem(UTM_STORAGE_KEY) ?? "{}"));
  } catch {
    return {};
  }
}

export function WhatsAppButton() {
  const { drawerOpen } = useCart();
  const pathname = usePathname();
  if (drawerOpen || pathname === "/carrito") return null;

  function openChat(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    window.open(whatsappUrl(buildGreeting(storedUtm())), "_blank", "noopener,noreferrer");
  }

  return (
    <a
      href={whatsappUrl(buildGreeting())}
      onClick={openChat}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed right-4 bottom-20 z-40 md:bottom-6"
    >
      <span className="wa-ring absolute inset-0 rounded-full bg-whatsapp" aria-hidden="true" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg">
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3zm3.2 12.2c-.1.4-.8.7-1.1.7-.3.1-1.3.2-2.5-.4-2.1-1.1-3.4-3.2-3.5-3.4-.1-.2-.8-1.1-.8-2s.5-1.4.7-1.6c.2-.2.4-.2.6-.2h.4c.2 0 .4 0 .5.4.2.5.6 1.6.6 1.7.1.1 0 .3-.1.4l-.3.4c-.1.1-.2.2-.1.4.2.3.7 1.1 1.5 1.8.9.8 1.6 1 1.9 1.1.2.1.3 0 .4-.1l.5-.6c.1-.2.3-.1.5-.1h.4c.2 0 .4.1.5.3.1.3.5 1.2.4 1.4z"
          />
        </svg>
      </span>
    </a>
  );
}
