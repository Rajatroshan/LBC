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

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
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

// Report Types
export interface FestivalReport {
  festivalId: string;
  festivalName: string;
  festivalDate: Date;
  totalFamilies: number;
  paidFamilies: number;
  unpaidFamilies: number;
  totalAmount: number;
  collectedAmount: number;
  pendingAmount: number;
  payments: PaymentDetail[];
}

export interface PaymentDetail {
  familyName: string;
  amount: number;
  paidDate: Date;
  status: string;
}

// Dashboard Types
export interface DashboardStats {
  totalFamilies: number;
  activeFamilies: number;
  totalFestivals: number;
  upcomingFestivals: number;
  totalCollectionThisYear: number;
  pendingPayments: number;
  recentPayments: Payment[];
  upcomingFestivalsList: Festival[];
}
