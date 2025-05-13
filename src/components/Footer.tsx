import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Instagram, Facebook, Twitter, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-600 dark:bg-gray-950 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <UtensilsCrossed className="h-8 w-8 text-accent-400" />
              <span className="text-2xl font-display font-bold">Yummy</span>
            </div>
            <p className="text-primary-100 dark:text-gray-300 mb-6">
              Your recipe collection. Create, discover, and share delicious recipes together!
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-200 dark:text-gray-400 hover:text-accent-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-200 dark:text-gray-400 hover:text-accent-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-200 dark:text-gray-400 hover:text-accent-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-lg font-display font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-primary-100 dark:text-gray-300 hover:text-accent-400 transition-colors">Home</Link></li>
              <li><Link to="/recipes" className="text-primary-100 dark:text-gray-300 hover:text-accent-400 transition-colors">Recipes</Link></li>
              <li><Link to="/recipes/create" className="text-primary-100 dark:text-gray-300 hover:text-accent-400 transition-colors">Create Recipe</Link></li>
              <li><a href="#" className="text-primary-100 dark:text-gray-300 hover:text-accent-400 transition-colors">Ingredients</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-lg font-display font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-100 dark:text-gray-300 hover:text-accent-400 transition-colors">Cooking Tips</a></li>
              <li><a href="#" className="text-primary-100 dark:text-gray-300 hover:text-accent-400 transition-colors">Ingredient Guides</a></li>
              <li><a href="#" className="text-primary-100 dark:text-gray-300 hover:text-accent-400 transition-colors">Kitchen Tools</a></li>
              <li><a href="#" className="text-primary-100 dark:text-gray-300 hover:text-accent-400 transition-colors">Nutrition Facts</a></li>
              <li><a href="#" className="text-primary-100 dark:text-gray-300 hover:text-accent-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-lg font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-accent-400 mr-2 mt-0.5" />
                <span className="text-primary-100 dark:text-gray-300">hello@yummyrecipes.com</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-accent-400 mr-2 mt-0.5" />
                <span className="text-primary-100 dark:text-gray-300">123 Kitchen St, Food City</span>
              </li>
            </ul>
            <div className="mt-6">
              <a href="#" className="button-accent">Subscribe to Newsletter</a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-500 dark:border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-200 dark:text-gray-400 text-sm">© 2025 Yummy. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-primary-200 dark:text-gray-400 hover:text-accent-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-primary-200 dark:text-gray-400 hover:text-accent-400 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-primary-200 dark:text-gray-400 hover:text-accent-400 text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;