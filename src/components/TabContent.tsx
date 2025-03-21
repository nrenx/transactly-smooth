
import { Transaction, TabKey } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

interface TabContentProps {
  transaction: Transaction;
  activeTab: TabKey;
}

const LoadBuyContent = ({ data }: { data: Transaction['loadBuy'] }) => {
  if (!data) return <div className="text-muted-foreground">No purchase data available</div>;
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Supplier Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Supplier Name</p>
            <p className="font-medium">{data.supplierName}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Contact Number</p>
            <p className="font-medium">{data.supplierContact}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Goods Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Goods Type</p>
            <p className="font-medium">{data.goodsName}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Quantity</p>
            <p className="font-medium">{data.quantity}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Purchase Rate</p>
            <p className="font-medium">{formatCurrency(data.purchaseRate)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Cost</p>
            <p className="font-medium">{formatCurrency(data.totalCost)}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Payment Status</h3>
        <div className="glass p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Amount Paid</p>
              <p className="font-medium text-success">{formatCurrency(data.amountPaid)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Remaining Balance</p>
              <p className="font-medium text-destructive">{formatCurrency(data.balance)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransportationContent = ({ data }: { data: Transaction['transportation'] }) => {
  if (!data) return <div className="text-muted-foreground">No transportation data available</div>;
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Vehicle Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Vehicle Type</p>
            <p className="font-medium">{data.vehicleType}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Number Plate</p>
            <p className="font-medium">{data.vehicleNumber}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Load Measurements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Empty Weight</p>
            <p className="font-medium">{data.emptyWeight} kg</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Loaded Weight</p>
            <p className="font-medium">{data.loadedWeight} kg</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Route Details</h3>
        <div className="glass p-4 rounded-lg">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Origin</p>
                <p className="font-medium">{data.origin}</p>
              </div>
              <div className="mx-4 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-sm text-muted-foreground">Destination</p>
                <p className="font-medium">{data.destination}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Transport Charges</p>
                <p className="font-medium">{formatCurrency(data.charges)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadSoldContent = ({ data }: { data: Transaction['loadSold'] }) => {
  if (!data) return <div className="text-muted-foreground">No sales data available</div>;
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Buyer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Buyer Name</p>
            <p className="font-medium">{data.buyerName}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Contact Number</p>
            <p className="font-medium">{data.buyerContact}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Sale Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Quantity Sold</p>
            <p className="font-medium">{data.quantitySold}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Sale Rate</p>
            <p className="font-medium">{formatCurrency(data.saleRate)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Sale Amount</p>
            <p className="font-medium">{formatCurrency(data.totalSaleAmount)}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Payment Status</h3>
        <div className="glass p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Amount Received</p>
              <p className="font-medium text-success">{formatCurrency(data.amountReceived)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Pending Balance</p>
              <p className="font-medium text-destructive">{formatCurrency(data.pendingBalance)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentsContent = ({ payments }: { payments: Transaction['payments'] }) => {
  if (!payments || payments.length === 0) return <div className="text-muted-foreground">No payment records available</div>;
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Payment Records</h3>
      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="glass p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${payment.isIncoming ? 'text-success' : 'text-destructive'}`}>
                    {payment.isIncoming ? 'Received' : 'Paid'}: {formatCurrency(payment.amount)}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground uppercase">
                    {payment.mode}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(payment.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm mt-2">
                  {payment.isIncoming ? 'From' : 'To'}: {payment.counterparty}
                </p>
                {payment.notes && (
                  <p className="text-sm text-muted-foreground mt-2 border-t border-border pt-2">
                    {payment.notes}
                  </p>
                )}
              </div>
              <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
                payment.isIncoming 
                  ? 'bg-success/10 text-success' 
                  : 'bg-destructive/10 text-destructive'
              }`}>
                {payment.isIncoming ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NotesContent = ({ notes }: { notes: Transaction['notes'] }) => {
  if (!notes || notes.length === 0) return <div className="text-muted-foreground">No notes available</div>;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Additional Notes</h3>
        <button
          type="button"
          className="inline-flex items-center justify-center h-8 px-3 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Note
        </button>
      </div>
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="glass p-4 rounded-lg">
            <div className="flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-muted-foreground">
                  {new Date(note.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <p className="text-sm whitespace-pre-wrap">{note.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AttachmentsContent = ({ attachments }: { attachments: Transaction['attachments'] }) => {
  if (!attachments || attachments.length === 0) return <div className="text-muted-foreground">No attachments available</div>;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Attachments</h3>
        <button
          type="button"
          className="inline-flex items-center justify-center h-8 px-3 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Upload
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {attachments.map((attachment) => {
          const isImage = attachment.type.startsWith('image/');
          
          return (
            <div key={attachment.id} className="glass rounded-lg overflow-hidden">
              <div className="aspect-square bg-accent flex items-center justify-center overflow-hidden">
                {isImage ? (
                  <img 
                    src={attachment.uri} 
                    alt={attachment.name} 
                    className="object-cover w-full h-full" 
                  />
                ) : (
                  <div className="flex items-center justify-center text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{attachment.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(attachment.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TabContent = ({ transaction, activeTab }: TabContentProps) => {
  const contentMap = {
    loadBuy: <LoadBuyContent data={transaction.loadBuy} />,
    transportation: <TransportationContent data={transaction.transportation} />,
    loadSold: <LoadSoldContent data={transaction.loadSold} />,
    payments: <PaymentsContent payments={transaction.payments} />,
    notes: <NotesContent notes={transaction.notes} />,
    attachments: <AttachmentsContent attachments={transaction.attachments} />
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {contentMap[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TabContent;
