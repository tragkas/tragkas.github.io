import { NextRequest, NextResponse } from "next/server";
import { AuthError, verifyAdminRequest } from "@/lib/auth-server";
import {
  batchSeedDocuments,
  getDocument,
  listCollection,
  upsertProfileDocument,
} from "@/lib/firebase-rest";
import {
  DEFAULT_LINKS,
  DEFAULT_MEDIA,
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
} from "@/lib/seed-data";

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminRequest(req);

    const [existingProfile, existingProjects, existingLinks, existingMedia] =
      await Promise.all([
        getDocument("profile", "main").catch(() => null),
        listCollection("projects").catch(() => []),
        listCollection("links").catch(() => []),
        listCollection("media").catch(() => []),
      ]);

    const existingProjectIds = new Set(existingProjects.map((p) => p.id));
    const existingLinkIds = new Set(existingLinks.map((l) => l.id));
    const existingMediaIds = new Set(existingMedia.map((m) => m.id));

    let seededProfile = false;
    if (!existingProfile) {
      await upsertProfileDocument(
        {
          name: DEFAULT_PROFILE.name,
          location: DEFAULT_PROFILE.location,
          headline: DEFAULT_PROFILE.headline,
          subheadline: DEFAULT_PROFILE.subheadline,
          heroImage: DEFAULT_PROFILE.heroImage,
          heroCaption: DEFAULT_PROFILE.heroCaption ?? "",
          resumeUrl: DEFAULT_PROFILE.resumeUrl,
          assessmentUrl: DEFAULT_PROFILE.assessmentUrl,
          ownerUid: admin.uid,
        },
        admin.token,
        false
      );
      seededProfile = true;
    }

    const writes: Array<{
      collectionName: string;
      docId: string;
      data: Record<string, unknown>;
    }> = [];

    if (existingProjects.length === 0) {
      for (const proj of DEFAULT_PROJECTS) {
        if (!existingProjectIds.has(proj.id)) {
          writes.push({
            collectionName: "projects",
            docId: proj.id,
            data: {
              title: proj.title,
              year: proj.year,
              category: proj.category,
              url: proj.url,
              description: proj.description ?? "",
              imageUrl: proj.imageUrl ?? "",
              featured: proj.featured,
              sortOrder: proj.sortOrder,
              ownerUid: admin.uid,
            },
          });
        }
      }
    }

    if (existingLinks.length === 0) {
      for (const link of DEFAULT_LINKS) {
        if (!existingLinkIds.has(link.id)) {
          writes.push({
            collectionName: "links",
            docId: link.id,
            data: {
              label: link.label,
              group: link.group,
              url: link.url,
              imageUrl: link.imageUrl ?? "",
              description: link.description ?? "",
              sortOrder: link.sortOrder,
              ownerUid: admin.uid,
            },
          });
        }
      }
    }

    if (existingMedia.length === 0) {
      for (const item of DEFAULT_MEDIA) {
        if (!existingMediaIds.has(item.id)) {
          writes.push({
            collectionName: "media",
            docId: item.id,
            data: {
              title: item.title,
              category: item.category,
              src: item.src,
              alt: item.alt,
              linkUrl: item.linkUrl ?? "",
              sortOrder: item.sortOrder,
              ownerUid: admin.uid,
            },
          });
        }
      }
    }

    // Firestore commit supports up to 500 writes per batch; we have ~40 total.
    if (writes.length > 0) {
      await batchSeedDocuments(writes, admin.token);
    }

    return NextResponse.json(
      {
        seededProfile,
        seededCount: writes.length,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to initialize database records." },
      { status: 500 }
    );
  }
}
