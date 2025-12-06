// User Types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  gender: "male" | "female" | "other";
  age: number;
  height_cm: number;
  weight_kg: number;
  goal_weight_kg: number;
  activity_level: ActivityLevel;
  goal: Goal;
  daily_calorie_target: number;
  daily_protein_target: number;
  daily_carbs_target: number;
  daily_fat_target: number;
  unit_preference: "metric" | "imperial";
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type Goal = "lose_weight" | "maintain" | "gain_muscle";

// Meal Types
export interface Meal {
  id: string;
  user_id: string;
  name: string;
  meal_type: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
  logged_at: string;
  created_at: string;
  updated_at: string;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealInput {
  name: string;
  meal_type: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
  logged_at?: string;
}

// Food Database Types
export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

// Water Tracking Types
export interface WaterLog {
  id: string;
  user_id: string;
  amount_ml: number;
  logged_at: string;
  created_at: string;
}

// Weight Tracking Types
export interface WeightLog {
  id: string;
  user_id: string;
  weight_kg: number;
  logged_at: string;
  created_at: string;
}

// Daily Summary Types
export interface DailySummary {
  date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  meals_count: number;
  water_ml: number;
  weight_kg?: number;
  calorie_target: number;
  is_on_target: boolean;
}

// Statistics Types
export interface Stats {
  period: "week" | "month" | "all_time";
  start_date: string;
  end_date: string;
  average_daily_calories: number;
  average_daily_protein: number;
  average_daily_carbs: number;
  average_daily_fat: number;
  total_meals_logged: number;
  days_on_target: number;
  adherence_rate: number;
  weight_change_kg: number;
  current_streak: number;
  daily_summaries: DailySummary[];
}

// Onboarding Types
export interface OnboardingData {
  gender: "male" | "female" | "other";
  age: number;
  height_cm: number;
  weight_kg: number;
  goal_weight_kg: number;
  activity_level: ActivityLevel;
  goal: Goal;
}

// Calculation Results
export interface CalculationResult {
  bmr: number;
  tdee: number;
  daily_calories: number;
  daily_protein: number;
  daily_carbs: number;
  daily_fat: number;
  bmi: number;
  bmi_category: string;
  weeks_to_goal: number;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Auth Types
export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Activity Level Descriptions
export const ACTIVITY_LEVEL_DESCRIPTIONS: Record<ActivityLevel, string> = {
  sedentary: "Little or no exercise, desk job",
  light: "Light exercise 1-3 days/week",
  moderate: "Moderate exercise 3-5 days/week",
  active: "Hard exercise 6-7 days/week",
  very_active: "Very hard exercise, physical job",
};

// Activity Level Multipliers (for TDEE calculation)
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Goal Calorie Adjustments
export const GOAL_CALORIE_ADJUSTMENTS: Record<Goal, number> = {
  lose_weight: -500, // 1 lb per week deficit
  maintain: 0,
  gain_muscle: 300, // Moderate surplus
};

// BMI Categories
export const BMI_CATEGORIES = {
  underweight: { max: 18.5, label: "Underweight" },
  normal: { max: 24.9, label: "Normal weight" },
  overweight: { max: 29.9, label: "Overweight" },
  obese: { max: Infinity, label: "Obese" },
};
