
import { useState, useEffect, useMemo } from 'react';
import { Transaction } from '@/lib/types';
import { dbManager } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { exportTransactions, ExportFormat } from '@/lib/exportUtils';
import { FilterCriteria, FilterOption } from '@/components/index/AdvancedSearchFilters';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterCriteria>({
    status: [],
    goodsName: [],
    amountRange: { min: null, max: null },
    dateRange: { start: null, end: null }
  });
  const { toast } = useToast();

  // Extract unique goods names from transactions for filter options
  const goodsOptions = useMemo<FilterOption[]>(() => {
    const uniqueGoods = new Set<string>();
    transactions.forEach(transaction => {
      if (transaction.loadBuy?.goodsName) {
        uniqueGoods.add(transaction.loadBuy.goodsName);
      }
    });
    return Array.from(uniqueGoods).map(name => ({
      value: name,
      label: name
    }));
  }, [transactions]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await dbManager.getAllTransactions();
      
      if (data.length === 0) {
        // Add mock transaction if there are no transactions
        const mockTransaction: Transaction = {
          id: 'txn-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
          name: 'Sample Wheat Transaction',
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
            charges: 5000,
            notes: 'Scheduled for delivery on time'
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

  const exportData = async (format: ExportFormat = 'json') => {
    try {
      // Use the currently filtered transactions for export
      await exportTransactions(filteredTransactions, format);
      
      toast({
        title: 'Export Successful',
        description: `Transaction data has been exported as ${format.toUpperCase()}`,
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

  // Apply the text search and filters together
  useEffect(() => {
    let filtered = [...transactions];
    
    // Apply text search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction => 
        transaction.name?.toLowerCase().includes(query) ||
        transaction.id.toLowerCase().includes(query) ||
        (transaction.loadBuy?.supplierName?.toLowerCase().includes(query)) ||
        (transaction.loadSold?.buyerName?.toLowerCase().includes(query)) ||
        (transaction.loadBuy?.goodsName?.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(transaction => 
        filters.status!.includes(transaction.status || 'pending')
      );
    }
    
    // Apply goods name filter
    if (filters.goodsName && filters.goodsName.length > 0) {
      filtered = filtered.filter(transaction => 
        transaction.loadBuy?.goodsName && 
        filters.goodsName!.includes(transaction.loadBuy.goodsName)
      );
    }
    
    // Apply amount range filter
    if (filters.amountRange) {
      if (filters.amountRange.min !== null) {
        filtered = filtered.filter(transaction => 
          (transaction.totalAmount || 0) >= (filters.amountRange!.min || 0)
        );
      }
      if (filters.amountRange.max !== null) {
        filtered = filtered.filter(transaction => 
          (transaction.totalAmount || 0) <= (filters.amountRange!.max || Infinity)
        );
      }
    }
    
    // Apply date range filter
    if (filters.dateRange) {
      if (filters.dateRange.start) {
        const startDate = new Date(filters.dateRange.start);
        startDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter(transaction => {
          if (!transaction.date) return false;
          const transactionDate = new Date(transaction.date);
          return transactionDate >= startDate;
        });
      }
      if (filters.dateRange.end) {
        const endDate = new Date(filters.dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(transaction => {
          if (!transaction.date) return false;
          const transactionDate = new Date(transaction.date);
          return transactionDate <= endDate;
        });
      }
    }
    
    setFilteredTransactions(filtered);
  }, [searchQuery, transactions, filters]);

  // Load transactions on component mount
  useEffect(() => {
    loadTransactions();
  }, []);

  return {
    transactions,
    filteredTransactions,
    loading,
    searchQuery,
    setSearchQuery,
    exportData,
    loadTransactions,
    goodsOptions,
    setFilters
  };
};
