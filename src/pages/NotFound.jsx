import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-100">404</div>
          <div className="relative -top-16">
            <div className="text-6xl font-bold text-gray-300">OOPS!</div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => window.history.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Link to="/">
            <Button>
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 p-6 bg-gray-100 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-3">You might be looking for:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/products" className="text-primary-600 hover:text-primary-700">
              All Products
            </Link>
            <Link to="/login" className="text-primary-600 hover:text-primary-700">
              Login
            </Link>
            <Link to="/register" className="text-primary-600 hover:text-primary-700">
              Register
            </Link>
            <Link to="/cart" className="text-primary-600 hover:text-primary-700">
              Shopping Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;