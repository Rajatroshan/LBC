// Predefined Public Festivals list for dropdown
export const PREDEFINED_FESTIVALS = [
  'Durga Puja',
  'Ganesh Chaturthi',
  'Diwali',
  'Laxmi Puja',
  'Kali Puja',
  'Holi',
  'Navratri',
  'Dussehra / Vijayadashami',
  'Makar Sankranti / Pongal',
  'Saraswati Puja / Vasant Panchami',
  'Janmashtami',
  'Maha Shivratri',
  'Ram Navami',
  'Chhath Puja',
  'Jagannath Rath Yatra',
  'Raksha Bandhan',
  'Eid-ul-Fitr',
  'Eid-ul-Adha',
  'Christmas',
  'New Year Celebration',
  'Village Annual Puja',
  'OTHER',
] as const;

// Expense Categories
export enum ExpenseCategory {
  TENT = 'TENT',
  FOOD = 'FOOD',
  DECORATION = 'DECORATION',
  ENTERTAINMENT = 'ENTERTAINMENT',
  UTILITIES = 'UTILITIES',
  TRANSPORT = 'TRANSPORT',
  SOUND_LIGHT = 'SOUND_LIGHT',
  PRIEST = 'PRIEST',
  OTHER = 'OTHER',
}

// Expense Category Labels (for display)
export const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  TENT: 'Tent & Pandal',
  FOOD: 'Food & Catering',
  DECORATION: 'Decoration',
  ENTERTAINMENT: 'Entertainment (DJ, Band)',
  UTILITIES: 'Utilities (Electricity, Water)',
  TRANSPORT: 'Transport',
  SOUND_LIGHT: 'Sound & Lighting',
  PRIEST: 'Priest & Rituals',
  OTHER: 'Other',
};

// Payment Source Options
export const PAYMENT_SOURCES = {
  MASTER_ACCOUNT: 'MASTER_ACCOUNT',
  PERSONAL_OUT_OF_POCKET: 'PERSONAL_OUT_OF_POCKET',
} as const;

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
  USER_ACCOUNTS: 'user_accounts',
  REIMBURSEMENT_REQUESTS: 'reimbursement_requests',
  NEWS_POSTS: 'news_posts',
} as const;

// News Categories & Display Labels
export const NEWS_CATEGORY_LABELS: Record<string, string> = {
  PUJA_UPDATE: 'Puja & Mandap Updates',
  SABHA_NOTICE: 'Gram Sabha Notices',
  DEVELOPMENT: 'Village Development Work',
  FESTIVAL_SCHEDULE: 'Festival Schedule & Tithi',
  YOUTH_EVENT: 'Youth & Sports Events',
  EMERGENCY: 'Emergency & Urgent Alert',
  GENERAL: 'General Village News',
};

export const NEWS_CATEGORY_ICONS: Record<string, string> = {
  PUJA_UPDATE: '🪔',
  SABHA_NOTICE: '📢',
  DEVELOPMENT: '🏗️',
  FESTIVAL_SCHEDULE: '📅',
  YOUTH_EVENT: '🏏',
  EMERGENCY: '🚨',
  GENERAL: '🌾',
};

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
  PHONE_REGEX: /^[0-9]{10,15}$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  ADDRESS_MAX_LENGTH: 500,
  MIN_AMOUNT: 0,
  MAX_AMOUNT: 1000000,
} as const;
