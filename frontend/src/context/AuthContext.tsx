/**
 * Authentication Context Provider
 * Manages global authentication state
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth.types';
import * as authService from '../services/auth.service';
import { saveToken, saveUser, getToken, getUser, clearAuth } from '../utils/storage';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Initialize authentication state from local storage
   */
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      const storedUser = getUser();

      if (storedToken && storedUser) {
        // Validate token with backend
        const isValid = await authService.validateToken();
        if (isValid) {
          setToken(storedToken);
          setUser(storedUser);
        } else {
          clearAuth();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login user with credentials
   */
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await authService.login(credentials);
      setToken(response.token);
      setUser(response.user);
      saveToken(response.token);
      saveUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Register new user
   */
  const register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await authService.register(data);
      setToken(response.token);
      setUser(response.user);
      saveToken(response.token);
      saveUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logout user and clear authentication data
   */
  const logout = (): void => {
    setUser(null);
    setToken(null);
    clearAuth();
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};