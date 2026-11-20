import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "George Tragkas — Economics, Front-End & Organic Growth",
  description:
    "Personal portfolio of George Tragkas: economics, international negotiations, front-end web products, and organic social growth.",
  openGraph: {
    title: "George Tragkas — Economics, Front-End & Organic Growth",
    description:
      "Personal portfolio of George Tragkas: economics, international negotiations, front-end web products, and organic social growth.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${fraunces.variable} ${jetbrainsMono.variable} bg-[#fafafa] text-[#111111] antialiased selection:bg-blue-600 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
