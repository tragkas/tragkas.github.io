import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface MinimalHeaderProps {
  mode?: "portfolio" | "projects";
  brandName: string;
  resumeLabel?: string;
  resumeUrl: string;
}

export default function MinimalHeader({
  mode = "portfolio",
  brandName,
  resumeLabel = "Resume",
  resumeUrl,
}: MinimalHeaderProps) {
  return (
    <header className="border-b border-neutral-200 bg-[#fafafa]/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
        >
          {brandName}
        </Link>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600"
        >
          {mode === "portfolio" ? (
            <>
              <a
                href="#strengths"
                className="hover:text-neutral-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Strengths
              </a>
              <a
                href="#projects"
                className="hover:text-neutral-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Projects
              </a>
              <a
                href="#media"
                className="hover:text-neutral-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Media &amp; Links
              </a>
              <a
                href="#background"
                className="hover:text-neutral-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Background
              </a>
            </>
          ) : (
            <>
              <Link
                href="/"
                className="hover:text-neutral-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Overview
              </Link>
              <Link
                href="/#strengths"
                className="hover:text-neutral-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Strengths
              </Link>
              <Link
                href="/projects"
                className="hover:text-neutral-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                All Projects
              </Link>
              <Link
                href="/#media"
                className="hover:text-neutral-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Media &amp; Links
              </Link>
            </>
          )}
        </nav>

        {/* Zone 3: Single Public Primary Action */}
        <div className="flex items-center shrink-0">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-1 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <span>{resumeLabel}</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
