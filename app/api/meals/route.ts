import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// GET /api/meals - Get all meals for the authenticated user
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date"); // Format: YYYY-MM-DD
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build query
    let query = supabase
      .from("meals")
      .select("*")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by date if provided
    if (date) {
      const startOfDay = `${date}T00:00:00.000Z`;
      const endOfDay = `${date}T23:59:59.999Z`;
      query = query.gte("logged_at", startOfDay).lte("logged_at", endOfDay);
    }

    const { data: meals, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch meals" },
        { status: 500 }
      );
    }

    // Calculate totals for the day if date is provided
    let totals = null;
    if (date && meals) {
      totals = {
        calories: meals.reduce((sum, meal) => sum + (meal.calories || 0), 0),
        protein_g: meals.reduce((sum, meal) => sum + (meal.protein_g || 0), 0),
        carbs_g: meals.reduce((sum, meal) => sum + (meal.carbs_g || 0), 0),
        fat_g: meals.reduce((sum, meal) => sum + (meal.fat_g || 0), 0),
      };
    }

    return NextResponse.json({
      meals,
      totals,
      pagination: {
        limit,
        offset,
        count: meals?.length || 0,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/meals - Create a new meal
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    const { food_name, quantity, quantity_unit, calories } = body;

    if (!food_name || !quantity || !quantity_unit || calories === undefined) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: food_name, quantity, quantity_unit, calories",
        },
        { status: 400 }
      );
    }

    // Create the meal
    const { data: meal, error } = await supabase
      .from("meals")
      .insert({
        user_id: user.id,
        food_name,
        quantity,
        quantity_unit,
        calories,
        protein_g: body.protein_g || null,
        carbs_g: body.carbs_g || null,
        fat_g: body.fat_g || null,
        meal_type: body.meal_type || null,
        logged_at: body.logged_at || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create meal" },
        { status: 500 }
      );
    }

    return NextResponse.json({ meal }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
