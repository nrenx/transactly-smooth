
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom hooks
import { useTransactions } from '@/hooks/useTransactions';

// Components
import Header from '@/components/index/Header';
import SearchBar from '@/components/index/SearchBar';
import CreateTransactionDialog from '@/components/index/CreateTransactionDialog';
import EmptyState from '@/components/index/EmptyState';
import LoadingSpinner from '@/components/index/LoadingSpinner';
import TransactionList from '@/components/index/TransactionList';

const Index = () => {
  const { 
    filteredTransactions, 
    loading, 
    searchQuery, 
    setSearchQuery,
    exportData
  } = useTransactions();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col"
    >
      <Header onExport={exportData} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="w-full md:w-auto">
            <h2 className="text-xl font-medium mb-2">Recent Transactions</h2>
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          
          <CreateTransactionDialog />
        </div>
        
        <AnimatePresence>
          {loading ? (
            <LoadingSpinner />
          ) : filteredTransactions.length === 0 ? (
            <EmptyState 
              hasSearchQuery={searchQuery.length > 0}
              onCreateTransaction={() => setIsDialogOpen(true)}
            />
          ) : (
            <TransactionList transactions={filteredTransactions} />
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default Index;
