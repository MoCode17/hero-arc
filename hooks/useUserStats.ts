"use client";

import { useState, useCallback } from "react";
import type { Stats, DailySummary } from "@/types";

interface UseUserStatsReturn {
  stats: Stats | null;
  dailySummary: DailySummary | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: (period: "week" | "month" | "all_time") => Promise<void>;
  fetchDailySummary: (date?: string) => Promise<void>;
}

// Placeholder hook - will be implemented with Supabase
export function useUserStats(): UseUserStatsReturn {
  const [stats, setStats] = useState<Stats | null>(null);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(
    async (period: "week" | "month" | "all_time"): Promise<void> => {
      setIsLoading(true);
      setError(null);
      // TODO: Implement with Supabase
      console.log("Fetch stats for period:", period);
      setStats(null);
      setIsLoading(false);
    },
    []
  );

  const fetchDailySummary = useCallback(async (date?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    // TODO: Implement with Supabase
    console.log("Fetch daily summary for date:", date);
    setDailySummary(null);
    setIsLoading(false);
  }, []);

  return {
    stats,
    dailySummary,
    isLoading,
    error,
    fetchStats,
    fetchDailySummary,
  };
}
