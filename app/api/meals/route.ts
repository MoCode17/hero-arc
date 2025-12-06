import { NextResponse } from "next/server";

// GET /api/meals - Get all meals for the authenticated user
export async function GET() {
  // TODO: Implement with Supabase
  return NextResponse.json({ meals: [], message: "API not yet implemented" });
}

// POST /api/meals - Create a new meal
export async function POST(request: Request) {
  const body = await request.json();
  // TODO: Implement with Supabase
  return NextResponse.json({ meal: body, message: "API not yet implemented" });
}
