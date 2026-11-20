import { NextRequest, NextResponse } from "next/server";
import { AuthError, verifyAdminRequest } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdminRequest(req);
    return NextResponse.json(
      { authorized: true, email: admin.email },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { authorized: false, error: error.message },
        { status: error.status, headers: { "Cache-Control": "no-store" } }
      );
    }
    return NextResponse.json(
      { authorized: false, error: "Verification failed." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
