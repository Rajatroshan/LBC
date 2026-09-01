import { paymentService } from '../services/payment.service';
import { familyService } from '../services/family.service';
import { festivalService } from '../services/festival.service';
import { receiptService } from '../services/receipt.service';
import { accountService } from '../services/account.service';
import { Payment, PaymentFilter, Receipt } from '../models';
import { generateReceiptNumber } from '@/utils/pdf';

export class PaymentController {
  /**
   * Create a payment (Admin -> PAID immediately; Regular Member -> UNPAID/PENDING verification)
   */
  async createPayment(data: {
    familyId: string;
    festivalId: string;
    amount: number;
    paidDate: Date;
    status?: 'PAID' | 'UNPAID' | 'PENDING';
    receiptNumber?: string;
    notes?: string;
    generateReceipt?: boolean;
    generatedBy?: string;
    isAdmin?: boolean;
    submittedByUserId?: string;
    submittedByUserName?: string;
  }): Promise<Payment> {
    // Validation
    if (!data.familyId || !data.festivalId || !data.amount) {
      throw new Error('Family ID, Festival ID, and amount are required');
    }

    if (data.amount <= 0) {
      throw new Error('Amount must be positive');
    }

    // Determine status based on Admin role if not explicitly provided
    const isActuallyAdmin = data.isAdmin === true;
    const finalStatus: 'PAID' | 'UNPAID' | 'PENDING' = isActuallyAdmin 
      ? 'PAID' 
      : (data.status || 'UNPAID');

    // Generate slip/receipt number
    const finalReceiptNumber = data.receiptNumber || generateReceiptNumber();

    const payment = await paymentService.create({
      familyId: data.familyId,
      festivalId: data.festivalId,
      amount: data.amount,
      paidDate: data.paidDate,
      status: finalStatus,
      receiptNumber: finalReceiptNumber,
      notes: data.notes,
      submittedByUserId: data.submittedByUserId,
      submittedByUserName: data.submittedByUserName,
      verifiedByUserId: isActuallyAdmin ? data.generatedBy : undefined,
      verifiedByUserName: isActuallyAdmin ? data.submittedByUserName : undefined,
      verifiedAt: isActuallyAdmin ? new Date() : undefined,
    });

    // Add income to master account ONLY if payment is PAID (Admin verified)
    if (finalStatus === 'PAID') {
      try {
        const family = await familyService.getById(data.familyId);
        const festival = await festivalService.getById(data.festivalId);
        
        const description = `Payment received from ${family?.headName || 'Unknown'} for ${festival?.name || 'Unknown'}`;
        
        await accountService.addIncome({
          amount: data.amount,
          description,
          referenceId: payment.id,
          date: data.paidDate,
        });
      } catch (error) {
        console.error('Error adding income to master account:', error);
      }
    }

    return payment;
  }

  /**
   * Admin verifies a pending/unpaid member payment
   * Transitions status to PAID, credits Master Account, and generates official receipt
   */
  async verifyPayment(
    paymentId: string, 
    adminUser: { id: string; name: string }
  ): Promise<{ payment: Payment; receipt: Receipt; pdfBlob: Blob }> {
    const payment = await this.getPaymentById(paymentId);

    if (payment.status === 'PAID') {
      throw new Error('This payment has already been verified and marked as PAID.');
    }

    const verifiedAt = new Date();
    const receiptNumber = payment.receiptNumber || generateReceiptNumber();

    // 1. Update Payment status in Firestore
    await paymentService.update(paymentId, {
      status: 'PAID',
      receiptNumber,
      verifiedByUserId: adminUser.id,
      verifiedByUserName: adminUser.name,
      verifiedAt,
    });

    // 2. Add income to Master Account
    try {
      const family = await familyService.getById(payment.familyId);
      const festival = await festivalService.getById(payment.festivalId);
      
      const description = `Verified payment from ${family?.headName || 'Unknown'} for ${festival?.name || 'Unknown'}`;
      
      await accountService.addIncome({
        amount: payment.amount,
        description,
        referenceId: payment.id,
        date: payment.paidDate,
      });
    } catch (error) {
      console.error('Error adding income to account during verification:', error);
    }

    // 3. Generate official verified receipt
    const family = await familyService.getById(payment.familyId);
    const festival = await festivalService.getById(payment.festivalId);

    const { receipt, pdfBlob } = await receiptService.generateReceiptWithoutStorage({
      paymentId: payment.id,
      familyName: family?.headName || 'Unknown Family',
      festivalName: festival?.name || 'Unknown Festival',
      amount: payment.amount,
      paidDate: payment.paidDate,
      generatedBy: adminUser.id,
      notes: payment.notes,
      isProvisional: false,
      submittedByName: payment.submittedByUserName,
      verifiedByName: adminUser.name,
    });

    const updatedPayment = await this.getPaymentById(paymentId);
    return { payment: updatedPayment, receipt, pdfBlob };
  }

