import { IRepository } from '@/core/shared/interfaces';
import { Expense, ExpenseFilter } from '@/core/types';

export interface IExpenseRepository extends IRepository<Expense> {
  getFiltered(filter: ExpenseFilter): Promise<Expense[]>;
  getTotalByFestival(festivalId: string): Promise<number>;
}
