import React from 'react';
import { useRecipes } from '../contexts/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import { Search, ChevronRight, Utensils, BookOpen, Share2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { recipes, favoriteRecipes } = useRecipes();
  const { theme } = useTheme();

  // Get featured recipes (we'll just use the first 3 for now)
  const featuredRecipes = recipes.slice(0, 3);

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center">
        <div className="absolute inset-0 bg-pattern bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-r from-[#292929]/80 to-[#464646]/70 dark:from-gray-900/95 dark:to-gray-800/90"></div>
        </div>

        <div className="container-custom relative z-10 pt-20">
          <div className="max-w-2xl animate-slideUp">
            <h1 className="text-white mb-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>Discover Delicious Homemade Recipes</h1>
            <p className="text-xl text-white/90 mb-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              Your ultimate collection of authentic recipes, cooking tips, and kitchen essentials to bring flavorful dishes to your home.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
              <div className="relative flex-grow max-w-md">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                <input
                  type="text"
                  placeholder="Search recipes, ingredients..."
                  className="w-full py-3 pl-10 pr-4 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#FF5C38] shadow-lg dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
              </div>
              <button className="button-accent py-3 px-6 whitespace-nowrap">
                Find Recipes
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-6 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
              <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm p-4 rounded-lg text-center hover:bg-white/20 transition-all duration-300">
                <Utensils className="h-6 w-6 mx-auto mb-2 text-[#FF5C38]" />
                <p className="text-white font-medium">{recipes.length}+ Recipes</p>
              </div>
              <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm p-4 rounded-lg text-center hover:bg-white/20 transition-all duration-300">
                <BookOpen className="h-6 w-6 mx-auto mb-2 text-[#FF5C38]" />
                <p className="text-white font-medium">Recipe Collections</p>
              </div>
              <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm p-4 rounded-lg text-center hover:bg-white/20 transition-all duration-300">
                <Share2 className="h-6 w-6 mx-auto mb-2 text-[#FF5C38]" />
                <p className="text-white font-medium">Easy Sharing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-16 bg-[#fbfbfb] dark:bg-gray-900">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`${theme === 'dark' ? 'text-white' : 'text-[#292929]'} relative after:content-[""] after:absolute after:h-1 after:w-16 after:bg-[#FF5C38] after:-bottom-2 after:left-0`}>
              Featured Recipes
            </h2>
            <Link to="/recipes" className="button-outline flex items-center">
              View All <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe, index) => (
              <div key={recipe.id} className="animate-fadeIn" style={{ animationDelay: `${0.2 * index}s` }}>
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Favorites Section (Only shown if user has favorites) */}
      {favoriteRecipes.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-900/50">
          <div className="container-custom">
            <div className="flex justify-between items-center mb-8">
              <h2 className={`${theme === 'dark' ? 'text-white' : 'text-[#292929]'} relative after:content-[""] after:absolute after:h-1 after:w-16 after:bg-[#FF5C38] after:-bottom-2 after:left-0`}>
                Your Favorite Recipes
              </h2>
              <Link to="/recipes" className="button-outline flex items-center">
                View All <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favoriteRecipes.slice(0, 3).map((recipe, index) => (
                <div key={recipe.id} className="animate-fadeIn" style={{ animationDelay: `${0.2 * index}s` }}>
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-[#292929] dark:bg-gray-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-white mb-6 animate-fadeIn">Ready to Share Your Own Recipes?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Join our community of food lovers and share your favorite recipes with the world.
          </p>
          <Link to="/recipes/create" className="button-accent py-3 px-8 text-lg animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            Create Recipe
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;