import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.email(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
  ADMIN_EMAIL: z.email().default("nitinverma0902@gmail.com"),
  SITE_VISIBLE: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
});

export function getServerEnv() {
  return serverEnvSchema.parse({
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || undefined,
    SITE_VISIBLE: process.env.SITE_VISIBLE || undefined,
  });
}

export function getSiteVisibleFlag() {
  return (process.env.SITE_VISIBLE ?? "true").toLowerCase() === "true";
}
