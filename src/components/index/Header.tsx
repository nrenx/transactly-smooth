
import ThemeToggle from '@/components/ThemeToggle';
import { ExportFormat } from '@/lib/exportUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

interface HeaderProps {
  onExport: (format: ExportFormat) => Promise<void>;
}

const Header = ({ onExport }: HeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <header className="glass border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-semibold flex items-center">
          <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Transactly
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {!isMobile && (
            <Link to="/new-transaction">
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                New Transaction
              </Button>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
