
import React, { useState } from 'react';
import { Transaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Edit, Info } from 'lucide-react';

interface LoadBuyContentProps {
  data: Transaction['loadBuy'];
  transaction: Transaction;
  refreshTransaction: () => Promise<void>;
}

const LoadBuyContent: React.FC<LoadBuyContentProps> = ({ data, transaction, refreshTransaction }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!data) {
    return <div className="text-muted-foreground text-center py-8">No load purchase information available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Load Purchase Details</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Info className="h-4 w-4 mr-1" />
            {showDetails ? "Hide Details" : "View Details"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit Details
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Supplier Information</h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Supplier Name</p>
              <p className="font-medium">{data.supplierName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact Information</p>
              <p className="font-medium">{data.supplierContact || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Goods Information</h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Goods Name</p>
              <p className="font-medium">{data.goodsName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quantity</p>
              <p className="font-medium">{data.quantity} units</p>
            </div>
          </div>
        </div>
      </div>

      {showDetails && (
        <>
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Financial Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Purchase Rate</p>
                <p className="text-lg font-semibold">${data.purchaseRate.toFixed(2)}/unit</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-lg font-semibold">${data.totalCost.toFixed(2)}</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Amount Paid</p>
                <p className="text-lg font-semibold">${data.amountPaid.toFixed(2)}</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-lg font-semibold">${data.balance.toFixed(2)}</p>
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
        </>
      )}
    </div>
  );
};

export default LoadBuyContent;
