import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { Suspense } from "react";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MetaPixel } from "@/components/meta-pixel";
import { MobileNav } from "@/components/mobile-nav";
import { UtmCapture } from "@/components/utm-capture";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { store } from "@/config";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(store.url),
  title: {
    default: "Perfumes y Belleza",
    template: "%s | Perfumes y Belleza",
  },
  description: store.description,
  openGraph: {
    siteName: store.name,
    locale: store.locale,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${outfit.variable} ${display.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <CartProvider>
          <Header />
          <main id="contenido" className="min-w-0 flex-1 pb-40 md:pb-0">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
          <MobileNav />
          <CartDrawer />
        </CartProvider>
        <Suspense fallback={null}>
          <UtmCapture />
        </Suspense>
        <MetaPixel />
      </body>
    </html>
  );
}
