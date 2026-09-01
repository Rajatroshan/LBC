import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  Timestamp,
  increment 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserAccount } from '../models';
import { COLLECTIONS } from '@/constants';

export class UserAccountService {
  private collectionRef = collection(db, COLLECTIONS.USER_ACCOUNTS);

  /**
   * Get or initialize a member's personal account
   */
  async getUserAccount(userId: string, defaultName = 'Member', defaultEmail = ''): Promise<UserAccount> {
    try {
      const docRef = doc(db, COLLECTIONS.USER_ACCOUNTS, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return this.toEntity(docSnap);
      }

      // Return default user account object if not created yet
      return {
        id: userId,
        userId,
        userName: defaultName,
        userEmail: defaultEmail,
        totalPaidOutOfPocket: 0,
        totalReimbursed: 0,
        pendingReimbursement: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error getting user account:', error);
      return {
        id: userId,
        userId,
        userName: defaultName,
        userEmail: defaultEmail,
        totalPaidOutOfPocket: 0,
        totalReimbursed: 0,
        pendingReimbursement: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  /**
   * Record an out-of-pocket payment made by a member
   */
  async recordOutOfPocket(
    userId: string, 
    userName: string, 
    userEmail: string, 
    amount: number
  ): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USER_ACCOUNTS, userId);
    const docSnap = await getDoc(docRef);
    const now = Timestamp.now();

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        userId,
        userName: userName || 'Member',
        userEmail: userEmail || '',
        totalPaidOutOfPocket: amount,
        totalReimbursed: 0,
        pendingReimbursement: amount,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      await updateDoc(docRef, {
        userName: userName || docSnap.data().userName,
        userEmail: userEmail || docSnap.data().userEmail,
        totalPaidOutOfPocket: increment(amount),
        pendingReimbursement: increment(amount),
        updatedAt: now,
      });
    }
  }

  /**
   * Record a reimbursement payout made back to the member
   */
  async recordReimbursementPayout(userId: string, amount: number): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USER_ACCOUNTS, userId);
    const now = Timestamp.now();

    await updateDoc(docRef, {
      totalReimbursed: increment(amount),
      pendingReimbursement: increment(-amount),
      updatedAt: now,
    });
  }

  /**
   * Get all user accounts (Admin overview)
   */
  async getAllUserAccounts(): Promise<UserAccount[]> {
    try {
      const snapshot = await getDocs(this.collectionRef);
      return snapshot.docs.map(doc => this.toEntity(doc));
    } catch (error) {
      console.error('Error in getAllUserAccounts:', error);
      return [];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toEntity(doc: any): UserAccount {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId || doc.id,
      userName: data.userName || 'Member',
      userEmail: data.userEmail || '',
      totalPaidOutOfPocket: data.totalPaidOutOfPocket || 0,
      totalReimbursed: data.totalReimbursed || 0,
      pendingReimbursement: data.pendingReimbursement || 0,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
}

export const userAccountService = new UserAccountService();

