import React from 'react';
import { Link } from 'react-router-dom';
import { Candy, ShoppingBag, Shield, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <Candy className="text-purple-600 animate-bounce" size={80} />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-purple-600">Sweet Shop</span>
          </h1>
          <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Discover a world of delicious sweets and treats. Your one-stop shop for all things sweet!
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button variant="primary" className="text-lg px-8 py-4">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="text-lg px-8 py-4">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <ShoppingBag className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Easy Shopping</h3>
            <p className="text-gray-600">Browse and purchase your favorite sweets with just a few clicks</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Sparkles className="text-orange-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Wide Selection</h3>
            <p className="text-gray-600">Explore a vast collection of sweets from various categories</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
              <Shield className="text-pink-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Secure Platform</h3>
            <p className="text-gray-600">Shop with confidence on our secure and reliable platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
