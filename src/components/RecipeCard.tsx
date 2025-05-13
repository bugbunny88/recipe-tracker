import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Award } from 'lucide-react';
import { Recipe } from '../utils/types';
import { useRecipes } from '../contexts/RecipeContext';
import { cn } from '../utils/helpers';
import { useTheme } from '../contexts/ThemeContext';

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, className }) => {
  const { toggleFavorite } = useRecipes();
  const { theme } = useTheme();
  const { id, title, description, imageUrl, prepTime, cookTime, difficulty, isFavorite, dietaryTags } = recipe;

  const totalTime = prepTime + cookTime;

  const timeDisplay = () => {
    if (totalTime < 60) {
      return `${totalTime} min`;
    }
    const hours = Math.floor(totalTime / 60);
    const mins = totalTime % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
        className
      )}
    >
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn(
            "h-5 w-5 transition-colors",
            isFavorite ? "fill-[#FF5C38] text-[#FF5C38]" : "text-gray-600 dark:text-primary-300"
          )} />
        </button>

        {dietaryTags && dietaryTags.length > 0 && (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            {dietaryTags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-800 dark:text-primary-100 font-medium"
              >
                {tag}
              </span>
            ))}
            {dietaryTags.length > 2 && (
              <span className="text-xs px-2 py-1 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-800 dark:text-primary-100 font-medium">
                +{dietaryTags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-lg font-display font-bold ${theme === 'dark' ? 'text-white' : 'text-[#292929]'} line-clamp-1 group-hover:text-[#FF5C38] transition-colors`}>
            {title}
          </h3>
        </div>

        <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 text-sm">{description}</p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            <span>{timeDisplay()}</span>
          </div>

          <div className="flex items-center text-sm">
            <Award className="h-4 w-4 mr-1" />
            <span className={cn(
              difficulty === 'Easy' ? 'text-green-500' :
                difficulty === 'Medium' ? 'text-[#FF5C38]' :
                  'text-red-500'
            )}>
              {difficulty}
            </span>
          </div>
        </div>
      </div>
      <Link to={`/recipes/${id}`} className="absolute inset-0" aria-label={`View ${title} recipe`}>
        <span className="sr-only">View recipe</span>
      </Link>
    </div>
  );
};

export default RecipeCard;