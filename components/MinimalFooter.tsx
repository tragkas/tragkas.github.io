import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioLinkRecord } from "@/lib/portfolio-types";

interface MinimalFooterProps {
  links: PortfolioLinkRecord[];
  ownerName: string;
  footerLocation: string;
  resumeLabel?: string;
  resumeUrl?: string;
}

export default function MinimalFooter({
  links,
  ownerName,
  footerLocation,
  resumeLabel = "Resume",
  resumeUrl,
}: MinimalFooterProps) {
  const socialLinks = links.filter(
    (l) => l.group === "social" || l.group === "channel"
  );
  const resourceLinks = links.filter((l) => l.group === "resource");

  return (
    <footer className="border-t border-neutral-200 bg-white text-neutral-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Navigate */}
          <div>
            <h3 className="text-xs font-medium text-neutral-500 mb-4">
              Navigate
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/#strengths"
                  className="hover:text-neutral-900 transition-colors"
                >
                  Core Strengths
                </Link>
              </li>
              <li>
                <Link
                  href="/#projects"
                  className="hover:text-neutral-900 transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-neutral-900 transition-colors"
                >
                  Full Project Archive
                </Link>
              </li>
              <li>
                <Link
                  href="/#background"
                  className="hover:text-neutral-900 transition-colors"
                >
                  Education &amp; Credentials
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Social & Channels */}
          <div>
            <h3 className="text-xs font-medium text-neutral-500 mb-4">
              Channels
            </h3>
            <ul className="space-y-2.5 text-sm">
              {socialLinks.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-neutral-900 transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-xs font-medium text-neutral-500 mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5 text-sm">
              {resourceLinks.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-neutral-900 transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" aria-hidden="true" />
                  </a>
                </li>
              ))}
              {resumeUrl && (
                <li>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-neutral-900 transition-colors"
                  >
                    <span>{resumeLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" aria-hidden="true" />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-12 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-500">
          <p>{ownerName}</p>
          <p>{footerLocation}</p>
        </div>
      </div>
    </footer>
  );
}
