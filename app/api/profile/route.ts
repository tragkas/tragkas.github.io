import { NextRequest, NextResponse } from "next/server";
import { AuthError, verifyAdminRequest } from "@/lib/auth-server";
import { getDocument, upsertProfileDocument } from "@/lib/firebase-rest";
import { ProfileConfigRecord, validateProfilePayload } from "@/lib/portfolio-types";
import { DEFAULT_PROFILE } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await getDocument<ProfileConfigRecord>("profile", "main");
    return NextResponse.json(
      { profile: profile ?? DEFAULT_PROFILE },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await verifyAdminRequest(req);
    const raw = (await req.json()) as Record<string, unknown>;
    const validation = validateProfilePayload(raw);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const existing = await getDocument<ProfileConfigRecord>("profile", "main");
    await upsertProfileDocument(
      {
        ...validation.data,
        ...(existing ? {} : { ownerUid: admin.uid }),
      },
      admin.token,
      Boolean(existing)
    );

    const updated = await getDocument<ProfileConfigRecord>("profile", "main");
    return NextResponse.json({ profile: updated ?? { id: "main", ...validation.data } }, { status: 200 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Failed to update profile:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
