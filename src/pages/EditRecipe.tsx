import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useRecipes } from '../contexts/RecipeContext';
import CreateEditRecipeForm from '../components/CreateEditRecipeForm';

const EditRecipe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getRecipeById } = useRecipes();
  
  const recipe = getRecipeById(id || '');
  
  if (!recipe) {
    return <Navigate to="/recipes" />;
  }
  
  return (
    <div className="pt-24 pb-16 animate-fadeIn">
      <div className="container-custom mb-8">
        <h1 className="text-primary-800">Edit Recipe</h1>
        <p className="text-primary-600">Update your recipe details.</p>
      </div>
      
      <CreateEditRecipeForm mode="edit" existingRecipe={recipe} />
    </div>
  );
};

export default EditRecipe;