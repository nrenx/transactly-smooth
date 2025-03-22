
import ThemeToggle from '@/components/ThemeToggle';

interface HeaderProps {
  onExport: () => void;
}

const Header = ({ onExport }: HeaderProps) => {
  return (
    <header className="glass border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Transactly</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={onExport}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Export Data
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
