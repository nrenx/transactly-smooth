
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom hooks
import { useTransactions } from '@/hooks/useTransactions';

// Components
import Header from '@/components/index/Header';
import SearchBar from '@/components/index/SearchBar';
import CreateTransactionDialog from '@/components/index/CreateTransactionDialog';
import EmptyState from '@/components/index/EmptyState';
import LoadingSpinner from '@/components/index/LoadingSpinner';
import TransactionList from '@/components/index/TransactionList';
import { exportTransactions, ExportFormat } from '@/lib/exportUtils';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, UserPlus, LineChart } from 'lucide-react';
import { dbManager } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Index = () => {
  const { 
    filteredTransactions, 
    loading, 
    searchQuery, 
    setSearchQuery,
    setStatusFilter
  } = useTransactions();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [businessName, setBusinessName] = useState('TransactLy');
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState('');
  const { toast } = useToast();

  const handleExport = async (format: ExportFormat) => {
    try {
      await exportTransactions(filteredTransactions, format);
      toast({
        title: 'Export Successful',
        description: `Transaction data has been exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export transaction data',
        variant: 'destructive',
      });
    }
  };

  const handleFilterChange = (status: string | null) => {
    setStatusFilter(status);
  };

  const loadBusinessName = async () => {
    try {
      const settings = await localStorage.getItem('businessName');
      if (settings) {
        setBusinessName(settings);
      }
    } catch (error) {
      console.error('Failed to load business name:', error);
    }
  };

  const saveBusinessName = async () => {
    try {
      if (newBusinessName.trim()) {
        await localStorage.setItem('businessName', newBusinessName);
        setBusinessName(newBusinessName);
        setIsNameDialogOpen(false);
        toast({
          title: 'Success',
          description: 'Business name updated successfully',
        });
      }
    } catch (error) {
      console.error('Failed to save business name:', error);
      toast({
        title: 'Error',
        description: 'Failed to update business name',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadBusinessName();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col"
    >
      <Header onExport={handleExport} businessName={businessName} onEditName={() => setIsNameDialogOpen(true)} />
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="w-full max-w-3xl mx-auto mb-6 grid grid-cols-4">
          <TabsTrigger value="dashboard">
            <LineChart className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="buyers">
            <UserPlus className="w-4 h-4 mr-2" />
            Buyers
          </TabsTrigger>
          <TabsTrigger value="sellers">
            <Users className="w-4 h-4 mr-2" />
            Sellers
          </TabsTrigger>
          <TabsTrigger value="more">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div className="w-full md:w-auto">
              <h2 className="text-xl font-medium mb-2">Recent Transactions</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <SearchBar 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
                <div className="flex space-x-2">
                  <Button 
                    variant={filteredTransactions.length === 0 ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleFilterChange(null)}
                  >
                    All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleFilterChange('pending')}
                    className="border-amber-500 text-amber-500 hover:bg-amber-50"
                  >
                    Pending
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleFilterChange('completed')}
                    className="border-green-500 text-green-500 hover:bg-green-50"
                  >
                    Completed
                  </Button>
                </div>
              </div>
            </div>
            
            <CreateTransactionDialog />
          </div>
          
          <AnimatePresence>
            {loading ? (
              <LoadingSpinner />
            ) : filteredTransactions.length === 0 ? (
              <EmptyState 
                hasSearchQuery={searchQuery.length > 0}
                onCreateTransaction={() => setIsDialogOpen(true)}
              />
            ) : (
              <TransactionList transactions={filteredTransactions} />
            )}
          </AnimatePresence>
        </TabsContent>
        
        <TabsContent value="buyers" className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Buyers Management</CardTitle>
              <CardDescription>Add and manage your buyers in one place</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>This section allows you to add new buyers by entering their details.</p>
                <p>Feature coming soon!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sellers" className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Sellers Management</CardTitle>
              <CardDescription>Add and manage your sellers in one place</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>This section allows you to add new sellers by entering their details.</p>
                <p>Feature coming soon!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="more" className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Customize your application settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Business Name</h3>
                    <p className="text-sm text-muted-foreground">Current: {businessName}</p>
                  </div>
                  <Button onClick={() => setIsNameDialogOpen(true)}>Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Business Name</DialogTitle>
            <DialogDescription>
              Enter your business name to customize your dashboard
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input 
                id="businessName" 
                placeholder="Enter your business name"
                value={newBusinessName}
                onChange={(e) => setNewBusinessName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNameDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveBusinessName}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Index;
