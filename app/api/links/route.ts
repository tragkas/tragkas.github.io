import { NextRequest, NextResponse } from "next/server";
import { AuthError, verifyAdminRequest } from "@/lib/auth-server";
import { createDocument, getDocument, listCollection } from "@/lib/firebase-rest";
import {
  generateSlugId,
  PortfolioLinkRecord,
  validateLinkPayload,
} from "@/lib/portfolio-types";
import { DEFAULT_LINKS } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const links = await listCollection<PortfolioLinkRecord>("links");
    const sorted = (links.length > 0 ? links : DEFAULT_LINKS).sort(
      (a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)
    );
    return NextResponse.json(
      { links: sorted },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("GET /api/links error:", error);
    return NextResponse.json({ error: "Failed to load links." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminRequest(req);
    const raw = (await req.json()) as Record<string, unknown>;
    const validation = validateLinkPayload(raw);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const docId = generateSlugId("link");
    await createDocument(
      "links",
      docId,
      {
        ...validation.data,
        ownerUid: admin.uid,
      },
      admin.token
    );

    const created = await getDocument<PortfolioLinkRecord>("links", docId);
    return NextResponse.json(
      { link: created ?? { id: docId, ...validation.data, ownerUid: admin.uid } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("POST /api/links error:", error);
    return NextResponse.json({ error: "Failed to create link." }, { status: 500 });
  }
}
