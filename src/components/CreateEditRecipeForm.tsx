import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useRecipes } from '../contexts/RecipeContext';
import { Recipe, Ingredient, Nutrition, AffiliateLink } from '../utils/types';
import { Plus, Minus, X, CheckCircle2 } from 'lucide-react';
import { cuisines, dietaryTags } from '../utils/mockData';

interface CreateEditRecipeFormProps {
  existingRecipe?: Recipe;
  mode: 'create' | 'edit';
}

const CreateEditRecipeForm: React.FC<CreateEditRecipeFormProps> = ({ existingRecipe, mode }) => {
  const navigate = useNavigate();
  const { addRecipe, updateRecipe } = useRecipes();
  
  const [title, setTitle] = useState(existingRecipe?.title || '');
  const [description, setDescription] = useState(existingRecipe?.description || '');
  const [prepTime, setPrepTime] = useState(existingRecipe?.prepTime || 15);
  const [cookTime, setCookTime] = useState(existingRecipe?.cookTime || 30);
  const [servings, setServings] = useState(existingRecipe?.servings || 4);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>(existingRecipe?.difficulty || 'Medium');
  const [cuisine, setCuisine] = useState(existingRecipe?.cuisine || '');
  const [selectedDietaryTags, setSelectedDietaryTags] = useState<string[]>(existingRecipe?.dietaryTags || []);
  const [imageUrl, setImageUrl] = useState(existingRecipe?.imageUrl || '');
  const [ingredients, setIngredients] = useState<Ingredient[]>(existingRecipe?.ingredients || [
    { id: uuidv4(), name: '', quantity: '', unit: '', notes: '' }
  ]);
  const [instructions, setInstructions] = useState<string[]>(existingRecipe?.instructions || ['']);
  const [nutrition, setNutrition] = useState<Nutrition>(existingRecipe?.nutrition || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>(existingRecipe?.affiliateLinks || []);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Toggle dietary tag
  const toggleDietaryTag = (tag: string) => {
    if (selectedDietaryTags.includes(tag)) {
      setSelectedDietaryTags(selectedDietaryTags.filter(t => t !== tag));
    } else {
      setSelectedDietaryTags([...selectedDietaryTags, tag]);
    }
  };

  // Handle ingredient changes
  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = { 
      ...updatedIngredients[index], 
      [field]: value 
    };
    setIngredients(updatedIngredients);
  };

  // Add new ingredient
  const addIngredient = () => {
    setIngredients([
      ...ingredients, 
      { id: uuidv4(), name: '', quantity: '', unit: '', notes: '' }
    ]);
  };

  // Remove ingredient
  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const updatedIngredients = [...ingredients];
      updatedIngredients.splice(index, 1);
      setIngredients(updatedIngredients);
    }
  };

  // Handle instruction changes
  const updateInstruction = (index: number, value: string) => {
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = value;
    setInstructions(updatedInstructions);
  };

  // Add new instruction
  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  // Remove instruction
  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      const updatedInstructions = [...instructions];
      updatedInstructions.splice(index, 1);
      setInstructions(updatedInstructions);
    }
  };

  // Handle nutrition changes
  const updateNutrition = (field: keyof Nutrition, value: string) => {
    setNutrition({
      ...nutrition,
      [field]: value === '' ? 0 : parseInt(value, 10)
    });
  };

  // Handle affiliate link changes
  const updateAffiliateLink = (index: number, field: keyof AffiliateLink, value: string) => {
    const updatedLinks = [...affiliateLinks];
    updatedLinks[index] = { 
      ...updatedLinks[index], 
      [field]: value 
    };
    setAffiliateLinks(updatedLinks);
  };

  // Add new affiliate link
  const addAffiliateLink = () => {
    setAffiliateLinks([
      ...affiliateLinks, 
      { id: uuidv4(), title: '', url: '', description: '' }
    ]);
  };

  // Remove affiliate link
  const removeAffiliateLink = (index: number) => {
    const updatedLinks = [...affiliateLinks];
    updatedLinks.splice(index, 1);
    setAffiliateLinks(updatedLinks);
  };

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';
    if (!cuisine) newErrors.cuisine = 'Cuisine is required';
    
    // Validate ingredients
    let hasIngredientError = false;
    ingredients.forEach((ingredient, index) => {
      if (!ingredient.name.trim() || !ingredient.quantity.trim() || !ingredient.unit.trim()) {
        hasIngredientError = true;
      }
    });
    if (hasIngredientError) newErrors.ingredients = 'All ingredients must have a name, quantity, and unit';
    
    // Validate instructions
    let hasInstructionError = false;
    instructions.forEach((instruction, index) => {
      if (!instruction.trim()) {
        hasInstructionError = true;
      }
    });
    if (hasInstructionError) newErrors.instructions = 'All instruction steps must be filled out';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    try {
      // Filter out empty ingredients and instructions
      const filteredIngredients = ingredients.filter(ing => ing.name.trim() !== '');
      const filteredInstructions = instructions.filter(inst => inst.trim() !== '');
      const filteredAffiliateLinks = affiliateLinks.filter(link => link.title.trim() !== '' && link.url.trim() !== '');
      
      const recipeData = {
        title,
        description,
        prepTime,
        cookTime,
        servings,
        difficulty,
        ingredients: filteredIngredients,
        instructions: filteredInstructions,
        cuisine,
        dietaryTags: selectedDietaryTags,
        imageUrl,
        nutrition,
        isFavorite: existingRecipe?.isFavorite || false,
        affiliateLinks: filteredAffiliateLinks
      };
      
      if (mode === 'create') {
        const newRecipe = addRecipe(recipeData);
        setSuccessMessage('Recipe created successfully!');
        setTimeout(() => {
          navigate(`/recipes/${newRecipe.id}`);
        }, 1500);
      } else if (mode === 'edit' && existingRecipe) {
        updateRecipe(existingRecipe.id, recipeData);
        setSuccessMessage('Recipe updated successfully!');
        setTimeout(() => {
          navigate(`/recipes/${existingRecipe.id}`);
        }, 1500);
      }
    } catch (error) {
      setErrors({ form: 'An error occurred. Please try again.' });
    }
  };

  return (
    <div className="container-custom py-8">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}
        
        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-medium mb-2">Please fix the following errors:</p>
            <ul className="list-disc list-inside">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label htmlFor="title" className="label">Recipe Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`input ${errors.title ? 'border-red-500' : ''}`}
              placeholder="E.g., Authentic Mexican Guacamole"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          
          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="label">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`input min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Brief description of the recipe"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          
          {/* Image URL */}
          <div className="md:col-span-2">
            <label htmlFor="imageUrl" className="label">Image URL</label>
            <input
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={`input ${errors.imageUrl ? 'border-red-500' : ''}`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
            {imageUrl && (
              <div className="mt-2 h-40 w-full bg-gray-100 rounded-md overflow-hidden">
                <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
          
          {/* Prep Time */}
          <div>
            <label htmlFor="prepTime" className="label">Prep Time (minutes)</label>
            <input
              type="number"
              id="prepTime"
              min="0"
              value={prepTime}
              onChange={(e) => setPrepTime(parseInt(e.target.value, 10) || 0)}
              className="input"
            />
          </div>
          
          {/* Cook Time */}
          <div>
            <label htmlFor="cookTime" className="label">Cook Time (minutes)</label>
            <input
              type="number"
              id="cookTime"
              min="0"
              value={cookTime}
              onChange={(e) => setCookTime(parseInt(e.target.value, 10) || 0)}
              className="input"
            />
          </div>
          
          {/* Servings */}
          <div>
            <label htmlFor="servings" className="label">Servings</label>
            <input
              type="number"
              id="servings"
              min="1"
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value, 10) || 1)}
              className="input"
            />
          </div>
          
          {/* Difficulty */}
          <div>
            <label htmlFor="difficulty" className="label">Difficulty</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
              className="input"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          {/* Cuisine */}
          <div>
            <label htmlFor="cuisine" className="label">Cuisine</label>
            <select
              id="cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className={`input ${errors.cuisine ? 'border-red-500' : ''}`}
            >
              <option value="">Select Cuisine</option>
              {cuisines.map((c, index) => (
                <option key={index} value={c}>{c}</option>
              ))}
            </select>
            {errors.cuisine && <p className="text-red-500 text-sm mt-1">{errors.cuisine}</p>}
          </div>
        </div>
        
        {/* Dietary Tags */}
        <div className="mb-8">
          <label className="label">Dietary Tags</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {dietaryTags.map((tag, index) => (
              <button
                type="button"
                key={index}
                onClick={() => toggleDietaryTag(tag)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedDietaryTags.includes(tag)
                    ? 'bg-primary-600 text-white'
                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* Ingredients */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-display font-bold text-primary-800">Ingredients</label>
            <button
              type="button"
              onClick={addIngredient}
              className="button-outline py-1 px-3 text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Ingredient
            </button>
          </div>
          
          {errors.ingredients && <p className="text-red-500 text-sm mb-2">{errors.ingredients}</p>}
          
          <div className="space-y-4">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="bg-primary-50 p-4 rounded-md">
                <div className="flex justify-between mb-3">
                  <span className="font-medium">Ingredient {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={ingredients.length <= 1}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`ingredient-name-${index}`} className="label">Name</label>
                    <input
                      type="text"
                      id={`ingredient-name-${index}`}
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      className="input"
                      placeholder="E.g., Avocado"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor={`ingredient-quantity-${index}`} className="label">Quantity</label>
                      <input
                        type="text"
                        id={`ingredient-quantity-${index}`}
                        value={ingredient.quantity}
                        onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                        className="input"
                        placeholder="E.g., 2"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`ingredient-unit-${index}`} className="label">Unit</label>
                      <input
                        type="text"
                        id={`ingredient-unit-${index}`}
                        value={ingredient.unit}
                        onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                        className="input"
                        placeholder="E.g., cups"
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor={`ingredient-notes-${index}`} className="label">Notes (optional)</label>
                    <input
                      type="text"
                      id={`ingredient-notes-${index}`}
                      value={ingredient.notes || ''}
                      onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                      className="input"
                      placeholder="E.g., finely chopped"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Instructions */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-display font-bold text-primary-800">Instructions</label>
            <button
              type="button"
              onClick={addInstruction}
              className="button-outline py-1 px-3 text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Step
            </button>
          </div>
          
          {errors.instructions && <p className="text-red-500 text-sm mb-2">{errors.instructions}</p>}
          
          <div className="space-y-4">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-medium">
                  {index + 1}
                </div>
                
                <div className="flex-grow">
                  <textarea
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    className="input min-h-[80px]"
                    placeholder={`Step ${index + 1} instructions...`}
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="text-red-500 hover:text-red-700 flex-shrink-0 h-8 w-8 flex items-center justify-center"
                  disabled={instructions.length <= 1}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Nutrition */}
        <div className="mb-8">
          <label className="text-lg font-display font-bold text-primary-800 mb-4">Nutrition Information</label>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="calories" className="label">Calories</label>
              <input
                type="number"
                id="calories"
                min="0"
                value={nutrition.calories || ''}
                onChange={(e) => updateNutrition('calories', e.target.value)}
                className="input"
                placeholder="0"
              />
            </div>
            
            <div>
              <label htmlFor="protein" className="label">Protein (g)</label>
              <input
                type="number"
                id="protein"
                min="0"
                value={nutrition.protein || ''}
                onChange={(e) => updateNutrition('protein', e.target.value)}
                className="input"
                placeholder="0"
              />
            </div>
            
            <div>
              <label htmlFor="carbs" className="label">Carbs (g)</label>
              <input
                type="number"
                id="carbs"
                min="0"
                value={nutrition.carbs || ''}
                onChange={(e) => updateNutrition('carbs', e.target.value)}
                className="input"
                placeholder="0"
              />
            </div>
            
            <div>
              <label htmlFor="fat" className="label">Fat (g)</label>
              <input
                type="number"
                id="fat"
                min="0"
                value={nutrition.fat || ''}
                onChange={(e) => updateNutrition('fat', e.target.value)}
                className="input"
                placeholder="0"
              />
            </div>
            
            <div>
              <label htmlFor="fiber" className="label">Fiber (g)</label>
              <input
                type="number"
                id="fiber"
                min="0"
                value={nutrition.fiber || ''}
                onChange={(e) => updateNutrition('fiber', e.target.value)}
                className="input"
                placeholder="0"
              />
            </div>
            
            <div>
              <label htmlFor="sugar" className="label">Sugar (g)</label>
              <input
                type="number"
                id="sugar"
                min="0"
                value={nutrition.sugar || ''}
                onChange={(e) => updateNutrition('sugar', e.target.value)}
                className="input"
                placeholder="0"
              />
            </div>
            
            <div>
              <label htmlFor="sodium" className="label">Sodium (mg)</label>
              <input
                type="number"
                id="sodium"
                min="0"
                value={nutrition.sodium || ''}
                onChange={(e) => updateNutrition('sodium', e.target.value)}
                className="input"
                placeholder="0"
              />
            </div>
          </div>
        </div>
        
        {/* Affiliate Links */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-display font-bold text-primary-800">Affiliate Links (Optional)</label>
            <button
              type="button"
              onClick={addAffiliateLink}
              className="button-outline py-1 px-3 text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Link
            </button>
          </div>
          
          <div className="space-y-4">
            {affiliateLinks.map((link, index) => (
              <div key={index} className="border border-primary-200 p-4 rounded-md">
                <div className="flex justify-between mb-3">
                  <span className="font-medium">Link {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeAffiliateLink(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label htmlFor={`affiliate-title-${index}`} className="label">Title</label>
                    <input
                      type="text"
                      id={`affiliate-title-${index}`}
                      value={link.title}
                      onChange={(e) => updateAffiliateLink(index, 'title', e.target.value)}
                      className="input"
                      placeholder="E.g., Premium Chef's Knife"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`affiliate-url-${index}`} className="label">URL</label>
                    <input
                      type="text"
                      id={`affiliate-url-${index}`}
                      value={link.url}
                      onChange={(e) => updateAffiliateLink(index, 'url', e.target.value)}
                      className="input"
                      placeholder="https://example.com/product"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`affiliate-description-${index}`} className="label">Description (optional)</label>
                    <input
                      type="text"
                      id={`affiliate-description-${index}`}
                      value={link.description || ''}
                      onChange={(e) => updateAffiliateLink(index, 'description', e.target.value)}
                      className="input"
                      placeholder="E.g., The perfect knife for chopping vegetables"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="button-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button-primary"
          >
            {mode === 'create' ? 'Create Recipe' : 'Update Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditRecipeForm;