import { invoiceService } from '../services/invoice.service';
import { expenseService } from '../services/expense.service';
import { Invoice } from '../models';

export class InvoiceController {
  /**
   * Generate invoice for an expense without Firebase Storage
   * Returns invoice metadata and PDF blob for immediate download
   */
  async generateInvoiceForExpense(
    expenseId: string,
    userId: string
  ): Promise<{ invoice: Invoice; pdfBlob: Blob }> {
    // Ensure expense exists
    const expense = await expenseService.getById(expenseId);
    if (!expense) {
      throw new Error('Expense not found');
    }

    // Check if invoice already exists
    const existingInvoice = await invoiceService.getByExpenseId(expenseId);
    if (existingInvoice) {
      throw new Error('Invoice already exists for this expense');
    }

    // Generate invoice without storage
    const { invoice, pdfBlob } = await invoiceService.generateInvoiceWithoutStorage({
      expenseId: expense.id,
      vendorName: expense.paidTo,
      purpose: expense.purpose,
      amount: expense.amount,
      expenseDate: expense.expenseDate,
      generatedBy: userId,
      contactNumber: expense.contactNumber,
      notes: expense.notes,
    });

    return { invoice, pdfBlob };
  }

  /**
   * Get invoice for an expense
   */
  async getInvoiceForExpense(expenseId: string): Promise<Invoice | null> {
    return await invoiceService.getByExpenseId(expenseId);
  }

  /**
   * Download invoice PDF for an expense
   * Regenerates PDF from metadata if not stored
   */
  async downloadInvoiceForExpense(expenseId: string): Promise<{ invoiceNumber: string; pdfBlob: Blob } | null> {
    const invoice = await invoiceService.getByExpenseId(expenseId);
    
    if (!invoice) {
      return null;
    }

    // Generate PDF from invoice metadata
    const pdfBlob = await invoiceService.generatePDFFromInvoice(invoice);
    
    return {
      invoiceNumber: invoice.invoiceNumber,
      pdfBlob,
    };
  }

  /**
   * Get all invoices
   */
  async getAllInvoices(): Promise<Invoice[]> {
    return await invoiceService.getAll();
  }

  /**
   * Delete invoice
   */
  async deleteInvoice(id: string): Promise<void> {
    await invoiceService.delete(id);
  }
}

export const invoiceController = new InvoiceController();
