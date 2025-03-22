
import { Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useIsMobile } from '@/hooks/use-mobile';

interface TransactionBasicFieldsProps {
  control: Control<any>;
}

export const TransactionBasicFields = ({ control }: TransactionBasicFieldsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Transaction Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter transaction name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Transaction Date</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                {...field} 
                value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''} 
                onChange={e => field.onChange(e.target.value)} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
