-- CalorieTracker Database Schema
-- Version: 1.0.0
-- This migration creates all tables, indexes, and RLS policies for the CalorieTracker app

-- =============================================================================
-- EXTENSIONS
-- =============================================================================

-- Enable UUID generation (should already be enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- CUSTOM TYPES (ENUMS)
-- =============================================================================

-- Gender enum
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');

-- Activity level enum
CREATE TYPE activity_level_enum AS ENUM ('sedentary', 'light', 'moderate', 'active', 'very_active');

-- Primary goal enum
CREATE TYPE goal_enum AS ENUM ('lose', 'maintain', 'gain');

-- Meal type enum
CREATE TYPE meal_type_enum AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');

-- Unit preference enum
CREATE TYPE unit_preference_enum AS ENUM ('metric', 'imperial');

-- =============================================================================
-- TABLES
-- =============================================================================

-- User Profiles Table
-- Stores user onboarding data and preferences (linked to auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Onboarding data
  gender gender_enum NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 120),
  height_cm INTEGER NOT NULL CHECK (height_cm > 0),
  weight_kg DECIMAL(5, 2) NOT NULL CHECK (weight_kg > 0),
  goal_weight_kg DECIMAL(5, 2) NOT NULL CHECK (goal_weight_kg > 0),
  activity_level activity_level_enum NOT NULL,
  primary_goal goal_enum NOT NULL,
  daily_calorie_goal INTEGER NOT NULL CHECK (daily_calorie_goal > 0),

  -- Calculated fields
  bmr INTEGER,
  tdee INTEGER,

  -- Settings
  unit_preference unit_preference_enum DEFAULT 'metric',
  daily_water_goal_cups INTEGER DEFAULT 8 CHECK (daily_water_goal_cups > 0),
  macro_carbs_pct INTEGER DEFAULT 40 CHECK (macro_carbs_pct >= 0 AND macro_carbs_pct <= 100),
  macro_protein_pct INTEGER DEFAULT 30 CHECK (macro_protein_pct >= 0 AND macro_protein_pct <= 100),
  macro_fat_pct INTEGER DEFAULT 30 CHECK (macro_fat_pct >= 0 AND macro_fat_pct <= 100),

  -- Status
  onboarding_completed BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one profile per user
  CONSTRAINT unique_user_profile UNIQUE (user_id),
  -- Ensure macro percentages sum to 100
  CONSTRAINT macro_percentages_sum CHECK (macro_carbs_pct + macro_protein_pct + macro_fat_pct = 100)
);

-- Meals Table
-- Stores all logged meals for users
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Meal data
  food_name TEXT NOT NULL,
  quantity DECIMAL(8, 2) NOT NULL CHECK (quantity > 0),
  quantity_unit TEXT NOT NULL,
  calories INTEGER NOT NULL CHECK (calories >= 0),

  -- Macros (in grams)
  protein_g DECIMAL(5, 1) CHECK (protein_g >= 0),
  carbs_g DECIMAL(5, 1) CHECK (carbs_g >= 0),
  fat_g DECIMAL(5, 1) CHECK (fat_g >= 0),

  -- Meal type (optional categorization)
  meal_type meal_type_enum,

  -- When the meal was eaten (can be different from when it was logged)
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weight Entries Table
-- Stores weight tracking history
CREATE TABLE weight_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  weight_kg DECIMAL(5, 2) NOT NULL CHECK (weight_kg > 0),
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Only one weight entry per user per day
  CONSTRAINT unique_daily_weight UNIQUE (user_id, recorded_at)
);

-- Water Logs Table
-- Stores daily water intake
CREATE TABLE water_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  amount_cups INTEGER DEFAULT 1 CHECK (amount_cups > 0),
  logged_at DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Foods Table (Reference Database)
-- Stores common foods for quick lookup
CREATE TABLE foods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  food_name TEXT NOT NULL,
  brand TEXT,
  serving_size_g DECIMAL(8, 2),
  calories_per_serving INTEGER CHECK (calories_per_serving >= 0),
  protein_g DECIMAL(5, 1) CHECK (protein_g >= 0),
  carbs_g DECIMAL(5, 1) CHECK (carbs_g >= 0),
  fat_g DECIMAL(5, 1) CHECK (fat_g >= 0),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique food entries
  CONSTRAINT unique_food_entry UNIQUE (food_name, brand, serving_size_g)
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- User profiles index
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Meals indexes for common queries
CREATE INDEX idx_meals_user_id ON meals(user_id);
CREATE INDEX idx_meals_logged_at ON meals(logged_at);
CREATE INDEX idx_meals_user_date ON meals(user_id, logged_at);

