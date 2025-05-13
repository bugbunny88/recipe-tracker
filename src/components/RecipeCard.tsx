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
        "card group hover:translate-y-[-4px]",
        className
      )}
    >
      <div className="relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn(
            "h-5 w-5 transition-colors", 
            isFavorite ? "fill-error-500 text-error-500" : "text-primary-600"
          )} />
        </button>
        
        {dietaryTags && dietaryTags.length > 0 && (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            {dietaryTags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm text-primary-800 font-medium"
              >
                {tag}
              </span>
            ))}
            {dietaryTags.length > 2 && (
              <span className="text-xs px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm text-primary-800 font-medium">
                +{dietaryTags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-display font-bold text-primary-800 line-clamp-1">{title}</h3>
        </div>
        
        <p className="text-primary-600 line-clamp-2 mb-3 text-sm">{description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center text-sm text-primary-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>{timeDisplay()}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Award className="h-4 w-4 mr-1" />
            <span className={cn(
              difficulty === 'Easy' ? 'text-success-500' : 
              difficulty === 'Medium' ? 'text-accent-500' : 
              'text-error-500'
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