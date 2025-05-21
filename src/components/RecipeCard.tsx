import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Award } from 'lucide-react';
import { Recipe } from '../utils/types';
import { useRecipes } from '../contexts/RecipeContext';
import { cn } from '../utils/helpers';

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, className }) => {
  const { toggleFavorite } = useRecipes();
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
        "bg-white relative overflow-hidden group transition-all duration-500 shadow-sm hover:shadow-md",
        className
      )}
    >
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-10 group-hover:opacity-30 transition-opacity duration-500"></div>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(id);
          }}
          className="absolute top-4 right-4 p-2 bg-white/70 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn(
            "h-5 w-5 transition-colors",
            isFavorite ? "fill-zesty-coral text-zesty-coral" : "text-zesty-brown/70"
          )} />
        </button>

        {dietaryTags && dietaryTags.length > 0 && (
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-1 z-10">
            {dietaryTags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-white/90 backdrop-blur-sm text-zesty-brown font-medium"
              >
                {tag}
              </span>
            ))}
            {dietaryTags.length > 2 && (
              <span className="text-xs px-2 py-1 bg-white/90 backdrop-blur-sm text-zesty-brown font-medium">
                +{dietaryTags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3 className="font-elegant text-xl font-medium text-zesty-brown group-hover:text-zesty-coral transition-colors">
            {title}
          </h3>
        </div>

        <p className="text-zesty-brown/70 mb-5 text-sm font-light line-clamp-2">{description}</p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-zesty-brown/60">
            <Clock className="h-4 w-4 mr-1 text-zesty-coral" />
            <span>{timeDisplay()}</span>
          </div>

          <div className="flex items-center text-sm">
            <Award className="h-4 w-4 mr-1 text-zesty-coral" />
            <span className={cn(
              "font-medium",
              difficulty === 'Easy' ? 'text-green-600' :
                difficulty === 'Medium' ? 'text-zesty-coral' :
                  'text-red-600'
            )}>
              {difficulty}
            </span>
          </div>
        </div>
      </div>
      <Link to={`/recipes/${id}`} className="absolute inset-0 z-[5]" aria-label={`View ${title} recipe`}>
        <span className="sr-only">View recipe</span>
      </Link>
    </div>
  );
};

export default RecipeCard;