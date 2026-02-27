import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  deleteDoc,
  updateDoc,
  query, 
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Receipt } from '../models';
import { COLLECTIONS } from '@/constants';
import { 
  generateReceiptPDF, 
  generateReceiptNumber, 
  ReceiptData 
} from '@/utils/pdf';

export class ReceiptService {
  private collectionRef = collection(db, COLLECTIONS.RECEIPTS);
  private storageFolder = 'receipts';

  /**
   * Generate receipt PDF without storing in Firebase Storage
   * Returns the PDF blob for immediate download
   */
  async generateReceiptWithoutStorage(data: {
    paymentId: string;
    familyName: string;
    festivalName: string;
    amount: number;
    paidDate: Date;
    generatedBy: string;
    paymentMethod?: string;
    notes?: string;
  }): Promise<{ receipt: Receipt; pdfBlob: Blob }> {
    try {
      console.log('Generating receipt for payment:', data.paymentId);
      
      // Generate unique receipt number
      const receiptNumber = generateReceiptNumber();
      console.log('Generated receipt number:', receiptNumber);

      // Generate PDF
      const pdfData: ReceiptData = {
        receiptNumber,
        familyName: data.familyName,
        festivalName: data.festivalName,
        amount: data.amount,
        paidDate: data.paidDate,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      };

      console.log('Generating PDF blob...');
      const pdfBlob = generateReceiptPDF(pdfData);
      console.log('PDF blob generated, size:', pdfBlob.size);

      // Create receipt record in Firestore (without pdfUrl)
      console.log('Creating receipt document in Firestore...');
      const now = Timestamp.now();
      const docRef = await addDoc(this.collectionRef, {
        paymentId: data.paymentId,
        receiptNumber,
        familyName: data.familyName,
        festivalName: data.festivalName,
        amount: data.amount,
        paidDate: Timestamp.fromDate(data.paidDate),
        generatedBy: data.generatedBy,
        pdfUrl: '', // No storage URL
        createdAt: now,
        updatedAt: now,
      });

      console.log('Receipt document created with ID:', docRef.id);

      const docSnap = await getDoc(docRef);
      const receipt = this.toEntity(docSnap);
      console.log('Receipt generation complete:', receipt);
      return { receipt, pdfBlob };
    } catch (error) {
      console.error('Error generating receipt:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate receipt: ${error.message}`);
      }
      throw new Error('Failed to generate receipt');
    }
  }

