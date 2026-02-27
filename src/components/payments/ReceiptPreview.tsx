'use client';

import React, { useState } from 'react';
import { Receipt } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { downloadPDF } from '@/utils';
import { Download, Eye, CheckCircle } from 'lucide-react';

interface ReceiptPreviewProps {
  receipt: Receipt | null;
  isGenerating?: boolean;
  onClose?: () => void;
  onViewAll?: () => void;
}

export const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({
  receipt,
  isGenerating = false,
  onClose,
  onViewAll,
}) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!receipt?.pdfUrl) return;

    setDownloading(true);
    try {
      const response = await fetch(receipt.pdfUrl);
      const blob = await response.blob();
      downloadPDF(blob, `Receipt_${receipt.receiptNumber}.pdf`);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('Failed to download receipt. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleView = () => {
    if (receipt?.pdfUrl) {
      window.open(receipt.pdfUrl, '_blank');
    }
  };

  if (isGenerating) {
    return (
      <Card className="text-center py-8">
        <Loader />
        <p className="text-gray-600 mt-4">Generating receipt...</p>
      </Card>
    );
  }

  if (!receipt) {
    return null;
  }

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-green-500 rounded-full p-2">
          <CheckCircle size={32} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            Payment Recorded Successfully!
          </h3>
          <p className="text-gray-600">
            Receipt has been generated and saved.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Receipt Number</p>
            <p className="text-lg font-bold text-gray-800">{receipt.receiptNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="text-lg font-bold text-green-600">₹{receipt.amount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Family Name</p>
            <p className="font-medium text-gray-800">{receipt.familyName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Festival</p>
            <p className="font-medium text-gray-800">{receipt.festivalName}</p>
          </div>
        </div>

        {receipt.pdfUrl && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-3">Receipt Preview</p>
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <iframe
                src={receipt.pdfUrl}
                className="w-full h-96"
                title={`Receipt ${receipt.receiptNumber}`}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleView}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Eye size={18} />
          View Full Receipt
        </Button>
        <Button
          onClick={handleDownload}
          isLoading={downloading}
          disabled={downloading}
          className="flex items-center gap-2"
        >
          <Download size={18} />
          Download PDF
        </Button>
        {onViewAll && (
          <Button
            onClick={onViewAll}
            variant="outline"
          >
            View All Payments
          </Button>
        )}
        {onClose && (
          <Button
            onClick={onClose}
            variant="outline"
          >
            Record Another Payment
          </Button>
        )}
      </div>
    </Card>
  );
};
