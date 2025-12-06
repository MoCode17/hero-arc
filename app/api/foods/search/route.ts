import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// GET /api/foods/search - Search for foods in the database
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Get the authenticated user (optional for food search, but good for rate limiting)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Search foods using full-text search
    const { data: foods, error } = await supabase
      .from("foods")
      .select("*")
      .textSearch("food_name", query, {
        type: "websearch",
        config: "english",
      })
      .limit(limit);

    // If full-text search returns no results, try ILIKE as fallback
    if (!foods || foods.length === 0) {
      const { data: fallbackFoods, error: fallbackError } = await supabase
        .from("foods")
        .select("*")
        .ilike("food_name", `%${query}%`)
        .limit(limit);

      if (fallbackError) {
        return NextResponse.json(
          { error: "Failed to search foods" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        query,
        results: fallbackFoods || [],
        count: fallbackFoods?.length || 0,
      });
    }

    if (error) {
      return NextResponse.json(
        { error: "Failed to search foods" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      query,
      results: foods,
      count: foods.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
