type PixelValue = string | number | string[];
type Fbq = (...args: unknown[]) => void;

function facebookQueue(): Fbq | null {
  if (typeof window === "undefined") return null;
  const candidate = (window as Window & { fbq?: Fbq }).fbq;
  return typeof candidate === "function" ? candidate : null;
}

export function trackPixel(event: string, params?: Record<string, PixelValue>): void {
  const queue = facebookQueue();
  if (!queue) return;
  queue("track", event, params);
}

export function pixelId(): string {
  return (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "").replace(/[^\d]/g, "");
}
