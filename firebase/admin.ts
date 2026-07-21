import "server-only";

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

import { getServerEnv } from "@/lib/env.server";

function normalizePrivateKey(privateKey: string) {
  return privateKey
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n");
}

function getFirebaseAdminApp() {
  const apps = getApps();
  const serverEnv = getServerEnv();

  if (apps.length) {
    return apps[0];
  }

  return initializeApp({
    credential: cert({
      projectId: serverEnv.FIREBASE_PROJECT_ID,
      clientEmail: serverEnv.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(serverEnv.FIREBASE_PRIVATE_KEY),
    }),
  });
}

export function getAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}
