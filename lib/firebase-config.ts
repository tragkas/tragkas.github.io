export interface FirebaseClientConfig {
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain: string;
  firestoreDatabaseId: string;
  storageBucket: string;
  messagingSenderId: string;
}

export function getFirebaseClientConfig(): FirebaseClientConfig {
  return {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() || "",
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() || "",
    firestoreDatabaseId:
      process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID?.trim() ||
      "(default)",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || "",
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() || "",
  };
}

export function isFirebaseConfigured(config = getFirebaseClientConfig()): boolean {
  return Boolean(config.apiKey && config.projectId && config.appId && config.authDomain);
}
