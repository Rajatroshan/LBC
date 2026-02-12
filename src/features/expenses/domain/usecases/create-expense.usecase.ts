import { IUseCase } from '@/core/shared/interfaces';
import { Expense } from '@/core/types';
import { IExpenseRepository } from '../repositories/expense.repository.interface';

export interface CreateExpenseInput {
  purpose: string;
  category: 'TENT' | 'FOOD' | 'DECORATION' | 'ENTERTAINMENT' | 'UTILITIES' | 'OTHER';
  amount: number;
  expenseDate: Date;
  paidTo: string;
  contactNumber?: string;
  festivalId?: string;
  notes?: string;
}

export class CreateExpenseUseCase implements IUseCase<CreateExpenseInput, Expense> {
  constructor(private expenseRepository: IExpenseRepository) {}

  async execute(input: CreateExpenseInput): Promise<Expense> {
    const expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'> = {
      purpose: input.purpose,
      category: input.category,
      amount: input.amount,
      expenseDate: input.expenseDate,
      paidTo: input.paidTo,
      contactNumber: input.contactNumber,
      festivalId: input.festivalId,
      notes: input.notes,
    };

    return await this.expenseRepository.create(expense);
  }
}
