import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  Timestamp,
  QueryConstraint 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ReimbursementRequest, ReimbursementFilter } from '../models';
import { COLLECTIONS } from '@/constants';
import { accountService } from './account.service';
import { userAccountService } from './userAccount.service';
import { generateClaimNumber, generateReimbursementVoucherPDF } from '@/utils/pdf';

export class ReimbursementService {
  private collectionRef = collection(db, COLLECTIONS.REIMBURSEMENT_REQUESTS);

  /**
   * Create a new reimbursement request
   */
  async createRequest(data: {
    userId: string;
    userName: string;
    userEmail: string;
    amount: number;
    festivalId?: string;
    festivalName?: string;
    notes: string;
    payoutDetails?: string;
  }): Promise<ReimbursementRequest> {
    if (data.amount <= 0) {
      throw new Error('Claim amount must be greater than zero.');
    }

    const now = Timestamp.now();
    const docData = {
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      amount: data.amount,
      festivalId: data.festivalId || null,
      festivalName: data.festivalName || null,
      notes: data.notes || '',
      payoutDetails: data.payoutDetails || '',
      status: 'PENDING' as const,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(this.collectionRef, docData);
    const snap = await getDoc(docRef);
    return this.toEntity(snap);
  }

  /**
   * Get reimbursement request by ID
   */
  async getById(id: string): Promise<ReimbursementRequest | null> {
    const docRef = doc(db, COLLECTIONS.REIMBURSEMENT_REQUESTS, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return this.toEntity(snap);
  }

  /**
   * Get all reimbursement requests (with optional filters)
   */
  async getAll(filter?: ReimbursementFilter): Promise<ReimbursementRequest[]> {
    const constraints: QueryConstraint[] = [];

    if (filter?.userId) {
      constraints.push(where('userId', '==', filter.userId));
    }

    if (filter?.status) {
      constraints.push(where('status', '==', filter.status));
    }

    const q = query(this.collectionRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const requests = snapshot.docs.map(d => this.toEntity(d));
    // Sort descending by created date
    return requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Approve a reimbursement request:
   * 1. Deducts amount from Master Account
   * 2. Settles Member's Personal Account
   * 3. Generates Payout Voucher PDF with unique receipt number
   * 4. Updates Request status to APPROVED
   */
  async approveRequest(
    requestId: string, 
    admin: { id: string; name: string }
  ): Promise<{ request: ReimbursementRequest; pdfBlob: Blob; receiptNumber: string }> {
    const request = await this.getById(requestId);
    if (!request) {
      throw new Error('Reimbursement claim not found.');
    }

    if (request.status === 'APPROVED') {
      throw new Error('This reimbursement claim is already approved and settled.');
    }

    const receiptNumber = generateClaimNumber();
    const approvedDate = new Date();

    // 1. Deduct from Master Account
    const payoutDescription = `Reimbursement Payout to ${request.userName} (${receiptNumber}) - ${request.notes || 'Out-of-Pocket Expense Settlement'}`;
    await accountService.deductExpense({
      amount: request.amount,
      description: payoutDescription,
      referenceId: request.id,
      date: approvedDate,
    });

    // 2. Settle Member's Personal Account
    await userAccountService.recordReimbursementPayout(request.userId, request.amount);

    // 3. Update Request status to APPROVED
    const docRef = doc(db, COLLECTIONS.REIMBURSEMENT_REQUESTS, requestId);
    const now = Timestamp.now();
    await updateDoc(docRef, {
      status: 'APPROVED',
      approvedBy: admin.id,
      approvedByName: admin.name || 'Club Administrator',
      approvedAt: now,
      receiptNumber,
      updatedAt: now,
    });

    // 4. Generate Voucher PDF
    const pdfBlob = generateReimbursementVoucherPDF({
      voucherNumber: receiptNumber,
      beneficiaryName: request.userName,
      beneficiaryEmail: request.userEmail,
      amount: request.amount,
      approvedDate,
      approvedByName: admin.name || 'Club Administrator',
      festivalName: request.festivalName,
      notes: request.notes,
      payoutDetails: request.payoutDetails,
    });

    const updatedSnap = await getDoc(docRef);
    return {
      request: this.toEntity(updatedSnap),
      pdfBlob,
      receiptNumber,
    };
  }

  /**
   * Reject a reimbursement request
   */
  async rejectRequest(
    requestId: string, 
    admin: { id: string; name: string },
    rejectionReason: string
  ): Promise<ReimbursementRequest> {
    const request = await this.getById(requestId);
    if (!request) {
      throw new Error('Reimbursement claim not found.');
    }

    if (request.status === 'APPROVED') {
      throw new Error('Cannot reject an already approved reimbursement.');
    }

    const docRef = doc(db, COLLECTIONS.REIMBURSEMENT_REQUESTS, requestId);
    const now = Timestamp.now();
    await updateDoc(docRef, {
      status: 'REJECTED',
      approvedBy: admin.id,
      approvedByName: admin.name || 'Club Administrator',
      rejectionReason: rejectionReason || 'Request rejected by administrator.',
      updatedAt: now,
    });

    const updatedSnap = await getDoc(docRef);
    return this.toEntity(updatedSnap);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toEntity(doc: any): ReimbursementRequest {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      userName: data.userName || 'Member',
      userEmail: data.userEmail || '',
      amount: data.amount || 0,
      festivalId: data.festivalId || undefined,
      festivalName: data.festivalName || undefined,
      notes: data.notes || '',
      payoutDetails: data.payoutDetails || '',
      status: data.status || 'PENDING',
      approvedBy: data.approvedBy || undefined,
      approvedByName: data.approvedByName || undefined,
      approvedAt: data.approvedAt?.toDate() || undefined,
      receiptNumber: data.receiptNumber || undefined,
      rejectionReason: data.rejectionReason || undefined,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
}

export const reimbursementService = new ReimbursementService();
