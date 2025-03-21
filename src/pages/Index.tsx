
import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import TransactionCard from '@/components/TransactionCard';
import { Transaction } from '@/lib/types';
import { dbManager } from '@/lib/db';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ButtonIcon from '@/components/ui/ButtonIcon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await dbManager.getAllTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Failed to load transactions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load transactions',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    // Add some mock data only if there are no transactions
    const initializeData = async () => {
      const data = await dbManager.getAllTransactions();
      
      if (data.length === 0) {
        // Add mock transaction
        const mockTransaction: Transaction = {
          id: 'txn-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
          date: new Date().toISOString(),
          totalAmount: 85000,
          status: 'pending',
          loadBuy: {
            supplierName: 'Northern Farms Ltd.',
            supplierContact: '+91 98765 43210',
            goodsName: 'Premium Wheat',
            quantity: 10,
            purchaseRate: 2500,
            totalCost: 25000,
            amountPaid: 15000,
            balance: 10000
          },
          transportation: {
            vehicleType: 'Truck - Medium',
            vehicleNumber: 'MH 04 AB 1234',
            emptyWeight: 5000,
            loadedWeight: 15000,
            origin: 'Mumbai',
            destination: 'Pune',
            charges: 5000
          },
          loadSold: {
            buyerName: 'City Mills',
            buyerContact: '+91 98765 12345',
            quantitySold: 10,
            saleRate: 3500,
            totalSaleAmount: 35000,
            amountReceived: 20000,
            pendingBalance: 15000
          },
          payments: [
            {
              id: 'pay-' + Date.now().toString(36),
              date: new Date().toISOString(),
              amount: 15000,
              mode: 'upi',
              counterparty: 'Northern Farms Ltd.',
              isIncoming: false,
              notes: 'Initial payment for wheat purchase'
            },
            {
              id: 'pay-' + (Date.now() + 1).toString(36),
              date: new Date().toISOString(),
              amount: 20000,
              mode: 'bank',
              counterparty: 'City Mills',
              isIncoming: true,
              notes: 'Advance payment for wheat delivery'
            }
          ],
          notes: [
            {
              id: 'note-' + Date.now().toString(36),
              date: new Date().toISOString(),
              content: 'Quality inspection completed. Grade A wheat confirmed.'
            }
          ],
          attachments: [
            {
              id: 'att-' + Date.now().toString(36),
              name: 'Invoice_123.pdf',
              type: 'application/pdf',
              uri: 'https://via.placeholder.com/150',
              date: new Date().toISOString()
            }
          ]
        };
        
        await dbManager.addTransaction(mockTransaction);
        setTransactions([mockTransaction]);
      } else {
        setTransactions(data);
      }
      
      setLoading(false);
    };

    initializeData();
  }, [toast]);

  const handleExport = async () => {
    try {
      const jsonData = await dbManager.exportData();
      
      // Create a blob and download it
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactly-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export Successful',
        description: 'Transaction data has been exported successfully',
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export transaction data',
        variant: 'destructive',
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col"
    >
      <header className="glass border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Transactly</h1>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExport}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Export Data
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-medium">Recent Transactions</h2>
          <Link to="/new-transaction">
            <ButtonIcon variant="default" className="rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </ButtonIcon>
          </Link>
        </div>
        
        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <div className="animate-pulse-subtle">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="2" x2="12" y2="6"></line>
                  <line x1="12" y1="18" x2="12" y2="22"></line>
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                  <line x1="2" y1="12" x2="6" y2="12"></line>
                  <line x1="18" y1="12" x2="22" y2="12"></line>
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
              </div>
            </motion.div>
          ) : transactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-64 text-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-muted-foreground mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
              <h3 className="text-lg font-medium mb-2">No Transactions Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first transaction to get started
              </p>
              <Link
                to="/new-transaction"
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                New Transaction
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {transactions.map((transaction, index) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  index={index}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default Index;
