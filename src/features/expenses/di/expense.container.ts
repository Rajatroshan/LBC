import { FirebaseExpenseRepository } from '../data/repositories/firebase-expense.repository';
import { CreateExpenseUseCase } from '../domain/usecases/create-expense.usecase';
import { GetExpensesUseCase } from '../domain/usecases/get-expenses.usecase';
import { DeleteExpenseUseCase } from '../domain/usecases/delete-expense.usecase';

class ExpenseContainer {
  private _expenseRepository: FirebaseExpenseRepository | null = null;

  expenseRepository(): FirebaseExpenseRepository {
    if (!this._expenseRepository) {
      this._expenseRepository = new FirebaseExpenseRepository();
    }
    return this._expenseRepository;
  }

  createExpenseUseCase(): CreateExpenseUseCase {
    return new CreateExpenseUseCase(this.expenseRepository());
  }

  getExpensesUseCase(): GetExpensesUseCase {
    return new GetExpensesUseCase(this.expenseRepository());
  }

  deleteExpenseUseCase(): DeleteExpenseUseCase {
    return new DeleteExpenseUseCase(this.expenseRepository());
  }
}

export const expenseContainer = new ExpenseContainer();
