import type { Metadata } from "next";
import "./globals.css";
import VisitorTracker from "@/components/VisitorTracker";
import OfflinePOS from "@/components/OfflinePOS";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import DemoDataInitializer from "@/components/DemoDataInitializer";

export const metadata: Metadata = {
  title: "HBS | Hybrid Business System",
  description:
    "Cloud-based multi-store, multi-customer stock, warehouse, order and storefront platform.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">
        <VisitorTracker />
        <OfflinePOS />
        <PWAInstallPrompt />
        <DemoDataInitializer />
        {children}
      </body>
    </html>
  );
}
