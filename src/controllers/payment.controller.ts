import { paymentService } from '../services/payment.service';
import { familyService } from '../services/family.service';
import { festivalService } from '../services/festival.service';
import { receiptService } from '../services/receipt.service';
import { accountService } from '../services/account.service';
import { Payment, PaymentFilter, Receipt } from '../models';
import { generateReceiptNumber } from '@/utils/pdf';

export class PaymentController {
  /**
   * Create a payment and optionally generate a receipt
   */
  async createPayment(data: {
    familyId: string;
    festivalId: string;
    amount: number;
    paidDate: Date;
    status: 'PAID' | 'UNPAID' | 'PENDING';
    receiptNumber?: string;
    notes?: string;
    generateReceipt?: boolean;
    generatedBy?: string;
  }): Promise<Payment> {
    // Validation
    if (!data.familyId || !data.festivalId || !data.amount) {
      throw new Error('Family ID, Festival ID, and amount are required');
    }

    if (data.amount <= 0) {
      throw new Error('Amount must be positive');
    }

    // Generate receipt number if payment is PAID and no receipt number provided
    if (data.status === 'PAID' && !data.receiptNumber) {
      data.receiptNumber = generateReceiptNumber();
    }

    const payment = await paymentService.create(data);

    // Add income to account if payment is PAID
    if (data.status === 'PAID') {
      try {
        // Get family and festival names for description
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
        console.error('Error adding income to account:', error);
        // Payment still created even if account update fails
      }
    }

    // Auto-generate receipt for PAID payments if requested
    if (data.generateReceipt && data.status === 'PAID' && data.generatedBy) {
      try {
        await this.generateReceiptForPayment(payment.id, data.generatedBy);
      } catch (error) {
        console.error('Error generating receipt:', error);
        // Payment is still created, just receipt generation failed
      }
    }

    return payment;
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
   * Generate receipt for a payment without Firebase Storage
   * Returns receipt metadata and PDF blob for immediate download
   */
  async generateReceiptWithoutStorage(
    paymentId: string, 
    userId: string
  ): Promise<{ receipt: Receipt; pdfBlob: Blob }> {
    // Get payment details
    const payment = await this.getPaymentById(paymentId);

    if (payment.status !== 'PAID') {
      throw new Error('Cannot generate receipt for unpaid payment');
    }

    // Check if receipt already exists
    const existingReceipt = await receiptService.getByPaymentId(paymentId);
    if (existingReceipt) {
      throw new Error('Receipt already exists for this payment');
    }

    // Get family and festival details for the receipt
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
    });

    // Update payment with receipt number
    if (receipt.receiptNumber && !payment.receiptNumber) {
      await paymentService.update(paymentId, {
        receiptNumber: receipt.receiptNumber,
      });
    }

    return { receipt, pdfBlob };
  }

  /**
   * Generate a receipt for an existing payment
   */
  async generateReceiptForPayment(paymentId: string, userId: string): Promise<Receipt> {
    // Get payment details
    const payment = await this.getPaymentById(paymentId);

    if (payment.status !== 'PAID') {
      throw new Error('Cannot generate receipt for unpaid payment');
    }

    // Check if receipt already exists
    const existingReceipt = await receiptService.getByPaymentId(paymentId);
    if (existingReceipt) {
      throw new Error('Receipt already exists for this payment');
    }

    // Get family and festival details for the receipt
    const family = await familyService.getById(payment.familyId);
    const festival = await festivalService.getById(payment.festivalId);

    if (!family || !festival) {
      throw new Error('Family or Festival not found');
    }

    // Generate receipt
    const receipt = await receiptService.generateReceipt({
      paymentId: payment.id,
      familyName: family.headName,
      festivalName: festival.name,
      amount: payment.amount,
      paidDate: payment.paidDate,
      generatedBy: userId,
      notes: payment.notes,
    });

    // Update payment with receipt number
    if (receipt.receiptNumber && !payment.receiptNumber) {
      await paymentService.update(paymentId, {
        receiptNumber: receipt.receiptNumber,
      });
    }

    return receipt;
  }

  /**
   * Get receipt for a payment
   */
  async getReceiptForPayment(paymentId: string): Promise<Receipt | null> {
    return await receiptService.getByPaymentId(paymentId);
  }

  /**
   * Download receipt PDF for a payment
   * Regenerates PDF from metadata if not stored
   */
  async downloadReceiptForPayment(paymentId: string): Promise<{ receiptNumber: string; pdfBlob: Blob } | null> {
    const receipt = await receiptService.getByPaymentId(paymentId);
    
    if (!receipt) {
      return null;
    }

    // Generate PDF from receipt metadata
    const pdfBlob = await receiptService.generatePDFFromReceipt(receipt);
    
    return {
      receiptNumber: receipt.receiptNumber,
      pdfBlob,
    };
  }
}

export const paymentController = new PaymentController();