  /**
   * Generate and store a receipt for a payment
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
    try {
      console.log('Generating receipt for payment:', data.paymentId);
      
      // Generate unique receipt number
      const receiptNumber = generateReceiptNumber();
      console.log('Generated receipt number:', receiptNumber);

      // Generate PDF
      const pdfData: ReceiptData = {
        receiptNumber,
        familyName: data.familyName,
        festivalName: data.festivalName,
        amount: data.amount,
        paidDate: data.paidDate,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      };

      console.log('Generating PDF blob...');
      const pdfBlob = generateReceiptPDF(pdfData);
      console.log('PDF blob generated, size:', pdfBlob.size);

      // Upload PDF to Firebase Storage
      console.log('Uploading PDF to Firebase Storage...');
      const pdfUrl = await this.uploadPDF(pdfBlob, receiptNumber);
      console.log('PDF uploaded, URL:', pdfUrl);

      // Create receipt record in Firestore
      console.log('Creating receipt document in Firestore...');
      const now = Timestamp.now();
      const docRef = await addDoc(this.collectionRef, {
        paymentId: data.paymentId,
        receiptNumber,
        familyName: data.familyName,
        festivalName: data.festivalName,
        amount: data.amount,
        paidDate: Timestamp.fromDate(data.paidDate),
        generatedBy: data.generatedBy,
        pdfUrl,
        createdAt: now,
        updatedAt: now,
      });

      console.log('Receipt document created with ID:', docRef.id);

      const docSnap = await getDoc(docRef);
      const receipt = this.toEntity(docSnap);
      console.log('Receipt generation complete:', receipt);
      return receipt;
    } catch (error) {
      console.error('Error generating receipt:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate receipt: ${error.message}`);
      }
      throw new Error('Failed to generate receipt');
    }
  }

  /**
   * Upload PDF to Firebase Storage
   */
  private async uploadPDF(pdfBlob: Blob, receiptNumber: string): Promise<string> {
    try {
      const fileName = `${receiptNumber}.pdf`;
      const storageRef = ref(storage, `${this.storageFolder}/${fileName}`);
      
      console.log('Uploading to storage path:', `${this.storageFolder}/${fileName}`);
      
      // Upload the PDF
      const snapshot = await uploadBytes(storageRef, pdfBlob, {
        contentType: 'application/pdf',
      });
      
      console.log('Upload complete, getting download URL...');

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL obtained:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading PDF to storage:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to upload receipt PDF: ${error.message}`);
      }
      throw new Error('Failed to upload receipt PDF');
    }
  }

  /**
   * Get receipt by ID
   */
  async getById(id: string): Promise<Receipt | null> {
    const docRef = doc(db, COLLECTIONS.RECEIPTS, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return this.toEntity(docSnap);
  }

  /**
   * Get receipt by payment ID
   */
  async getByPaymentId(paymentId: string): Promise<Receipt | null> {
    const q = query(
      this.collectionRef, 
      where('paymentId', '==', paymentId)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    return this.toEntity(snapshot.docs[0]);
  }

  /**
   * Get receipt by receipt number
   */
  async getByReceiptNumber(receiptNumber: string): Promise<Receipt | null> {
    const q = query(
      this.collectionRef,
      where('receiptNumber', '==', receiptNumber)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    return this.toEntity(snapshot.docs[0]);
  }

  /**
   * Get all receipts for a family
   */
  async getByFamily(familyName: string): Promise<Receipt[]> {
    const q = query(
      this.collectionRef,
      where('familyName', '==', familyName),
      orderBy('paidDate', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => this.toEntity(doc));
  }

  /**
   * Get all receipts for a festival
   */
  async getByFestival(festivalName: string): Promise<Receipt[]> {
    const q = query(
      this.collectionRef,
      where('festivalName', '==', festivalName),
      orderBy('paidDate', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => this.toEntity(doc));
  }

  /**
   * Get all receipts
   */
  async getAll(): Promise<Receipt[]> {
    const q = query(this.collectionRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => this.toEntity(doc));
  }

  /**
   * Delete receipt and associated PDF
   */
  async delete(id: string): Promise<void> {
    try {
      // Get receipt to find PDF URL
      const receipt = await this.getById(id);
      
      if (!receipt) {
        throw new Error('Receipt not found');
      }

      // Delete PDF from storage if it exists
      if (receipt.pdfUrl) {
        try {
          const pdfRef = ref(storage, receipt.pdfUrl);
          await deleteObject(pdfRef);
        } catch (error) {
          console.warn('Error deleting PDF from storage:', error);
          // Continue with receipt deletion even if PDF deletion fails
        }
      }

      // Delete receipt document
      const docRef = doc(db, COLLECTIONS.RECEIPTS, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting receipt:', error);
      throw new Error('Failed to delete receipt');
    }
  }

  /**
   * Regenerate receipt PDF (useful if template changes)
   */
  async regenerateReceipt(receiptId: string): Promise<Receipt> {
    const receipt = await this.getById(receiptId);
    
    if (!receipt) {
      throw new Error('Receipt not found');
    }

    // Generate new PDF
    const pdfData: ReceiptData = {
      receiptNumber: receipt.receiptNumber,
      familyName: receipt.familyName,
      festivalName: receipt.festivalName,
      amount: receipt.amount,
      paidDate: receipt.paidDate,
    };

    const pdfBlob = generateReceiptPDF(pdfData);

    // Delete old PDF
    if (receipt.pdfUrl) {
      try {
        const oldPdfRef = ref(storage, receipt.pdfUrl);
        await deleteObject(oldPdfRef);
      } catch (error) {
        console.warn('Error deleting old PDF:', error);
      }
    }

    // Upload new PDF
    const newPdfUrl = await this.uploadPDF(pdfBlob, receipt.receiptNumber);

    // Update receipt with new PDF URL
    const docRef = doc(db, COLLECTIONS.RECEIPTS, receiptId);
    await updateDoc(docRef, {
      pdfUrl: newPdfUrl,
      updatedAt: Timestamp.now(),
    });

    return await this.getById(receiptId) as Receipt;
  }

  /**
   * Generate PDF blob from existing receipt metadata
   * Does not upload to storage, returns blob for immediate download
   */
  async generatePDFFromReceipt(receipt: Receipt): Promise<Blob> {
    try {
      const pdfData: ReceiptData = {
        receiptNumber: receipt.receiptNumber,
        familyName: receipt.familyName,
        festivalName: receipt.festivalName,
        amount: receipt.amount,
        paidDate: receipt.paidDate,
      };

      return generateReceiptPDF(pdfData);
    } catch (error) {
      console.error('Error generating PDF from receipt:', error);
      throw new Error('Failed to generate receipt PDF');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toEntity(doc: any): Receipt {
    const data = doc.data();
    return {
      id: doc.id,
      paymentId: data.paymentId,
      receiptNumber: data.receiptNumber,
      familyName: data.familyName,
      festivalName: data.festivalName,
      amount: data.amount,
      paidDate: data.paidDate?.toDate() || new Date(),
      generatedBy: data.generatedBy,
      pdfUrl: data.pdfUrl,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
}

export const receiptService = new ReceiptService();
