import { receiptService } from '../services/receipt.service';
import { Receipt } from '../models';

export class ReceiptController {
  /**
   * Generate a receipt for a payment
   */
  async generateReceipt(data: {
    paymentId: string;
    familyName: string;
    festivalName: string;
    amount: number;
    paidDate: Date;
    generatedBy: string;
    paymentMethod?: string;
    notes?: string;
  }): Promise<Receipt> {
    // Validation
    if (!data.paymentId || !data.familyName || !data.festivalName) {
      throw new Error('Payment ID, family name, and festival name are required');
    }

    if (!data.amount || data.amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    if (!data.generatedBy) {
      throw new Error('User ID is required to generate receipt');
    }

    return await receiptService.generateReceipt(data);
  }

  /**
   * Get receipt by ID
   */
  async getReceiptById(id: string): Promise<Receipt> {
    const receipt = await receiptService.getById(id);
    
    if (!receipt) {
      throw new Error('Receipt not found');
    }

    return receipt;
  }

  /**
   * Get receipt by payment ID
   */
  async getReceiptByPaymentId(paymentId: string): Promise<Receipt | null> {
    return await receiptService.getByPaymentId(paymentId);
  }

  /**
   * Get receipt by receipt number
   */
  async getReceiptByNumber(receiptNumber: string): Promise<Receipt | null> {
    return await receiptService.getByReceiptNumber(receiptNumber);
  }

  /**
   * Get all receipts for a family
   */
  async getReceiptsByFamily(familyName: string): Promise<Receipt[]> {
    if (!familyName) {
      throw new Error('Family name is required');
    }

    return await receiptService.getByFamily(familyName);
  }

  /**
   * Get all receipts for a festival
   */
  async getReceiptsByFestival(festivalName: string): Promise<Receipt[]> {
    if (!festivalName) {
      throw new Error('Festival name is required');
    }

    return await receiptService.getByFestival(festivalName);
  }

  /**
   * Get all receipts
   */
  async getAllReceipts(): Promise<Receipt[]> {
    return await receiptService.getAll();
  }

  /**
   * Delete a receipt
   */
  async deleteReceipt(id: string): Promise<void> {
    if (!id) {
      throw new Error('Receipt ID is required');
    }

    await receiptService.delete(id);
  }

  /**
   * Regenerate receipt PDF
   */
  async regenerateReceipt(receiptId: string): Promise<Receipt> {
    if (!receiptId) {
      throw new Error('Receipt ID is required');
    }

    return await receiptService.regenerateReceipt(receiptId);
  }
}

export const receiptController = new ReceiptController();
