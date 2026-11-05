import type { Metadata } from "next";
import { store } from "@/config";

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}): Metadata {
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: input.path },
    robots: input.index === false ? { index: false, follow: true } : undefined,
    openGraph: {
      title: input.title,
      description: input.description,
      url: input.path,
      locale: store.locale,
      siteName: store.name,
      type: "website",
    },
  };
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
