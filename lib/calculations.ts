import {
  type ActivityLevel,
  type Goal,
  type OnboardingData,
  type CalculationResult,
  ACTIVITY_MULTIPLIERS,
  GOAL_CALORIE_ADJUSTMENTS,
  BMI_CATEGORIES,
} from "@/types";

/**
 * Calculate BMR using Mifflin-St Jeor Formula
 * Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
 * Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: "male" | "female" | "other"
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;

  // For "other" gender, use average of male and female formulas
  if (gender === "male") {
    return Math.round(base + 5);
  } else if (gender === "female") {
    return Math.round(base - 161);
  } else {
    // Average of male and female
    return Math.round(base - 78);
  }
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * TDEE = BMR × Activity Multiplier
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

/**
 * Calculate daily calorie target based on goal
 */
export function calculateDailyCalories(tdee: number, goal: Goal): number {
  return Math.max(1200, Math.round(tdee + GOAL_CALORIE_ADJUSTMENTS[goal]));
}

/**
 * Calculate BMI
 * BMI = weight (kg) / height (m)²
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * Get BMI category based on BMI value
 */
export function getBMICategory(bmi: number): string {
  if (bmi < BMI_CATEGORIES.underweight.max) return BMI_CATEGORIES.underweight.label;
  if (bmi < BMI_CATEGORIES.normal.max) return BMI_CATEGORIES.normal.label;
  if (bmi < BMI_CATEGORIES.overweight.max) return BMI_CATEGORIES.overweight.label;
  return BMI_CATEGORIES.obese.label;
}

/**
 * Calculate estimated weeks to reach goal weight
 * Assumes 0.5-1 kg per week for weight loss, 0.25-0.5 kg per week for muscle gain
 */
export function calculateWeeksToGoal(
  currentWeightKg: number,
  goalWeightKg: number,
  goal: Goal
): number {
  const weightDiff = Math.abs(currentWeightKg - goalWeightKg);

  if (weightDiff < 0.5) return 0; // Already at goal

  let weeklyChange: number;
  switch (goal) {
    case "lose_weight":
      weeklyChange = 0.5; // ~1 lb per week (500 cal deficit)
      break;
    case "gain_muscle":
      weeklyChange = 0.25; // Slower for muscle gain
      break;
    default:
      return 0;
  }

  return Math.ceil(weightDiff / weeklyChange);
}

/**
 * Calculate macro targets based on daily calories
 * Default split: 30% protein, 40% carbs, 30% fat
 */
export function calculateMacros(dailyCalories: number): {
  protein: number;
  carbs: number;
  fat: number;
} {
  // Calories per gram: protein=4, carbs=4, fat=9
  const proteinCalories = dailyCalories * 0.3;
  const carbsCalories = dailyCalories * 0.4;
  const fatCalories = dailyCalories * 0.3;

  return {
    protein: Math.round(proteinCalories / 4),
    carbs: Math.round(carbsCalories / 4),
    fat: Math.round(fatCalories / 9),
  };
}

/**
 * Calculate all nutritional targets from onboarding data
 */
export function calculateAllTargets(data: OnboardingData): CalculationResult {
  const bmr = calculateBMR(data.weight_kg, data.height_cm, data.age, data.gender);
  const tdee = calculateTDEE(bmr, data.activity_level);
  const dailyCalories = calculateDailyCalories(tdee, data.goal);
  const macros = calculateMacros(dailyCalories);
  const bmi = calculateBMI(data.weight_kg, data.height_cm);
  const bmiCategory = getBMICategory(bmi);
  const weeksToGoal = calculateWeeksToGoal(
    data.weight_kg,
    data.goal_weight_kg,
    data.goal
  );

  return {
    bmr,
    tdee,
    daily_calories: dailyCalories,
    daily_protein: macros.protein,
    daily_carbs: macros.carbs,
    daily_fat: macros.fat,
    bmi,
    bmi_category: bmiCategory,
    weeks_to_goal: weeksToGoal,
  };
}

/**
 * Get supportive message based on BMI category
 */
export function getBMIMessage(bmiCategory: string): string {
  switch (bmiCategory) {
    case "Underweight":
      return "Your BMI indicates you're underweight. Focus on nutrient-dense foods to reach a healthy weight.";
    case "Normal weight":
      return "Great! Your BMI is in the healthy range. Keep up the good work!";
    case "Overweight":
      return "Your BMI indicates you're slightly overweight. With consistent tracking, you can reach your goals!";
    case "Obese":
      return "Your BMI indicates obesity. Small, consistent changes can make a big difference. We're here to help!";
    default:
      return "Let's work together to achieve your health goals!";
  }
}

/**
 * Calculate remaining calories for the day
 */
export function calculateRemainingCalories(
  target: number,
  consumed: number
): { remaining: number; isOver: boolean; percentage: number } {
  const remaining = target - consumed;
  const isOver = remaining < 0;
  const percentage = Math.min(100, Math.round((consumed / target) * 100));

  return { remaining, isOver, percentage };
}

/**
 * Calculate macro percentage of daily target
 */
export function calculateMacroPercentage(
  consumed: number,
  target: number
): number {
  if (target === 0) return 0;
  return Math.min(100, Math.round((consumed / target) * 100));
}

/**
 * Get calorie status message based on remaining calories
 */
export function getCalorieStatusMessage(
  remaining: number,
  isOver: boolean
): string {
  if (isOver) {
    return `You're ${Math.abs(remaining)} kcal over your target`;
  } else if (remaining < 100) {
    return "Almost there! Just a few calories left";
  } else if (remaining < 500) {
    return `${remaining} kcal remaining - you're doing great!`;
  } else {
    return `${remaining} kcal to enjoy today`;
  }
}
