/**
 * Validation utilities for forms
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true };
}

/**
 * Password requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 number
 */
export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
}

export function checkPasswordRequirements(password: string): PasswordRequirements {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  const requirements = checkPasswordRequirements(password);

  if (!requirements.minLength) {
    return { isValid: false, error: "Password must be at least 8 characters" };
  }

  if (!requirements.hasUppercase) {
    return { isValid: false, error: "Password must contain at least 1 uppercase letter" };
  }

  if (!requirements.hasNumber) {
    return { isValid: false, error: "Password must contain at least 1 number" };
  }

  return { isValid: true };
}

/**
 * Validate password confirmation matches
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }

  return { isValid: true };
}

/**
 * Validate terms acceptance
 */
export function validateTerms(accepted: boolean): ValidationResult {
  if (!accepted) {
    return { isValid: false, error: "You must accept the Terms & Privacy Policy" };
  }

  return { isValid: true };
}
