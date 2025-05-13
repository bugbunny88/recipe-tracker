import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecipes } from '../contexts/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import { PlusCircle, Search, Filter, X } from 'lucide-react';
import { cuisines, dietaryTags } from '../utils/mockData';

const MyRecipes: React.FC = () => {
  const { recipes } = useRecipes();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [selectedDiet, setSelectedDiet] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter recipes based on search term and filters
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = searchTerm === '' || 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCuisine = selectedCuisine === '' || recipe.cuisine === selectedCuisine;
    
    const matchesDiet = selectedDiet === '' || recipe.dietaryTags.includes(selectedDiet);
    
    return matchesSearch && matchesCuisine && matchesDiet;
  });

  const resetFilters = () => {
    setSelectedCuisine('');
    setSelectedDiet('');
    setSearchTerm('');
  };

  const hasActiveFilters = selectedCuisine !== '' || selectedDiet !== '' || searchTerm !== '';

  return (
    <div className="pt-24 pb-16 animate-fadeIn">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-primary-800">My Recipes</h1>
          
          <Link to="/recipes/create" className="button-accent">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Recipe
          </Link>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" />
              <input 
                type="text" 
                placeholder="Search recipes, ingredients..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-primary-200 rounded-md hover:bg-primary-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            {hasActiveFilters && (
              <button 
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-800 transition-colors"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-primary-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Cuisine</label>
                <select 
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="input"
                >
                  <option value="">All Cuisines</option>
                  {cuisines.map((cuisine, index) => (
                    <option key={index} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="label">Dietary Preference</label>
                <select 
                  value={selectedDiet}
                  onChange={(e) => setSelectedDiet(e.target.value)}
                  className="input"
                >
                  <option value="">All Diets</option>
                  {dietaryTags.map((diet, index) => (
                    <option key={index} value={diet}>{diet}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
        
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-display font-bold text-primary-700 mb-2">No Recipes Found</h3>
            <p className="text-primary-600 mb-6">
              {hasActiveFilters 
                ? 'Try adjusting your filters or search term.' 
                : 'Start adding recipes to your collection.'}
            </p>
            {hasActiveFilters ? (
              <button 
                onClick={resetFilters}
                className="button-primary"
              >
                Clear All Filters
              </button>
            ) : (
              <Link to="/recipes/create" className="button-accent">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Your First Recipe
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecipes;