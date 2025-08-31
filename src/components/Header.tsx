
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Menu, CreditCard } from 'lucide-react';
import TrialStatus from '@/components/TrialStatus';

const Header = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch user credits
  const { data: userCredits } = useQuery({
    queryKey: ['user-credits', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('user_credits')
        .select('credits, is_trial_user, trial_end_date, trial_credits_used')
        .eq('user_id', user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing';
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
                {userCredits && userCredits.is_trial_user && userCredits.trial_end_date ? (
                  <TrialStatus 
                    trialEndDate={userCredits.trial_end_date}
                    credits={userCredits.credits}
                    trialCreditsUsed={userCredits.trial_credits_used}
                    onUpgrade={handleUpgrade}
                  />
                ) : userCredits && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <CreditCard className="w-4 h-4" />
                    <span>{userCredits.credits} Credits</span>
                  </Badge>
                )}
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
                {userCredits && userCredits.is_trial_user && userCredits.trial_end_date ? (
                  <div className="mb-2">
                    <TrialStatus 
                      trialEndDate={userCredits.trial_end_date}
                      credits={userCredits.credits}
                      trialCreditsUsed={userCredits.trial_credits_used}
                      onUpgrade={handleUpgrade}
                    />
                  </div>
                ) : userCredits && (
                  <Badge variant="secondary" className="flex items-center space-x-1 w-fit mb-2">
                    <CreditCard className="w-4 h-4" />
                    <span>{userCredits.credits} Credits</span>
                  </Badge>
                )}
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