-- Weight entries indexes
CREATE INDEX idx_weight_entries_user_id ON weight_entries(user_id);
CREATE INDEX idx_weight_entries_recorded_at ON weight_entries(recorded_at);
CREATE INDEX idx_weight_entries_user_date ON weight_entries(user_id, recorded_at);

-- Water logs indexes
CREATE INDEX idx_water_logs_user_id ON water_logs(user_id);
CREATE INDEX idx_water_logs_logged_at ON water_logs(logged_at);

-- Foods full-text search index
CREATE INDEX idx_foods_name ON foods USING gin(to_tsvector('english', food_name));

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meals_updated_at
  BEFORE UPDATE ON meals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weight_entries_updated_at
  BEFORE UPDATE ON weight_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all user-related tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
-- Users can only view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON user_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Meals Policies
-- Users can view their own meals
CREATE POLICY "Users can view own meals"
  ON meals FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own meals
CREATE POLICY "Users can insert own meals"
  ON meals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own meals
CREATE POLICY "Users can update own meals"
  ON meals FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own meals
CREATE POLICY "Users can delete own meals"
  ON meals FOR DELETE
  USING (auth.uid() = user_id);

-- Weight Entries Policies
-- Users can view their own weight entries
CREATE POLICY "Users can view own weight entries"
  ON weight_entries FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own weight entries
CREATE POLICY "Users can insert own weight entries"
  ON weight_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own weight entries
CREATE POLICY "Users can update own weight entries"
  ON weight_entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own weight entries
CREATE POLICY "Users can delete own weight entries"
  ON weight_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Water Logs Policies
-- Users can view their own water logs
CREATE POLICY "Users can view own water logs"
  ON water_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own water logs
CREATE POLICY "Users can insert own water logs"
  ON water_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own water logs
CREATE POLICY "Users can delete own water logs"
  ON water_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Foods Policies (public read, admin write)
-- Everyone can view the food database
CREATE POLICY "Anyone can view foods"
  ON foods FOR SELECT
  USING (true);

-- =============================================================================
-- SEED DATA (Optional - Common Foods)
-- =============================================================================

-- Insert some common foods for the database
INSERT INTO foods (food_name, brand, serving_size_g, calories_per_serving, protein_g, carbs_g, fat_g) VALUES
  ('Chicken Breast (Grilled)', NULL, 100, 165, 31, 0, 3.6),
  ('Brown Rice (Cooked)', NULL, 100, 112, 2.6, 23.5, 0.9),
  ('Broccoli (Steamed)', NULL, 100, 35, 2.4, 7.2, 0.4),
  ('Salmon (Baked)', NULL, 100, 208, 20, 0, 13),
  ('Sweet Potato (Baked)', NULL, 100, 90, 2, 21, 0.1),
  ('Egg (Large, Whole)', NULL, 50, 72, 6.3, 0.4, 5),
  ('Greek Yogurt (Plain, Non-fat)', NULL, 100, 59, 10, 3.6, 0.7),
  ('Banana (Medium)', NULL, 118, 105, 1.3, 27, 0.4),
  ('Apple (Medium)', NULL, 182, 95, 0.5, 25, 0.3),
  ('Oatmeal (Cooked)', NULL, 100, 68, 2.4, 12, 1.4),
  ('Almonds (Raw)', NULL, 28, 164, 6, 6, 14),
  ('Avocado (Medium)', NULL, 150, 240, 3, 12, 22),
  ('Spinach (Raw)', NULL, 100, 23, 2.9, 3.6, 0.4),
  ('Cottage Cheese (Low-fat)', NULL, 100, 72, 12, 2.7, 1),
  ('Turkey Breast (Roasted)', NULL, 100, 135, 30, 0, 0.7),
  ('Quinoa (Cooked)', NULL, 100, 120, 4.4, 21.3, 1.9),
  ('Tuna (Canned in Water)', NULL, 100, 116, 25.5, 0, 0.8),
  ('Peanut Butter', NULL, 32, 188, 7, 6, 16),
  ('Whole Wheat Bread', NULL, 30, 81, 4, 13.8, 1.1),
  ('Milk (Skim)', NULL, 245, 83, 8.3, 12.2, 0.2);

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE user_profiles IS 'Stores user profile and onboarding data';
COMMENT ON TABLE meals IS 'Stores all logged meals for users';
COMMENT ON TABLE weight_entries IS 'Stores weight tracking history';
COMMENT ON TABLE water_logs IS 'Stores daily water intake logs';
COMMENT ON TABLE foods IS 'Reference database of common foods for quick lookup';
