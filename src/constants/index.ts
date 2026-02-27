// User Roles
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// Payment Status
export enum PaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  PENDING = 'PENDING',
}

// Festival Types
export enum FestivalType {
  DURGA_PUJA = 'DURGA_PUJA',
  DIWALI = 'DIWALI',
  HOLI = 'HOLI',
  VILLAGE_PUJA = 'VILLAGE_PUJA',
  OTHER = 'OTHER',
}

// Expense Categories
export enum ExpenseCategory {
  TENT = 'TENT',
  FOOD = 'FOOD',
  DECORATION = 'DECORATION',
  ENTERTAINMENT = 'ENTERTAINMENT',
  UTILITIES = 'UTILITIES',
  OTHER = 'OTHER',
}

// Collection Names for Firestore
export const COLLECTIONS = {
  USERS: 'users',
  FAMILIES: 'families',
  FESTIVALS: 'festivals',
  PAYMENTS: 'payments',
  RECEIPTS: 'receipts',
  EXPENSES: 'expenses',
} as const;

// App Constants
export const APP_CONSTANTS = {
  APP_NAME: 'LBC - Luhuren Bae Club',
  APP_DESCRIPTION: 'Village Chanda Management System',
  DEFAULT_CURRENCY: '₹',
  DATE_FORMAT: 'dd/MM/yyyy',
  DATETIME_FORMAT: 'dd/MM/yyyy hh:mm a',
  ITEMS_PER_PAGE: 20,
} as const;

// Validation Constants
export const VALIDATION = {
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 15,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  ADDRESS_MAX_LENGTH: 500,
  MIN_AMOUNT: 0,
  MAX_AMOUNT: 1000000,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Resource not found',
  NETWORK_ERROR: 'Network error. Please check your connection',
  VALIDATION_ERROR: 'Please check your input',
  SERVER_ERROR: 'Something went wrong. Please try again',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  CREATE_SUCCESS: 'Created successfully',
  UPDATE_SUCCESS: 'Updated successfully',
  DELETE_SUCCESS: 'Deleted successfully',
  PAYMENT_SUCCESS: 'Payment recorded successfully',
} as const;
