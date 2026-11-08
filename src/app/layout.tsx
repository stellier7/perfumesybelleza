import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { Suspense } from "react";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MetaPixel } from "@/components/meta-pixel";
import { UtmCapture } from "@/components/utm-capture";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { store } from "@/config";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
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
    <html lang="es" className={`${outfit.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <CartProvider>
          <Header />
          <main id="contenido" className="flex-1 pb-28 md:pb-0">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
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
