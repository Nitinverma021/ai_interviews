import type { NextConfig } from "next";

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  "'unsafe-eval'",
  "https://cloud.umami.is",
  "https://accounts.google.com",
  "https://c.daily.co",
  "https://*.daily.co",
].join(" ");

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      {
        source: "/umami/script.js",
        destination: "https://cloud.umami.is/script.js",
      },
      {
        source: "/umami/api/send",
        destination: "https://cloud.umami.is/api/send",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src ${scriptSrc}`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self' https://cloud.umami.is https://accounts.google.com https://*.googleapis.com https://*.firebaseio.com https://*.vapi.ai wss://*.vapi.ai https://*.daily.co wss://*.daily.co",
              "media-src 'self' blob: data:",
              "frame-src https://accounts.google.com https://cloud.umami.is",
              "frame-ancestors 'none'",
              "worker-src 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(self), geolocation=(), microphone=(self), payment=(), identity-credentials-get=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
