import { io } from "next/cache";
import { HeroFrame } from "@/components/home/hero-frame";
import { isSaleActive } from "@/lib/sale";

export async function HeroLive() {
  await io();
  return <HeroFrame sale={isSaleActive(new Date())} />;
}
