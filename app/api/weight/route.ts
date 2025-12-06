import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// GET /api/weight - Get weight entries for the authenticated user
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
    const range = searchParams.get("range") || "month";
    const limit = parseInt(searchParams.get("limit") || "30");

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (range) {
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
        startDate = new Date("2020-01-01");
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    }

    // Get weight entries
    const { data: entries, error } = await supabase
      .from("weight_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("recorded_at", startDate.toISOString().split("T")[0])
      .order("recorded_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch weight entries" },
        { status: 500 }
      );
    }

    // Calculate stats
    let stats = null;
    if (entries && entries.length > 0) {
      const sortedEntries = [...entries].sort(
        (a, b) =>
          new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
      );
      const firstEntry = sortedEntries[0];
      const lastEntry = sortedEntries[sortedEntries.length - 1];

      const weightChange = lastEntry.weight_kg - firstEntry.weight_kg;
      const daysDiff = Math.max(
        1,
        Math.ceil(
          (new Date(lastEntry.recorded_at).getTime() -
            new Date(firstEntry.recorded_at).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );
      const weeklyChange = (weightChange / daysDiff) * 7;

      stats = {
        current_weight: lastEntry.weight_kg,
        starting_weight: firstEntry.weight_kg,
        change: Math.round(weightChange * 10) / 10,
        change_per_week: Math.round(weeklyChange * 10) / 10,
        total_entries: entries.length,
      };
    }

    return NextResponse.json({
      entries: entries || [],
      stats,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/weight - Log a new weight entry
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
    const { weight_kg, recorded_at } = body;

    // Validate required fields
    if (weight_kg === undefined || weight_kg <= 0) {
      return NextResponse.json(
        { error: "Valid weight_kg is required" },
        { status: 400 }
      );
    }

    const recordDate = recorded_at || new Date().toISOString().split("T")[0];

    // Upsert the weight entry (update if exists for this date, insert otherwise)
    const { data: existingEntry } = await supabase
      .from("weight_entries")
      .select("id")
      .eq("user_id", user.id)
      .eq("recorded_at", recordDate)
      .single();

    if (existingEntry) {
      // Update existing entry
      const { data: entry, error } = await supabase
        .from("weight_entries")
        .update({
          weight_kg,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingEntry.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Failed to update weight entry" },
          { status: 500 }
        );
      }

      return NextResponse.json({ entry });
    } else {
      // Create new entry
      const { data: entry, error } = await supabase
        .from("weight_entries")
        .insert({
          user_id: user.id,
          weight_kg,
          recorded_at: recordDate,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Failed to create weight entry" },
          { status: 500 }
        );
      }

      return NextResponse.json({ entry }, { status: 201 });
    }
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/weight?id=uuid - Delete a weight entry
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
        { error: "Weight entry ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("weight_entries")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete weight entry" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Weight entry deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
