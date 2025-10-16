import React, { createContext, useState, useEffect, useContext } from 'react';
import { Recipe } from '../utils/types';
import * as recipeApi from '../api/recipes';
import * as authApi from '../api/auth';

interface RecipeContextType {
  recipes: Recipe[];
  loading: boolean;
  error: Error | null;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Recipe>;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => Promise<Recipe | undefined>;
  deleteRecipe: (id: string) => Promise<void>;
  getRecipeById: (id: string) => Recipe | undefined;
  toggleFavorite: (id: string) => Promise<void>;
  favoriteRecipes: Recipe[];
  refreshRecipes: () => Promise<void>;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshRecipes = async () => {
    setLoading(true);
    try {
      const user = await authApi.getUser();
      if (user) {
        const fetchedRecipes = await recipeApi.fetchRecipes();
        setRecipes(fetchedRecipes || []);
      } else {
        setRecipes([]);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRecipes();
  }, []);

  useEffect(() => {
    setFavoriteRecipes(recipes.filter(recipe => recipe.isFavorite));
  }, [recipes]);

  const getRecipeById = (id: string) => {
    return recipes.find(recipe => recipe.id === id);
  };

  const addRecipe = async (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newRecipe = await recipeApi.createRecipe(recipeData);
      setRecipes(prevRecipes => [...prevRecipes, newRecipe]);
      return newRecipe;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add recipe'));
      throw err;
    }
  };

  const updateRecipe = async (id: string, recipeData: Partial<Recipe>) => {
    try {
      const updatedRecipe = await recipeApi.updateRecipe(id, recipeData);
      if (updatedRecipe) {
        setRecipes(prevRecipes =>
          prevRecipes.map(recipe => recipe.id === id ? updatedRecipe : recipe)
        );
      }
      return updatedRecipe;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update recipe'));
      throw err;
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      await recipeApi.deleteRecipe(id);
      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete recipe'));
      throw err;
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      await recipeApi.toggleFavorite(id);
      setRecipes(prevRecipes =>
        prevRecipes.map(recipe => {
          if (recipe.id === id) {
            return { ...recipe, isFavorite: !recipe.isFavorite };
          }
          return recipe;
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to toggle favorite'));
      throw err;
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        loading,
        error,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        getRecipeById,
        toggleFavorite,
        favoriteRecipes,
        refreshRecipes
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};