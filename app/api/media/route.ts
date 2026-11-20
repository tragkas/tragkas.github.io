import { NextRequest, NextResponse } from "next/server";
import { AuthError, verifyAdminRequest } from "@/lib/auth-server";
import { createDocument, getDocument, listCollection } from "@/lib/firebase-rest";
import {
  generateSlugId,
  MediaItemRecord,
  validateMediaPayload,
} from "@/lib/portfolio-types";
import { DEFAULT_MEDIA } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const media = await listCollection<MediaItemRecord>("media");
    const sorted = (media.length > 0 ? media : DEFAULT_MEDIA).sort(
      (a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)
    );
    return NextResponse.json(
      { media: sorted },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("GET /api/media error:", error);
    return NextResponse.json({ error: "Failed to load media." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminRequest(req);
    const raw = (await req.json()) as Record<string, unknown>;
    const validation = validateMediaPayload(raw);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const docId = generateSlugId("media");
    await createDocument(
      "media",
      docId,
      {
        ...validation.data,
        ownerUid: admin.uid,
      },
      admin.token
    );

    const created = await getDocument<MediaItemRecord>("media", docId);
    return NextResponse.json(
      { media: created ?? { id: docId, ...validation.data, ownerUid: admin.uid } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("POST /api/media error:", error);
    return NextResponse.json({ error: "Failed to create media item." }, { status: 500 });
  }
}
