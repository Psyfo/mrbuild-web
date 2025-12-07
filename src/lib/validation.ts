/**
 * Validation utilities for forms
 * Provides reusable validation functions and real-time feedback
 */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
  met?: boolean;
}

/**
 * Email validation using standard RFC 5322 regex pattern
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || !email.trim()) {
    return {
      isValid: false,
      message: 'Email is required',
    };
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address',
    };
  }

  return { isValid: true };
};

/**
 * Name validation (supports full names with spaces, hyphens, apostrophes)
 */
export const validateName = (
  name: string,
  fieldName: string = 'Name',
  minLength: number = 2
): ValidationResult => {
  if (!name || !name.trim()) {
    return {
      isValid: false,
      message: `${fieldName} is required`,
    };
  }

  if (name.trim().length < minLength) {
    return {
      isValid: false,
      message: `${fieldName} must be at least ${minLength} characters`,
    };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return {
      isValid: false,
      message: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`,
    };
  }

  return { isValid: true };
};

/**
 * Required field validation
 */
export const validateRequired = (
  value: string,
  fieldName: string = 'This field'
): ValidationResult => {
  if (!value || !value.trim()) {
    return {
      isValid: false,
      message: `${fieldName} is required`,
    };
  }

  return { isValid: true };
};

/**
 * Password requirements for strong passwords
 */
export const passwordRequirements: PasswordRequirement[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (password) => password.length >= 8,
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter',
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: 'number',
    label: 'One number',
    test: (password) => /\d/.test(password),
  },
];

/**
 * Validate password and return detailed requirements status
 */
export const validatePassword = (
  password: string
): {
  isValid: boolean;
  requirements: PasswordRequirement[];
  message?: string;
} => {
  if (!password) {
    return {
      isValid: false,
      requirements: passwordRequirements.map((req) => ({ ...req, met: false })),
      message: 'Password is required',
    };
  }

  const requirements = passwordRequirements.map((req) => ({
    ...req,
    met: req.test(password),
  }));

  const allMet = requirements.every((req) => req.met);

  return {
    isValid: allMet,
    requirements,
    message: allMet ? undefined : 'Password does not meet all requirements',
  };
};

/**
 * Validate password match
 * Industry best practice: only show mismatch when user has finished typing
 * (on blur or submit), not while actively typing
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
  showMismatch: boolean = false
): ValidationResult => {
  if (!confirmPassword) {
    return {
      isValid: false,
      message: 'Please confirm your password',
    };
  }

  // Only show mismatch error if explicitly requested (on blur/submit)
  if (showMismatch && password !== confirmPassword) {
    return {
      isValid: false,
      message: 'Passwords do not match',
    };
  }

  // If not showing mismatch yet, consider valid if confirmPassword has content
  return {
    isValid: password === confirmPassword,
  };
};

/**
 * Message/text validation with min length
 */
export const validateMessage = (
  message: string,
  minLength: number = 10
): ValidationResult => {
  if (!message || !message.trim()) {
    return {
      isValid: false,
      message: 'Message is required',
    };
  }

  if (message.trim().length < minLength) {
    return {
      isValid: false,
      message: `Message must be at least ${minLength} characters`,
    };
  }

  return { isValid: true };
};
