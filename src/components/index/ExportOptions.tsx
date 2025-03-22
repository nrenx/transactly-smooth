
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ExportFormat } from '@/lib/exportUtils';
import { FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportOptionsProps {
  onExport: (format: ExportFormat) => Promise<void>;
  disabled?: boolean;
}

const ExportOptions = ({ onExport, disabled = false }: ExportOptionsProps) => {
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async (format: ExportFormat) => {
    try {
      setExporting(true);
      await onExport(format);
      toast({
        title: 'Export Successful',
        description: `Your data has been exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your data',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          disabled={disabled || exporting}
        >
          <FileDown className="h-4 w-4" />
          <span className="hidden sm:inline-block">Export</span>
          {exporting && (
            <span className="ml-1 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('json')}>
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportOptions;
