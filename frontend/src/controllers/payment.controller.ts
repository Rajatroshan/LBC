import { paymentService } from '../services/payment.service';
import { Payment, PaymentFilter } from '../models';

export class PaymentController {
  async createPayment(data: {
    familyId: string;
    festivalId: string;
    amount: number;
    paidDate: Date;
    status: 'PAID' | 'UNPAID' | 'PENDING';
    receiptNumber?: string;
    notes?: string;
  }): Promise<Payment> {
    // Validation
    if (!data.familyId || !data.festivalId || !data.amount) {
      throw new Error('Family ID, Festival ID, and amount are required');
    }

    if (data.amount <= 0) {
      throw new Error('Amount must be positive');
    }

    return await paymentService.create(data);
  }

  async getPaymentById(id: string): Promise<Payment> {
    const payment = await paymentService.getById(id);
    
    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  }

  async getAllPayments(filter?: PaymentFilter): Promise<Payment[]> {
    return await paymentService.getAll(filter);
  }

  async getPaymentsByFestival(festivalId: string): Promise<Payment[]> {
    return await paymentService.getByFestival(festivalId);
  }

  async getRecentPayments(limit: number = 10): Promise<Payment[]> {
    return await paymentService.getRecent(limit);
  }

  async updatePayment(id: string, data: Partial<Payment>): Promise<void> {
    await paymentService.update(id, data);
  }

  async deletePayment(id: string): Promise<void> {
    await paymentService.delete(id);
  }
}

export const paymentController = new PaymentController();
