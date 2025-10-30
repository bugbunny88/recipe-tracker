import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, X, Search, PlusCircle, UtensilsCrossed, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();
  const { user, signOut } = useAuth();

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

  const handleSignOut = async () => {
    try {
      await signOut();
      closeMenu();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const getHeaderBgClass = () => {
    if (isHomePage && !isScrolled && !isMenuOpen) {
      return 'bg-transparent';
    }

    return theme === 'dark'
      ? 'bg-gray-900 shadow-lg'
      : 'bg-white shadow-sm';
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getHeaderBgClass()}`}>
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <UtensilsCrossed className={`h-8 w-8 ${theme === 'dark' ? 'text-accent-400' : 'text-[#FF5C38]'} group-hover:text-[#e04e2e] transition-colors animate-float`} />
            <span className={`text-2xl font-display font-bold ${theme === 'dark' ? 'text-white' : 'text-[#292929]'}`}>Masa Mía</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`${theme === 'dark' ? 'text-white hover:text-accent-300' : 'text-[#292929] hover:text-[#FF5C38]'} transition-colors font-medium`}>Home</Link>
            {user ? (
              <>
                <Link to="/recipes" className={`${theme === 'dark' ? 'text-white hover:text-accent-300' : 'text-[#292929] hover:text-[#FF5C38]'} transition-colors font-medium`}>My Recipes</Link>
                <Link to="/recipes/create" className={`${theme === 'dark' ? 'text-white hover:text-accent-300' : 'text-[#292929] hover:text-[#FF5C38]'} transition-colors font-medium`}>Create Recipe</Link>
              </>
            ) : null}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <button className={`p-2 rounded-full ${theme === 'dark' ? 'text-white hover:bg-white/20' : 'text-[#292929] hover:bg-gray-100'} transition-colors`}>
                  <Search className="h-5 w-5" />
                </button>
                <Link
                  to="/recipes/create"
                  className="button-accent"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Recipe
                </Link>
                <div className="flex items-center">
                  <span className={`mr-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className={`flex items-center p-2 rounded-full ${theme === 'dark' ? 'text-white hover:bg-white/20' : 'text-[#292929] hover:bg-gray-100'} transition-colors`}
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={`flex items-center ${theme === 'dark' ? 'text-white hover:text-accent-300' : 'text-[#292929] hover:text-[#FF5C38]'} transition-colors`}>
                  <LogIn className="h-4 w-4 mr-1" />
                  Log In
                </Link>
                <Link to="/signup" className="button-accent">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              className={`p-2 ${theme === 'dark' ? 'text-white' : 'text-[#292929]'}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed inset-0 z-40 transition-transform transform pt-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            } ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}`}
        >
          <div className="container p-4 flex flex-col space-y-6">
            <Link
              to="/"
              className={`flex items-center p-3 rounded-lg ${theme === 'dark'
                ? 'text-white hover:bg-gray-800'
                : 'text-[#292929] hover:bg-gray-50'
                } transition-colors`}
              onClick={closeMenu}
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  to="/recipes"
                  className={`flex items-center p-3 rounded-lg ${theme === 'dark'
                    ? 'text-white hover:bg-gray-800'
                    : 'text-[#292929] hover:bg-gray-50'
                    } transition-colors`}
                  onClick={closeMenu}
                >
                  My Recipes
                </Link>
                <Link
                  to="/recipes/create"
                  className={`flex items-center p-3 rounded-lg ${theme === 'dark'
                    ? 'text-white hover:bg-gray-800'
                    : 'text-[#292929] hover:bg-gray-50'
                    } transition-colors`}
                  onClick={closeMenu}
                >
                  Create Recipe
                </Link>
                <button
                  onClick={handleSignOut}
                  className={`flex items-center p-3 rounded-lg ${theme === 'dark'
                    ? 'text-white hover:bg-gray-800'
                    : 'text-[#292929] hover:bg-gray-50'
                    } transition-colors`}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`flex items-center p-3 rounded-lg ${theme === 'dark'
                    ? 'text-white hover:bg-gray-800'
                    : 'text-[#292929] hover:bg-gray-50'
                    } transition-colors`}
                  onClick={closeMenu}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className={`flex items-center p-3 rounded-lg ${theme === 'dark'
                    ? 'text-white hover:bg-gray-800'
                    : 'text-[#292929] hover:bg-gray-50'
                    } transition-colors`}
                  onClick={closeMenu}
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Sign Up
                </Link>
              </>
            )}

            {user && (
              <div className={`pt-4 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    className={`w-full ${theme === 'dark'
                      ? 'bg-gray-800 text-white placeholder:text-gray-400'
                      : 'bg-gray-100 text-[#292929] placeholder:text-gray-500'
                      } border-none rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF5C38]`}
                  />
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;