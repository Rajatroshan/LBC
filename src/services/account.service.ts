import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Account, Transaction } from '../models';
import { COLLECTIONS } from '@/constants';

export class AccountService {
  private accountCollectionRef = collection(db, COLLECTIONS.ACCOUNT);
  private transactionsCollectionRef = collection(db, COLLECTIONS.TRANSACTIONS);
  private MAIN_ACCOUNT_ID = 'main_account';

  /**
   * Get or create the main account
   */
  async getMainAccount(): Promise<Account> {
    try {
      const docRef = doc(db, COLLECTIONS.ACCOUNT, this.MAIN_ACCOUNT_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return this.toAccountEntity(docSnap);
      }
      
      // Create new account if doesn't exist
      const now = Timestamp.now();
      await setDoc(docRef, {
        balance: 0,
        totalIncome: 0,
        totalExpense: 0,
        createdAt: now,
        updatedAt: now,
      });
      
      const newDocSnap = await getDoc(docRef);
      return this.toAccountEntity(newDocSnap);
    } catch (error) {
      console.error('Error getting main account:', error);
      // Return default account
      return {
        id: this.MAIN_ACCOUNT_ID,
        balance: 0,
        totalIncome: 0,
        totalExpense: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  /**
   * Add income to account (from payment)
   */
  async addIncome(data: {
    amount: number;
    description: string;
    referenceId?: string;
    date: Date;
  }): Promise<void> {
    try {
      const account = await this.getMainAccount();
      const balanceBefore = account.balance;
      const balanceAfter = balanceBefore + data.amount;

      // Update account balance
      const accountRef = doc(db, COLLECTIONS.ACCOUNT, this.MAIN_ACCOUNT_ID);
      await updateDoc(accountRef, {
        balance: balanceAfter,
        totalIncome: account.totalIncome + data.amount,
        lastTransactionDate: Timestamp.fromDate(data.date),
        updatedAt: Timestamp.now(),
      });

      // Record transaction
      await this.recordTransaction({
        type: 'INCOME',
        amount: data.amount,
        balanceBefore,
        balanceAfter,
        description: data.description,
        referenceId: data.referenceId,
        referenceType: 'PAYMENT',
        date: data.date,
      });

      console.log(`Income added: ₹${data.amount}, New balance: ₹${balanceAfter}`);
    } catch (error) {
      console.error('Error adding income:', error);
      throw new Error('Failed to add income to account');
    }
  }

  /**
   * Deduct expense from account
   */
  async deductExpense(data: {
    amount: number;
    description: string;
    referenceId?: string;
    date: Date;
  }): Promise<void> {
    try {
      const account = await this.getMainAccount();
      const balanceBefore = account.balance;
      const balanceAfter = balanceBefore - data.amount;

      // Check if sufficient balance (optional - can be removed if overdraft allowed)
      if (balanceAfter < 0) {
        console.warn(`Warning: Account will go negative. Current: ₹${balanceBefore}, Deducting: ₹${data.amount}`);
      }

      // Update account balance
      const accountRef = doc(db, COLLECTIONS.ACCOUNT, this.MAIN_ACCOUNT_ID);
      await updateDoc(accountRef, {
        balance: balanceAfter,
        totalExpense: account.totalExpense + data.amount,
        lastTransactionDate: Timestamp.fromDate(data.date),
        updatedAt: Timestamp.now(),
      });

      // Record transaction
      await this.recordTransaction({
        type: 'EXPENSE',
        amount: data.amount,
        balanceBefore,
        balanceAfter,
        description: data.description,
        referenceId: data.referenceId,
        referenceType: 'EXPENSE',
        date: data.date,
      });

      console.log(`Expense deducted: ₹${data.amount}, New balance: ₹${balanceAfter}`);
    } catch (error) {
      console.error('Error deducting expense:', error);
      throw new Error('Failed to deduct expense from account');
    }
  }

  /**
   * Record a transaction
   */
  private async recordTransaction(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const now = Timestamp.now();
      await addDoc(this.transactionsCollectionRef, {
        ...data,
        date: Timestamp.fromDate(data.date),
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      console.error('Error recording transaction:', error);
      // Don't throw - transaction is secondary
    }
  }

  /**
   * Get recent transactions
   */
  async getRecentTransactions(limitCount: number = 10): Promise<Transaction[]> {
    try {
      const q = query(
        this.transactionsCollectionRef,
        orderBy('date', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => this.toTransactionEntity(doc));
    } catch (error) {
      console.error('Error getting recent transactions:', error);
      return [];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toAccountEntity(doc: any): Account {
    const data = doc.data();
    return {
      id: doc.id,
      balance: data.balance || 0,
      totalIncome: data.totalIncome || 0,
      totalExpense: data.totalExpense || 0,
      lastTransactionDate: data.lastTransactionDate?.toDate(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toTransactionEntity(doc: any): Transaction {
    const data = doc.data();
    return {
      id: doc.id,
      type: data.type,
      amount: data.amount,
      balanceBefore: data.balanceBefore,
      balanceAfter: data.balanceAfter,
      description: data.description,
      referenceId: data.referenceId,
      referenceType: data.referenceType,
      date: data.date?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
}

export const accountService = new AccountService();
