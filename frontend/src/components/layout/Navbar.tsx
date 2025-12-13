/**
 * Navigation Bar Component
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Candy, LogOut, User, ShoppingBag, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

/**
 * Main navigation bar with authentication state
 */
const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Candy className="text-orange-400 group-hover:rotate-12 transition-transform" size={32} />
            <span className="text-white text-2xl font-bold">Sweet Shop</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-white hover:text-orange-300 transition-colors px-3 py-2 rounded-lg hover:bg-purple-700"
                >
                  <ShoppingBag size={20} />
                  <span>Dashboard</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-white hover:text-orange-300 transition-colors px-3 py-2 rounded-lg hover:bg-purple-700"
                  >
                    <Shield size={20} />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <div className="flex items-center space-x-2 text-white border-l border-purple-500 pl-4">
                  <User size={20} />
                  <span className="font-medium">{user?.name}</span>
                  {isAdmin && (
                    <span className="bg-orange-500 text-xs px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-white hover:text-orange-300 transition-colors px-3 py-2 rounded-lg hover:bg-purple-700"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;