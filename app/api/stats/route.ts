import { NextResponse } from "next/server";

// GET /api/stats - Get aggregated stats for the authenticated user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "week";

  // TODO: Implement with Supabase
  return NextResponse.json({
    period,
    stats: null,
    message: "API not yet implemented",
  });
}
