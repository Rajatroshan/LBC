import { IUseCase } from '@/core/shared/interfaces';
import { IExpenseRepository } from '../repositories/expense.repository.interface';

export class DeleteExpenseUseCase implements IUseCase<string, void> {
  constructor(private expenseRepository: IExpenseRepository) {}

  async execute(id: string): Promise<void> {
    await this.expenseRepository.delete(id);
  }
}
