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

export interface ProjectRecord {
  id: string;
  title: string;
  year: string;
  category: ProjectCategory;
  url: string;
  description?: string;
  imageUrl?: string;
  featured: boolean;
  sortOrder: number;
  ownerUid?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioLinkRecord {
  id: string;
  label: string;
  group: LinkGroup;
  url: string;
  imageUrl?: string;
  description?: string;
  sortOrder: number;
  ownerUid?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaItemRecord {
  id: string;
  title: string;
  category: MediaCategory;
  src: string;
  alt: string;
  linkUrl?: string;
  sortOrder: number;
  ownerUid?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileConfigRecord {
  id: string;
  name: string;
  location: string;
  headline: string;
  subheadline: string;
  heroImage: string;
  heroCaption?: string;
  resumeUrl: string;
  assessmentUrl: string;
  ownerUid?: string;
  updatedAt?: string;
}

export interface StrengthPillar {
  number: string;
  title: string;
  summary: string;
  proof: string;
}

export interface EducationItem {
  title: string;
  institution: string;
  period: string;
  description?: string;
  linkUrl?: string;
  linkLabel?: string;
}

export interface PortfolioSnapshot {
  profile: ProfileConfigRecord;
  projects: ProjectRecord[];
  links: PortfolioLinkRecord[];
  media: MediaItemRecord[];
  fromDatabase: {
    profile: boolean;
    projects: boolean;
    links: boolean;
    media: boolean;
  };
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

const VALID_PROJECT_CATS = new Set<string>(PROJECT_CATEGORIES.map((c) => c.value));
const VALID_LINK_GROUPS = new Set<string>(LINK_GROUPS.map((g) => g.value));
const VALID_MEDIA_CATS = new Set<string>(MEDIA_CATEGORIES.map((m) => m.value));

export function isValidDocId(id: unknown): id is string {
  return (
    typeof id === "string" &&
    id.length >= 1 &&
    id.length <= 128 &&
    /^[a-zA-Z0-9_-]+$/.test(id)
  );
}

export function isSafeHttpUrl(val: unknown): val is string {
  if (typeof val !== "string") return false;
  const trimmed = val.trim();
  if (trimmed.length < 1 || trimmed.length > 1000) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function isValidMediaSrc(val: unknown): val is string {
  if (typeof val !== "string") return false;
  const trimmed = val.trim();
  if (trimmed.length < 1 || trimmed.length > 600000) return false;
  if (/^\/[^/][a-zA-Z0-9_\-./]*$/.test(trimmed)) return true;
  if (isSafeHttpUrl(trimmed)) return true;
  if (/^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(trimmed)) {
    return true;
  }
  return false;
}

export function generateSlugId(prefix: string): string {
  const randomPart = Math.random().toString(36).slice(2, 8);
  const timePart = Date.now().toString(36);
  const cleanPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 20) || "item";
  return `${cleanPrefix}_${timePart}_${randomPart}`;
}

export function validateProjectPayload(
  raw: Record<string, unknown>
): { ok: true; data: Omit<ProjectRecord, "id" | "ownerUid" | "createdAt" | "updatedAt"> } | { ok: false; error: string } {
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const year = typeof raw.year === "string" ? raw.year.trim() : "";
  const category = typeof raw.category === "string" ? raw.category.trim() : "";
  const url = typeof raw.url === "string" ? raw.url.trim() : "";
  const description = typeof raw.description === "string" ? raw.description.trim() : "";
  const imageUrl = typeof raw.imageUrl === "string" ? raw.imageUrl.trim() : "";
  const featured = Boolean(raw.featured);
  const sortOrder = typeof raw.sortOrder === "number" && Number.isFinite(raw.sortOrder) ? raw.sortOrder : 0;

  if (!title || title.length > 140) {
    return { ok: false, error: "Title must be between 1 and 140 characters." };
  }
  if (!/^[0-9]{4}$/.test(year)) {
    return { ok: false, error: "Year must be a 4-digit number." };
  }
  if (!VALID_PROJECT_CATS.has(category)) {
    return { ok: false, error: "Invalid project category." };
  }
  if (!isSafeHttpUrl(url)) {
    return { ok: false, error: "Project URL must start with http:// or https://." };
  }
  if (description.length > 500) {
    return { ok: false, error: "Description cannot exceed 500 characters." };
  }
  if (imageUrl !== "" && !isValidMediaSrc(imageUrl)) {
    return { ok: false, error: "Image source must be a valid local path, HTTPS URL, or bounded PNG/JPG/WebP/GIF image." };
  }

  return {
    ok: true,
    data: {
      title,
      year,
      category: category as ProjectCategory,
      url,
      description,
      imageUrl,
      featured,
      sortOrder,
    },
  };
}

export function validateLinkPayload(
  raw: Record<string, unknown>
): { ok: true; data: Omit<PortfolioLinkRecord, "id" | "ownerUid" | "createdAt" | "updatedAt"> } | { ok: false; error: string } {
  const label = typeof raw.label === "string" ? raw.label.trim() : "";
  const group = typeof raw.group === "string" ? raw.group.trim() : "";
  const url = typeof raw.url === "string" ? raw.url.trim() : "";
  const imageUrl = typeof raw.imageUrl === "string" ? raw.imageUrl.trim() : "";
  const description = typeof raw.description === "string" ? raw.description.trim() : "";
  const sortOrder = typeof raw.sortOrder === "number" && Number.isFinite(raw.sortOrder) ? raw.sortOrder : 0;

  if (!label || label.length > 100) {
    return { ok: false, error: "Label must be between 1 and 100 characters." };
  }
  if (!VALID_LINK_GROUPS.has(group)) {
    return { ok: false, error: "Invalid link group." };
  }
  if (!isSafeHttpUrl(url)) {
    return { ok: false, error: "Link URL must start with http:// or https://." };
  }
  if (imageUrl !== "" && !isValidMediaSrc(imageUrl)) {
    return { ok: false, error: "Thumbnail source must be a valid local path, HTTPS URL, or image." };
  }
  if (description.length > 300) {
    return { ok: false, error: "Description cannot exceed 300 characters." };
  }

  return {
    ok: true,
    data: {
      label,
      group: group as LinkGroup,
      url,
      imageUrl,
      description,
      sortOrder,
    },
  };
}

export function validateMediaPayload(
  raw: Record<string, unknown>
): { ok: true; data: Omit<MediaItemRecord, "id" | "ownerUid" | "createdAt" | "updatedAt"> } | { ok: false; error: string } {
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const category = typeof raw.category === "string" ? raw.category.trim() : "";
  const src = typeof raw.src === "string" ? raw.src.trim() : "";
  const alt = typeof raw.alt === "string" ? raw.alt.trim() : "";
  const linkUrl = typeof raw.linkUrl === "string" ? raw.linkUrl.trim() : "";
  const sortOrder = typeof raw.sortOrder === "number" && Number.isFinite(raw.sortOrder) ? raw.sortOrder : 0;

  if (!title || title.length > 140) {
    return { ok: false, error: "Media title must be between 1 and 140 characters." };
  }
  if (!VALID_MEDIA_CATS.has(category)) {
    return { ok: false, error: "Invalid media category." };
  }
  if (!isValidMediaSrc(src)) {
    return { ok: false, error: "Media source must be a valid local path, HTTPS URL, or bounded PNG/JPG/WebP/GIF image (max ~400KB)." };
  }
  if (!alt || alt.length > 200) {
    return { ok: false, error: "Alt text must be between 1 and 200 characters." };
  }
  if (linkUrl !== "" && !isSafeHttpUrl(linkUrl)) {
    return { ok: false, error: "Reference link must start with http:// or https://." };
  }

  return {
    ok: true,
    data: {
      title,
      category: category as MediaCategory,
      src,
      alt,
      linkUrl,
      sortOrder,
    },
  };
}

export function validateProfilePayload(
  raw: Record<string, unknown>
): { ok: true; data: Omit<ProfileConfigRecord, "id" | "ownerUid" | "updatedAt"> } | { ok: false; error: string } {
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const location = typeof raw.location === "string" ? raw.location.trim() : "";
  const headline = typeof raw.headline === "string" ? raw.headline.trim() : "";
  const subheadline = typeof raw.subheadline === "string" ? raw.subheadline.trim() : "";
  const heroImage = typeof raw.heroImage === "string" ? raw.heroImage.trim() : "";
  const heroCaption = typeof raw.heroCaption === "string" ? raw.heroCaption.trim() : "";
  const resumeUrl = typeof raw.resumeUrl === "string" ? raw.resumeUrl.trim() : "";
  const assessmentUrl = typeof raw.assessmentUrl === "string" ? raw.assessmentUrl.trim() : "";

  if (!name || name.length > 100) return { ok: false, error: "Invalid name." };
  if (!location || location.length > 120) return { ok: false, error: "Invalid location." };
  if (!headline || headline.length > 200) return { ok: false, error: "Headline must be 1-200 characters." };
  if (!subheadline || subheadline.length > 400) return { ok: false, error: "Subheadline must be 1-400 characters." };
  if (!isValidMediaSrc(heroImage)) return { ok: false, error: "Invalid hero image source." };
  if (heroCaption.length > 300) return { ok: false, error: "Hero caption must be <= 300 characters." };
  if (!isSafeHttpUrl(resumeUrl)) return { ok: false, error: "Resume URL must be http(s)." };
  if (!isSafeHttpUrl(assessmentUrl)) return { ok: false, error: "Assessment URL must be http(s)." };

  return {
    ok: true,
    data: {
      name,
      location,
      headline,
      subheadline,
      heroImage,
      heroCaption,
      resumeUrl,
      assessmentUrl,
    },
  };
}
