
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { generateId } from '@/lib/utils';
import { dbManager } from '@/lib/db';
import { Transaction } from '@/lib/types';

const NewTransaction = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    defaultValues: {
      supplierName: '',
      supplierContact: '',
      goodsName: '',
      quantity: '',
      purchaseRate: '',
      status: 'pending',
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const purchaseRate = parseFloat(data.purchaseRate);
      const quantity = parseFloat(data.quantity);
      const totalCost = purchaseRate * quantity;
      
      const newTransaction: Transaction = {
        id: generateId('txn'),
        date: new Date().toISOString(),
        totalAmount: totalCost,
        status: data.status as 'completed' | 'pending' | 'cancelled',
        loadBuy: {
          supplierName: data.supplierName,
          supplierContact: data.supplierContact,
          goodsName: data.goodsName,
          quantity: quantity,
          purchaseRate: purchaseRate,
          totalCost: totalCost,
          amountPaid: 0,
          balance: totalCost,
        },
        payments: [],
        notes: [],
        attachments: [],
      };

      await dbManager.addTransaction(newTransaction);
      
      toast({
        title: "Success!",
        description: "Transaction created successfully.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        title: "Error",
        description: "Failed to create transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="supplierName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter supplier name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="supplierContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter supplier contact" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="goodsName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goods Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter goods name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter quantity" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="purchaseRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Rate</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter rate" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <CardFooter className="flex justify-between px-0">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Transaction"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewTransaction;
