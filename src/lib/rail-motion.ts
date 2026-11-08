import { assertNever } from "@/lib/text";

/** Hacia dónde se mueven las tarjetas. */
export type RailDirection = "left" | "right";

/** La copia del loop queda del lado por donde entran las tarjetas. La visible sigue siendo clicable. */
export function railTrackOrder(direction: RailDirection): Array<"live" | "loop"> {
  switch (direction) {
    case "left":
      return ["live", "loop"];
    case "right":
      return ["loop", "live"];
    default:
      return assertNever(direction);
  }
}

/**
 * Punto de partida del loop. Hacia la derecha hay que empezar en la copia,
 * porque el scroll no puede bajar de cero.
 */
export function railOrigin(width: number, direction: RailDirection): number {
  if (width <= 0) return 0;
  switch (direction) {
    case "left":
      return 0;
    case "right":
      return width;
    default:
      return assertNever(direction);
  }
}

/** Deja la posición dentro de una copia. El duplicado se ve igual, así que el salto no se nota. */
export function containRail(position: number, width: number): number {
  if (width <= 0) return 0;
  const wrapped = position % width;
  return wrapped < 0 ? wrapped + width : wrapped;
}

/** Avanza en píxeles reales, fracciones incluidas, y salta al otro extremo del loop. */
export function advanceRail(
  position: number,
  width: number,
  delta: number,
  direction: RailDirection,
): number {
  if (width <= 0) return 0;
  let next = position;
  switch (direction) {
    case "left":
      next += delta;
      break;
    case "right":
      next -= delta;
      break;
    default:
      return assertNever(direction);
  }
  return containRail(next, width);
}
