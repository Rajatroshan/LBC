import { expenseService } from '../services/expense.service';
import { accountService } from '../services/account.service';
import { userAccountService } from '../services/userAccount.service';
import { Expense, ExpenseFilter, PaymentSourceType } from '../models';

export class ExpenseController {
  /**
   * Create an expense
   * - If Admin pays with MASTER_ACCOUNT -> APPROVED immediately & deducted from treasury
   * - If Member pays with MASTER_ACCOUNT -> PENDING_APPROVAL (does not deduct until Admin approves)
   * - If Member pays with PERSONAL_OUT_OF_POCKET -> Logged to member ledger for reimbursement
   */
  async createExpense(data: {
    purpose: string;
    category: 'TENT' | 'FOOD' | 'DECORATION' | 'ENTERTAINMENT' | 'UTILITIES' | 'TRANSPORT' | 'SOUND_LIGHT' | 'PRIEST' | 'OTHER';
    amount: number;
    expenseDate: Date;
    paidTo: string;
    contactNumber?: string;
    festivalId?: string;
    notes?: string;
    receiptUrl?: string;
    paymentSource?: PaymentSourceType;
    paidByUserId?: string;
    paidByUserName?: string;
    paidByUserEmail?: string;
    isAdmin?: boolean;
  }): Promise<Expense> {
    // Validation
    if (!data.purpose || !data.category || !data.amount || !data.paidTo) {
      throw new Error('Purpose, category, amount, and paid to are required');
    }

    if (data.amount <= 0) {
      throw new Error('Amount must be positive');
    }

    const paymentSource = data.paymentSource || 'MASTER_ACCOUNT';
    const isActuallyAdmin = data.isAdmin === true;

    // Determine approval status:
    // If personal out-of-pocket: APPROVED (tracked in user ledger)
    // If master account by Admin: APPROVED (direct payout)
    // If master account by Member: PENDING_APPROVAL (requires Admin verification)
    let approvalStatus: 'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED' = 'APPROVED';
    if (paymentSource === 'MASTER_ACCOUNT' && !isActuallyAdmin) {
      approvalStatus = 'PENDING_APPROVAL';
    }

    const expense = await expenseService.create({
      purpose: data.purpose,
      category: data.category,
      amount: data.amount,
      expenseDate: data.expenseDate,
      paidTo: data.paidTo,
      contactNumber: data.contactNumber,
      festivalId: data.festivalId,
      notes: data.notes,
      receiptUrl: data.receiptUrl,
      paymentSource,
      paidByUserId: data.paidByUserId,
      paidByUserName: data.paidByUserName,
      paidByUserEmail: data.paidByUserEmail,
      reimbursementStatus: paymentSource === 'PERSONAL_OUT_OF_POCKET' ? 'PENDING' : 'NONE',
      approvalStatus,
      approvedByUserId: isActuallyAdmin ? data.paidByUserId : undefined,
      approvedByUserName: isActuallyAdmin ? data.paidByUserName : undefined,
      approvedAt: isActuallyAdmin ? new Date() : undefined,
    });

    if (paymentSource === 'PERSONAL_OUT_OF_POCKET' && data.paidByUserId) {
      // 1. Paid from member's personal pocket -> Log in Member's personal account
      try {
        await userAccountService.recordOutOfPocket(
          data.paidByUserId,
          data.paidByUserName || 'Member',
          data.paidByUserEmail || '',
          data.amount
        );
      } catch (error) {
        console.error('Error logging user out-of-pocket balance:', error);
      }
    } else if (paymentSource === 'MASTER_ACCOUNT' && isActuallyAdmin) {
      // 2. Paid from Club Master Account by Admin -> Deduct immediately
      try {
        const description = `Expense: ${data.purpose} - Paid to ${data.paidTo}`;
        
        await accountService.deductExpense({
          amount: data.amount,
          description,
          referenceId: expense.id,
          date: data.expenseDate,
        });
      } catch (error) {
        console.error('Error deducting expense from account:', error);
      }
    }
    // Note: If paymentSource === 'MASTER_ACCOUNT' and !isActuallyAdmin, it does NOT deduct now!
    // It will be deducted when Admin approves it via approveMasterAccountExpense()

    return expense;
  }

  /**
   * Admin approves a member-requested Master Account expense
   * Deducts from Master Account and sets approvalStatus to APPROVED
   */
  async approveMasterAccountExpense(
    expenseId: string, 
    adminUser: { id: string; name: string }
  ): Promise<Expense> {
    const expense = await this.getExpenseById(expenseId);

    if (expense.approvalStatus === 'APPROVED') {
      throw new Error('This expense is already approved.');
    }

    // 1. Deduct from Master Account
    const description = `Approved Expense: ${expense.purpose} - Paid to ${expense.paidTo}`;
    await accountService.deductExpense({
      amount: expense.amount,
      description,
      referenceId: expense.id,
      date: expense.expenseDate,
    });

    // 2. Update expense status in Firestore
    const approvedAt = new Date();
    await expenseService.update(expenseId, {
      approvalStatus: 'APPROVED',
      approvedByUserId: adminUser.id,
      approvedByUserName: adminUser.name,
      approvedAt,
    });

    return await this.getExpenseById(expenseId);
  }

  /**
   * Admin rejects a member-requested Master Account expense
   */
  async rejectMasterAccountExpense(
    expenseId: string, 
    adminUser: { id: string; name: string },
    reason = 'Declined by administrator'
  ): Promise<void> {
    await expenseService.update(expenseId, {
      approvalStatus: 'REJECTED',
      approvedByUserId: adminUser.id,
      approvedByUserName: adminUser.name,
      rejectionReason: reason,
    });
  }

  async getExpenseById(id: string): Promise<Expense> {
    const expense = await expenseService.getById(id);
    
    if (!expense) {
      throw new Error('Expense not found');
    }

    return expense;
  }

  async getAllExpenses(filter?: ExpenseFilter): Promise<Expense[]> {
    return await expenseService.getAll(filter);
  }

  async updateExpense(id: string, data: Partial<Expense>): Promise<void> {
    await expenseService.update(id, data);
  }

  async deleteExpense(id: string): Promise<void> {
    await expenseService.delete(id);
  }
}

export const expenseController = new ExpenseController();
