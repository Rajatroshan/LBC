import { IUseCase } from '@/core/shared/interfaces';
import { Expense, ExpenseFilter } from '@/core/types';
import { IExpenseRepository } from '../repositories/expense.repository.interface';

export class GetExpensesUseCase implements IUseCase<ExpenseFilter, Expense[]> {
  constructor(private expenseRepository: IExpenseRepository) {}

  async execute(filter: ExpenseFilter = {}): Promise<Expense[]> {
    return await this.expenseRepository.getFiltered(filter);
  }
}
