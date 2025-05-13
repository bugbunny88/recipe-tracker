export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: Ingredient[];
  instructions: string[];
  cuisine: string;
  dietaryTags: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  nutrition: Nutrition;
  isFavorite: boolean;
  affiliateLinks?: AffiliateLink[];
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  notes?: string;
  substitutes?: string[];
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar?: number;
  fiber?: number;
  sodium?: number;
}

export interface AffiliateLink {
  id: string;
  title: string;
  url: string;
  description?: string;
}