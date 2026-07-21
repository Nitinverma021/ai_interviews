import "server-only";

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

import { serverEnv } from "@/lib/env.server";

function initFirebaseAdmin() {
  const apps = getApps();

  if (!apps.length) {
    initializeApp({
      credential: cert({
        projectId: serverEnv.FIREBASE_PROJECT_ID,
        clientEmail: serverEnv.FIREBASE_CLIENT_EMAIL,
        privateKey: serverEnv.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
}

export const { auth, db } = initFirebaseAdmin();
