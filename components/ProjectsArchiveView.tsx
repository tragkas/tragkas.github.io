"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Search } from "lucide-react";
import {
  PortfolioContent,
  PROJECT_CATEGORIES,
  ProjectCategory,
} from "@/lib/portfolio-types";
import MinimalHeader from "./MinimalHeader";
import MinimalFooter from "./MinimalFooter";

interface ProjectsArchiveViewProps {
  data: PortfolioContent;
}

type ArchiveFilter = "all" | ProjectCategory;

function categoryLabel(cat: string): string {
  return PROJECT_CATEGORIES.find((c) => c.value === cat)?.label ?? cat;
}

export default function ProjectsArchiveView({
  data,
}: ProjectsArchiveViewProps) {
  const [filter, setFilter] = useState<ArchiveFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.projects.filter((project) => {
      if (filter !== "all" && project.category !== filter) return false;
      if (!q) return true;
      return (
        project.title.toLowerCase().includes(q) ||
        (project.description || "").toLowerCase().includes(q) ||
        project.year.includes(q)
      );
    });
  }, [data.projects, filter, query]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#111111]">
      <MinimalHeader
        mode="projects"
        brandName={data.profile.name}
        resumeLabel={data.profile.resumeLabel}
        resumeUrl={data.profile.resumeUrl}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-12 lg:py-16">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-950 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Back to Portfolio</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-950">
              {data.sectionHeadings.archiveTitle}
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 max-w-2xl">
              {data.sectionHeadings.archiveSubtitle}
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search
              className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects or years..."
              aria-label="Search projects"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div
          role="group"
          aria-label="Filter project archive"
          className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 border border-neutral-200 rounded-lg w-fit mb-8"
        >
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filter === "all"
                ? "bg-white text-neutral-950 shadow-xs"
                : "text-neutral-600 hover:text-neutral-950"
            }`}
          >
            All ({data.projects.length})
          </button>
          {PROJECT_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setFilter(cat.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                filter === cat.value
                  ? "bg-white text-neutral-950 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-neutral-500">
              No projects match your current filter.
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filtered.map((project) => (
                <div
                  key={project.id}
                  className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/70 transition-colors"
                >
                  <div className="flex items-baseline gap-4 min-w-0">
                    <span className="font-mono tabular-nums text-xs text-neutral-500 shrink-0 w-10">
                      {project.year}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-950">
                        {project.title}
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {categoryLabel(project.category)}
                        {project.description ? ` · ${project.description}` : ""}
                      </p>
                    </div>
                  </div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-neutral-800 hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
                  >
                    <span>Visit</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <MinimalFooter
        links={data.links}
        ownerName={data.profile.name}
        footerLocation={data.profile.footerLocation}
        resumeLabel={data.profile.resumeLabel}
        resumeUrl={data.profile.resumeUrl}
      />
    </div>
  );
}
