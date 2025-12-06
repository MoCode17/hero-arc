import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // This will handle the Supabase auth callback
  // Implementation will be added when Supabase is configured
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    // Exchange code for session
    // Redirect to dashboard or onboarding
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
