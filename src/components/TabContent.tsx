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
    amountPaid: data?.amountPaid || 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['quantity', 'purchaseRate', 'amountPaid'].includes(name) ? parseFloat(value) : value,
    });
  };

  const handleSave = async () => {
    try {
      const totalCost = formData.quantity * formData.purchaseRate;
      
      const updatedTransaction = {
        ...transaction,
        loadBuy: {
          ...formData,
          totalCost: totalCost,
          balance: totalCost - formData.amountPaid,
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

  // Always show the edit form for undefined data
  if (!data) {
    setIsEditing(true);
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Add Load Buy Details</h3>
          <div className="flex space-x-2">
            <Button onClick={handleSave}>Save Details</Button>
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
          
          <div className="space-y-2">
            <Label htmlFor="amountPaid">Amount Paid</Label>
            <Input 
              id="amountPaid" 
              name="amountPaid" 
              type="number" 
              value={formData.amountPaid} 
              onChange={handleInputChange} 
            />
            <p className="text-xs text-muted-foreground mt-1">
              Total Cost: {formatCurrency(formData.quantity * formData.purchaseRate)} • 
              Balance: {formatCurrency((formData.quantity * formData.purchaseRate) - formData.amountPaid)}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
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
          
          <div className="space-y-2">
            <Label htmlFor="amountPaid">Amount Paid</Label>
            <Input 
              id="amountPaid" 
              name="amountPaid" 
              type="number" 
              value={formData.amountPaid} 
              onChange={handleInputChange} 
            />
            <p className="text-xs text-muted-foreground mt-1">
              Total Cost: {formatCurrency(formData.quantity * formData.purchaseRate)} • 
              Balance: {formatCurrency((formData.quantity * formData.purchaseRate) - formData.amountPaid)}
            </p>
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

// TransportationContent with Edit functionality and Notes
const TransportationContent = ({ data, transaction, refreshTransaction }: { data: Transaction['transportation'], transaction: Transaction, refreshTransaction: () => Promise<void> }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(!data);
  const [formData, setFormData] = useState({
    vehicleType: data?.vehicleType || '',
    vehicleNumber: data?.vehicleNumber || '',
    emptyWeight: data?.emptyWeight || 0,
    loadedWeight: data?.loadedWeight || 0,
    origin: data?.origin || '',
    destination: data?.destination || '',
    charges: data?.charges || 0,
    notes: data?.notes || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{data ? "Edit Transportation Details" : "Add Transportation Details"}</h3>
          <div className="flex space-x-2">
            {data && <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>}
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
          
          <div className="space-y-2">
            <Label htmlFor="notes">Transportation Notes</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              value={formData.notes} 
              onChange={handleInputChange} 
              placeholder="Add details about the transportation"
              rows={4}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
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
      
      {data.notes && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Transportation Notes</h3>
          <div className="glass p-4 rounded-lg">
            <p className="whitespace-pre-wrap">{data.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// LoadSoldContent with Edit functionality
const LoadSoldContent = ({ data, transaction, refreshTransaction }: { data: Transaction['loadSold'], transaction: Transaction, refreshTransaction: () => Promise<void> }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(!data);
  const [formData, setFormData] = useState({
    buyerName: data?.buyerName || '',
    buyerContact: data?.buyerContact || '',
    quantitySold: data?.quantitySold || 0,
    saleRate: data?.saleRate || 0,
    amountReceived: data?.amountReceived || 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['quantitySold', 'saleRate', 'amountReceived'].includes(name) ? parseFloat(value) : value,
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
          pendingBalance: totalSaleAmount - formData.amountReceived,
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

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{data ? "Edit Sales Details" : "Add Sales Details"}</h3>
          <div className="flex space-x-2">
            {data && <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>}
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
          
          <div className="space-y-2">
            <Label htmlFor="amountReceived">Amount Received</Label>
            <Input 
              id="amountReceived" 
              name="amountReceived" 
              type="number" 
              value={formData.amountReceived} 
              onChange={handleInputChange} 
            />
            <p className="text-xs text-muted-foreground mt-1">
              Total Sale Amount: {formatCurrency(formData.quantitySold * formData.saleRate)} • 
              Pending Balance: {formatCurrency((formData.quantitySold * formData.saleRate) - formData.amountReceived)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
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
      
      // Reset form and close dialog
      setFormData({
        amount: "",
        mode: "cash",
        counterparty: "",
        isIncoming: false,
        notes: "",
      });
      setIsAddingPayment(false);
      
      toast({
        title: "Payment Added",
        description: `${formData.isIncoming ? "Incoming" : "Outgoing"} payment of ${formatCurrency(parseFloat(formData.amount))} added successfully`,
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

  const getPaymentTypeText = (isIncoming: boolean) => {
    return isIncoming ? 'Received' : 'Paid';
  };

  const getPaymentTypeClass = (isIncoming: boolean) => {
    return isIncoming ? 'text-success' : 'text-destructive';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Payment Transactions</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsAddingPayment(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Payment
        </Button>
      </div>
        
      <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                name="amount" 
                type="number" 
                value={formData.amount} 
                onChange={handleInputChange} 
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mode">Payment Mode</Label>
              <Select 
                value={formData.mode} 
                onValueChange={(value) => handleSelectChange('mode', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="counterparty">Paid To / Received From</Label>
              <Input 
                id="counterparty" 
                name="counterparty" 
                value={formData.counterparty} 
                onChange={handleInputChange} 
                placeholder="Enter name"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isIncoming"
                checked={formData.isIncoming}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isIncoming" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                This is an incoming payment (money received)
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                value={formData.notes} 
                onChange={handleInputChange} 
                placeholder="Add any payment notes"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingPayment(false)}>Cancel</Button>
            <Button onClick={handleAddPayment}>Add Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {payments && payments.length > 0 ? (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="glass p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    <span className={getPaymentTypeClass(payment.isIncoming)}>
                      {getPaymentTypeText(payment.isIncoming)}:
                    </span> {formatCurrency(payment.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment.date).toLocaleDateString()} • {payment.mode.toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{payment.counterparty}</p>
                  <p className="text-xs text-muted-foreground">{payment.isIncoming ? 'From' : 'To'}</p>
                </div>
              </div>
              {payment.notes && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm">{payment.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">No payment transactions recorded</p>
          <Button 
            onClick={() => setIsAddingPayment(true)}
            variant="outline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Record First Payment
          </Button>
        </div>
      )}
    </div>
  );
};

// NotesContent with Add Note functionality
const NotesContent = ({ notes, transaction, refreshTransaction }: { notes: Transaction['notes'], transaction: Transaction, refreshTransaction: () => Promise<void> }) => {
  const { toast } = useToast();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  const handleAddNote = async () => {
    if (!noteContent.trim()) {
      toast({
        title: "Error",
        description: "Note content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const newNote: Note = {
        id: generateId('note'),
        date: new Date().toISOString(),
        content: noteContent,
      };

      const updatedTransaction = { ...transaction };
      updatedTransaction.notes = [...(updatedTransaction.notes || []), newNote];
      
      await dbManager.updateTransaction(updatedTransaction);
      await refreshTransaction();
      
      setNoteContent("");
      setIsAddingNote(false);
      
      toast({
        title: "Note Added",
        description: "Note has been added successfully",
      });
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Transaction Notes</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsAddingNote(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Note
        </Button>
      </div>
        
      <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="noteContent">Note Content</Label>
              <Textarea 
                id="noteContent" 
                value={noteContent} 
                onChange={(e) => setNoteContent(e.target.value)} 
                placeholder="Add details about the transaction"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingNote(false)}>Cancel</Button>
            <Button onClick={handleAddNote}>Add Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {notes && notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="glass p-4 rounded-lg">
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">
                  {new Date(note.date).toLocaleString()}
                </p>
                <p className="whitespace-pre-wrap">{note.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">No notes added to this transaction</p>
          <Button 
            onClick={() => setIsAddingNote(true)}
            variant="outline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add First Note
          </Button>
        </div>
      )}
    </div>
  );
};

// AttachmentsContent with Add Attachment functionality
const AttachmentsContent = ({ attachments, transaction, refreshTransaction }: { attachments: Transaction['attachments'], transaction: Transaction, refreshTransaction: () => Promise<void> }) => {
  const { toast } = useToast();
  const [isAddingAttachment, setIsAddingAttachment] = useState(false);
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentUri, setAttachmentUri] = useState("");

  const handleAddAttachment = async () => {
    if (!attachmentName.trim() || !attachmentUri.trim()) {
      toast({
        title: "Error",
        description: "Attachment name and URL are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const newAttachment: Attachment = {
        id: generateId('att'),
        name: attachmentName,
        type: getFileType(attachmentUri),
        uri: attachmentUri,
        date: new Date().toISOString(),
      };

      const updatedTransaction = { ...transaction };
      updatedTransaction.attachments = [...(updatedTransaction.attachments || []), newAttachment];
      
      await dbManager.updateTransaction(updatedTransaction);
      await refreshTransaction();
      
      setAttachmentName("");
      setAttachmentUri("");
      setIsAddingAttachment(false);
      
      toast({
        title: "Attachment Added",
        description: "Attachment has been added successfully",
      });
    } catch (error) {
      console.error("Error adding attachment:", error);
      toast({
        title: "Error",
        description: "Failed to add attachment",
        variant: "destructive",
      });
    }
  };

  const getFileType = (uri: string): string => {
    const extension = uri.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return 'image';
    } else if (['pdf'].includes(extension)) {
      return 'pdf';
    } else if (['doc', 'docx'].includes(extension)) {
      return 'document';
    } else if (['xls', 'xlsx'].includes(extension)) {
      return 'spreadsheet';
    } else if (['txt', 'csv'].includes(extension)) {
      return 'text';
    }
    
    return 'other';
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        );
      case 'pdf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
      case 'document':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Attachments</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsAddingAttachment(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
          </svg>
          Add Attachment
        </Button>
      </div>
        
      <Dialog open={isAddingAttachment} onOpenChange={setIsAddingAttachment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Attachment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="attachmentName">Attachment Name</Label>
              <Input 
                id="attachmentName" 
                value={attachmentName} 
                onChange={(e) => setAttachmentName(e.target.value)} 
                placeholder="Enter a name for this attachment"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attachmentUri">Attachment URL</Label>
              <Input 
                id="attachmentUri" 
                value={attachmentUri} 
                onChange={(e) => setAttachmentUri(e.target.value)} 
                placeholder="Enter the URL for this attachment"
              />
              <p className="text-xs text-muted-foreground">
                Enter a direct URL to the file or image
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingAttachment(false)}>Cancel</Button>
            <Button onClick={handleAddAttachment}>Add Attachment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {attachments && attachments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attachments.map((attachment) => (
            <a 
              key={attachment.id} 
              href={attachment.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass p-4 rounded-lg flex items-center gap-3 hover:bg-accent transition-colors"
            >
              <div className="text-primary">
                {getAttachmentIcon(attachment.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{attachment.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(attachment.date).toLocaleDateString()}
                </p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">No attachments added to this transaction</p>
          <Button 
            onClick={() => setIsAddingAttachment(true)}
            variant="outline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </svg>
            Add First Attachment
          </Button>
        </div>
      )}
    </div>
  );
};

// Main TabContent component
const TabContent = ({ transaction, activeTab, refreshTransaction }: TabContentProps & { refreshTransaction: () => Promise<void> }) => {
  if (!transaction) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
        className="p-4"
      >
        {activeTab === 'loadBuy' && (
          <LoadBuyContent 
            data={transaction.loadBuy} 
            transaction={transaction} 
            refreshTransaction={refreshTransaction} 
          />
        )}
        {activeTab === 'transportation' && (
          <TransportationContent 
            data={transaction.transportation} 
            transaction={transaction} 
            refreshTransaction={refreshTransaction} 
          />
        )}
        {activeTab === 'loadSold' && (
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
      </motion.div>
    </AnimatePresence>
  );
};

export default TabContent;
