"use client";

import { Children, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

const SPEED = 48;

export function AutoRail({
  label,
  title,
  children,
}: {
  label: string;
  title?: ReactNode;
  children: ReactNode;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const reasons = useRef(new Set<string>());
  const timers = useRef(new Map<string, number>());
  const manual = useRef(false);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const detachDrag = useRef<(() => void) | null>(null);
  const suppressClick = useRef(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
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
    if (!el || reduced) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      const set = el.querySelector<HTMLElement>("[data-rail-set]");
      const width = set?.offsetWidth ?? 0;
      const running = !manual.current && reasons.current.size === 0 && width > el.clientWidth + 1;
      if (running) {
        el.scrollLeft += (SPEED * dt) / 1000;
        if (el.scrollLeft >= width) el.scrollLeft -= width;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const pending = timers.current;
    return () => {
      cancelAnimationFrame(frame);
      for (const timer of pending.values()) window.clearTimeout(timer);
      pending.clear();
    };
  }, [reduced, items.length]);

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
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const el = scroller.current;
    if (!el) return;
    detachDrag.current?.();
    drag.current = { x: event.clientX, left: el.scrollLeft, moved: false };
    hold("drag", true);
    const move = (pointer: PointerEvent) => {
      const current = drag.current;
      const node = scroller.current;
      if (!current || !node) return;
      const dx = pointer.clientX - current.x;
      if (Math.abs(dx) > 6) current.moved = true;
      if (current.moved) node.scrollLeft = current.left - dx;
    };
    const up = () => {
      detachDrag.current?.();
      if (drag.current?.moved) suppressClick.current = true;
      drag.current = null;
      hold("drag", false);
    };
    window.addEventListener("pointermove", move);
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
        className="no-scrollbar cursor-grab overflow-x-auto overscroll-x-contain active:cursor-grabbing"
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
        onWheel={() => bump("wheel", 1200)}
      >
        <div className="flex w-max">
          <div data-rail-set="" className="flex gap-4 pr-4">
            {items.map((item, index) => (
              <div key={index} className="shrink-0">
                {item}
              </div>
            ))}
          </div>
          {reduced ? null : (
            <div className="flex gap-4 pr-4" aria-hidden="true" inert>
              {items.map((item, index) => (
                <div key={index} className="shrink-0">
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
