import { IUseCase } from '@/core/shared/interfaces';
import { Payment } from '@/core/types';
import { PaymentStatus } from '@/core/constants';
import { IPaymentRepository } from '../repositories/payment.repository.interface';

export interface RecordPaymentInput {
  familyId: string;
  festivalId: string;
  amount: number;
  paidDate: Date;
  notes?: string;
}

export class RecordPaymentUseCase implements IUseCase<RecordPaymentInput, Payment> {
  constructor(private paymentRepository: IPaymentRepository) {}

  async execute(input: RecordPaymentInput): Promise<Payment> {
    const receiptNumber = this.generateReceiptNumber();
    
    return await this.paymentRepository.create({
      ...input,
      status: PaymentStatus.PAID,
      receiptNumber,
    });
  }

  private generateReceiptNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `LBC${timestamp}${random}`;
  }
}
