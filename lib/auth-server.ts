import { getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import type { NextRequest } from "next/server";
import { getFirebaseClientConfig } from "./firebase-config";

export const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL?.trim() ||
  process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim() ||
  "george1tragas@gmail.com"
).toLowerCase();

function getAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }
  const { projectId } = getFirebaseClientConfig();
  return initializeApp({
    projectId,
  });
}

export interface VerifiedAdmin {
  uid: string;
  email: string;
  token: string;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function verifyAdminRequest(req: NextRequest): Promise<VerifiedAdmin> {
  const authHeader = req.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    throw new AuthError("Authentication required. Please sign in.", 401);
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    throw new AuthError("Missing bearer token.", 401);
  }

  try {
    const adminAuth = getAuth(getAdminApp());
    const decoded = await adminAuth.verifyIdToken(token);

    if (
      !decoded.email_verified ||
      decoded.email?.toLowerCase() !== ADMIN_EMAIL
    ) {
      throw new AuthError("Access restricted to the verified portfolio owner.", 403);
    }

    return {
      uid: decoded.uid,
      email: decoded.email,
      token,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError("Invalid or expired session token. Please sign in again.", 401);
  }
}
