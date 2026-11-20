import bundledConfig from "../firebase-applet-config.json";

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
    projectId:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
      bundledConfig.projectId,
    appId:
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() || bundledConfig.appId,
    apiKey:
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || bundledConfig.apiKey,
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() ||
      bundledConfig.authDomain,
    firestoreDatabaseId:
      process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID?.trim() ||
      bundledConfig.firestoreDatabaseId ||
      "(default)",
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ||
      bundledConfig.storageBucket,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() ||
      bundledConfig.messagingSenderId,
  };
}

export function getPublicAdminEmail(): string {
  return (
    process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim() || "george1tragas@gmail.com"
  );
}
