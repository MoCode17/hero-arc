import { NextResponse } from "next/server";

// GET /api/meals/[id] - Get a specific meal
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // TODO: Implement with Supabase
  return NextResponse.json({ id, message: "API not yet implemented" });
}

// PATCH /api/meals/[id] - Update a meal
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  // TODO: Implement with Supabase
  return NextResponse.json({ id, ...body, message: "API not yet implemented" });
}

// DELETE /api/meals/[id] - Delete a meal
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // TODO: Implement with Supabase
  return NextResponse.json({ id, deleted: true, message: "API not yet implemented" });
}
