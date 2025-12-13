/**
 * Footer Component
 */

import React from 'react';
import { Heart, Candy } from 'lucide-react';

/**
 * Application footer with branding
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Brand */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Candy className="text-orange-400" size={24} />
            <span className="text-xl font-bold">Sweet Shop</span>
          </div>

          {/* Copyright */}
          <div className="flex items-center space-x-1 text-gray-400">
            <span>Made with</span>
            <Heart className="text-red-500 fill-current" size={16} />
            <span>© 2024 Sweet Shop. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;