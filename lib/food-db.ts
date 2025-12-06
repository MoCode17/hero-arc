import type { FoodItem } from "@/types";

// Basic food database for MVP
// This will be expanded with USDA FoodData Central API integration
export const COMMON_FOODS: FoodItem[] = [
  {
    id: "1",
    name: "Chicken Breast (grilled)",
    serving_size: 100,
    serving_unit: "g",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
  },
  {
    id: "2",
    name: "Brown Rice (cooked)",
    serving_size: 1,
    serving_unit: "cup",
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 1.8,
  },
  {
    id: "3",
    name: "Banana",
    serving_size: 1,
    serving_unit: "medium",
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
  },
  {
    id: "4",
    name: "Egg (large, whole)",
    serving_size: 1,
    serving_unit: "egg",
    calories: 72,
    protein: 6,
    carbs: 0.4,
    fat: 5,
  },
  {
    id: "5",
    name: "Oatmeal (cooked)",
    serving_size: 1,
    serving_unit: "cup",
    calories: 158,
    protein: 6,
    carbs: 27,
    fat: 3,
  },
  {
    id: "6",
    name: "Greek Yogurt (plain, non-fat)",
    serving_size: 170,
    serving_unit: "g",
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0.7,
  },
  {
    id: "7",
    name: "Salmon (baked)",
    serving_size: 100,
    serving_unit: "g",
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
  },
  {
    id: "8",
    name: "Broccoli (steamed)",
    serving_size: 1,
    serving_unit: "cup",
    calories: 55,
    protein: 4,
    carbs: 11,
    fat: 0.6,
  },
  {
    id: "9",
    name: "Apple",
    serving_size: 1,
    serving_unit: "medium",
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
  },
  {
    id: "10",
    name: "Almonds",
    serving_size: 28,
    serving_unit: "g",
    calories: 164,
    protein: 6,
    carbs: 6,
    fat: 14,
  },
  {
    id: "11",
    name: "Whole Wheat Bread",
    serving_size: 1,
    serving_unit: "slice",
    calories: 81,
    protein: 4,
    carbs: 14,
    fat: 1,
  },
  {
    id: "12",
    name: "Avocado",
    serving_size: 0.5,
    serving_unit: "fruit",
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
  },
  {
    id: "13",
    name: "Sweet Potato (baked)",
    serving_size: 1,
    serving_unit: "medium",
    calories: 103,
    protein: 2,
    carbs: 24,
    fat: 0.1,
  },
  {
    id: "14",
    name: "Cottage Cheese (low-fat)",
    serving_size: 1,
    serving_unit: "cup",
    calories: 163,
    protein: 28,
    carbs: 6,
    fat: 2.3,
  },
  {
    id: "15",
    name: "Spinach (raw)",
    serving_size: 1,
    serving_unit: "cup",
    calories: 7,
    protein: 0.9,
    carbs: 1,
    fat: 0.1,
  },
];

/**
 * Search foods by name
 */
export function searchFoods(query: string): FoodItem[] {
  const lowerQuery = query.toLowerCase();
  return COMMON_FOODS.filter((food) =>
    food.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get food by ID
 */
export function getFoodById(id: string): FoodItem | undefined {
  return COMMON_FOODS.find((food) => food.id === id);
}

/**
 * Calculate nutrition for a quantity
 */
export function calculateNutrition(
  food: FoodItem,
  quantity: number
): Omit<FoodItem, "id" | "name" | "brand"> {
  const multiplier = quantity / food.serving_size;
  return {
    serving_size: quantity,
    serving_unit: food.serving_unit,
    calories: Math.round(food.calories * multiplier),
    protein: Math.round(food.protein * multiplier * 10) / 10,
    carbs: Math.round(food.carbs * multiplier * 10) / 10,
    fat: Math.round(food.fat * multiplier * 10) / 10,
  };
}
