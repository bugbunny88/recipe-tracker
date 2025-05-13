import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, X, Search, BookOpenText, PlusCircle, Heart, UtensilsCrossed } from 'lucide-react';
import { cn } from '../utils/helpers';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        {
          'bg-transparent': isHomePage && !isScrolled && !isMenuOpen,
          'bg-primary-500/90 backdrop-blur-sm shadow-lg': isScrolled || !isHomePage || isMenuOpen,
        }
      )}
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <UtensilsCrossed className="h-8 w-8 text-accent-400 group-hover:text-accent-300 transition-colors animate-float" />
            <span className="text-2xl font-display font-bold text-white">Yummy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-accent-300 transition-colors">Home</Link>
            <Link to="/recipes" className="text-white hover:text-accent-300 transition-colors">My Recipes</Link>
            <Link to="/recipes/create" className="text-white hover:text-accent-300 transition-colors">Create Recipe</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 rounded-full text-white hover:bg-white/20 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link 
              to="/recipes/create" 
              className="button-accent"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Recipe
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={cn(
            "md:hidden fixed inset-0 bg-primary-500 z-40 transition-transform transform pt-20",
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <div className="container p-4 flex flex-col space-y-6">
            <Link 
              to="/" 
              className="flex items-center p-3 rounded-lg text-white hover:bg-primary-400 transition-colors"
              onClick={closeMenu}
            >
              <BookOpenText className="h-5 w-5 mr-3" />
              Home
            </Link>
            <Link 
              to="/recipes" 
              className="flex items-center p-3 rounded-lg text-white hover:bg-primary-400 transition-colors"
              onClick={closeMenu}
            >
              <Heart className="h-5 w-5 mr-3" />
              My Recipes
            </Link>
            <Link 
              to="/recipes/create" 
              className="flex items-center p-3 rounded-lg text-white hover:bg-primary-400 transition-colors"
              onClick={closeMenu}
            >
              <PlusCircle className="h-5 w-5 mr-3" />
              Create Recipe
            </Link>
            <div className="pt-4 border-t border-primary-400">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search recipes..."
                  className="w-full bg-white/10 text-white placeholder:text-white/60 border-none rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent-400"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;