import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu } from 'lucide-react';

const Header = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-primary">Meeting Manager</h1>
            
            {user && (
              <nav className="hidden md:flex space-x-6">
                <a href="/" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </a>
                <a href="/pricing" className="text-foreground hover:text-primary transition-colors">
                  Pricing
                </a>
              </nav>
            )}
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  size="sm"
                >
                  Sign Out
                </Button>
              </div>

              <Button
                className="md:hidden"
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && user && (
          <div className="md:hidden mt-4 pt-4 border-t border-border">
            <nav className="flex flex-col space-y-2">
              <a href="/" className="text-foreground hover:text-primary transition-colors py-2">
                Dashboard
              </a>
              <a href="/pricing" className="text-foreground hover:text-primary transition-colors py-2">
                Pricing
              </a>
              <div className="pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground block mb-2">
                  {user.email}
                </span>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  Sign Out
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
