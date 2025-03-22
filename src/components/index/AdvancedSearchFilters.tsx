
import { useState } from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { Check, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export type FilterOption = {
  value: string;
  label: string;
};

export type FilterCriteria = {
  status?: string[];
  goodsName?: string[];
  amountRange?: {
    min: number | null;
    max: number | null;
  };
  dateRange?: {
    start: string | null;
    end: string | null;
  };
};

const statusOptions: FilterOption[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

interface AdvancedSearchFiltersProps {
  onFilterChange: (filters: FilterCriteria) => void;
  goodsOptions: FilterOption[];
}

const AdvancedSearchFilters = ({ 
  onFilterChange,
  goodsOptions
}: AdvancedSearchFiltersProps) => {
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<FilterCriteria>({
    status: [],
    goodsName: [],
    amountRange: { min: null, max: null },
    dateRange: { start: null, end: null }
  });
  
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const handleStatusToggle = (value: string) => {
    setFilters(prev => {
      const newStatus = prev.status?.includes(value)
        ? prev.status.filter(item => item !== value)
        : [...(prev.status || []), value];
      
      const newFilters = { ...prev, status: newStatus };
      onFilterChange(newFilters);
      return newFilters;
    });
  };
  
  const handleGoodsToggle = (value: string) => {
    setFilters(prev => {
      const newGoods = prev.goodsName?.includes(value)
        ? prev.goodsName.filter(item => item !== value)
        : [...(prev.goodsName || []), value];
      
      const newFilters = { ...prev, goodsName: newGoods };
      onFilterChange(newFilters);
      return newFilters;
    });
  };
  
  const handleAmountChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : Number(value);
    
    setFilters(prev => {
      const newAmountRange = { 
        ...prev.amountRange,
        [field]: numValue 
      };
      
      const newFilters = { ...prev, amountRange: newAmountRange };
      onFilterChange(newFilters);
      return newFilters;
    });
  };
  
  const handleDateChange = (field: 'start' | 'end', value: string) => {
    setFilters(prev => {
      const newDateRange = { 
        ...prev.dateRange,
        [field]: value || null 
      };
      
      const newFilters = { ...prev, dateRange: newDateRange };
      onFilterChange(newFilters);
      return newFilters;
    });
  };
  
  const clearAllFilters = () => {
    const emptyFilters = {
      status: [],
      goodsName: [],
      amountRange: { min: null, max: null },
      dateRange: { start: null, end: null }
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
    if (isMobile) setPopoverOpen(false);
  };
  
  // Count active filters
  const activeFiltersCount = [
    (filters.status?.length || 0), 
    (filters.goodsName?.length || 0),
    ((filters.amountRange?.min !== null || filters.amountRange?.max !== null) ? 1 : 0),
    ((filters.dateRange?.start !== null || filters.dateRange?.end !== null) ? 1 : 0)
  ].reduce((sum, count) => sum + count, 0);
  
  return (
    <div className="relative">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 border-dashed flex items-center gap-1"
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge 
                variant="secondary" 
                className="rounded-full h-5 min-w-5 px-1 flex items-center justify-center text-xs font-normal"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search filters..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              
              <CommandGroup heading="Status">
                {statusOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleStatusToggle(option.value)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        filters.status?.includes(option.value)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              
              <CommandSeparator />
              
              <CommandGroup heading="Goods Type">
                <div className="max-h-[200px] overflow-auto">
                  {goodsOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleGoodsToggle(option.value)}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          filters.goodsName?.includes(option.value)
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{option.label}</span>
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
              
              <CommandSeparator />
              
              <CommandGroup heading="Amount Range">
                <div className="flex gap-2 p-2">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs text-muted-foreground">Min</label>
                    <input
                      type="number"
                      className="h-8 rounded-md border border-input px-3 py-1 text-sm"
                      value={filters.amountRange?.min !== null ? filters.amountRange.min : ''}
                      onChange={(e) => handleAmountChange('min', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs text-muted-foreground">Max</label>
                    <input
                      type="number"
                      className="h-8 rounded-md border border-input px-3 py-1 text-sm"
                      value={filters.amountRange?.max !== null ? filters.amountRange.max : ''}
                      onChange={(e) => handleAmountChange('max', e.target.value)}
                      placeholder="∞"
                    />
                  </div>
                </div>
              </CommandGroup>
              
              <CommandSeparator />
              
              <CommandGroup heading="Date Range">
                <div className="flex gap-2 p-2">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs text-muted-foreground">From</label>
                    <input
                      type="date"
                      className="h-8 rounded-md border border-input px-3 py-1 text-sm"
                      value={filters.dateRange?.start || ''}
                      onChange={(e) => handleDateChange('start', e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs text-muted-foreground">To</label>
                    <input
                      type="date"
                      className="h-8 rounded-md border border-input px-3 py-1 text-sm"
                      value={filters.dateRange?.end || ''}
                      onChange={(e) => handleDateChange('end', e.target.value)}
                    />
                  </div>
                </div>
              </CommandGroup>
            </CommandList>
            
            <div className="flex items-center justify-between border-t p-2">
              <p className="text-sm text-muted-foreground">
                {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
              </p>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Reset
                <X className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
      
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {filters.status?.map(status => (
            <Badge 
              key={`status-${status}`} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {statusOptions.find(opt => opt.value === status)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleStatusToggle(status)}
              />
            </Badge>
          ))}
          
          {filters.goodsName?.map(good => (
            <Badge 
              key={`good-${good}`} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {goodsOptions.find(opt => opt.value === good)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleGoodsToggle(good)}
              />
            </Badge>
          ))}
          
          {(filters.amountRange?.min !== null || filters.amountRange?.max !== null) && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1"
            >
              Amount: 
              {filters.amountRange?.min !== null ? ` ₹${filters.amountRange.min}` : ' ₹0'} 
              {' - '} 
              {filters.amountRange?.max !== null ? ` ₹${filters.amountRange.max}` : ' ∞'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  setFilters(prev => {
                    const newFilters = {
                      ...prev,
                      amountRange: { min: null, max: null }
                    };
                    onFilterChange(newFilters);
                    return newFilters;
                  });
                }}
              />
            </Badge>
          )}
          
          {(filters.dateRange?.start !== null || filters.dateRange?.end !== null) && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1"
            >
              Date: 
              {filters.dateRange?.start ? ` ${new Date(filters.dateRange.start).toLocaleDateString()}` : ' Any'} 
              {' - '} 
              {filters.dateRange?.end ? ` ${new Date(filters.dateRange.end).toLocaleDateString()}` : ' Any'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  setFilters(prev => {
                    const newFilters = {
                      ...prev,
                      dateRange: { start: null, end: null }
                    };
                    onFilterChange(newFilters);
                    return newFilters;
                  });
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchFilters;
