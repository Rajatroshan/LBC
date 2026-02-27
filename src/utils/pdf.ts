import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { APP_CONSTANTS } from '@/constants';

export interface ReceiptData {
  receiptNumber: string;
  familyName: string;
  festivalName: string;
  amount: number;
  paidDate: Date;
  paymentMethod?: string;
  notes?: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  vendorName: string;
  purpose: string;
  amount: number;
  expenseDate: Date;
  contactNumber?: string;
  notes?: string;
}

/**
 * Generate a PDF receipt for a payment
 */
export const generateReceiptPDF = (data: ReceiptData): Blob => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Add border
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Header - Organization Name
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(APP_CONSTANTS.APP_NAME, pageWidth / 2, 30, { align: 'center' });

  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(APP_CONSTANTS.APP_DESCRIPTION, pageWidth / 2, 38, { align: 'center' });

  // Divider line
  doc.setLineWidth(0.3);
  doc.line(margin, 45, pageWidth - margin, 45);

  // Receipt Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT RECEIPT', pageWidth / 2, 56, { align: 'center' });

  // Receipt Number
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Receipt No: ${data.receiptNumber}`, pageWidth - margin, 65, { align: 'right' });

  // Date
  const formattedDate = format(data.paidDate, 'dd/MM/yyyy');
  doc.text(`Date: ${formattedDate}`, pageWidth - margin, 72, { align: 'right' });

  // Receipt Details Table
  const tableStartY = 85;
  
  autoTable(doc, {
    startY: tableStartY,
    head: [['Description', 'Details']],
    body: [
      ['Family Name', data.familyName],
      ['Festival/Event', data.festivalName],
      ['Amount Paid', `${APP_CONSTANTS.DEFAULT_CURRENCY} ${data.amount.toFixed(2)}`],
      ['Payment Date', formattedDate],
      ...(data.paymentMethod ? [['Payment Method', data.paymentMethod]] : []),
      ...(data.notes ? [['Notes', data.notes]] : []),
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [52, 73, 94],
      textColor: 255,
      fontSize: 11,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 10,
      textColor: 50,
    },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
    },
    margin: { left: margin, right: margin },
  });

  // Get Y position after table
  const finalY = (doc as any).lastAutoTable.finalY || tableStartY + 60;

  // Amount in words section
  const amountInWords = numberToWords(data.amount);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Amount in Words:', margin, finalY + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(amountInWords, margin, finalY + 22);

  // Thank you message
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'Thank you for your contribution!',
    pageWidth / 2,
    finalY + 40,
    { align: 'center' }
  );

  // Signature section
  const signatureY = pageHeight - 50;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Received by
  doc.line(margin, signatureY, margin + 60, signatureY);
  doc.text('Received By', margin, signatureY + 5);
  
  // Authorized Signature
  doc.line(pageWidth - margin - 60, signatureY, pageWidth - margin, signatureY);
  doc.text('Authorized Signature', pageWidth - margin - 60, signatureY + 5);

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'This is a computer-generated receipt and does not require a physical signature.',
    pageWidth / 2,
    pageHeight - 20,
    { align: 'center' }
  );

  // Convert to Blob
  return doc.output('blob');
};

/**
 * Convert number to words (Indian numbering system)
 */
const numberToWords = (num: number): string => {
  if (num === 0) return 'Zero Rupees Only';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  const convertTwoDigits = (n: number): string => {
    if (n < 10) return ones[n];
    if (n >= 10 && n < 20) return teens[n - 10];
    return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
  };

  const convertThreeDigits = (n: number): string => {
    if (n === 0) return '';
    if (n < 100) return convertTwoDigits(n);
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertTwoDigits(n % 100) : '');
  };

  // Split into integer and decimal parts
  const [integerPart, decimalPart] = num.toFixed(2).split('.');
  const integer = parseInt(integerPart, 10);
  const decimal = parseInt(decimalPart, 10);

  let words = '';

  // Crores
  if (integer >= 10000000) {
    words += convertThreeDigits(Math.floor(integer / 10000000)) + ' Crore ';
  }

  // Lakhs
  const lakhs = Math.floor((integer % 10000000) / 100000);
  if (lakhs > 0) {
    words += convertTwoDigits(lakhs) + ' Lakh ';
  }

  // Thousands
  const thousands = Math.floor((integer % 100000) / 1000);
  if (thousands > 0) {
    words += convertTwoDigits(thousands) + ' Thousand ';
  }

  // Hundreds
  const hundreds = integer % 1000;
  if (hundreds > 0) {
    words += convertThreeDigits(hundreds) + ' ';
  }

  words += 'Rupees';

  // Add paise if present
  if (decimal > 0) {
    words += ' and ' + convertTwoDigits(decimal) + ' Paise';
  }

  words += ' Only';

  return words.trim();
};

/**
 * Download a PDF blob as a file
 */
export const downloadPDF = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate a unique receipt number
 */
export const generateReceiptNumber = (): string => {
  const prefix = 'LBC';
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

/**
 * Generate a unique invoice number
 */
export const generateInvoiceNumber = (): string => {
  const prefix = 'INV';
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

/**
 * Generate a PDF invoice for an expense
 */
export const generateInvoicePDF = (data: InvoiceData): Blob => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Add border
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Header - Organization Name
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(APP_CONSTANTS.APP_NAME, pageWidth / 2, 30, { align: 'center' });

  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(APP_CONSTANTS.APP_DESCRIPTION, pageWidth / 2, 38, { align: 'center' });

  // Divider line
  doc.setLineWidth(0.3);
  doc.line(margin, 45, pageWidth - margin, 45);

  // Invoice Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('EXPENSE INVOICE', pageWidth / 2, 58, { align: 'center' });

  // Invoice Number
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice No: ${data.invoiceNumber}`, margin, 70);
  doc.text(`Date: ${format(data.expenseDate, 'dd/MM/yyyy')}`, pageWidth - margin, 70, { align: 'right' });

  // Vendor Details Table
  autoTable(doc, {
    startY: 78,
    head: [['Vendor Details', '']],
    body: [
      ['Vendor Name', data.vendorName],
      ['Contact Number', data.contactNumber || 'N/A'],
      ['Purpose', data.purpose],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [0, 102, 204],
      fontSize: 12,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 11,
    },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: 'bold' },
      1: { cellWidth: 110 },
    },
    margin: { left: margin, right: margin },
  });

  // Payment Details Table
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  autoTable(doc, {
    startY: finalY,
    head: [['Description', 'Amount']],
    body: [
      [data.purpose, `${APP_CONSTANTS.DEFAULT_CURRENCY}${data.amount.toFixed(2)}`],
    ],
    foot: [
      ['Total Amount', `${APP_CONSTANTS.DEFAULT_CURRENCY}${data.amount.toFixed(2)}`],
    ],
    theme: 'striped',
    headStyles: {
      fillColor: [0, 102, 204],
      fontSize: 11,
      fontStyle: 'bold',
    },
    footStyles: {
      fillColor: [230, 230, 230],
      textColor: [0, 0, 0],
      fontSize: 12,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 11,
    },
    columnStyles: {
      0: { cellWidth: 110 },
      1: { cellWidth: 60, halign: 'right' },
    },
    margin: { left: margin, right: margin },
  });

  // Amount in Words
  const amountInWords = numberToWords(data.amount);
  const wordsY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Amount in Words:', margin, wordsY);
  doc.setFont('helvetica', 'normal');
  doc.text(amountInWords, margin, wordsY + 6);

  // Notes Section (if provided)
  if (data.notes) {
    const notesY = wordsY + 20;
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', margin, notesY);
    doc.setFont('helvetica', 'normal');
    
    const notesLines = doc.splitTextToSize(data.notes, pageWidth - 2 * margin);
    doc.text(notesLines, margin, notesY + 6);
  }

  // Footer
  const footerY = pageHeight - 30;
  doc.setLineWidth(0.3);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('This is a computer-generated invoice.', pageWidth / 2, footerY + 8, { align: 'center' });
  doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy hh:mm a')}`, pageWidth / 2, footerY + 14, { align: 'center' });

  // Convert to blob
  return doc.output('blob');
};

