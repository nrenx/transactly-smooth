
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const isMobile = useIsMobile();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check if theme is saved in localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Check if user has a system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return (savedTheme as 'light' | 'dark') || (prefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save theme to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button 
      variant="ghost"
      size={isMobile ? "icon" : "sm"}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="relative"
    >
      <div className="relative w-5 h-5">
        {/* Sun icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: theme === 'dark' ? 0 : 1, scale: theme === 'dark' ? 0.5 : 1 }}
          animate={{ opacity: theme === 'dark' ? 0 : 1, scale: theme === 'dark' ? 0.5 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Sun className="h-5 w-5" />
        </motion.div>
        
        {/* Moon icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: theme === 'light' ? 0 : 1, scale: theme === 'light' ? 0.5 : 1 }}
          animate={{ opacity: theme === 'light' ? 0 : 1, scale: theme === 'light' ? 0.5 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Moon className="h-5 w-5" />
        </motion.div>
      </div>
      
      {!isMobile && (
        <span className="ml-2">{theme === 'light' ? 'Dark' : 'Light'}</span>
      )}
    </Button>
  );
};

export default ThemeToggle;
