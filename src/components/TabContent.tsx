import { useState, useCallback } from 'react';
import { TabKey, Transaction } from '@/lib/types';
import TabNavigation from './TabNavigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { dbManager } from '@/lib/db';
import LoadBuyContent from './tab-contents/LoadBuyContent';
import TransportationContent from './TransportationComponent';
import LoadSoldContent from './tab-contents/LoadSoldContent';
import PaymentsContent from './tab-contents/PaymentsContent';
import NotesContent from './tab-contents/NotesContent';
import AttachmentsContent from './tab-contents/AttachmentsContent';

interface TabContentProps {
  transaction: Transaction;
  activeTab: TabKey;
  refreshTransaction: () => Promise<void>;
}

const TabContent: React.FC<TabContentProps> = ({ transaction, activeTab, refreshTransaction }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteTransaction = async () => {
    try {
      await dbManager.deleteTransaction(transaction.id);
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
      navigate("/");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "loadBuy":
        return <LoadBuyContent data={transaction.loadBuy} transaction={transaction} refreshTransaction={refreshTransaction} />;
      case "transportation":
        return <TransportationContent data={transaction.transportation} transaction={transaction} refreshTransaction={refreshTransaction} />;
      case "loadSold":
        return <LoadSoldContent data={transaction.loadSold} transaction={transaction} refreshTransaction={refreshTransaction} />;
      case "payments":
        return <PaymentsContent payments={transaction.payments} transaction={transaction} refreshTransaction={refreshTransaction} />;
      case "notes":
        return <NotesContent notes={transaction.notes} transaction={transaction} refreshTransaction={refreshTransaction} />;
      case "attachments":
        return <AttachmentsContent attachments={transaction.attachments} transaction={transaction} refreshTransaction={refreshTransaction} />;
      default:
        return <div>Select a tab to view details</div>;
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-6"
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>

      {activeTab === "loadBuy" && (
        <div className="mt-8 pt-6 border-t border-border">
          <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Delete Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Transaction</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p>Are you sure you want to delete this transaction? This action cannot be undone.</p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDeleteTransaction}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default TabContent;
