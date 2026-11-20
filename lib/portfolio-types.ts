export type ProjectCategory =
  | "web-app"
  | "extension"
  | "website"
  | "finance"
  | "negotiations"
  | "real-estate"
  | "other";

export type LinkGroup = "social" | "channel" | "resource";

export type MediaCategory =
  | "social-marketing"
  | "project-preview"
  | "analytics"
  | "other";

export interface ProfileConfig {
  name: string;
  location: string;
  kickerTagline: string;
  headline: string;
  subheadline: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  resumeLabel: string;
  resumeUrl: string;
  assessmentLabel: string;
  assessmentUrl: string;
  heroImage: string;
  heroImageTitle: string;
  heroImageSubtitle: string;
  heroImageExternalUrl?: string;
  heroCaption?: string;
  footerLocation: string;
}

export interface MetricItem {
  value: string;
  label: string;
  /** When true, automatically displays the current number of items in `projects`. */
  useProjectCount?: boolean;
}

export interface SectionHeadings {
  strengthsTitle: string;
  strengthsSubtitle: string;
  projectsTitle: string;
  projectsSubtitle: string;
  mediaTitle: string;
  mediaSubtitle: string;
  linksTitle: string;
  linksSubtitle: string;
  educationTitle: string;
  educationSubtitle: string;
  archiveTitle: string;
  archiveSubtitle: string;
}

export interface StrengthPillar {
  number: string;
  title: string;
  summary: string;
  proof: string;
}

export interface ProjectRecord {
  id: string;
  title: string;
  year: string;
  category: ProjectCategory;
  url: string;
  description?: string;
  imageUrl?: string;
  featured: boolean;
}

export interface PortfolioLinkRecord {
  id: string;
  label: string;
  group: LinkGroup;
  url: string;
  imageUrl?: string;
  description?: string;
}

export interface MediaItemRecord {
  id: string;
  title: string;
  category: MediaCategory;
  src: string;
  alt: string;
  linkUrl?: string;
}

export interface EducationItem {
  title: string;
  institution: string;
  period: string;
  description?: string;
  linkUrl?: string;
  linkLabel?: string;
}

export interface PortfolioContent {
  profile: ProfileConfig;
  metrics: MetricItem[];
  sectionHeadings: SectionHeadings;
  strengths: StrengthPillar[];
  projects: ProjectRecord[];
  links: PortfolioLinkRecord[];
  media: MediaItemRecord[];
  education: EducationItem[];
}

export const PROJECT_CATEGORIES: readonly { value: ProjectCategory; label: string }[] = [
  { value: "web-app", label: "Web Apps" },
  { value: "extension", label: "Extensions" },
  { value: "website", label: "Websites" },
  { value: "finance", label: "Finance" },
  { value: "negotiations", label: "Negotiations" },
  { value: "real-estate", label: "Real Estate" },
  { value: "other", label: "Other" },
] as const;

export const LINK_GROUPS: readonly { value: LinkGroup; label: string }[] = [
  { value: "social", label: "Social" },
  { value: "channel", label: "Channel" },
  { value: "resource", label: "Resource" },
] as const;

export const MEDIA_CATEGORIES: readonly { value: MediaCategory; label: string }[] = [
  { value: "social-marketing", label: "Social Marketing" },
  { value: "project-preview", label: "Project Preview" },
  { value: "analytics", label: "Analytics" },
  { value: "other", label: "Other" },
] as const;
