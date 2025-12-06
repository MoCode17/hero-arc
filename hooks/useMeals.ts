"use client";

import { useState, useCallback } from "react";
import type { Meal, MealInput } from "@/types";

interface UseMealsReturn {
  meals: Meal[];
  isLoading: boolean;
  error: string | null;
  fetchMeals: (date?: string) => Promise<void>;
  addMeal: (meal: MealInput) => Promise<{ error?: string }>;
  updateMeal: (id: string, meal: Partial<MealInput>) => Promise<{ error?: string }>;
  deleteMeal: (id: string) => Promise<{ error?: string }>;
}

// Placeholder hook - will be implemented with Supabase
export function useMeals(): UseMealsReturn {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = useCallback(async (date?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    // TODO: Implement with Supabase
    console.log("Fetch meals for date:", date);
    setMeals([]);
    setIsLoading(false);
  }, []);

  const addMeal = useCallback(
    async (meal: MealInput): Promise<{ error?: string }> => {
      setIsLoading(true);
      // TODO: Implement with Supabase
      console.log("Add meal:", meal);
      setIsLoading(false);
      return {};
    },
    []
  );

  const updateMeal = useCallback(
    async (id: string, meal: Partial<MealInput>): Promise<{ error?: string }> => {
      setIsLoading(true);
      // TODO: Implement with Supabase
      console.log("Update meal:", id, meal);
      setIsLoading(false);
      return {};
    },
    []
  );

  const deleteMeal = useCallback(
    async (id: string): Promise<{ error?: string }> => {
      setIsLoading(true);
      // TODO: Implement with Supabase
      console.log("Delete meal:", id);
      setMeals((prev) => prev.filter((m) => m.id !== id));
      setIsLoading(false);
      return {};
    },
    []
  );

  return {
    meals,
    isLoading,
    error,
    fetchMeals,
    addMeal,
    updateMeal,
    deleteMeal,
  };
}
