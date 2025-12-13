/**
 * Local storage utility functions for managing authentication data
 */

const TOKEN_KEY = 'sweets_auth_token';
const USER_KEY = 'sweets_user';

/**
 * Save authentication token to local storage
 */
export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get authentication token from local storage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove authentication token from local storage
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Save user data to local storage
 */
export const saveUser = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Get user data from local storage
 */
export const getUser = (): any | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * Remove user data from local storage
 */
export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

/**
 * Clear all authentication data from local storage
 */
export const clearAuth = (): void => {
  removeToken();
  removeUser();
};