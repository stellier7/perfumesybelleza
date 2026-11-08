"use client";

import { Children, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import {
  advanceRail,
  containRail,
  railOrigin,
  railTrackOrder,
  railWheelAxis,
  swipeAxis,
  type GestureAxis,
  type RailDirection,
} from "@/lib/rail-motion";

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
    axis: GestureAxis | null;
    lastX: number;
    lastT: number;
    velocity: number;
  } | null>(null);
  const coastFrame = useRef(0);
  const wheelAxis = useRef<GestureAxis | null>(null);
  const detachDrag = useRef<(() => void) | null>(null);
  const suppressClick = useRef(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [repeat, setRepeat] = useState(1);
  const items = Children.toArray(children);

  useEffect(
    () => () => {
      detachDrag.current?.();
      if (coastFrame.current) cancelAnimationFrame(coastFrame.current);
    },
    [],
  );

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
      const gesturing =
        reasons.current.has("drag") ||
        reasons.current.has("wheel") ||
        reasons.current.has("coast") ||
        reasons.current.has("settle") ||
        reasons.current.has("touch");
      const running = seeded && canScroll && !manual.current && reasons.current.size === 0;
      if (running) {
        offset.current = advanceRail(offset.current, width, (SPEED * dt) / 1000, direction);
        el.scrollLeft = offset.current;
      } else if (seeded && !gesturing) {
        // Durante el swipe la posición la lleva el dedo. Leer scrollLeft ahí
        // la devolvía al borde. En pausa por hover sí hay que seguir el scroll real.
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
      const axis = railWheelAxis(horizontal, vertical, wheelAxis.current);
      if (axis !== "x") {
        wheelAxis.current = null;
        return;
      }
      const width = el.querySelector<HTMLElement>("[data-rail-set]")?.offsetWidth ?? 0;
      if (width <= el.clientWidth + 1) return;
      event.preventDefault();
      if (wheelAxis.current !== "x" && Math.abs(el.scrollLeft - offset.current) > 1) {
        offset.current = el.scrollLeft;
      }
      wheelAxis.current = "x";
      const axisTimer = timers.current.get("wheel-axis");
      if (axisTimer) window.clearTimeout(axisTimer);
      timers.current.set(
        "wheel-axis",
        window.setTimeout(() => {
          wheelAxis.current = null;
          timers.current.delete("wheel-axis");
        }, 180),
      );
      pauseFor("wheel", 1600);
      offset.current = containRail(
        offset.current + horizontal * wheelScale(event.deltaMode, el.clientWidth),
        width,
      );
      el.scrollLeft = offset.current;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (drag.current?.axis === "x") event.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    const pending = timers.current;
    const activeReasons = reasons.current;
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchmove", onTouchMove);
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

  function stopCoast() {
    if (coastFrame.current) cancelAnimationFrame(coastFrame.current);
    coastFrame.current = 0;
    hold("coast", false);
  }

  function coastFrom(velocity: number) {
    const node = scroller.current;
    if (!node || reduced || Math.abs(velocity) < 0.05) {
      bump("settle", 500);
      return;
    }
    stopCoast();
    hold("coast", true);
    let speed = velocity;
    let last = performance.now();
    const step = (now: number) => {
      const current = scroller.current;
      if (!current || drag.current) {
        hold("coast", false);
        coastFrame.current = 0;
        return;
      }
      const dt = Math.min(32, now - last);
      last = now;
      const width = current.querySelector<HTMLElement>("[data-rail-set]")?.offsetWidth ?? 0;
      if (width > current.clientWidth + 1) {
        offset.current = containRail(offset.current + speed * dt, width);
        current.scrollLeft = offset.current;
      }
      speed *= 0.86 ** (dt / 16);
      if (Math.abs(speed) < 0.02) {
        hold("coast", false);
        coastFrame.current = 0;
        bump("settle", 450);
        return;
      }
      coastFrame.current = requestAnimationFrame(step);
    };
    coastFrame.current = requestAnimationFrame(step);
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    const el = scroller.current;
    if (!el) return;
    detachDrag.current?.();
    stopCoast();
    const now = performance.now();
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      left: offset.current,
      moved: false,
      axis: null,
      lastX: event.clientX,
      lastT: now,
      velocity: 0,
    };
    hold("drag", true);
    const move = (pointer: PointerEvent) => {
      const current = drag.current;
      const node = scroller.current;
      if (!current || !node) return;
      const dx = pointer.clientX - current.x;
      const dy = pointer.clientY - current.y;
      current.axis = swipeAxis(dx, dy, current.axis);
      if (current.axis === "y") return;
      if (current.axis !== "x") return;
      current.moved = true;
      const width = node.querySelector<HTMLElement>("[data-rail-set]")?.offsetWidth ?? 0;
      const raw = current.left - dx;
      const looping = !reduced && width > node.clientWidth + 1;
      const next = looping ? containRail(raw, width) : raw;
      node.scrollLeft = next;
      offset.current = next;
      const sampleAt = performance.now();
      const elapsed = sampleAt - current.lastT;
      if (elapsed >= 8) {
        const sample = -(pointer.clientX - current.lastX) / elapsed;
        current.velocity = Math.max(-2.2, Math.min(2.2, sample));
        current.lastX = pointer.clientX;
        current.lastT = sampleAt;
      }
      pointer.preventDefault();
    };
    const up = () => {
      const moved = drag.current?.moved ?? false;
      const velocity = drag.current?.velocity ?? 0;
      detachDrag.current?.();
      drag.current = null;
      hold("drag", false);
      if (!moved) return;
      suppressClick.current = true;
      coastFrom(velocity);
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
