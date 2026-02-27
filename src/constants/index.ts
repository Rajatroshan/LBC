// Festival Types
export enum FestivalType {
  DURGA_PUJA = 'DURGA_PUJA',
  DIWALI = 'DIWALI',
  HOLI = 'HOLI',
  VILLAGE_PUJA = 'VILLAGE_PUJA',
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
  INVOICES: 'invoices',
  ACCOUNT: 'account',
  TRANSACTIONS: 'transactions',
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
