import { IUseCase } from '@/core/shared/interfaces';
import { Payment } from '@/core/types';
import { IPaymentRepository } from '../repositories/payment.repository.interface';
import { NotFoundError } from '@/core/error';

export interface UpdatePaymentInput {
  id: string;
  data: Partial<Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>>;
}

export class UpdatePaymentUseCase implements IUseCase<UpdatePaymentInput, Payment> {
  constructor(private paymentRepository: IPaymentRepository) {}

  async execute(input: UpdatePaymentInput): Promise<Payment> {
    const existing = await this.paymentRepository.getById(input.id);
    if (!existing) {
      throw new NotFoundError('Payment');
    }
    return await this.paymentRepository.update(input.id, input.data);
  }
}
