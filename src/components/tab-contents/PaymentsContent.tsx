
import React from 'react';
import { Transaction, Payment } from '@/lib/types';

interface PaymentsContentProps {
  payments: Payment[];
  transaction: Transaction;
  refreshTransaction: () => Promise<void>;
}

const PaymentsContent: React.FC<PaymentsContentProps> = ({ payments, transaction, refreshTransaction }) => {
  if (!payments || payments.length === 0) {
    return <div className="text-muted-foreground text-center py-8">No payment records available</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Payment Records</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {payments.map((payment) => (
          <div 
            key={payment.id} 
            className={`border rounded-lg p-4 ${payment.isIncoming ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900/50' : 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/50'}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${payment.isIncoming ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                  {payment.isIncoming ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v18M5 16l7 7 7-7"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21V3M5 8l7-7 7 7"/>
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">
                    {payment.isIncoming ? 'Payment Received' : 'Payment Sent'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment.date).toLocaleDateString()} 
                    {payment.paymentTime && ` at ${payment.paymentTime}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${payment.isIncoming ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {payment.isIncoming ? '+' : '-'}${payment.amount.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground capitalize">via {payment.mode}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-3">
              <div>
                <span className="text-muted-foreground mr-2">Counterparty:</span>
                <span className="font-medium">{payment.counterparty}</span>
              </div>
              
              {payment.installmentNumber && payment.totalInstallments && (
                <div className="text-sm sm:text-right">
                  <span className="text-muted-foreground mr-2">Installment:</span>
                  <span className="font-medium">{payment.installmentNumber} of {payment.totalInstallments}</span>
                </div>
              )}
            </div>
            
            {payment.notes && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="text-sm">{payment.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentsContent;
