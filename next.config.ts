import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

interface LocalFirebaseConfig {
  projectId?: string;
  appId?: string;
  apiKey?: string;
  authDomain?: string;
  firestoreDatabaseId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
}

function loadLocalFirebaseEnvFallback(): Record<string, string> {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (!fs.existsSync(configPath)) {
    return {};
  }

  try {
    const raw = fs.readFileSync(configPath, "utf8");
    const parsed = JSON.parse(raw) as LocalFirebaseConfig;
    const fallback: Record<string, string> = {};

    const pairs: Array<[string, string | undefined]> = [
      ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", parsed.projectId],
      ["NEXT_PUBLIC_FIREBASE_APP_ID", parsed.appId],
      ["NEXT_PUBLIC_FIREBASE_API_KEY", parsed.apiKey],
      ["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", parsed.authDomain],
      ["NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID", parsed.firestoreDatabaseId],
      ["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", parsed.storageBucket],
      ["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", parsed.messagingSenderId],
    ];

    for (const [key, value] of pairs) {
      if (!process.env[key]?.trim() && value?.trim()) {
        fallback[key] = value.trim();
      }
    }

    return fallback;
  } catch {
    return {};
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  env: loadLocalFirebaseEnvFallback(),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
