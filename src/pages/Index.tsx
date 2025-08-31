
import PricingPlans from "@/components/PricingPlans";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import HomePage from "@/components/HomePage";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Index = () => {
  const { user, loading } = useAuth();
  const [showPricing, setShowPricing] = useState(false);

  console.log("Index component - user:", user, "loading:", loading);

  // Check user credits if authenticated
  const { data: userCredits, isLoading: creditsLoading, error: creditsError } = useQuery({
    queryKey: ['user-credits', user?.id],
    queryFn: async () => {
      if (!user) return null;
      console.log("Fetching credits for user:", user.id);
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits, is_trial_user, trial_end_date')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Credits fetch error:", error);
        // Return default credits if table doesn't exist or user not found
        return { credits: 100, is_trial_user: true, trial_end_date: null };
      }
      
      console.log("User credits data:", data);
      return data || { credits: 100, is_trial_user: true, trial_end_date: null };
    },
    enabled: !!user,
  });

  console.log("Credits loading:", creditsLoading, "Credits data:", userCredits, "Credits error:", creditsError);

  if (loading) {
    console.log("Auth loading...");
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-lg">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated, show home page or pricing
  if (!user) {
    console.log("No user, showing homepage or pricing. showPricing:", showPricing);
    if (showPricing) {
      return (
        <div className="min-h-screen bg-background">
          <PricingPlans />
        </div>
      );
    }
    
    return <HomePage onGetStarted={() => setShowPricing(true)} />;
  }

  // If still loading credits, show loading state
  if (creditsLoading) {
    console.log("Credits loading...");
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-lg">Loading dashboard...</div>
      </div>
    );
  }

  // Check if user has credits or if trial has expired
  const hasCredits = userCredits && userCredits.credits > 0;
  const isTrialExpired = userCredits?.is_trial_user && userCredits?.trial_end_date && 
    new Date(userCredits.trial_end_date) < new Date();

  console.log("Has credits:", hasCredits, "Is trial expired:", isTrialExpired);

  // If user has no credits or trial expired, show pricing
  if (!hasCredits || isTrialExpired) {
    console.log("No credits or trial expired, showing pricing");
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {isTrialExpired ? 'Trial Expired' : 'No Credits Available'}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isTrialExpired 
              ? 'Your free trial has ended. Please purchase credits to continue using Meeting Manager.'
              : 'Please purchase credits to access the dashboard.'
            }
          </p>
          <PricingPlans />
        </div>
      </div>
    );
  }

  // User is authenticated and has credits, show dashboard
  console.log("Showing dashboard");
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Dashboard />
    </div>
  );
};

export default Index;
