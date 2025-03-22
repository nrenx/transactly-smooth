import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!data) {
      setIsEditing(true);
    }
  }, [data]);

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

  if (!data && isEditing) {
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

  if (isEditing && data) {
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

  if (!data && !isEditing) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground mb-4">No load buy data available</p>
        <Button 
          onClick={() => setIsEditing(true)}
          variant="outline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          Add Load Buy Details
        </Button>
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
    notes: data?.notes || '',
  });

  useEffect(() => {
    if (!data) {
      setIsEditing(true);
    }
  }, [data]);

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

const LoadSoldContent = ({ data, transaction, refreshTransaction }: { data: Transaction['loadSold'], transaction: Transaction, refreshTransaction: () => Promise<void> }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: data?.buyerName || '',
    buyerContact: data?.buyerContact || '',
    quantitySold: data?.quantitySold || 0,
    saleRate: data?.saleRate || 0,
    amountReceived: data?.amountReceived || 0,
  });

  useEffect(() => {
    if (!data) {
      setIsEditing(true);
    }
  }, [data]);

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

const PaymentsContent = ({ payments, transaction, refreshTransaction }: { payments: Transaction['payments'], transaction: Transaction, refreshTransaction: () => Promise<void> }) => {
  const { toast } = useToast();
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    mode: "cash",
    counterparty: "",
    referenceNumber: "",
    notes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      mode: value,
    });
  };

  const handleAddPayment = async () => {
    try {
      const newPayment: Payment = {
        id: generateId(),
        amount: parseFloat(formData.amount),
        date: new Date().toISOString(),
        mode: formData.mode as "cash" | "bank" | "upi" | "other",
        counterparty: formData.counterparty,
        referenceNumber: formData.referenceNumber,
        notes: formData.notes,
      };
      
      const updatedTransaction = {
        ...transaction,
        payments: [...(payments || []), newPayment],
      };
      
      await dbManager.updateTransaction(updatedTransaction);
      await refreshTransaction();
      setIsAddingPayment(false);
      setFormData({
        amount: "",
        mode: "cash",
        counterparty: "",
        referenceNumber: "",
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Payment History</h3>
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
      
      {payments && payments.length > 0 ? (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="glass p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{formatCurrency(payment.amount)}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    payment.mode === 'cash' ? 'bg-green-100 text-green-800' :
                    payment.mode === 'bank' ? 'bg-blue-100 text-blue-800' :
                    payment.mode === 'upi' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {payment.mode.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(payment.date).toLocaleDateString()} • {new Date(payment.date).toLocaleTimeString()}
                </p>
              </div>
              
              {payment.counterparty && (
                <p className="text-sm my-1">
                  <span className="text-muted-foreground">Counterparty:</span> {payment.counterparty}
                </p>
              )}
              
              {payment.referenceNumber && (
                <p className="text-sm my-1">
                  <span className="text-muted-foreground">Reference:</span> {payment.referenceNumber}
                </p>
              )}
              
              {payment.notes && (
                <p className="text-sm mt-2 whitespace-pre-wrap">
                  {payment.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">No payment records available</p>
        </div>
      )}
      
      <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
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
              <Select value={formData.mode} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="counterparty">Counterparty</Label>
              <Input 
                id="counterparty" 
                name="counterparty" 
                value={formData.counterparty} 
                onChange={handleInputChange} 
                placeholder="Enter counterparty name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="referenceNumber">Reference Number</Label>
              <Input 
                id="referenceNumber" 
                name="referenceNumber" 
                value={formData.referenceNumber} 
                onChange={handleInputChange} 
                placeholder="Enter reference number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                value={formData.notes} 
                onChange={handleInputChange}
                placeholder="Add any additional notes"
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
    </div>
  );
};

const NotesContent = ({ notes, transaction, refreshTransaction }: { notes: Transaction['notes'], transaction: Transaction, refreshTransaction: () => Promise<void> }) => {
  const { toast } = useToast();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState("");

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    
    try {
      const newNote: Note = {
        id: generateId(),
        text: noteText,
        date: new Date().toISOString(),
      };
      
      const updatedTransaction = {
        ...transaction,
        notes: [...(notes || []), newNote],
      };
      
      await dbManager.updateTransaction(updatedTransaction);
      await refreshTransaction();
      setIsAddingNote(false);
      setNoteText("");
      
      toast({
        title: "Success",
        description: "Note added successfully",
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
        <h3 className="text-lg font-medium">Notes</h3>
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
      
      {notes && notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="glass p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{note.text}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {new Date(note.date).toLocaleDateString()} • {new Date(note.date).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">No notes available</p>
        </div>
      )}
      
      <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="noteText">Note</Label>
              <Textarea 
                id="noteText" 
                value={noteText} 
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter your note here"
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
    </div>
  );
};

const AttachmentsContent = ({ attachments, transaction, refreshTransaction }: { attachments: Transaction['attachments'], transaction: Transaction, refreshTransaction: () => Promise<void> }) => {
  const { toast } = useToast();
  const [isAddingAttachment, setIsAddingAttachment] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    type: "image",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      type: value,
    });
  };

  const handleAddAttachment = async () => {
    if (!formData.title.trim() || !formData.url.trim()) return;
    
    try {
      const newAttachment: Attachment = {
        id: generateId(),
        title: formData.title,
        url: formData.url,
        type: formData.type as "image" | "document" | "invoice" | "other",
        description: formData.description,
        date: new Date().toISOString(),
      };
      
      const updatedTransaction = {
        ...transaction,
        attachments: [...(attachments || []), newAttachment],
      };
      
      await dbManager.updateTransaction(updatedTransaction);
      await refreshTransaction();
      setIsAddingAttachment(false);
      setFormData({
        title: "",
        url: "",
        type: "image",
        description: "",
      });
      
      toast({
        title: "Success",
        description: "Attachment added successfully",
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
      
      {attachments && attachments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="glass p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="rounded-md bg-muted p-2 text-muted-foreground">
                  {attachment.type === 'image' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  ) : attachment.type === 'document' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  ) : attachment.type === 'invoice' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="16" y="4" width="6" height="6"></rect>
                      <rect x="2" y="14" width="6" height="6"></rect>
                      <path d="M16 10l-4 4-8-4"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                  )}
                </div>
                <div className="flex-1 space-y-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium truncate">{attachment.title}</h4>
                    <span className="text-xs text-muted-foreground">{attachment.type}</span>
                  </div>
                  {attachment.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{attachment.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(attachment.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex justify-end">
                <a 
                  href={attachment.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View Attachment
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">No attachments available</p>
        </div>
      )}
      
      <Dialog open={isAddingAttachment} onOpenChange={setIsAddingAttachment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Attachment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                placeholder="Enter attachment title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input 
                id="url" 
                name="url" 
                value={formData.url} 
                onChange={handleInputChange} 
                placeholder="Enter URL of the attachment"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Attachment Type</Label>
              <Select value={formData.type} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select attachment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange}
                placeholder="Add a brief description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingAttachment(false)}>Cancel</Button>
            <Button onClick={handleAddAttachment}>Add Attachment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const TabContent: React.FC<TabContentProps> = ({ transaction, activeTab }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  const refreshTransaction = async () => {
    try {
      const refreshedTransaction = await dbManager.getTransactionById(transaction.id);
    } catch (error) {
      console.error("Error refreshing transaction:", error);
    }
  };

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
