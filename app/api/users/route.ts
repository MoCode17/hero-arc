import { NextResponse } from "next/server";

// GET /api/users - Get the authenticated user's profile
export async function GET() {
  // TODO: Implement with Supabase
  return NextResponse.json({ user: null, message: "API not yet implemented" });
}

// PATCH /api/users - Update the authenticated user's profile
export async function PATCH(request: Request) {
  const body = await request.json();
  // TODO: Implement with Supabase
  return NextResponse.json({ user: body, message: "API not yet implemented" });
}
