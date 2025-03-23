
import { useState } from 'react';
import { TabKey, Transaction } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { dbManager } from '@/lib/db';
import TransportationContent from './TransportationComponent';
import LoadBuyContent from './tab-contents/LoadBuyContent';
import LoadSoldContent from './tab-contents/LoadSoldContent';
import PaymentsContent from './tab-contents/PaymentsContent';
import NotesContent from './tab-contents/NotesContent';
import AttachmentsContent from './tab-contents/AttachmentsContent';

interface TabContentProps {
  activeTab: TabKey;
  transaction: Transaction;
  refreshTransaction: () => Promise<void>;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab, transaction, refreshTransaction }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await dbManager.deleteTransaction(transaction.id);
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
      navigate('/');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-card rounded-lg p-6 shadow-sm border"
        >
          {activeTab === 'loadBuy' && transaction.loadBuy && (
            <LoadBuyContent 
              data={transaction.loadBuy} 
              transaction={transaction} 
              refreshTransaction={refreshTransaction} 
            />
          )}
          
          {activeTab === 'transportation' && transaction.transportation && (
            <TransportationContent 
              data={transaction.transportation} 
              transaction={transaction} 
              refreshTransaction={refreshTransaction} 
            />
          )}
          
          {activeTab === 'loadSold' && transaction.loadSold && (
            <LoadSoldContent 
              data={transaction.loadSold} 
              transaction={transaction} 
              refreshTransaction={refreshTransaction} 
            />
          )}
          
          {activeTab === 'payments' && (
            <PaymentsContent 
              payments={transaction.payments} 
              transaction={transaction} 
              refreshTransaction={refreshTransaction} 
            />
          )}
          
          {activeTab === 'notes' && (
            <NotesContent 
              notes={transaction.notes} 
              transaction={transaction} 
              refreshTransaction={refreshTransaction} 
            />
          )}
          
          {activeTab === 'attachments' && (
            <AttachmentsContent 
              attachments={transaction.attachments} 
              transaction={transaction} 
              refreshTransaction={refreshTransaction} 
            />
          )}
          
          <div className="mt-8 flex justify-between">
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete Transaction</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <p className="py-4">This action cannot be undone. This will permanently delete this transaction and all its data.</p>
                <DialogFooter className="flex space-x-2 justify-end">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TabContent;
