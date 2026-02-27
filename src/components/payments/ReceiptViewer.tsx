'use client';

import React, { useState, useEffect } from 'react';
import { Receipt } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { Download, X } from 'lucide-react';
import { receiptService } from '@/services';

interface ReceiptViewerProps {
  receipt: Receipt;
  onClose?: () => void;
}

export const ReceiptViewer: React.FC<ReceiptViewerProps> = ({ receipt, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string>('');

  useEffect(() => {
    // Generate PDF from receipt metadata
    const generatePDF = async () => {
      try {
        setLoading(true);
        const blob = await receiptService.generatePDFFromReceipt(receipt);
        setPdfBlob(blob);
        const blobUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(blobUrl);
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setLoading(false);
      }
    };

    generatePDF();

    // Cleanup blob URL on unmount
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [receipt]);

  const handleDownload = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${receipt.receiptNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Receipt Details</h3>
          <p className="text-sm text-gray-500 mt-1">
            Receipt #{receipt.receiptNumber}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Family Name</p>
            <p className="font-medium text-gray-800">{receipt.familyName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Festival</p>
            <p className="font-medium text-gray-800">{receipt.festivalName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="font-medium text-gray-800">₹{receipt.amount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Payment Date</p>
            <p className="font-medium text-gray-800">
              {new Date(receipt.paidDate).toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-96 mb-6">
          <Loader />
        </div>
      )}

      {!loading && pdfBlobUrl && (
        <div className="mb-6 border rounded-lg overflow-hidden">
          <iframe
            src={pdfBlobUrl}
            className="w-full h-96"
            title={`Receipt ${receipt.receiptNumber}`}
          />
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleDownload}
          disabled={!pdfBlob || loading}
          className="flex items-center gap-2"
        >
          <Download size={18} />
          Download PDF
        </Button>
      </div>
    </Card>
  );
};
