import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-display font-bold text-primary-800 mb-6">404</h1>
        <h2 className="text-2xl font-display font-bold text-primary-700 mb-4">Page Not Found</h2>
        <p className="text-primary-600 mb-8">
          The recipe you're looking for might have been moved, deleted, or never existed in the first place.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => window.history.back()} 
            className="button-outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
          <Link to="/" className="button-primary">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;