import { IUseCase } from '@/core/shared/interfaces';
import { Payment } from '@/core/types';
import { IPaymentRepository } from '../repositories/payment.repository.interface';

export class GetPaymentsByFestivalUseCase implements IUseCase<string, Payment[]> {
  constructor(private paymentRepository: IPaymentRepository) {}

  async execute(festivalId: string): Promise<Payment[]> {
    return await this.paymentRepository.getByFestival(festivalId);
  }
}
