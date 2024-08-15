// src/app/recipe.model.ts

export interface Meal {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    // Agrega más propiedades si es necesario
  }
  
  export interface RecipeResponse {
    meals: Meal[];
  }
  