import React from 'react';
import { useRecipes } from '../contexts/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import { Search, ChevronRight, Utensils, BookOpen, Share2 } from 'lucide-react';
import { cuisines } from '../utils/mockData';

const Home: React.FC = () => {
  const { recipes, favoriteRecipes } = useRecipes();

  // Get featured recipes (we'll just use the first 3 for now)
  const featuredRecipes = recipes.slice(0, 3);

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center">
        <div className="absolute inset-0 bg-pattern bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-800/75"></div>
        </div>
        
        <div className="container-custom relative z-10 pt-20">
          <div className="max-w-2xl animate-slideUp">
            <h1 className="text-white mb-6">Discover the Vibrant Flavors of Latin Cuisine</h1>
            <p className="text-xl text-white/90 mb-8">
              Your ultimate collection of authentic recipes, cooking tips, and kitchen essentials to bring Latin American flavors to your home.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" />
                <input 
                  type="text" 
                  placeholder="Search recipes, ingredients, or cuisines" 
                  className="w-full py-3 pl-10 pr-4 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-accent-500 shadow-lg"
                />
              </div>
              <button className="button-accent py-3 px-6 whitespace-nowrap">
                Find Recipes
              </button>
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <Utensils className="h-6 w-6 mx-auto mb-2 text-accent-400" />
                <p className="text-white font-medium">{recipes.length}+ Recipes</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <BookOpen className="h-6 w-6 mx-auto mb-2 text-accent-400" />
                <p className="text-white font-medium">10+ Cuisines</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <Share2 className="h-6 w-6 mx-auto mb-2 text-accent-400" />
                <p className="text-white font-medium">Easy Sharing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-primary-800">Featured Recipes</h2>
            <a href="#" className="button-outline flex items-center">
              View All <ChevronRight className="ml-2 h-4 w-4" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Cuisine Section */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <h2 className="text-primary-800 mb-8 text-center">Explore by Cuisine</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {cuisines.slice(0, 10).map((cuisine, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="h-32 bg-primary-200 flex items-center justify-center">
                  <span className="font-display text-xl text-primary-800 group-hover:text-accent-600 transition-colors">
                    {cuisine}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Favorites Section (Only shown if user has favorites) */}
      {favoriteRecipes.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container-custom">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-primary-800">Your Favorite Recipes</h2>
              <a href="#" className="button-outline flex items-center">
                View All <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favoriteRecipes.slice(0, 3).map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-white mb-6">Ready to Share Your Own Recipes?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community of food lovers and share your favorite Latin recipes with the world.
          </p>
          <button className="button-accent py-3 px-8 text-lg">
            Create Recipe
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;