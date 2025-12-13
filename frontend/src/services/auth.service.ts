/**
 * Authentication service for API calls
 */

import api from './api';
import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth.types';

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

/**
 * Login user with credentials
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

/**
 * Validate current token (check if still valid)
 */
export const validateToken = async (): Promise<boolean> => {
  try {
    // Make a simple request to check if token is valid
    await api.get('/sweets');
    return true;
  } catch (error) {
    return false;
  }
};