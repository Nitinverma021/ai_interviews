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
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: optionalString,
  NEXT_PUBLIC_VAPI_WEB_TOKEN: z.string().min(1),
  NEXT_PUBLIC_VAPI_WORKFLOW_ID: z.string().min(1),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: optionalString,
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: optionalString,
  NEXT_PUBLIC_UMAMI_SCRIPT_URL: optionalUrl,
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  NEXT_PUBLIC_VAPI_WEB_TOKEN: process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN,
  NEXT_PUBLIC_VAPI_WORKFLOW_ID: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  NEXT_PUBLIC_UMAMI_SCRIPT_URL: process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
});