  async getPaymentById(id: string): Promise<Payment> {
    const payment = await paymentService.getById(id);
    
    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  }

  async getAllPayments(filter?: PaymentFilter): Promise<Payment[]> {
    return await paymentService.getAll(filter);
  }

  async getPaymentsByFestival(festivalId: string): Promise<Payment[]> {
    return await paymentService.getByFestival(festivalId);
  }

  async getRecentPayments(limit: number = 10): Promise<Payment[]> {
    return await paymentService.getRecent(limit);
  }

  async updatePayment(id: string, data: Partial<Payment>): Promise<void> {
    await paymentService.update(id, data);
  }

  async deletePayment(id: string): Promise<void> {
    await paymentService.delete(id);
  }

  /**
   * Generate receipt or provisional slip without storage
   * Returns receipt metadata and PDF blob for immediate download
   */
  async generateReceiptWithoutStorage(
    paymentId: string, 
    userId: string,
    userName?: string
  ): Promise<{ receipt: Receipt; pdfBlob: Blob }> {
    // Get payment details
    const payment = await this.getPaymentById(paymentId);
    const isProvisional = payment.status !== 'PAID';

    // Get family and festival details
    const family = await familyService.getById(payment.familyId);
    const festival = await festivalService.getById(payment.festivalId);

    if (!family || !festival) {
      throw new Error('Family or Festival not found');
    }

    // Generate receipt without storage
    const { receipt, pdfBlob } = await receiptService.generateReceiptWithoutStorage({
      paymentId: payment.id,
      familyName: family.headName,
      festivalName: festival.name,
      amount: payment.amount,
      paidDate: payment.paidDate,
      generatedBy: userId,
      notes: payment.notes,
      isProvisional,
      submittedByName: payment.submittedByUserName || userName,
      verifiedByName: payment.verifiedByUserName,
    });

    // Update payment with receipt number if missing
    if (receipt.receiptNumber && !payment.receiptNumber) {
      await paymentService.update(paymentId, {
        receiptNumber: receipt.receiptNumber,
      });
    }

    return { receipt, pdfBlob };
  }

  /**
   * Download receipt PDF for a payment
   */
  async downloadReceiptForPayment(paymentId: string): Promise<{ receiptNumber: string; pdfBlob: Blob } | null> {
    const payment = await this.getPaymentById(paymentId);
    const receipt = await receiptService.getByPaymentId(paymentId);
    
    if (receipt) {
      const pdfBlob = await receiptService.generatePDFFromReceipt(receipt);
      return {
        receiptNumber: receipt.receiptNumber,
        pdfBlob,
      };
    }

    // If receipt not in db, generate dynamically
    const family = await familyService.getById(payment.familyId);
    const festival = await festivalService.getById(payment.festivalId);

    if (!family || !festival) return null;

    const { receipt: newReceipt, pdfBlob } = await receiptService.generateReceiptWithoutStorage({
      paymentId: payment.id,
      familyName: family.headName,
      festivalName: festival.name,
      amount: payment.amount,
      paidDate: payment.paidDate,
      generatedBy: payment.submittedByUserId || 'System',
      notes: payment.notes,
      isProvisional: payment.status !== 'PAID',
      submittedByName: payment.submittedByUserName,
      verifiedByName: payment.verifiedByUserName,
    });

    return {
      receiptNumber: newReceipt.receiptNumber,
      pdfBlob,
    };
  }

  /**
   * Get receipt document for a payment
   */
  async getReceiptForPayment(paymentId: string): Promise<Receipt | null> {
    return await receiptService.getByPaymentId(paymentId);
  }
}

export const paymentController = new PaymentController();
