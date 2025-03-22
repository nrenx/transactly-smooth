
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom hooks
import { useTransactions } from '@/hooks/useTransactions';
import { useIsMobile } from '@/hooks/use-mobile';

// Components
import Header from '@/components/index/Header';
import SearchBar from '@/components/index/SearchBar';
import AdvancedSearchFilters from '@/components/index/AdvancedSearchFilters';
import CreateTransactionDialog from '@/components/index/CreateTransactionDialog';
import ExportOptions from '@/components/index/ExportOptions';
import EmptyState from '@/components/index/EmptyState';
import LoadingSpinner from '@/components/index/LoadingSpinner';
import TransactionList from '@/components/index/TransactionList';
import DashboardAnalytics from '@/components/analytics/DashboardAnalytics';

// UI Components
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LayoutGrid, ListFilter, BarChart3 } from 'lucide-react';

const Index = () => {
  const isMobile = useIsMobile();
  const { 
    filteredTransactions, 
    transactions,
    loading, 
    searchQuery, 
    setSearchQuery,
    exportData,
    goodsOptions,
    setFilters
  } = useTransactions();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'analytics'>('list');

  // View toggle handler
  const handleViewChange = (value: string) => {
    setActiveView(value as 'list' | 'analytics');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col"
    >
      <Header onExport={exportData} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="w-full md:w-auto">
              <h2 className="text-xl font-medium mb-2">Recent Transactions</h2>
              <div className="flex flex-wrap gap-2">
                <SearchBar 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
                <AdvancedSearchFilters 
                  onFilterChange={setFilters}
                  goodsOptions={goodsOptions}
                />
              </div>
            </div>
            
            <div className="flex gap-2 items-center w-full md:w-auto justify-between md:justify-end">
              <Tabs 
                defaultValue="list" 
                value={activeView} 
                onValueChange={handleViewChange}
                className="w-auto"
              >
                <TabsList className="grid grid-cols-2 h-9">
                  <TabsTrigger value="list" className="px-3 py-1.5">
                    <LayoutGrid className="h-4 w-4 mr-1" />
                    <span className={isMobile ? "hidden" : ""}>List</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="px-3 py-1.5">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    <span className={isMobile ? "hidden" : ""}>Analytics</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <ExportOptions 
                onExport={exportData} 
                disabled={filteredTransactions.length === 0 || loading}
              />
              
              <CreateTransactionDialog />
            </div>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingSpinner />
          ) : filteredTransactions.length === 0 ? (
            <EmptyState 
              hasSearchQuery={searchQuery.length > 0}
              onCreateTransaction={() => setIsDialogOpen(true)}
            />
          ) : (
            <div className="mb-8">
              {activeView === 'list' ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TransactionList transactions={filteredTransactions} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <DashboardAnalytics transactions={transactions} />
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default Index;
