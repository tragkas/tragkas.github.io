import { NextRequest, NextResponse } from "next/server";
import { AuthError, verifyAdminRequest } from "@/lib/auth-server";
import { deleteDocument, getDocument, updateDocument } from "@/lib/firebase-rest";
import {
  isValidDocId,
  PortfolioLinkRecord,
  validateLinkPayload,
} from "@/lib/portfolio-types";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminRequest(req);
    const { id } = await context.params;
    if (!isValidDocId(id)) {
      return NextResponse.json({ error: "Invalid link ID." }, { status: 400 });
    }

    const existing = await getDocument<PortfolioLinkRecord>("links", id);
    if (!existing) {
      return NextResponse.json({ error: "Link not found." }, { status: 404 });
    }

    const raw = (await req.json()) as Record<string, unknown>;
    const validation = validateLinkPayload(raw);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    await updateDocument("links", id, validation.data, admin.token);
    const updated = await getDocument<PortfolioLinkRecord>("links", id);
    return NextResponse.json({ link: updated }, { status: 200 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("PATCH /api/links/[id] error:", error);
    return NextResponse.json({ error: "Failed to update link." }, { status: 500 });
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
      return NextResponse.json({ error: "Invalid link ID." }, { status: 400 });
    }

    await deleteDocument("links", id, admin.token);
    return NextResponse.json({ deleted: true, id }, { status: 200 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("DELETE /api/links/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete link." }, { status: 500 });
  }
}
