"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";
import {
  doc,
  getDocFromServer,
  getFirestore,
  type Firestore,
} from "firebase/firestore";
import { getFirebaseClientConfig, isFirebaseConfigured } from "./firebase-config";

const firebaseConfig = getFirebaseClientConfig();
const configured = isFirebaseConfigured(firebaseConfig);

const app = configured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const db: Firestore | null = app
  ? firebaseConfig.firestoreDatabaseId &&
    firebaseConfig.firestoreDatabaseId !== "(default)"
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app)
  : null;

export const auth: Auth | null = app ? getAuth(app) : null;

export const firebaseClientReady = configured;

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid ?? null,
      email: auth?.currentUser?.email ?? null,
      emailVerified: auth?.currentUser?.emailVerified ?? null,
      isAnonymous: auth?.currentUser?.isAnonymous ?? null,
      tenantId: auth?.currentUser?.tenantId ?? null,
      providerInfo:
        auth?.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error:", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let connectionTested = false;

export async function testConnection(): Promise<void> {
  if (connectionTested || typeof window === "undefined" || !db) return;
  connectionTested = true;
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

export async function verifyServerOwnership(
  user: User
): Promise<{ authorized: boolean; error?: string }> {
  try {
    const token = await user.getIdToken();
    const res = await fetch("/api/auth/verify", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = (await res.json()) as { authorized?: boolean; error?: string };
    if (!res.ok || !data.authorized) {
      return {
        authorized: false,
        error:
          data.error ||
          "Access denied. Only the verified portfolio owner account is allowed to sign in.",
      };
    }
    return { authorized: true };
  } catch {
    return {
      authorized: false,
      error: "Unable to verify owner authorization with the server.",
    };
  }
}

export async function signInWithGoogle(): Promise<User> {
  if (!auth) {
    throw new Error(
      "Firebase client environment variables are not configured."
    );
  }
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });
  const result = await signInWithPopup(auth, provider);
  const check = await verifyServerOwnership(result.user);
  if (!check.authorized) {
    await signOut(auth);
    throw new Error(
      check.error ||
        "Access denied. Only the verified portfolio owner is allowed to sign in."
    );
  }
  return result.user;
}

export async function signOutUser(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}
