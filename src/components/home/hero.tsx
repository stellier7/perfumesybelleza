import { Suspense } from "react";
import { HeroFrame } from "@/components/home/hero-frame";
import { HeroLive } from "@/components/home/hero-live";

export function HomeHero() {
  return (
    <Suspense fallback={<HeroFrame sale />}>
      <HeroLive />
    </Suspense>
  );
}
