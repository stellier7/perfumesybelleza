"use client";

import { Children, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { advanceRail, containRail, railOrigin, railTrackOrder, type RailDirection } from "@/lib/rail-motion";

const SPEED = 48;

function wheelScale(mode: number, clientWidth: number): number {
  switch (mode) {
    case WheelEvent.DOM_DELTA_PIXEL:
      return 1;
    case WheelEvent.DOM_DELTA_LINE:
      return 16;
    case WheelEvent.DOM_DELTA_PAGE:
      return clientWidth;
    default:
      return 1;
  }
}

export function AutoRail({
  label,
  title,
  direction = "left",
  children,
}: {
  label: string;
  title?: ReactNode;
  direction?: RailDirection;
  children: ReactNode;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const reasons = useRef(new Set<string>());
  const timers = useRef(new Map<string, number>());
  const manual = useRef(false);
  const drag = useRef<{
    x: number;
    y: number;
    left: number;
    moved: boolean;
    axis: "x" | "y" | null;
  } | null>(null);
  const detachDrag = useRef<(() => void) | null>(null);
  const suppressClick = useRef(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [repeat, setRepeat] = useState(1);
  const items = Children.toArray(children);

  useEffect(() => () => detachDrag.current?.(), []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el || reduced || repeat >= 8) return;
    const set = el.querySelector<HTMLElement>("[data-rail-set]");
    if (!set || set.offsetWidth === 0) return;
    if (set.offsetWidth > el.clientWidth + 1) return;
    setRepeat((count) => count + 1);
  }, [items.length, reduced, repeat]);

  useEffect(() => {
    const el = scroller.current;
    if (!el || reduced) return;
    let frame = 0;
    let last = performance.now();
    let seeded = false;
    const tick = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      const set = el.querySelector<HTMLElement>("[data-rail-set]");
      const width = set?.offsetWidth ?? 0;
      const canScroll = width > el.clientWidth + 1;
      if (canScroll && !seeded) {
        offset.current = railOrigin(width, direction);
        el.scrollLeft = offset.current;
        seeded = true;
      }
      // scrollLeft del navegador trunca la fracción y, con scroll suave, anima cada paso.
      // La posición vive en un número propio para que el carril avance de corrido.
      const running = seeded && canScroll && !manual.current && reasons.current.size === 0;
      if (running) {
        offset.current = advanceRail(offset.current, width, (SPEED * dt) / 1000, direction);
        el.scrollLeft = offset.current;
      } else if (seeded && reasons.current.size === 0) {
        // Con el dedo o la rueda puestos, la posición la lleva el gesto.
        // Leer scrollLeft aquí la devolvía al borde y el carril se sentía trabado.
        offset.current = el.scrollLeft;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const pauseFor = (reason: string, ms: number) => {
      reasons.current.add(reason);
      const previous = timers.current.get(reason);
      if (previous) window.clearTimeout(previous);
      timers.current.set(
        reason,
        window.setTimeout(() => {
          reasons.current.delete(reason);
          timers.current.delete(reason);
        }, ms),
      );
    };
    const onWheel = (event: WheelEvent) => {
      const horizontal = event.shiftKey && event.deltaX === 0 ? event.deltaY : event.deltaX;
      const vertical = event.shiftKey && event.deltaX === 0 ? 0 : event.deltaY;
      if (horizontal === 0 || Math.abs(horizontal) <= Math.abs(vertical)) return;
      const width = el.querySelector<HTMLElement>("[data-rail-set]")?.offsetWidth ?? 0;
      if (width <= el.clientWidth + 1) return;
      event.preventDefault();
      pauseFor("wheel", 1400);
      offset.current = containRail(
        offset.current + horizontal * wheelScale(event.deltaMode, el.clientWidth),
        width,
      );
      el.scrollLeft = offset.current;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    const pending = timers.current;
    const activeReasons = reasons.current;
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("wheel", onWheel);
      for (const [reason, timer] of pending) {
        window.clearTimeout(timer);
        activeReasons.delete(reason);
      }
      pending.clear();
    };
  }, [direction, reduced, items.length, repeat]);

  function hold(reason: string, on: boolean) {
    if (on) reasons.current.add(reason);
    else reasons.current.delete(reason);
  }

  function bump(reason: string, ms: number) {
    hold(reason, true);
    const previous = timers.current.get(reason);
    if (previous) window.clearTimeout(previous);
    timers.current.set(
      reason,
      window.setTimeout(() => hold(reason, false), ms),
    );
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    const el = scroller.current;
    if (!el) return;
    detachDrag.current?.();
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      left: offset.current,
      moved: false,
      axis: null,
    };
    hold("drag", true);
    const move = (pointer: PointerEvent) => {
      const current = drag.current;
      const node = scroller.current;
      if (!current || !node) return;
      const dx = pointer.clientX - current.x;
      const dy = pointer.clientY - current.y;
      if (current.axis === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
        current.axis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
      }
      if (current.axis === "y") {
        detachDrag.current?.();
        drag.current = null;
        hold("drag", false);
        return;
      }
      if (current.axis !== "x") return;
      current.moved = true;
      const width = node.querySelector<HTMLElement>("[data-rail-set]")?.offsetWidth ?? 0;
      const raw = current.left - dx;
      const looping = !reduced && width > node.clientWidth + 1;
      const next = looping ? containRail(raw, width) : raw;
      node.scrollLeft = next;
      offset.current = next;
      pointer.preventDefault();
    };
    const up = () => {
      const moved = drag.current?.moved ?? false;
      detachDrag.current?.();
      if (moved) {
        suppressClick.current = true;
        bump("settle", 700);
      }
      drag.current = null;
      hold("drag", false);
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    detachDrag.current = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      detachDrag.current = null;
    };
  }

  if (items.length === 0) return null;

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>{title}</div>
        {reduced ? null : (
          <button
            type="button"
            className="inline-flex h-11 shrink-0 items-center rounded-full border border-line px-4 text-sm"
            aria-pressed={paused}
            aria-label={paused ? `Reanudar ${label}` : `Pausar ${label}`}
            onClick={() => {
              manual.current = !manual.current;
              setPaused(manual.current);
            }}
          >
            {paused ? "Reanudar" : "Pausar"}
          </button>
        )}
      </div>
      <div
        ref={scroller}
        className="no-scrollbar scroll-auto cursor-grab touch-pan-y overflow-x-auto overscroll-x-contain active:cursor-grabbing"
        role="region"
        aria-label={label}
        tabIndex={0}
        onDragStart={(event) => event.preventDefault()}
        onPointerDown={onPointerDown}
        onClickCapture={(event) => {
          if (!suppressClick.current) return;
          suppressClick.current = false;
          event.preventDefault();
          event.stopPropagation();
        }}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") hold("hover", true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "mouse") return;
          hold("hover", false);
          hold("focus", false);
        }}
        onFocusCapture={() => hold("focus", true)}
        onBlurCapture={(event) => {
          const next = event.relatedTarget;
          if (next instanceof Node && scroller.current?.contains(next)) return;
          hold("focus", false);
        }}
        onTouchStart={() => bump("touch", 1200)}
        onTouchEnd={() => bump("touch", 900)}
      >
        <div className="flex w-max">
          {railTrackOrder(direction).map((part) => {
            if (part === "loop" && reduced) return null;
            const cards = Array.from({ length: repeat }, (_, copy) =>
              items.map((item, index) => (
                <div key={`${copy}-${index}`} className="shrink-0">
                  {item}
                </div>
              )),
            );
            if (part === "live") {
              return (
                <div key={part} data-rail-set="" className="flex gap-4 pr-4">
                  {cards}
                </div>
              );
            }
            return (
              <div key={part} className="flex gap-4 pr-4" aria-hidden="true" inert>
                {cards}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
