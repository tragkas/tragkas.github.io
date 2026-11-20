"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, MotionConfig } from "motion/react";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import {
  PortfolioContent,
  PROJECT_CATEGORIES,
  ProjectCategory,
  ProjectRecord,
} from "@/lib/portfolio-types";
import MinimalHeader from "./MinimalHeader";
import MinimalFooter from "./MinimalFooter";
import SmartMedia from "./SmartMedia";

interface MinimalPortfolioViewProps {
  data: PortfolioContent;
}

type ProjectFilter = "all" | "featured" | ProjectCategory;

interface LightboxState {
  title: string;
  subtitle: string;
  src: string;
  alt: string;
  externalUrl?: string;
}

function formatCategoryLabel(category: string): string {
  const match = PROJECT_CATEGORIES.find((c) => c.value === category);
  return match ? match.label : category;
}

export default function MinimalPortfolioView({
  data,
}: MinimalPortfolioViewProps) {
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [showAllArchive, setShowAllArchive] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightbox(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox]);

  const {
    profile,
    metrics,
    sectionHeadings,
    strengths,
    projects,
    links,
    media,
    education,
  } = data;

  const featuredProjects = useMemo(
    () => projects.filter((p) => p.featured && p.imageUrl),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    if (filter === "all") return projects;
    if (filter === "featured") return projects.filter((p) => p.featured);
    return projects.filter((p) => p.category === filter);
  }, [projects, filter]);

  const visibleArchiveProjects: ProjectRecord[] = useMemo(() => {
    if (showAllArchive || filter !== "all") {
      return filteredProjects;
    }
    return filteredProjects.slice(0, 10);
  }, [filteredProjects, showAllArchive, filter]);

  const channelLinks = useMemo(
    () => links.filter((l) => l.group === "social" || l.group === "channel"),
    [links]
  );

  const resourceLinks = useMemo(
    () => links.filter((l) => l.group === "resource"),
    [links]
  );

  const galleryMedia = useMemo(
    () => media.filter((m) => m.src !== profile.heroImage),
    [media, profile.heroImage]
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#111111]">
        <MinimalHeader
          mode="portfolio"
          brandName={profile.name}
          resumeLabel={profile.resumeLabel}
          resumeUrl={profile.resumeUrl}
        />

        <main className="flex-1">
          {/* HERO SPLIT */}
          <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-12 pb-14 lg:pt-16 lg:pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="lg:col-span-7 flex flex-col justify-between space-y-8"
              >
                <div className="space-y-5">
                  <p className="text-xs font-medium text-neutral-500">
                    {profile.location}
                    {profile.kickerTagline ? ` · ${profile.kickerTagline}` : ""}
                  </p>
                  <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1] text-neutral-950 text-balance">
                    {profile.headline}
                  </h1>
                  <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
                    {profile.subheadline}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href={profile.primaryCtaHref}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  >
                    {profile.primaryCtaLabel}
                  </a>
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 text-sm font-medium text-neutral-900 bg-white border border-neutral-200 rounded-lg hover:border-neutral-400 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <span>{profile.resumeLabel}</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-500" aria-hidden="true" />
                  </a>
                  {profile.assessmentUrl && (
                    <a
                      href={profile.assessmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-950 hover:underline underline-offset-4 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <span>{profile.assessmentLabel}</span>
                      <ArrowUpRight className="w-4 h-4 text-neutral-500" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                className="lg:col-span-5 flex flex-col"
              >
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({
                      title: profile.heroImageTitle,
                      subtitle: profile.heroImageSubtitle,
                      src: profile.heroImage,
                      alt: profile.heroImageTitle,
                      externalUrl: profile.heroImageExternalUrl,
                    })
                  }
                  className="group relative flex-1 min-h-[260px] w-full rounded-xl overflow-hidden border border-neutral-200 bg-white text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <SmartMedia
                    src={profile.heroImage}
                    alt={profile.heroImageTitle}
                    priority
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-200"
                  />
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-white/95 text-neutral-900 border border-neutral-200 rounded-md shadow-xs">
                    <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Inspect</span>
                  </span>
                </button>
                {profile.heroCaption && (
                  <p className="mt-3 text-xs text-neutral-500 leading-relaxed">
                    {profile.heroCaption}
                  </p>
                )}
              </motion.div>
            </div>

            {/* 4-COLUMN PROOF METRICS STRIP */}
            {metrics.length > 0 && (
              <div className="mt-12 pt-8 border-t border-neutral-200 grid grid-cols-2 lg:grid-cols-4 gap-8">
                {metrics.map((metric, idx) => (
                  <div key={`${metric.label}-${idx}`}>
                    <p className="font-mono tabular-nums text-2xl sm:text-3xl font-medium text-neutral-950">
                      {metric.useProjectCount ? projects.length : metric.value}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* CORE STRENGTHS */}
          <section
            id="strengths"
            className="border-t border-neutral-200 bg-white py-16 lg:py-20"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-8">
              <div className="max-w-2xl mb-12">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950">
                  {sectionHeadings.strengthsTitle}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-neutral-600">
                  {sectionHeadings.strengthsSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {strengths.map((pillar) => (
                  <article
                    key={pillar.number}
                    className="pt-6 border-t border-neutral-200 flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-3">
                      <span className="font-mono tabular-nums text-xs text-blue-600 font-medium">
                        {pillar.number}
                      </span>
                      <h3 className="text-lg font-semibold text-neutral-950 tracking-tight">
                        {pillar.title}
                      </h3>
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {pillar.summary}
                      </p>
                    </div>
                    <p className="text-xs text-neutral-500 pt-2">
                      {pillar.proof}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* SELECTED WORK & PROJECT ARCHIVE */}
          <section
            id="projects"
            className="border-t border-neutral-200 bg-[#fafafa] py-16 lg:py-20"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950">
                    {sectionHeadings.projectsTitle}
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-xl">
                    {sectionHeadings.projectsSubtitle}
                  </p>
                </div>
                <Link
                  href="/projects"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <span>Full Project Archive ({projects.length})</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>

              {/* Filter Segmented Bar */}
              <div
                role="group"
                aria-label="Filter projects by category"
                className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 border border-neutral-200 rounded-lg w-fit mb-10"
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
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("featured")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    filter === "featured"
                      ? "bg-white text-neutral-950 shadow-xs"
                      : "text-neutral-600 hover:text-neutral-950"
                  }`}
                >
                  Featured
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

              {/* Featured Visual Showcase */}
              {(filter === "all" || filter === "featured") &&
                featuredProjects.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
                    {featuredProjects.map((project) => (
                      <article
                        key={project.id}
                        className="bg-white border border-neutral-200 rounded-xl overflow-hidden flex flex-col justify-between"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setLightbox({
                              title: project.title,
                              subtitle: `${project.year} · ${formatCategoryLabel(project.category)}`,
                              src: project.imageUrl || "",
                              alt: `${project.title} preview`,
                              externalUrl: project.url,
                            })
                          }
                          className="relative aspect-[16/10] w-full bg-neutral-100 overflow-hidden text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        >
                          <SmartMedia
                            src={project.imageUrl}
                            alt={`${project.title} preview`}
                            fallbackTitle={project.title}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                          />
                        </button>
                        <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                          <div>
                            <p className="text-xs text-neutral-500 font-mono tabular-nums">
                              {project.year} · {formatCategoryLabel(project.category)}
                            </p>
                            <h3 className="mt-1.5 text-base font-semibold text-neutral-950">
                              {project.title}
                            </h3>
                            {project.description && (
                              <p className="mt-1.5 text-sm text-neutral-600 line-clamp-2">
                                {project.description}
                              </p>
                            )}
                          </div>
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-900 hover:text-blue-600 transition-colors w-fit"
                          >
                            <span>Visit Project</span>
                            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

              {/* Tabular Archive Index */}
              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-500">
                    Project Index
                  </span>
                  <span className="font-mono tabular-nums text-xs text-neutral-500">
                    {filteredProjects.length} items
                  </span>
                </div>

                {visibleArchiveProjects.length === 0 ? (
                  <div className="p-8 text-center text-sm text-neutral-500">
                    No projects match this category yet.
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-200">
                    {visibleArchiveProjects.map((project) => (
                      <div
                        key={project.id}
                        className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/70 transition-colors"
                      >
                        <div className="flex items-baseline gap-4 min-w-0">
                          <span className="font-mono tabular-nums text-xs text-neutral-500 shrink-0 w-10">
                            {project.year}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-950 truncate">
                              {project.title}
                            </p>
                            <p className="text-xs text-neutral-500 mt-0.5 truncate">
                              {formatCategoryLabel(project.category)}
                              {project.description ? ` · ${project.description}` : ""}
                            </p>
                          </div>
                        </div>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-neutral-700 hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
                        >
                          <span>Visit</span>
                          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {filter === "all" && filteredProjects.length > 10 && (
                  <div className="px-5 py-3.5 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowAllArchive((prev) => !prev)}
                      className="text-xs font-medium text-neutral-900 hover:text-blue-600 transition-colors"
                    >
                      {showAllArchive
                        ? "Show fewer projects"
                        : `Show all ${filteredProjects.length} projects`}
                    </button>
                    <Link
                      href="/projects"
                      className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      Open dedicated archive →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* MEDIA & DIGITAL PRESENCE */}
          <section
            id="media"
            className="border-t border-neutral-200 bg-white py-16 lg:py-20"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-16">
              {/* Media Deliverables */}
              <div>
                <div className="max-w-2xl mb-10">
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950">
                    {sectionHeadings.mediaTitle}
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-neutral-600">
                    {sectionHeadings.mediaSubtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryMedia.map((item) => (
                    <figure
                      key={item.id}
                      className="border border-neutral-200 rounded-xl overflow-hidden bg-[#fafafa] flex flex-col justify-between"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setLightbox({
                            title: item.title,
                            subtitle: item.category.replace("-", " "),
                            src: item.src,
                            alt: item.alt,
                            externalUrl: item.linkUrl,
                          })
                        }
                        className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        <SmartMedia
                          src={item.src}
                          alt={item.alt}
                          fallbackTitle={item.title}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                        />
                      </button>
                      <figcaption className="px-4 py-3.5 bg-white border-t border-neutral-200 flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-neutral-900 truncate">
                          {item.title}
                        </span>
                        {item.linkUrl ? (
                          <a
                            href={item.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-blue-600 whitespace-nowrap shrink-0"
                          >
                            <span>Open</span>
                            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setLightbox({
                                title: item.title,
                                subtitle: item.category.replace("-", " "),
                                src: item.src,
                                alt: item.alt,
                              })
                            }
                            className="text-xs font-medium text-neutral-600 hover:text-blue-600 whitespace-nowrap shrink-0"
                          >
                            View
                          </button>
                        )}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>

              {/* Channels & Links */}
              <div id="links" className="pt-12 border-t border-neutral-200">
                <div className="max-w-2xl mb-8">
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-950">
                    {sectionHeadings.linksTitle}
                  </h3>
                  <p className="mt-1.5 text-sm text-neutral-600">
                    {sectionHeadings.linksSubtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {channelLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group border border-neutral-200 rounded-xl bg-[#fafafa] hover:border-neutral-400 transition-colors overflow-hidden flex flex-col justify-between"
                    >
                      {link.imageUrl && (
                        <div className="aspect-[16/9] w-full bg-neutral-100 overflow-hidden border-b border-neutral-200">
                          <SmartMedia
                            src={link.imageUrl}
                            alt={`${link.label} preview`}
                            fallbackTitle={link.label}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                          />
                        </div>
                      )}
                      <div className="p-4 flex items-start justify-between gap-3 bg-white flex-1">
                        <div>
                          <p className="text-sm font-semibold text-neutral-950 group-hover:text-blue-600 transition-colors">
                            {link.label}
                          </p>
                          {link.description && (
                            <p className="mt-1 text-xs text-neutral-500 line-clamp-2">
                              {link.description}
                            </p>
                          )}
                        </div>
                        <ArrowUpRight
                          className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                      </div>
                    </a>
                  ))}
                </div>

                {resourceLinks.length > 0 && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {resourceLinks.map((resLink) => (
                      <a
                        key={resLink.id}
                        href={resLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-4 border border-neutral-200 rounded-xl bg-[#fafafa] hover:border-neutral-400 transition-colors flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-sm font-medium text-neutral-950">
                            {resLink.label}
                          </p>
                          {resLink.description && (
                            <p className="text-xs text-neutral-500 mt-0.5">
                              {resLink.description}
                            </p>
                          )}
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-neutral-400 shrink-0" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* BACKGROUND & EDUCATION */}
          <section
            id="background"
            className="border-t border-neutral-200 bg-[#fafafa] py-16 lg:py-20"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-8">
              <div className="max-w-2xl mb-10">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950">
                  {sectionHeadings.educationTitle}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-neutral-600">
                  {sectionHeadings.educationSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                {education.map((edu) => (
                  <div
                    key={edu.title}
                    className="py-5 border-t border-neutral-200 flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-base font-semibold text-neutral-950">
                        {edu.title}
                      </h3>
                      <span className="font-mono tabular-nums text-xs text-neutral-500 whitespace-nowrap shrink-0">
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-neutral-600">
                      {edu.institution}
                    </p>
                    {edu.description && (
                      <p className="text-sm text-neutral-600 leading-relaxed mt-1">
                        {edu.description}
                      </p>
                    )}
                    {edu.linkUrl && (
                      <a
                        href={edu.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline underline-offset-4 w-fit"
                      >
                        <span>{edu.linkLabel || "View Credentials"}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <MinimalFooter
          links={links}
          ownerName={profile.name}
          footerLocation={profile.footerLocation}
          resumeLabel={profile.resumeLabel}
          resumeUrl={profile.resumeUrl}
        />

        {/* LIGHTBOX VIEWER */}
        {lightbox && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.title}
            className="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightbox(null)}
          >
            <div
              className="max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-2xl border border-neutral-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-neutral-950 truncate">
                    {lightbox.title}
                  </h3>
                  <p className="text-xs text-neutral-500 capitalize">
                    {lightbox.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {lightbox.externalUrl && (
                    <a
                      href={lightbox.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded-md hover:bg-blue-600 transition-colors inline-flex items-center gap-1 whitespace-nowrap"
                    >
                      <span>Open Link</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setLightbox(null)}
                    aria-label="Close preview"
                    className="p-2 text-neutral-500 hover:text-neutral-950 rounded-md hover:bg-neutral-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="bg-neutral-950 flex items-center justify-center max-h-[75vh] overflow-hidden">
                <SmartMedia
                  src={lightbox.src}
                  alt={lightbox.alt}
                  fallbackTitle={lightbox.title}
                  priority
                  className="max-h-[75vh] w-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
