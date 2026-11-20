import { NextRequest, NextResponse } from "next/server";
import { AuthError, verifyAdminRequest } from "@/lib/auth-server";
import { deleteDocument, getDocument, updateDocument } from "@/lib/firebase-rest";
import {
  isValidDocId,
  MediaItemRecord,
  validateMediaPayload,
} from "@/lib/portfolio-types";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminRequest(req);
    const { id } = await context.params;
    if (!isValidDocId(id)) {
      return NextResponse.json({ error: "Invalid media ID." }, { status: 400 });
    }

    const existing = await getDocument<MediaItemRecord>("media", id);
    if (!existing) {
      return NextResponse.json({ error: "Media item not found." }, { status: 404 });
    }

    const raw = (await req.json()) as Record<string, unknown>;
    const validation = validateMediaPayload(raw);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    await updateDocument("media", id, validation.data, admin.token);
    const updated = await getDocument<MediaItemRecord>("media", id);
    return NextResponse.json({ media: updated }, { status: 200 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("PATCH /api/media/[id] error:", error);
    return NextResponse.json({ error: "Failed to update media item." }, { status: 500 });
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
      return NextResponse.json({ error: "Invalid media ID." }, { status: 400 });
    }

    await deleteDocument("media", id, admin.token);
    return NextResponse.json({ deleted: true, id }, { status: 200 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("DELETE /api/media/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete media item." }, { status: 500 });
  }
}
