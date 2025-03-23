
import React from 'react';
import { Transaction } from '@/lib/types';

interface LoadSoldContentProps {
  data: Transaction['loadSold'];
  transaction: Transaction;
  refreshTransaction: () => Promise<void>;
}

const LoadSoldContent: React.FC<LoadSoldContentProps> = ({ data, transaction, refreshTransaction }) => {
  if (!data) {
    return <div className="text-muted-foreground text-center py-8">No load sale information available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Buyer Information</h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Buyer Name</p>
              <p className="font-medium">{data.buyerName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact Information</p>
              <p className="font-medium">{data.buyerContact || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Sale Information</h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Quantity Sold</p>
              <p className="font-medium">{data.quantitySold} units</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Financial Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Sale Rate</p>
            <p className="text-lg font-semibold">${data.saleRate.toFixed(2)}/unit</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Sale Amount</p>
            <p className="text-lg font-semibold">${data.totalSaleAmount.toFixed(2)}</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Amount Received</p>
            <p className="text-lg font-semibold">${data.amountReceived.toFixed(2)}</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Pending Balance</p>
            <p className="text-lg font-semibold">${data.pendingBalance.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      {(data.paymentDueDate || data.paymentFrequency) && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Payment Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.paymentDueDate && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Payment Due Date</p>
                <p className="text-lg font-semibold">{new Date(data.paymentDueDate).toLocaleDateString()}</p>
              </div>
            )}
            {data.paymentFrequency && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Payment Frequency</p>
                <p className="text-lg font-semibold capitalize">{data.paymentFrequency}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadSoldContent;
