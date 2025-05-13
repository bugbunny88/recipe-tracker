import React, { createContext, useState, useEffect, useContext } from 'react';
import { Recipe } from '../utils/types';
import { mockRecipes } from '../utils/mockData';
import { v4 as uuidv4 } from 'uuid';

interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => Recipe;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => Recipe | undefined;
  deleteRecipe: (id: string) => void;
  getRecipeById: (id: string) => Recipe | undefined;
  toggleFavorite: (id: string) => void;
  favoriteRecipes: Recipe[];
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    // In a real app, you would fetch recipes from an API
    setRecipes(mockRecipes);
  }, []);

  useEffect(() => {
    // Update favorite recipes whenever recipes change
    setFavoriteRecipes(recipes.filter(recipe => recipe.isFavorite));
  }, [recipes]);

  const addRecipe = (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecipe: Recipe = {
      ...recipeData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setRecipes(prevRecipes => [...prevRecipes, newRecipe]);
    return newRecipe;
  };

  const updateRecipe = (id: string, recipeData: Partial<Recipe>) => {
    let updatedRecipe: Recipe | undefined;
    
    setRecipes(prevRecipes => 
      prevRecipes.map(recipe => {
        if (recipe.id === id) {
          updatedRecipe = {
            ...recipe,
            ...recipeData,
            updatedAt: new Date().toISOString(),
          };
          return updatedRecipe;
        }
        return recipe;
      })
    );
    
    return updatedRecipe;
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
  };

  const getRecipeById = (id: string) => {
    return recipes.find(recipe => recipe.id === id);
  };

  const toggleFavorite = (id: string) => {
    setRecipes(prevRecipes => 
      prevRecipes.map(recipe => {
        if (recipe.id === id) {
          return { ...recipe, isFavorite: !recipe.isFavorite };
        }
        return recipe;
      })
    );
  };

  return (
    <RecipeContext.Provider 
      value={{ 
        recipes, 
        addRecipe, 
        updateRecipe, 
        deleteRecipe, 
        getRecipeById, 
        toggleFavorite,
        favoriteRecipes 
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};