import { NextResponse } from "next/server";
import { getPortfolioSnapshot } from "@/lib/portfolio-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getPortfolioSnapshot();
    return NextResponse.json(snapshot, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to fetch portfolio snapshot:", error);
    return NextResponse.json(
      { error: "Unable to load portfolio data." },
      { status: 500 }
    );
  }
}
