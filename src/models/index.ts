// Base Types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User Types
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  phone?: string;
  photoURL?: string;
}

// Family Types
export interface Family extends BaseEntity {
  headName: string;
  members: number;
  phone: string;
  address: string;
  isActive: boolean;
}

// Festival Types
export interface Festival extends BaseEntity {
  name: string;
  type: string;
  date: Date;
  amountPerFamily: number;
  description?: string;
  isActive: boolean;
}

// Payment Types
export interface Payment extends BaseEntity {
  familyId: string;
  festivalId: string;
  amount: number;
  paidDate: Date;
  status: 'PAID' | 'UNPAID' | 'PENDING';
  receiptNumber?: string;
  notes?: string;
}

// Receipt Types
export interface Receipt extends BaseEntity {
  paymentId: string;
  receiptNumber: string;
  familyName: string;
  festivalName: string;
  amount: number;
  paidDate: Date;
  generatedBy: string;
  pdfUrl?: string;
}

// Expense Types (for tracking outgoing payments)
export interface Expense extends BaseEntity {
  purpose: string;
  category: 'TENT' | 'FOOD' | 'DECORATION' | 'ENTERTAINMENT' | 'UTILITIES' | 'TRANSPORT' | 'SOUND_LIGHT' | 'PRIEST' | 'OTHER';
  amount: number;
  expenseDate: Date;
  paidTo: string;
  contactNumber?: string;
  festivalId?: string;
  notes?: string;
  receiptUrl?: string;
}

// Invoice Types (for expense invoices)
export interface Invoice extends BaseEntity {
  expenseId: string;
  invoiceNumber: string;
  vendorName: string;
  purpose: string;
  amount: number;
  expenseDate: Date;
  generatedBy: string;
  contactNumber?: string;
  notes?: string;
  pdfUrl?: string;
}

// Account/Wallet Types (for tracking main account balance)
export interface Account extends BaseEntity {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  lastTransactionDate?: Date;
}

// Transaction Types (for tracking account history)
export interface Transaction extends BaseEntity {
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  referenceId?: string; // Payment ID or Expense ID
  referenceType?: 'PAYMENT' | 'EXPENSE';
  date: Date;
}

// Filter Types
export interface FamilyFilter {
  search?: string;
  isActive?: boolean;
}

export interface FestivalFilter {
  search?: string;
  year?: number;
  type?: string;
  isActive?: boolean;
}

export interface PaymentFilter {
  festivalId?: string;
  familyId?: string;
  status?: 'PAID' | 'UNPAID' | 'PENDING';
  startDate?: Date;
  endDate?: Date;
}

export interface ExpenseFilter {
  festivalId?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
}

// Dashboard Types
export interface DashboardStats {
  totalFamilies: number;
  activeFamilies: number;
  totalFestivals: number;
  upcomingFestivals: number;
  totalCollectionThisYear: number;
  totalExpenseThisYear: number;
  currentBalance: number;
  pendingPayments: number;
  recentPayments: Payment[];
  upcomingFestivalsList: Festival[];
  recentTransactions: Transaction[];
}
