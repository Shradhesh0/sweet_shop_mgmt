/**
 * Input validation utility functions
 */

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { 
  valid: boolean; 
  message?: string 
} => {
  if (password.length < 6) {
    return { 
      valid: false, 
      message: 'Password must be at least 6 characters long' 
    };
  }
  return { valid: true };
};

/**
 * Validate price value
 */
export const validatePrice = (price: number): boolean => {
  return price > 0 && Number.isFinite(price);
};

/**
 * Validate quantity value
 */
export const validateQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity >= 0;
};

/**
 * Validate required field
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};