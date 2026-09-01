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
  isProvisional?: boolean;
  submittedByName?: string;
  verifiedByName?: string;
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
 * Generate a PDF receipt for a payment (Supports Official Paid Receipt or Provisional Contribution Slip)
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
  const isProvisional = data.isProvisional || false;

  // Add border
  doc.setDrawColor(isProvisional ? 217 : 0, isProvisional ? 119 : 0, isProvisional ? 6 : 0);
  doc.setLineWidth(isProvisional ? 0.8 : 0.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Header - Organization Name
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isProvisional ? 180 : 0, isProvisional ? 83 : 0, isProvisional ? 9 : 0);
  doc.text(APP_CONSTANTS.APP_NAME, pageWidth / 2, 30, { align: 'center' });

  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(APP_CONSTANTS.APP_DESCRIPTION, pageWidth / 2, 38, { align: 'center' });

  // Divider line
  doc.setLineWidth(0.3);
  doc.line(margin, 45, pageWidth - margin, 45);

  // Receipt Title
  doc.setFontSize(17);
  doc.setFont('helvetica', 'bold');
  if (isProvisional) {
    doc.setTextColor(180, 83, 9);
    doc.text('PROVISIONAL CONTRIBUTION SLIP', pageWidth / 2, 56, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('(PENDING ADMIN VERIFICATION)', pageWidth / 2, 62, { align: 'center' });
  } else {
    doc.setTextColor(16, 120, 80);
    doc.text('OFFICIAL PAYMENT RECEIPT', pageWidth / 2, 56, { align: 'center' });
  }

  // Receipt Number & Date
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${isProvisional ? 'Slip No' : 'Receipt No'}: ${data.receiptNumber}`, pageWidth - margin, 70, { align: 'right' });

  const formattedDate = format(data.paidDate, 'dd/MM/yyyy');
  doc.text(`Date: ${formattedDate}`, pageWidth - margin, 76, { align: 'right' });

  // Receipt Details Table
  const tableStartY = 85;
  
  autoTable(doc, {
    startY: tableStartY,
    head: [['Description', 'Details']],
    body: [
      ['Family Name', data.familyName],
      ['Festival/Event', data.festivalName],
      ['Contribution Amount', `${APP_CONSTANTS.DEFAULT_CURRENCY} ${data.amount.toFixed(2)}`],
      ['Payment Date', formattedDate],
      ['Verification Status', isProvisional ? 'UNPAID / PENDING VERIFICATION' : 'VERIFIED & PAID'],
      ...(data.submittedByName ? [['Recorded By', data.submittedByName]] : []),
      ...(data.verifiedByName ? [['Verified By Admin', data.verifiedByName]] : []),
      ...(data.paymentMethod ? [['Payment Method', data.paymentMethod]] : []),
      ...(data.notes ? [['Notes', data.notes]] : []),
    ],
    theme: 'grid',
    headStyles: {
      fillColor: isProvisional ? [217, 119, 6] : [16, 149, 106],
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable.finalY || tableStartY + 60;

  // Amount in words section
  const amountInWords = numberToWords(data.amount);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 40, 40);
  doc.text('Amount in Words:', margin, finalY + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(amountInWords, margin, finalY + 18);

  // Status Note
  if (isProvisional) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(180, 83, 9);
    doc.text(
      'Notice: This provisional slip confirms your payment submission. Official paid status and account credit will be issued after Admin verification.',
      margin,
      finalY + 30,
      { maxWidth: pageWidth - (margin * 2) }
    );
  } else {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(16, 120, 80);
    doc.text(
      'Thank you for your generous contribution to the community!',
      pageWidth / 2,
      finalY + 30,
      { align: 'center' }
    );
  }

  // Signature section
  const signatureY = pageHeight - 40;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  // Received by / Submitted by
  doc.line(margin, signatureY, margin + 60, signatureY);
  doc.text(isProvisional ? 'Recorded By (Member)' : 'Received By', margin, signatureY + 5);
  
  // Authorized Signature
  doc.line(pageWidth - margin - 60, signatureY, pageWidth - margin, signatureY);
  doc.text(isProvisional ? 'Admin Verification Signature' : 'Authorized Signatory', pageWidth - margin - 60, signatureY + 5);

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export interface ReimbursementVoucherData {
  voucherNumber: string;
  beneficiaryName: string;
  beneficiaryEmail: string;
  amount: number;
  approvedDate: Date;
  approvedByName: string;
  festivalName?: string;
  notes: string;
  payoutDetails?: string;
}

/**
 * Generate a unique reimbursement claim / voucher number
 */
export const generateClaimNumber = (): string => {
  const prefix = 'CLM';
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

/**
 * Generate a PDF payout voucher for an approved reimbursement
 */
export const generateReimbursementVoucherPDF = (data: ReimbursementVoucherData): Blob => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Add decorative border
  doc.setDrawColor(37, 99, 235); // Blue border
  doc.setLineWidth(0.8);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Header - Organization Name
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(APP_CONSTANTS.APP_NAME, pageWidth / 2, 28, { align: 'center' });

  // Subtitle
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(APP_CONSTANTS.APP_DESCRIPTION, pageWidth / 2, 35, { align: 'center' });

  // Divider line
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, 42, pageWidth - margin, 42);

  // Title: Reimbursement Payout Voucher
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('MEMBER REIMBURSEMENT PAYOUT VOUCHER', pageWidth / 2, 52, { align: 'center' });

  const safeDate = data.approvedDate instanceof Date ? data.approvedDate : new Date(data.approvedDate || Date.now());

  // Voucher details table
  autoTable(doc, {
    startY: 60,
    head: [['VOUCHER & BENEFICIARY INFORMATION', '']],
    body: [
      ['Voucher / Receipt No:', data.voucherNumber || 'VOUCHER'],
      ['Settlement Date:', format(safeDate, 'dd/MM/yyyy hh:mm a')],
      ['Beneficiary Name:', data.beneficiaryName || 'Member'],
      ['Beneficiary Email:', data.beneficiaryEmail || 'N/A'],
      ['Linked Festival / Event:', data.festivalName || 'General Club Operations'],
      ['Payout Destination / UPI:', data.payoutDetails || 'Direct Settlement / Cash'],
      ['Approved & Authorized By:', data.approvedByName || 'Club Administrator'],
    ],
    theme: 'plain',
    headStyles: {
      fillColor: [239, 246, 255],
      textColor: [30, 58, 138],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [51, 65, 85],
    },
    columnStyles: {
      0: { cellWidth: 70, fontStyle: 'bold' },
      1: { cellWidth: 100 },
    },
    margin: { left: margin, right: margin },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tableEndY = (doc as any).lastAutoTable.finalY + 8;

  // Reimbursement Settlement Summary Box
  autoTable(doc, {
    startY: tableEndY,
    head: [['SETTLEMENT SUMMARY', 'AMOUNT (INR)']],
    body: [
      [`Out-of-Pocket Expense Reimbursement\nPurpose / Notes: ${data.notes || 'Vendor Payment Reimbursement'}`, `INR ${data.amount.toLocaleString('en-IN')}`],
      ['Total Amount Paid & Disbursed from Master Account:', `INR ${data.amount.toLocaleString('en-IN')}`],
    ],
    theme: 'striped',
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [15, 23, 42],
    },
    columnStyles: {
      0: { cellWidth: 110 },
      1: { cellWidth: 60, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: margin, right: margin },
  });

  // Amount in Words
  const amountInWords = numberToWords(data.amount);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wordsY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Amount in Words:', margin, wordsY);
  doc.setFont('helvetica', 'normal');
  doc.text(amountInWords, margin, wordsY + 6);

  // Authorization Signatures Area
  const sigY = wordsY + 28;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, sigY, margin + 60, sigY);
  doc.line(pageWidth - margin - 60, sigY, pageWidth - margin, sigY);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Beneficiary Signature', margin, sigY + 5);
  doc.text('Authorized Admin / Treasurer', pageWidth - margin - 60, sigY + 5);

  // Footer
  const footerY = pageHeight - 25;
  doc.setLineWidth(0.3);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(148, 163, 184);
  doc.text('This is an official system-generated payment & reimbursement voucher.', pageWidth / 2, footerY + 6, { align: 'center' });
  doc.text(`Official Record Timestamp: ${format(new Date(), 'dd/MM/yyyy hh:mm a')}`, pageWidth / 2, footerY + 11, { align: 'center' });

  return doc.output('blob');
};

