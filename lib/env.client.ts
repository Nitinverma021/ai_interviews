import { z } from "zod";

const optionalString = z
  .union([z.string(), z.literal("")])
  .optional()
  .transform((value) => value || undefined);
const optionalUrl = z
  .union([z.url(), z.literal("")])
  .optional()
  .transform((value) => value || undefined);

const clientEnvSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z
    .string()
    .min(1)
    .default("AIzaSyAVULzA5CQgUY-c4kMg2q7YQWx4CTaGtK4"),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z
    .string()
    .min(1)
    .default("interviews-b7996.firebaseapp.com"),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1).default("interviews-b7996"),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z
    .string()
    .min(1)
    .default("interviews-b7996.firebasestorage.app"),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z
    .string()
    .min(1)
    .default("110067293227"),
  NEXT_PUBLIC_FIREBASE_APP_ID: z
    .string()
    .min(1)
    .default("1:110067293227:web:86b48509974024338ede6e"),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: optionalString,
  NEXT_PUBLIC_VAPI_WEB_TOKEN: z.string().min(1),
  NEXT_PUBLIC_VAPI_WORKFLOW_ID: z.string().min(1),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: optionalString,
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: optionalString,
  NEXT_PUBLIC_UMAMI_SCRIPT_URL: optionalUrl,
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_FIREBASE_API_KEY:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY || undefined,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || undefined,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || undefined,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || undefined,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || undefined,
  NEXT_PUBLIC_FIREBASE_APP_ID:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID || undefined,
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  NEXT_PUBLIC_VAPI_WEB_TOKEN: process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN,
  NEXT_PUBLIC_VAPI_WORKFLOW_ID: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  NEXT_PUBLIC_UMAMI_SCRIPT_URL: process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
});
