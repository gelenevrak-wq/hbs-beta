import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
