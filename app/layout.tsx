import type { Metadata } from "next";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import { portfolioData } from "@/data/portfolio";
import "./globals.css";

export const metadata: Metadata = {
  title: `${portfolioData.profile.name} — Economics, Front-End & Organic Growth`,
  description: portfolioData.profile.subheadline,
  openGraph: {
    title: `${portfolioData.profile.name} — Economics, Front-End & Organic Growth`,
    description: portfolioData.profile.subheadline,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#fafafa] text-[#111111] antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
