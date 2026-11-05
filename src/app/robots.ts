import type { MetadataRoute } from "next";
import { store } from "@/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${store.url}/sitemap.xml`,
    host: store.url,
  };
}
