import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// GET /api/water - Get water logs for the authenticated user
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
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Get water logs for the specified date
    const { data: logs, error } = await supabase
      .from("water_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("logged_at", date)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch water logs" },
        { status: 500 }
      );
    }

    // Calculate total cups for the day
    const totalCups = logs?.reduce((sum, log) => sum + (log.amount_cups || 1), 0) || 0;

    // Get user's daily water goal
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("daily_water_goal_cups")
      .eq("user_id", user.id)
      .single();

    const dailyGoal = profile?.daily_water_goal_cups || 8;

    return NextResponse.json({
      date,
      logs: logs || [],
      total_cups: totalCups,
      daily_goal: dailyGoal,
      remaining: Math.max(0, dailyGoal - totalCups),
      percentage: Math.min(100, Math.round((totalCups / dailyGoal) * 100)),
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/water - Log water intake
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
    const amount_cups = body.amount_cups || 1;
    const logged_at = body.logged_at || new Date().toISOString().split("T")[0];

    // Create the water log
    const { data: log, error } = await supabase
      .from("water_logs")
      .insert({
        user_id: user.id,
        amount_cups,
        logged_at,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to log water intake" },
        { status: 500 }
      );
    }

    // Get updated total for the day
    const { data: logs } = await supabase
      .from("water_logs")
      .select("amount_cups")
      .eq("user_id", user.id)
      .eq("logged_at", logged_at);

    const totalCups = logs?.reduce((sum, l) => sum + (l.amount_cups || 1), 0) || 0;

    return NextResponse.json(
      {
        log,
        total_cups: totalCups,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/water?id=uuid - Remove a water log entry
export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Water log ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("water_logs")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete water log" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Water log deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
