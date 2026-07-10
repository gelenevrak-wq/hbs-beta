import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import VisitorTracker from "@/components/VisitorTracker";
import OfflinePOS from "@/components/OfflinePOS";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import DemoDataInitializer from "@/components/DemoDataInitializer";
import DemoModeBanner from "@/components/common/DemoModeBanner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

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
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col font-sans">
        <DemoModeBanner />
        <VisitorTracker />
        <OfflinePOS />
        <PWAInstallPrompt />
        <DemoDataInitializer />
        {children}
      </body>
    </html>
  );
}
