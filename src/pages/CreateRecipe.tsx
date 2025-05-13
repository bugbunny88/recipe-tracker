import React from 'react';
import CreateEditRecipeForm from '../components/CreateEditRecipeForm';

const CreateRecipe: React.FC = () => {
  return (
    <div className="pt-24 pb-16 animate-fadeIn">
      <div className="container-custom mb-8">
        <h1 className="text-primary-800">Create New Recipe</h1>
        <p className="text-primary-600">Share your culinary masterpiece with the world!</p>
      </div>
      
      <CreateEditRecipeForm mode="create" />
    </div>
  );
};

export default CreateRecipe;