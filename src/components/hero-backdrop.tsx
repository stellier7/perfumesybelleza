"use client";

import { useEffect, useRef } from "react";

/** Foto del hero a lo ancho de la sección, con un desplazamiento más lento que el scroll. */
export function HeroBackdrop() {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const image = imageRef.current;
    const section = frame?.parentElement;
    if (!frame || !image || !section) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;

    const place = () => {
      frameId = 0;
      const sectionWidth = section.clientWidth;
      const sectionHeight = section.clientHeight;
      const ratio = image.naturalWidth > 0 && image.naturalHeight > 0 ? image.naturalWidth / image.naturalHeight : 1376 / 768;
      let renderWidth = sectionWidth;
      let renderHeight = sectionWidth / ratio;
      const minHeight = sectionHeight * 1.22;
      if (renderHeight < minHeight) {
        renderHeight = minHeight;
        renderWidth = renderHeight * ratio;
      }
      image.style.width = `${renderWidth}px`;
      image.style.height = `${renderHeight}px`;
      image.style.left = `${(sectionWidth - renderWidth) / 2}px`;

      const extra = renderHeight - sectionHeight;
      if (media.matches) {
        image.style.transform = `translate3d(0, ${-extra / 2}px, 0)`;
        return;
      }
      const rect = section.getBoundingClientRect();
      const start = 120;
      const end = -rect.height * 0.65;
      const progress = (start - rect.top) / (start - end || 1);
      const clamped = Math.min(1, Math.max(0, progress));
      image.style.transform = `translate3d(0, ${-extra * (0.08 + clamped * 0.84)}px, 0)`;
    };

    const onScroll = () => {
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(place);
    };

    place();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    media.addEventListener("change", onScroll);
    image.addEventListener("load", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      media.removeEventListener("change", onScroll);
      image.removeEventListener("load", onScroll);
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={frameRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* next/image no deja medir y mover esta foto al ritmo del scroll en Safari. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imageRef} src="/home/hero-fondo.webp" alt="" className="absolute top-0 h-auto w-full max-w-none" />
    </div>
  );
}
