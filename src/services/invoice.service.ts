import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  deleteDoc,
  query, 
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Invoice } from '../models';
import { COLLECTIONS } from '@/constants';
import { 
  generateInvoicePDF, 
  generateInvoiceNumber, 
  InvoiceData 
} from '@/utils/pdf';

export class InvoiceService {
  private collectionRef = collection(db, COLLECTIONS.INVOICES);

  /**
   * Generate invoice without storage
   * Returns invoice metadata and PDF blob for immediate download
   */
  async generateInvoiceWithoutStorage(data: {
    expenseId: string;
    vendorName: string;
    purpose: string;
    amount: number;
    expenseDate: Date;
    generatedBy: string;
    contactNumber?: string;
    notes?: string;
  }): Promise<{ invoice: Invoice; pdfBlob: Blob }> {
    try {
      console.log('Generating invoice for expense:', data.expenseId);
      
      // Generate unique invoice number
      const invoiceNumber = generateInvoiceNumber();
      console.log('Generated invoice number:', invoiceNumber);

      // Generate PDF
      const pdfData: InvoiceData = {
        invoiceNumber,
        vendorName: data.vendorName,
        purpose: data.purpose,
        amount: data.amount,
        expenseDate: data.expenseDate,
        contactNumber: data.contactNumber,
        notes: data.notes,
      };

      console.log('Generating PDF blob...');
      const pdfBlob = generateInvoicePDF(pdfData);
      console.log('PDF blob generated, size:', pdfBlob.size);

      // Create invoice record in Firestore (without pdfUrl)
      console.log('Creating invoice document in Firestore...');
      const now = Timestamp.now();
      const docRef = await addDoc(this.collectionRef, {
        expenseId: data.expenseId,
        invoiceNumber,
        vendorName: data.vendorName,
        purpose: data.purpose,
        amount: data.amount,
        expenseDate: Timestamp.fromDate(data.expenseDate),
        generatedBy: data.generatedBy,
        contactNumber: data.contactNumber || '',
        notes: data.notes || '',
        pdfUrl: '', // No storage URL
        createdAt: now,
        updatedAt: now,
      });

      console.log('Invoice document created with ID:', docRef.id);

      const docSnap = await getDoc(docRef);
      const invoice = this.toEntity(docSnap);
      console.log('Invoice generation complete:', invoice);
      return { invoice, pdfBlob };
    } catch (error) {
      console.error('Error generating invoice:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate invoice: ${error.message}`);
      }
      throw new Error('Failed to generate invoice');
    }
  }

  /**
   * Get invoice by ID
   */
  async getById(id: string): Promise<Invoice | null> {
    const docRef = doc(db, COLLECTIONS.INVOICES, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return this.toEntity(docSnap);
  }

  /**
   * Get invoice by expense ID
   */
  async getByExpenseId(expenseId: string): Promise<Invoice | null> {
    const q = query(this.collectionRef, where('expenseId', '==', expenseId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    return this.toEntity(snapshot.docs[0]);
  }

  /**
   * Get all invoices
   */
  async getAll(): Promise<Invoice[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map((doc) => this.toEntity(doc));
  }

  /**
   * Delete invoice
   */
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.INVOICES, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw new Error('Failed to delete invoice');
    }
  }

  /**
   * Generate PDF blob from existing invoice metadata
   * Does not upload to storage, returns blob for immediate download
   */
  async generatePDFFromInvoice(invoice: Invoice): Promise<Blob> {
    try {
      const pdfData: InvoiceData = {
        invoiceNumber: invoice.invoiceNumber,
        vendorName: invoice.vendorName,
        purpose: invoice.purpose,
        amount: invoice.amount,
        expenseDate: invoice.expenseDate,
        contactNumber: invoice.contactNumber,
        notes: invoice.notes,
      };

      return generateInvoicePDF(pdfData);
    } catch (error) {
      console.error('Error generating PDF from invoice:', error);
      throw new Error('Failed to generate invoice PDF');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toEntity(doc: any): Invoice {
    const data = doc.data();
    return {
      id: doc.id,
      expenseId: data.expenseId,
      invoiceNumber: data.invoiceNumber,
      vendorName: data.vendorName,
      purpose: data.purpose,
      amount: data.amount,
      expenseDate: data.expenseDate?.toDate() || new Date(),
      generatedBy: data.generatedBy,
      contactNumber: data.contactNumber || undefined,
      notes: data.notes || undefined,
      pdfUrl: data.pdfUrl,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
}

export const invoiceService = new InvoiceService();
