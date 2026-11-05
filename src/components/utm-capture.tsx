"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { UTM_STORAGE_KEY } from "@/config";
import { mergeUtm, pickUtm, sanitizeUtm } from "@/lib/utm";

export function UtmCapture() {
  const params = useSearchParams();
  useEffect(() => {
    const incoming = pickUtm(params);
    if (Object.keys(incoming).length === 0) return;
    let stored: Record<string, string> = {};
    try {
      stored = sanitizeUtm(JSON.parse(localStorage.getItem(UTM_STORAGE_KEY) ?? "{}"));
    } catch {
      stored = {};
    }
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(mergeUtm(stored, incoming)));
  }, [params]);
  return null;
}
