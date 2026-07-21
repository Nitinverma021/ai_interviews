import { Toaster } from "sonner";
import type { Metadata, Viewport } from "next";
import { Mona_Sans } from "next/font/google";

import PWARegister from "@/components/PWARegister";

import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

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
  const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;

  if (!websiteId || !scriptUrl) return null;

  return (
    <script
      defer
      src={scriptUrl}
      data-website-id={websiteId}
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
      <body className={`${monaSans.className} antialiased pattern`}>
        {children}

        <PWARegister />
        <Toaster />
      </body>
    </html>
  );
}
