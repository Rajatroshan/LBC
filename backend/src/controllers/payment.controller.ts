import { PaymentRepository } from '../repositories/payment.repository';
import { Payment, PaymentFilter, ApiResponse } from '@shared/models';

export class PaymentController {
  private repository: PaymentRepository;

  constructor() {
    this.repository = new PaymentRepository();
  }

  async createPayment(data: {
    familyId: string;
    festivalId: string;
    amount: number;
    paidDate: Date;
    status: 'PAID' | 'UNPAID' | 'PENDING';
    receiptNumber?: string;
    notes?: string;
  }): Promise<ApiResponse<Payment>> {
    try {
      if (!data.familyId || !data.festivalId || !data.amount) {
        return {
          success: false,
          error: 'Family ID, Festival ID, and amount are required',
        };
      }

      const payment = await this.repository.create(data);

      return {
        success: true,
        data: payment,
        message: 'Payment recorded successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to record payment',
      };
    }
  }

  async getPaymentById(id: string): Promise<ApiResponse<Payment>> {
    try {
      const payment = await this.repository.getById(id);
      
      if (!payment) {
        return {
          success: false,
          error: 'Payment not found',
        };
      }

      return {
        success: true,
        data: payment,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get payment',
      };
    }
  }

  async getAllPayments(filter?: PaymentFilter): Promise<ApiResponse<Payment[]>> {
    try {
      const payments = await this.repository.getAll(filter);
      
      return {
        success: true,
        data: payments,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get payments',
      };
    }
  }

  async getPaymentsByFestival(festivalId: string): Promise<ApiResponse<Payment[]>> {
    try {
      const payments = await this.repository.getByFestival(festivalId);
      
      return {
        success: true,
        data: payments,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get festival payments',
      };
    }
  }

  async updatePayment(id: string, data: Partial<Payment>): Promise<ApiResponse<Payment>> {
    try {
      const payment = await this.repository.update(id, data);
      
      return {
        success: true,
        data: payment,
        message: 'Payment updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update payment',
      };
    }
  }

  async deletePayment(id: string): Promise<ApiResponse<void>> {
    try {
      await this.repository.delete(id);
      
      return {
        success: true,
        message: 'Payment deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete payment',
      };
    }
  }

  async getRecentPayments(limit: number = 10): Promise<ApiResponse<Payment[]>> {
    try {
      const payments = await this.repository.getRecentPayments(limit);
      
      return {
        success: true,
        data: payments,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get recent payments',
      };
    }
  }
}
