import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRecipes } from '../contexts/RecipeContext';
import { ArrowLeft, Clock, Users, Heart, Share2, Edit, Trash2, ExternalLink } from 'lucide-react';
import { formatDate, calculateTotalTime } from '../utils/helpers';

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecipeById, toggleFavorite, deleteRecipe } = useRecipes();
  
  const recipe = getRecipeById(id || '');
  
  if (!recipe) {
    return (
      <div className="container-custom pt-32 pb-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Recipe Not Found</h2>
          <p className="mb-6">The recipe you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="button-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipe(recipe.id);
      navigate('/recipes');
    }
  };

  return (
    <div className="pt-20 animate-fadeIn">
      {/* Hero Image */}
      <div className="relative h-[40vh] min-h-[300px] md:h-[50vh]">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <div className="absolute top-4 left-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container-custom">
            <div className="flex flex-wrap gap-2 mb-3">
              {recipe.dietaryTags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-white">{recipe.title}</h1>
          </div>
        </div>
      </div>
      
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-grow">
            {/* Recipe Info Bar */}
            <div className="flex flex-wrap gap-y-4 justify-between items-center bg-white rounded-lg p-4 shadow-sm mb-8">
              <div className="flex items-center gap-8">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm text-primary-600">Total Time</p>
                    <p className="font-medium">{calculateTotalTime(recipe.prepTime, recipe.cookTime)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm text-primary-600">Servings</p>
                    <p className="font-medium">{recipe.servings}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleFavorite(recipe.id)}
                  className="flex items-center gap-2 p-2 rounded-md border border-primary-200 hover:bg-primary-50 transition-colors"
                  aria-label={recipe.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`h-5 w-5 ${recipe.isFavorite ? "fill-error-500 text-error-500" : "text-primary-600"}`} />
                  <span>{recipe.isFavorite ? "Favorited" : "Favorite"}</span>
                </button>
                
                <button className="flex items-center gap-2 p-2 rounded-md border border-primary-200 hover:bg-primary-50 transition-colors">
                  <Share2 className="h-5 w-5 text-primary-600" />
                  <span>Share</span>
                </button>
                
                <Link 
                  to={`/recipes/${recipe.id}/edit`}
                  className="flex items-center gap-2 p-2 rounded-md border border-primary-200 hover:bg-primary-50 transition-colors"
                >
                  <Edit className="h-5 w-5 text-primary-600" />
                  <span>Edit</span>
                </Link>
                
                <button 
                  onClick={handleDelete}
                  className="flex items-center gap-2 p-2 rounded-md border border-error-500 text-error-500 hover:bg-error-500/10 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary-800 mb-4">Description</h2>
              <p className="text-primary-700">{recipe.description}</p>
            </div>
            
            {/* Ingredients */}
            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary-800 mb-4">Ingredients</h2>
              <ul className="bg-white rounded-lg p-6 shadow-sm space-y-3">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id} className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-primary-100 border-2 border-primary-300 mt-1 mr-3 flex-shrink-0"></span>
                    <div>
                      <span className="font-medium">{ingredient.quantity} {ingredient.unit} {ingredient.name}</span>
                      {ingredient.notes && (
                        <p className="text-sm text-primary-600">{ingredient.notes}</p>
                      )}
                      {ingredient.substitutes && ingredient.substitutes.length > 0 && (
                        <p className="text-sm text-primary-500 italic">
                          Substitutes: {ingredient.substitutes.join(', ')}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Instructions */}
            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary-800 mb-4">Instructions</h2>
              <ol className="bg-white rounded-lg p-6 shadow-sm space-y-6">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                    </div>
                    <p className="pt-1">{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>
            
            {/* Notes/Tips Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary-800 mb-4">Recipe Notes</h2>
              <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg">
                <p className="italic text-primary-700">
                  This {recipe.cuisine} classic is best served fresh. If you need to prepare ahead, store the ingredients separately and assemble just before serving.
                </p>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-80 flex-shrink-0">
            {/* Nutrition Facts */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="bg-primary-700 text-white p-4">
                <h3 className="font-display font-bold text-xl">Nutrition Facts</h3>
                <p className="text-sm text-primary-100">Per serving</p>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex justify-between border-b border-primary-100 pb-2">
                  <span className="font-medium">Calories</span>
                  <span>{recipe.nutrition.calories}</span>
                </div>
                <div className="flex justify-between border-b border-primary-100 pb-2">
                  <span className="font-medium">Protein</span>
                  <span>{recipe.nutrition.protein}g</span>
                </div>
                <div className="flex justify-between border-b border-primary-100 pb-2">
                  <span className="font-medium">Carbs</span>
                  <span>{recipe.nutrition.carbs}g</span>
                </div>
                <div className="flex justify-between border-b border-primary-100 pb-2">
                  <span className="font-medium">Fat</span>
                  <span>{recipe.nutrition.fat}g</span>
                </div>
                {recipe.nutrition.fiber && (
                  <div className="flex justify-between border-b border-primary-100 pb-2">
                    <span className="font-medium">Fiber</span>
                    <span>{recipe.nutrition.fiber}g</span>
                  </div>
                )}
                {recipe.nutrition.sodium && (
                  <div className="flex justify-between pb-2">
                    <span className="font-medium">Sodium</span>
                    <span>{recipe.nutrition.sodium}mg</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Recipe Info */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="font-display font-bold text-xl text-primary-800 mb-3">Recipe Info</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between border-b border-primary-100 pb-2">
                  <span className="text-primary-600">Cuisine</span>
                  <span className="font-medium">{recipe.cuisine}</span>
                </div>
                <div className="flex justify-between border-b border-primary-100 pb-2">
                  <span className="text-primary-600">Difficulty</span>
                  <span className="font-medium">{recipe.difficulty}</span>
                </div>
                <div className="flex justify-between border-b border-primary-100 pb-2">
                  <span className="text-primary-600">Prep Time</span>
                  <span className="font-medium">{recipe.prepTime} min</span>
                </div>
                <div className="flex justify-between border-b border-primary-100 pb-2">
                  <span className="text-primary-600">Cook Time</span>
                  <span className="font-medium">{recipe.cookTime} min</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-primary-600">Added</span>
                  <span className="font-medium">{formatDate(recipe.createdAt)}</span>
                </div>
              </div>
            </div>
            
            {/* Affiliate Links (if any) */}
            {recipe.affiliateLinks && recipe.affiliateLinks.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <h3 className="font-display font-bold text-xl text-primary-800 mb-3">Recommended Products</h3>
                
                <div className="space-y-4">
                  {recipe.affiliateLinks.map(link => (
                    <a 
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 border border-primary-100 rounded-md hover:bg-primary-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-primary-800">{link.title}</h4>
                          {link.description && (
                            <p className="text-sm text-primary-600 mt-1">{link.description}</p>
                          )}
                        </div>
                        <ExternalLink className="h-4 w-4 text-primary-400 flex-shrink-0 mt-1" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;