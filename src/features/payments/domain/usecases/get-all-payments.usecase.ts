import { IUseCase } from '@/core/shared/interfaces';
import { Payment } from '@/core/types';
import { IPaymentRepository } from '../repositories/payment.repository.interface';

export class GetAllPaymentsUseCase implements IUseCase<void, Payment[]> {
  constructor(private paymentRepository: IPaymentRepository) {}

  async execute(): Promise<Payment[]> {
    return await this.paymentRepository.getAll();
  }
}
