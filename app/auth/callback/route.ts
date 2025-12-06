import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// GET /auth/callback - Handle OAuth and email verification callbacks
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = await createClient();

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user has completed onboarding
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("onboarding_completed")
          .eq("user_id", user.id)
          .single();

        // Redirect to onboarding if not completed
        if (!profile || !profile.onboarding_completed) {
          return NextResponse.redirect(
            new URL("/onboarding", requestUrl.origin)
          );
        }
      }

      // Redirect to the intended destination
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // If there's an error or no code, redirect to login with error
  return NextResponse.redirect(
    new URL("/auth/login?error=callback_failed", requestUrl.origin)
  );
}
