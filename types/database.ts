// Database types generated from Supabase schema
// These types should match your Supabase database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          gender: "male" | "female" | "other";
          age: number;
          height_cm: number;
          weight_kg: number;
          goal_weight_kg: number;
          activity_level:
            | "sedentary"
            | "light"
            | "moderate"
            | "active"
            | "very_active";
          primary_goal: "lose" | "maintain" | "gain";
          daily_calorie_goal: number;
          bmr: number | null;
          tdee: number | null;
          unit_preference: "metric" | "imperial";
          daily_water_goal_cups: number;
          macro_carbs_pct: number;
          macro_protein_pct: number;
          macro_fat_pct: number;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          gender: "male" | "female" | "other";
          age: number;
          height_cm: number;
          weight_kg: number;
          goal_weight_kg: number;
          activity_level:
            | "sedentary"
            | "light"
            | "moderate"
            | "active"
            | "very_active";
          primary_goal: "lose" | "maintain" | "gain";
          daily_calorie_goal: number;
          bmr?: number | null;
          tdee?: number | null;
          unit_preference?: "metric" | "imperial";
          daily_water_goal_cups?: number;
          macro_carbs_pct?: number;
          macro_protein_pct?: number;
          macro_fat_pct?: number;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          gender?: "male" | "female" | "other";
          age?: number;
          height_cm?: number;
          weight_kg?: number;
          goal_weight_kg?: number;
          activity_level?:
            | "sedentary"
            | "light"
            | "moderate"
            | "active"
            | "very_active";
          primary_goal?: "lose" | "maintain" | "gain";
          daily_calorie_goal?: number;
          bmr?: number | null;
          tdee?: number | null;
          unit_preference?: "metric" | "imperial";
          daily_water_goal_cups?: number;
          macro_carbs_pct?: number;
          macro_protein_pct?: number;
          macro_fat_pct?: number;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      meals: {
        Row: {
          id: string;
          user_id: string;
          food_name: string;
          quantity: number;
          quantity_unit: string;
          calories: number;
          protein_g: number | null;
          carbs_g: number | null;
          fat_g: number | null;
          meal_type: "breakfast" | "lunch" | "dinner" | "snack" | null;
          logged_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          food_name: string;
          quantity: number;
          quantity_unit: string;
          calories: number;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          meal_type?: "breakfast" | "lunch" | "dinner" | "snack" | null;
          logged_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          food_name?: string;
          quantity?: number;
          quantity_unit?: string;
          calories?: number;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          meal_type?: "breakfast" | "lunch" | "dinner" | "snack" | null;
          logged_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meals_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      weight_entries: {
        Row: {
          id: string;
          user_id: string;
          weight_kg: number;
          recorded_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          weight_kg: number;
          recorded_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          weight_kg?: number;
          recorded_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "weight_entries_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      water_logs: {
        Row: {
          id: string;
          user_id: string;
          amount_cups: number;
          logged_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount_cups?: number;
          logged_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount_cups?: number;
          logged_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "water_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      foods: {
        Row: {
          id: string;
          food_name: string;
          brand: string | null;
          serving_size_g: number | null;
          calories_per_serving: number | null;
          protein_g: number | null;
          carbs_g: number | null;
          fat_g: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          food_name: string;
          brand?: string | null;
          serving_size_g?: number | null;
          calories_per_serving?: number | null;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          food_name?: string;
          brand?: string | null;
          serving_size_g?: number | null;
          calories_per_serving?: number | null;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      activity_level_enum:
        | "sedentary"
        | "light"
        | "moderate"
        | "active"
        | "very_active";
      gender_enum: "male" | "female" | "other";
      goal_enum: "lose" | "maintain" | "gain";
      meal_type_enum: "breakfast" | "lunch" | "dinner" | "snack";
      unit_preference_enum: "metric" | "imperial";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Helper types for easier access
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
