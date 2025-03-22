
import { useState, useCallback } from 'react';
import { TabKey, Transaction } from '@/lib/types';
import TabNavigation from './TabNavigation';
import TabContent from './TabContent';
import { dbManager } from '@/lib/db';

interface DetailedViewProps {
  transaction: Transaction;
}

const DetailedView = ({ transaction }: DetailedViewProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>('loadBuy');
  const [currentTransaction, setCurrentTransaction] = useState<Transaction>(transaction);

  const refreshTransaction = useCallback(async () => {
    try {
      const refreshedTransaction = await dbManager.getTransaction(transaction.id);
      if (refreshedTransaction) {
        setCurrentTransaction(refreshedTransaction);
      }
    } catch (error) {
      console.error("Error refreshing transaction:", error);
    }
  }, [transaction.id]);

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
      <div className="w-full md:w-1/4 min-w-[240px] flex-shrink-0 border-b md:border-b-0 border-border">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      <div className="flex-1 overflow-auto">
        <TabContent 
          transaction={currentTransaction} 
          activeTab={activeTab} 
          refreshTransaction={refreshTransaction} 
        />
      </div>
    </div>
  );
};

export default DetailedView;
