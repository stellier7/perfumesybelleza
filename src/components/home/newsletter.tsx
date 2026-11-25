"use client";

import type { MouseEvent } from "react";
import { UTM_STORAGE_KEY, store } from "@/config";
import { sanitizeUtm } from "@/lib/utm";
import { trackingLine, whatsappUrl } from "@/lib/whatsapp";

function message(utm: Record<string, string>): string {
  return [`Hola, quiero recibir novedades, lanzamientos y promociones de ${store.name}.`, trackingLine(utm)]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export function NewsletterInvite() {
  const href = whatsappUrl(message({}));

  function openChat(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    let utm: Record<string, string> = {};
    try {
      utm = sanitizeUtm(JSON.parse(localStorage.getItem(UTM_STORAGE_KEY) ?? "{}"));
    } catch {
      utm = {};
    }
    window.open(whatsappUrl(message(utm)), "_blank", "noopener,noreferrer");
  }

  return (
    <a
      href={href}
      onClick={openChat}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-12 items-center rounded-full bg-ivory px-5 text-sm text-ink"
    >
      Quiero recibir novedades
    </a>
  );
}
