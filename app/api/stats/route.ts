import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// GET /api/stats - Get aggregated stats for the authenticated user
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
    const period = searchParams.get("period") || "week";

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "all_time":
        startDate = new Date("2020-01-01"); // Far enough back
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }

    // Get user's profile for daily goal
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("daily_calorie_goal")
      .eq("user_id", user.id)
      .single();

    const dailyGoal = profile?.daily_calorie_goal || 2000;

    // Get meals within the period
    const { data: meals, error: mealsError } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", user.id)
      .gte("logged_at", startDate.toISOString())
      .lte("logged_at", now.toISOString())
      .order("logged_at", { ascending: true });

    if (mealsError) {
      return NextResponse.json(
        { error: "Failed to fetch meals" },
        { status: 500 }
      );
    }

    // Get weight entries within the period
    const { data: weightEntries, error: weightError } = await supabase
      .from("weight_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("recorded_at", startDate.toISOString().split("T")[0])
      .lte("recorded_at", now.toISOString().split("T")[0])
      .order("recorded_at", { ascending: true });

    if (weightError) {
      return NextResponse.json(
        { error: "Failed to fetch weight entries" },
        { status: 500 }
      );
    }

    // Aggregate meals by day
    const dailySummaries: Record<
      string,
      {
        date: string;
        calories: number;
        protein_g: number;
        carbs_g: number;
        fat_g: number;
        meals_count: number;
      }
    > = {};

    meals?.forEach((meal) => {
      const date = meal.logged_at.split("T")[0];
      if (!dailySummaries[date]) {
        dailySummaries[date] = {
          date,
          calories: 0,
          protein_g: 0,
          carbs_g: 0,
          fat_g: 0,
          meals_count: 0,
        };
      }
      dailySummaries[date].calories += meal.calories || 0;
      dailySummaries[date].protein_g += meal.protein_g || 0;
      dailySummaries[date].carbs_g += meal.carbs_g || 0;
      dailySummaries[date].fat_g += meal.fat_g || 0;
      dailySummaries[date].meals_count += 1;
    });

    const summaries = Object.values(dailySummaries);

    // Calculate statistics
    const totalDays = summaries.length || 1;
    const totalCalories = summaries.reduce((sum, d) => sum + d.calories, 0);
    const totalProtein = summaries.reduce((sum, d) => sum + d.protein_g, 0);
    const totalCarbs = summaries.reduce((sum, d) => sum + d.carbs_g, 0);
    const totalFat = summaries.reduce((sum, d) => sum + d.fat_g, 0);
    const daysOnTarget = summaries.filter(
      (d) => d.calories <= dailyGoal
    ).length;

    // Calculate streak (consecutive days with logged meals ending today)
    let currentStreak = 0;
    const today = now.toISOString().split("T")[0];
    const sortedDates = Object.keys(dailySummaries).sort().reverse();

    for (let i = 0; i < sortedDates.length; i++) {
      const date = sortedDates[i];
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      const expected = expectedDate.toISOString().split("T")[0];

      if (date === expected) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate weight change
    let weightChange = 0;
    if (weightEntries && weightEntries.length >= 2) {
      const firstWeight = weightEntries[0].weight_kg;
      const lastWeight = weightEntries[weightEntries.length - 1].weight_kg;
      weightChange = lastWeight - firstWeight;
    }

    return NextResponse.json({
      period,
      start_date: startDate.toISOString().split("T")[0],
      end_date: now.toISOString().split("T")[0],
      stats: {
        average_daily_calories: Math.round(totalCalories / totalDays),
        average_daily_protein: Math.round(totalProtein / totalDays),
        average_daily_carbs: Math.round(totalCarbs / totalDays),
        average_daily_fat: Math.round(totalFat / totalDays),
        total_meals_logged: meals?.length || 0,
        days_on_target: daysOnTarget,
        total_days_tracked: totalDays,
        adherence_rate: Math.round((daysOnTarget / totalDays) * 100),
        current_streak: currentStreak,
        weight_change_kg: Math.round(weightChange * 10) / 10,
        daily_calorie_goal: dailyGoal,
      },
      daily_summaries: summaries,
      weight_entries: weightEntries || [],
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
