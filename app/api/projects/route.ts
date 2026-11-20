import { NextRequest, NextResponse } from "next/server";
import { AuthError, verifyAdminRequest } from "@/lib/auth-server";
import { createDocument, getDocument, listCollection } from "@/lib/firebase-rest";
import {
  generateSlugId,
  ProjectRecord,
  validateProjectPayload,
} from "@/lib/portfolio-types";
import { DEFAULT_PROJECTS } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await listCollection<ProjectRecord>("projects");
    const sorted = (projects.length > 0 ? projects : DEFAULT_PROJECTS).sort(
      (a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)
    );
    return NextResponse.json(
      { projects: sorted },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Failed to load projects." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminRequest(req);
    const raw = (await req.json()) as Record<string, unknown>;
    const validation = validateProjectPayload(raw);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const docId = generateSlugId("proj");
    await createDocument(
      "projects",
      docId,
      {
        ...validation.data,
        ownerUid: admin.uid,
      },
      admin.token
    );

    const created = await getDocument<ProjectRecord>("projects", docId);
    return NextResponse.json(
      { project: created ?? { id: docId, ...validation.data, ownerUid: admin.uid } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
  }
}
