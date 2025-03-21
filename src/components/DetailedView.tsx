
import { useState } from 'react';
import { TabKey, Transaction } from '@/lib/types';
import TabNavigation from './TabNavigation';
import TabContent from './TabContent';

interface DetailedViewProps {
  transaction: Transaction;
}

const DetailedView = ({ transaction }: DetailedViewProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>('loadBuy');

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
      <div className="w-full md:w-1/4 min-w-[240px] flex-shrink-0 border-b md:border-b-0 border-border">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      <div className="flex-1 overflow-auto">
        <TabContent transaction={transaction} activeTab={activeTab} />
      </div>
    </div>
  );
};

export default DetailedView;
