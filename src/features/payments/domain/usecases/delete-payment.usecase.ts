import { IUseCase } from '@/core/shared/interfaces';
import { IPaymentRepository } from '../repositories/payment.repository.interface';

export class DeletePaymentUseCase implements IUseCase<string, void> {
  constructor(private paymentRepository: IPaymentRepository) {}

  async execute(id: string): Promise<void> {
    await this.paymentRepository.delete(id);
  }
}
