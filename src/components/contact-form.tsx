"use client";

import { useState, type FormEvent } from "react";
import { UTM_STORAGE_KEY } from "@/config";
import { sanitizeUtm } from "@/lib/utm";
import { trackingLine, whatsappUrl } from "@/lib/whatsapp";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    let utm: Record<string, string> = {};
    try {
      utm = sanitizeUtm(JSON.parse(localStorage.getItem(UTM_STORAGE_KEY) ?? "{}"));
    } catch {
      utm = {};
    }
    const text = [`Hola, soy ${name}.`, "", message, trackingLine(utm)].filter((line) => line !== null).join("\n");
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  if (sent) {
    return <p className="mt-6">Abrimos WhatsApp con tu mensaje. Si no se abrió, revisa que el navegador permita ventanas.</p>;
  }

  return (
    <form onSubmit={submit} className="mt-6 grid max-w-lg gap-3">
      <label className="grid gap-1 text-sm">
        Nombre
        <input name="name" required className="h-12 rounded-xl border border-line bg-paper px-3" />
      </label>
      <label className="grid gap-1 text-sm">
        Mensaje
        <textarea name="message" required rows={5} className="rounded-xl border border-line bg-paper px-3 py-2" />
      </label>
      <button type="submit" className="h-12 rounded-full bg-ink text-sm text-ivory">
        Enviar por WhatsApp
      </button>
    </form>
  );
}
