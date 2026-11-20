import {
  MediaItemRecord,
  PortfolioLinkRecord,
  PortfolioSnapshot,
  ProfileConfigRecord,
  ProjectRecord,
} from "./portfolio-types";
import {
  DEFAULT_LINKS,
  DEFAULT_MEDIA,
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
} from "./seed-data";
import { getDocument, listCollection } from "./firebase-rest";

function sortByOrderAndYear<T extends { sortOrder?: number; year?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const orderDiff = (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999);
    if (orderDiff !== 0) return orderDiff;
    if (a.year && b.year) return b.year.localeCompare(a.year);
    return 0;
  });
}

export async function getPortfolioSnapshot(): Promise<PortfolioSnapshot> {
  try {
    const [dbProfile, dbProjects, dbLinks, dbMedia] = await Promise.all([
      getDocument<ProfileConfigRecord>("profile", "main").catch(() => null),
      listCollection<ProjectRecord>("projects").catch(() => []),
      listCollection<PortfolioLinkRecord>("links").catch(() => []),
      listCollection<MediaItemRecord>("media").catch(() => []),
    ]);

    return {
      profile: dbProfile ?? DEFAULT_PROFILE,
      projects: dbProjects.length > 0 ? sortByOrderAndYear(dbProjects) : DEFAULT_PROJECTS,
      links: dbLinks.length > 0 ? sortByOrderAndYear(dbLinks) : DEFAULT_LINKS,
      media: dbMedia.length > 0 ? sortByOrderAndYear(dbMedia) : DEFAULT_MEDIA,
      fromDatabase: {
        profile: Boolean(dbProfile),
        projects: dbProjects.length > 0,
        links: dbLinks.length > 0,
        media: dbMedia.length > 0,
      },
    };
  } catch {
    return {
      profile: DEFAULT_PROFILE,
      projects: DEFAULT_PROJECTS,
      links: DEFAULT_LINKS,
      media: DEFAULT_MEDIA,
      fromDatabase: {
        profile: false,
        projects: false,
        links: false,
        media: false,
      },
    };
  }
}
