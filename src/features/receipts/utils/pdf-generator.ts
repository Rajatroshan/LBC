import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Payment, Family, Festival } from '@/core/types';
import { formatDate, formatCurrency } from '@/utils';

/**
 * Generate PDF receipt for a payment
 */
export const generatePaymentReceipt = (
  payment: Payment,
  family: Family,
  festival: Festival
): void => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(76, 175, 80); // Primary green
  doc.text('LBC - Luhuren Bae Club', 105, 20, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Payment Receipt', 105, 30, { align: 'center' });

  // Receipt details
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Receipt No: ${payment.receiptNumber}`, 20, 45);
  doc.text(`Date: ${formatDate(payment.paidDate)}`, 20, 52);

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 58, 190, 58);

  // Family and Festival Details
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Payment Details', 20, 68);

  const details = [
    ['Family Head', family.headName],
    ['Phone', family.phone],
    ['Address', family.address],
    ['Festival', festival.name],
    ['Festival Date', formatDate(festival.date)],
    ['Amount', formatCurrency(payment.amount)],
    ['Status', payment.status],
  ];

  autoTable(doc, {
    startY: 73,
    head: [],
    body: details,
    theme: 'plain',
    styles: {
      fontSize: 11,
      cellPadding: 3,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' },
    },
  });

  // Footer
  const finalY = (doc as any).lastAutoTable.finalY || 140;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for your contribution!', 105, finalY + 20, {
    align: 'center',
  });
  doc.text('Village Chanda Management System', 105, finalY + 27, {
    align: 'center',
  });

  // Save PDF
  doc.save(`receipt-${payment.receiptNumber}.pdf`);
};

/**
 * Generate festival report PDF
 */
export const generateFestivalReport = (
  festival: Festival,
  payments: Payment[],
  families: Family[]
): void => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.setTextColor(76, 175, 80);
  doc.text('Festival Collection Report', 105, 20, { align: 'center' });

  // Festival Details
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Festival: ${festival.name}`, 20, 35);
  doc.text(`Date: ${formatDate(festival.date)}`, 20, 42);
  doc.text(`Amount per Family: ${formatCurrency(festival.amountPerFamily)}`, 20, 49);

  // Summary
  const totalPaid = payments.filter((p) => p.status === 'PAID').length;
  const totalAmount = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  doc.setFontSize(11);
  doc.text(`Total Families: ${families.length}`, 20, 60);
  doc.text(`Paid: ${totalPaid}`, 20, 67);
  doc.text(`Pending: ${families.length - totalPaid}`, 20, 74);
  doc.text(`Total Collection: ${formatCurrency(totalAmount)}`, 20, 81);

  // Payment table
  const tableData = payments.map((payment) => {
    const family = families.find((f) => f.id === payment.familyId);
    return [
      family?.headName || 'Unknown',
      formatDate(payment.paidDate),
      formatCurrency(payment.amount),
      payment.status,
    ];
  });

  autoTable(doc, {
    startY: 90,
    head: [['Family', 'Payment Date', 'Amount', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [76, 175, 80],
      textColor: [255, 255, 255],
    },
    styles: {
      fontSize: 10,
    },
  });

  doc.save(`festival-report-${festival.name}.pdf`);
};
