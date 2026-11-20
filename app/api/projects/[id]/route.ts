import { NextRequest, NextResponse } from "next/server";
import { AuthError, verifyAdminRequest } from "@/lib/auth-server";
import { deleteDocument, getDocument, updateDocument } from "@/lib/firebase-rest";
import {
  isValidDocId,
  ProjectRecord,
  validateProjectPayload,
} from "@/lib/portfolio-types";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminRequest(req);
    const { id } = await context.params;
    if (!isValidDocId(id)) {
      return NextResponse.json({ error: "Invalid project ID." }, { status: 400 });
    }

    const existing = await getDocument<ProjectRecord>("projects", id);
    if (!existing) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const raw = (await req.json()) as Record<string, unknown>;
    const validation = validateProjectPayload(raw);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    await updateDocument("projects", id, validation.data, admin.token);
    const updated = await getDocument<ProjectRecord>("projects", id);
    return NextResponse.json({ project: updated }, { status: 200 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("PATCH /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to update project." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminRequest(req);
    const { id } = await context.params;
    if (!isValidDocId(id)) {
      return NextResponse.json({ error: "Invalid project ID." }, { status: 400 });
    }

    await deleteDocument("projects", id, admin.token);
    return NextResponse.json({ deleted: true, id }, { status: 200 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete project." }, { status: 500 });
  }
}
