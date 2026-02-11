import { Payment, PaymentFilter } from '@/core/types';

export interface IPaymentRepository {
  getById(id: string): Promise<Payment | null>;
  getAll(): Promise<Payment[]>;
  getFiltered(filter: PaymentFilter): Promise<Payment[]>;
  getByFestival(festivalId: string): Promise<Payment[]>;
  getByFamily(familyId: string): Promise<Payment[]>;
  create(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment>;
  update(id: string, data: Partial<Payment>): Promise<Payment>;
  delete(id: string): Promise<void>;
}
