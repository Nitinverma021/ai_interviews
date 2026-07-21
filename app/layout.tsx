import { Toaster } from "sonner";
import type { Metadata, Viewport } from "next";

import PWARegister from "@/components/PWARegister";

import "./globals.css";

export const metadata: Metadata = {
  title: "PrepWise",
  description: "An AI-powered platform for preparing for mock interviews",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "PrepWise",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#020408",
};

function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  if (!websiteId) return null;

  return (
    <script
      defer
      src="/umami/script.js"
      data-website-id={websiteId}
      data-host-url="/umami"
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <UmamiAnalytics />
      </head>
      <body className="antialiased pattern">
        {children}

        <PWARegister />
        <Toaster />
      </body>
    </html>
  );
}
