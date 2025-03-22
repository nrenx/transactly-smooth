
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import TransactionForm from '@/components/forms/TransactionForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const NewTransaction = () => {
  const isMobile = useIsMobile();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-muted/30"
    >
      <header className="glass border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Create New Transaction</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-6 px-4 flex-1">
        <Card className={`mx-auto ${isMobile ? 'w-full' : 'max-w-2xl'}`}>
          <CardContent className="p-6">
            <TransactionForm />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default NewTransaction;
