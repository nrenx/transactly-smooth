import { useState } from 'react';
import { Transaction, TabKey, Payment, Note, Attachment } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { formatCurrency, generateId } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { dbManager } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import * as React from 'react';

interface TabContentProps {
  transaction: Transaction;
  activeTab: TabKey;
}

// LoadBuyContent with Edit functionality
const LoadBuyContent = ({ data, transaction, refreshTransaction }: { data: Transaction['loadBuy'], transaction: Transaction, refreshTransaction: () => Promise<void> }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    supplierName: data?.supplierName || '',
    supplierContact: data?.supplierContact || '',
    goodsName: data?.goodsName || '',
    quantity: data?.quantity || 0,
    purchaseRate: data?.purchaseRate || 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' || name === 'purchaseRate' ? parseFloat(value) : value,
    });
  };

  const handleSave = async () => {
    try {
      const totalCost = formData.quantity * formData.purchaseRate;
      
      const updatedTransaction = {
        ...transaction,
        loadBuy: {
          ...transaction.loadBuy,
          supplierName: formData.supplierName,
          supplierContact: formData.supplierContact,
          goodsName: formData.goodsName,
          quantity: formData.quantity,
          purchaseRate: formData.purchaseRate,
          totalCost: totalCost,
          balance: totalCost - (transaction.loadBuy?.amountPaid || 0),
        },
        totalAmount: totalCost,
      };
      
      await dbManager.updateTransaction(updatedTransaction);
      await refreshTransaction();
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Load buy details updated successfully",
      });
    } catch (error) {
      console.error("Error updating load buy details:", error);
      toast({
        title: "Error",
        description: "Failed to update load buy details",
        variant: "destructive",
      });
    }
  };

  if (!data) return <div className="text-muted-foreground">No purchase data available</div>;
  
  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Edit Load Buy Details</h3>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplierName">Supplier Name</Label>
              <Input 
                id="supplierName" 
                name="supplierName" 
                value={formData.supplierName} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplierContact">Contact Number</Label>
              <Input 
                id="supplierContact" 
                name="supplierContact" 
                value={formData.supplierContact} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goodsName">Goods Type</Label>
            <Input 
              id="goodsName" 
              name="goodsName" 
              value={formData.goodsName} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input 
                id="quantity" 
                name="quantity" 
                type="number" 
                value={formData.quantity} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchaseRate">Purchase Rate</Label>
              <Input 
                id="purchaseRate" 
                name="purchaseRate" 
                type="number" 
                value={formData.purchaseRate} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Supplier Information</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsEditing(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          Edit Details
        </Button>
      </div>
      
      <div className="space-y-4">
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

// TransportationContent with Edit functionality
const TransportationContent = ({ data, transaction, refreshTransaction }: { data: Transaction['transportation'], transaction: Transaction, refreshTransaction: () => Promise<void> }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    vehicleType: data?.vehicleType || '',
    vehicleNumber: data?.vehicleNumber || '',
    emptyWeight: data?.emptyWeight || 0,
    loadedWeight: data?.loadedWeight || 0,
    origin: data?.origin || '',
    destination: data?.destination || '',
    charges: data?.charges || 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['emptyWeight', 'loadedWeight', 'charges'].includes(name) ? parseFloat(value) : value,
    });
  };

  const handleSave = async () => {
    try {
      const updatedTransaction = {
        ...transaction,
        transportation: {
          ...formData,
        },
      };
      
      await dbManager.updateTransaction(updatedTransaction);
      await refreshTransaction();
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Transportation details updated successfully",
      });
    } catch (error) {
      console.error("Error updating transportation details:", error);
      toast({
        title: "Error",
        description: "Failed to update transportation details",
        variant: "destructive",
      });
    }
  };

  if (!data) return (
    <div className="text-center p-8">
      <p className="text-muted-foreground mb-4">No transportation data available</p>
      <Button 
        onClick={() => setIsEditing(true)}
        variant="outline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        Add Transportation Details
      </Button>
    </div>
  );
  
  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Edit Transportation Details</h3>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Input 
                id="vehicleType" 
                name="vehicleType" 
                value={formData.vehicleType} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Number Plate</Label>
              <Input 
                id="vehicleNumber" 
                name="vehicleNumber" 
                value={formData.vehicleNumber} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emptyWeight">Empty Weight (kg)</Label>
              <Input 
                id="emptyWeight" 
                name="emptyWeight" 
                type="number" 
                value={formData.emptyWeight} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loadedWeight">Loaded Weight (kg)</Label>
              <Input 
                id="loadedWeight" 
                name="loadedWeight" 
                type="number" 
                value={formData.loadedWeight} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <Input 
                id="origin" 
                name="origin" 
                value={formData.origin} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input 
                id="destination" 
                name="destination" 
                value={formData.destination} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="charges">Transport Charges</Label>
            <Input 
              id="charges" 
              name="charges" 
              type="number" 
              value={formData.charges} 
              onChange={handleInputChange} 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Vehicle Information</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsEditing(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          Edit Details
        </Button>
      </div>
      
      <div className="space-y-4">
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

// LoadSoldContent with Edit functionality
const LoadSoldContent = ({ data, transaction, refreshTransaction }: { data: Transaction['loadSold'], transaction: Transaction, refreshTransaction: () => Promise<void> }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: data?.buyerName || '',
    buyerContact: data?.buyerContact || '',
    quantitySold: data?.quantitySold || 0,
    saleRate: data?.saleRate || 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['quantitySold', 'saleRate'].includes(name) ? parseFloat(value) : value,
    });
  };

  const handleSave = async () => {
    try {
      const totalSaleAmount = formData.quantitySold * formData.saleRate;
      
      const updatedTransaction = {
        ...transaction,
        loadSold: {
          ...formData,
          totalSaleAmount,
          amountReceived: data?.amountReceived || 0,
          pendingBalance: totalSaleAmount - (data?.amountReceived || 0),
        },
      };
      
      await dbManager.updateTransaction(updatedTransaction);
      await refreshTransaction();
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Load sold details updated successfully",
      });
    } catch (error) {
      console.error("Error updating load sold details:", error);
      toast({
        title: "Error",
        description: "Failed to update load sold details",
        variant: "destructive",
      });
    }
  };

  if (!data) return (
    <div className="text-center p-8">
      <p className="text-muted-foreground mb-4">No sales data available</p>
      <Button 
        onClick={() => setIsEditing(true)}
        variant="outline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        Add Sales Details
      </Button>
    </div>
  );
  
  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Edit Sales Details</h3>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buyerName">Buyer Name</Label>
              <Input 
                id="buyerName" 
                name="buyerName" 
                value={formData.buyerName} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyerContact">Contact Number</Label>
              <Input 
                id="buyerContact" 
                name="buyerContact" 
                value={formData.buyerContact} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantitySold">Quantity Sold</Label>
              <Input 
                id="quantitySold" 
                name="quantitySold" 
                type="number" 
                value={formData.quantitySold} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="saleRate">Sale Rate</Label>
              <Input 
                id="saleRate" 
                name="saleRate" 
                type="number" 
                value={formData.saleRate} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Buyer Information</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsEditing(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          Edit Details
        </Button>
      </div>
      
      <div className="space-y-4">
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

// PaymentsContent with Add Payment functionality
const PaymentsContent = ({ payments, transaction, refreshTransaction }: { payments: Transaction['payments'], transaction: Transaction, refreshTransaction: () => Promise<void> }) => {
  const { toast } = useToast();
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    mode: "cash",
    counterparty: "",
    isIncoming: false,
    notes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, isIncoming: e.target.checked });
  };

  const handleAddPayment = async () => {
    try {
      const newPayment: Payment = {
        id: generateId('pay'),
        date: new Date().toISOString(),
        amount: parseFloat(formData.amount),
        mode: formData.mode as 'cash' | 'cheque' | 'upi' | 'bank',
        counterparty: formData.counterparty,
        isIncoming: formData.isIncoming,
        notes: formData.notes || undefined,
      };

      // Update transaction with new payment
      const updatedTransaction = { ...transaction };
      updatedTransaction.payments = [...(updatedTransaction.payments || []), newPayment];

      // If this is a load buy payment
      if (!formData.isIncoming && updatedTransaction.loadBuy) {
        updatedTransaction.loadBuy.amountPaid = (updatedTransaction.loadBuy.amountPaid || 0) + parseFloat(formData.amount);
        updatedTransaction.loadBuy.balance = updatedTransaction.loadBuy.totalCost - updatedTransaction.loadBuy.amountPaid;
      }

      // If this is a load sold payment
      if (formData.isIncoming && updatedTransaction.loadSold) {
        updatedTransaction.loadSold.amountReceived = (updatedTransaction.loadSold.amountReceived || 0) + parseFloat(formData.amount);
        updatedTransaction.loadSold.pendingBalance = updatedTransaction.loadSold.totalSaleAmount - updatedTransaction.loadSold.amountReceived;
      }

      await dbManager.updateTransaction(updatedTransaction);
      await refreshTransaction();
      setIsAddingPayment(false);
      setFormData({
        amount: "",
        mode: "cash",
        counterparty: "",
        isIncoming: false,
        notes: "",
      });

      toast({
        title: "Success",
        description: "Payment added successfully",
      });
    } catch (error) {
      console.error("Error adding payment:", error);
      toast({
        title: "Error",
        description: "Failed to add payment",
        variant: "destructive",
      });
    }
  };

  if (isAddingPayment) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Add New Payment</h3>
          <Button variant="outline" onClick={() => setIsAddingPayment(false)}>Cancel</Button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                name="amount" 
                type="number" 
                value={formData.amount} 
                onChange={handleInputChange} 
                placeholder="Enter amount"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mode">Payment Mode</Label>
              <Select 
                value={formData.mode} 
                onValueChange={(value) => handleSelectChange("mode", value)}
              >
                <SelectTrigger id="mode">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="counterparty">Counterparty</Label>
            <Input 
              id="counterparty" 
              name="counterparty" 
              value={formData.counterparty} 
              onChange={handleInputChange} 
              placeholder="Enter person/company name"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isIncoming"
              checked={formData.isIncoming}
              onChange={handleCheckboxChange}
              className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-2 focus:ring-primary"
            />
            <Label htmlFor="isIncoming" className="cursor-pointer">This is an incoming payment (money received)</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              value={formData.notes} 
              onChange={handleInputChange} 
              placeholder="Additional details about this payment"
            />
          </div>
          
          <Button onClick={handleAddPayment} className="w-full">Add Payment</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Payment Records</h3>
        <Button 
          onClick={() => setIsAddingPayment(true)}
          size="sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Payment
        </Button>
      </div>
      
      <div className="space-y-4">
        {(!payments || payments.length === 0) ? (
          <div className="text-muted-foreground">No payment records available</div>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="glass p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap
