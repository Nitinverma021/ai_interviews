import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";

import { clientEnv } from "@/lib/env.client";

import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrepWise",
  description: "An AI-powered platform for preparing for mock interviews",
};

function UmamiAnalytics() {
  const websiteId = clientEnv.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const scriptUrl = clientEnv.NEXT_PUBLIC_UMAMI_SCRIPT_URL;

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

        <Toaster />
      </body>
    </html>
  );
}
