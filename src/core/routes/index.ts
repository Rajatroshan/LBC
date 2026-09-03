// Application Routes
export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  
  // Family routes
  FAMILIES: '/families',
  FAMILY_DETAIL: (id: string) => `/families/${id}`,
  FAMILY_CREATE: '/families/create',
  FAMILY_EDIT: (id: string) => `/families/${id}/edit`,
  
  // Festival routes
  FESTIVALS: '/festivals',
  FESTIVAL_DETAIL: (id: string) => `/festivals/${id}`,
  FESTIVAL_CREATE: '/festivals/create',
  FESTIVAL_EDIT: (id: string) => `/festivals/${id}/edit`,
  
  // Payment routes
  PAYMENTS: '/payments',
  PAYMENT_RECORD: '/payments/record',
  
  // Expense & Reimbursement routes
  EXPENSES: '/expenses',
  EXPENSE_RECORD: '/expenses/record',
  REIMBURSEMENTS: '/reimbursements',
  
  // Receipt routes
  RECEIPTS: '/receipts',
  
  // Calendar routes
  CALENDAR: '/calendar',
  
  // Reports routes
  REPORTS: '/reports',
  REPORT_FESTIVAL: (festivalId: string) => `/reports/festival/${festivalId}`,
  
  // Member approvals route (Admin only)
  MEMBERS: '/members',

  // News & Notice Board routes
  NEWS: '/news',

  // Settings routes
  SETTINGS: '/settings',
} as const;
