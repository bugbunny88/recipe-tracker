import React from 'react';
import { useRecipes } from '../contexts/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import { ChevronRight, Utensils, BookOpen, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

// Utility component for scroll-triggered animations
const AnimateOnScroll: React.FC<{
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
  animation?: 'fadeIn' | 'slideUp' | 'slideRight' | 'scaleIn' | 'fade-in-slow' | 'slide-up-smooth';
}> = ({
  children,
  className = '',
  threshold = 0.1,
  triggerOnce = true,
  delay = 0,
  animation = 'fadeIn'
}) => {
    const { ref, inView } = useInView({
      threshold,
      triggerOnce,
    });

    const baseClassName = `opacity-0 transition-all duration-1000`;

    // Animation class mappings
    const animationClasses = {
      fadeIn: 'opacity-0',
      slideUp: 'opacity-0 translate-y-10',
      slideRight: 'opacity-0 -translate-x-10',
      scaleIn: 'opacity-0 scale-95',
      'fade-in-slow': 'opacity-0',
      'slide-up-smooth': 'opacity-0 translate-y-10',
    };

    // Classes to apply when in view
    const inViewClasses = {
      fadeIn: 'opacity-100',
      slideUp: 'opacity-100 translate-y-0',
      slideRight: 'opacity-100 translate-x-0',
      scaleIn: 'opacity-100 scale-100',
      'fade-in-slow': 'opacity-100',
      'slide-up-smooth': 'opacity-100 translate-y-0',
    };

    return (
      <div
        ref={ref}
        className={`${baseClassName} ${animationClasses[animation]} ${className} ${inView ? inViewClasses[animation] : ''
          }`}
        style={{
          transitionDelay: `${delay}ms`,
          transitionTimingFunction: animation.includes('smooth') ? 'cubic-bezier(0.22, 1, 0.36, 1)' : undefined
        }}
      >
        {children}
      </div>
    );
  };

const Home: React.FC = () => {
  const { recipes, favoriteRecipes } = useRecipes();

  // Get featured recipes (we'll just use the first 3 for now)
  const featuredRecipes = recipes.slice(0, 3);

  return (
    <div>
      {/* Hero Section - Zesty Style */}
      <section className="relative h-screen min-h-[600px] flex items-center bg-zesty-cream overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-zesty-gradient">
          <div className="absolute inset-0 bg-zesty-overlay"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute left-1/2 -translate-x-1/2 top-28 w-48 h-0.5 bg-zesty-brown/20"></div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-28 w-48 h-0.5 bg-zesty-brown/20"></div>

        <div className="container mx-auto px-6 relative z-10 pt-20 text-center">
          <div className="max-w-4xl mx-auto">
            <AnimateOnScroll animation="fade-in-slow" delay={200}>
              <h1 className="font-elegant text-5xl md:text-7xl lg:text-8xl font-light text-zesty-brown mb-8 tracking-wide">
                Discover Delicious<br />Homemade Recipes
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll animation="slide-up-smooth" delay={600}>
              <p className="text-xl md:text-2xl text-zesty-brown/80 mb-12 max-w-2xl mx-auto font-light">
                Your ultimate collection of authentic recipes, bringing flavorful dishes to your home.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-in-slow" delay={1000}>
              <div className="flex flex-col sm:flex-row gap-5 max-w-lg mx-auto justify-center mb-16">
                <Link
                  to="/recipes"
                  className="py-4 px-10 border border-zesty-brown/80 text-zesty-brown hover:bg-zesty-brown hover:text-white transition-all duration-500 rounded-none"
                >
                  Browse Recipes
                </Link>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-in-slow" delay={1200}>
              <div className="mt-8 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="p-5 text-center">
                  <Utensils className="h-8 w-8 mx-auto mb-3 text-zesty-coral" />
                  <p className="text-zesty-brown font-medium">{recipes.length}+ Recipes</p>
                </div>
                <div className="p-5 text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-3 text-zesty-coral" />
                  <p className="text-zesty-brown font-medium">Recipe Collections</p>
                </div>
                <div className="p-5 text-center">
                  <Share2 className="h-8 w-8 mx-auto mb-3 text-zesty-coral" />
                  <p className="text-zesty-brown font-medium">Easy Sharing</p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <AnimateOnScroll animation="slide-up-smooth">
            <div className="flex justify-between items-center mb-16">
              <h2 className="font-elegant text-4xl md:text-5xl text-zesty-brown">
                Featured Recipes
              </h2>
              <Link to="/recipes" className="flex items-center text-zesty-coral hover:text-zesty-brown transition-colors">
                View All <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredRecipes.map((recipe, index) => (
              <AnimateOnScroll key={recipe.id} animation="fade-in-slow" delay={index * 300}>
                <RecipeCard recipe={recipe} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Favorites Section (Only shown if user has favorites) */}
      {favoriteRecipes.length > 0 && (
        <section className="py-24 bg-zesty-cream">
          <div className="container mx-auto px-6">
            <AnimateOnScroll animation="slide-up-smooth">
              <div className="flex justify-between items-center mb-16">
                <h2 className="font-elegant text-4xl md:text-5xl text-zesty-brown">
                  Your Favorite Recipes
                </h2>
                <Link to="/recipes" className="flex items-center text-zesty-coral hover:text-zesty-brown transition-colors">
                  View All <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {favoriteRecipes.slice(0, 3).map((recipe, index) => (
                <AnimateOnScroll key={recipe.id} animation="fade-in-slow" delay={index * 300}>
                  <RecipeCard recipe={recipe} />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-zesty-tan text-center">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <AnimateOnScroll animation="fade-in-slow">
              <h2 className="font-elegant text-4xl md:text-5xl text-zesty-brown mb-8">Ready to Share Your Own Recipes?</h2>
            </AnimateOnScroll>

            <AnimateOnScroll animation="slide-up-smooth" delay={300}>
              <p className="text-xl text-zesty-brown/80 mb-12 max-w-2xl mx-auto">
                Join our community of food lovers and share your favorite recipes with the world.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-in-slow" delay={600}>
              <Link to="/recipes/create" className="inline-block py-4 px-10 bg-zesty-coral text-white hover:bg-zesty-brown transition-all duration-500">
                Create Recipe
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;