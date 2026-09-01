import { reimbursementService } from '../services/reimbursement.service';
import { userAccountService } from '../services/userAccount.service';
import { ReimbursementRequest, ReimbursementFilter, UserAccount } from '../models';

export class ReimbursementController {
  /**
   * Raise a reimbursement claim
   */
  async createClaim(data: {
    userId: string;
    userName: string;
    userEmail: string;
    amount: number;
    festivalId?: string;
    festivalName?: string;
    notes: string;
    payoutDetails?: string;
  }): Promise<ReimbursementRequest> {
    if (!data.userId) {
      throw new Error('User authentication required.');
    }

    if (!data.amount || data.amount <= 0) {
      throw new Error('Please specify a valid claim amount greater than ₹0.');
    }

    if (!data.notes || data.notes.trim().length === 0) {
      throw new Error('Please provide details or purpose for this reimbursement request.');
    }

    return await reimbursementService.createRequest(data);
  }

  /**
   * Get claims for a specific user
   */
  async getMyClaims(userId: string): Promise<ReimbursementRequest[]> {
    return await reimbursementService.getAll({ userId });
  }

  /**
   * Get all claims (Admin)
   */
  async getAllClaims(filter?: ReimbursementFilter): Promise<ReimbursementRequest[]> {
    return await reimbursementService.getAll(filter);
  }

  /**
   * Get a user's personal account balance
   */
  async getUserAccount(userId: string, defaultName?: string, defaultEmail?: string): Promise<UserAccount> {
    return await userAccountService.getUserAccount(userId, defaultName, defaultEmail);
  }

  /**
   * Get all user accounts (Admin)
   */
  async getAllUserAccounts(): Promise<UserAccount[]> {
    return await userAccountService.getAllUserAccounts();
  }

  /**
   * Approve a reimbursement claim (Admin)
   */
  async approveClaim(
    requestId: string, 
    admin: { id: string; name: string }
  ): Promise<{ request: ReimbursementRequest; pdfBlob: Blob; receiptNumber: string }> {
    if (!admin.id) {
      throw new Error('Admin authorization required to approve payouts.');
    }

    return await reimbursementService.approveRequest(requestId, admin);
  }

  /**
   * Reject a reimbursement claim (Admin)
   */
  async rejectClaim(
    requestId: string, 
    admin: { id: string; name: string },
    reason: string
  ): Promise<ReimbursementRequest> {
    if (!admin.id) {
      throw new Error('Admin authorization required to reject payouts.');
    }

    return await reimbursementService.rejectRequest(requestId, admin, reason);
  }
}

export const reimbursementController = new ReimbursementController();

