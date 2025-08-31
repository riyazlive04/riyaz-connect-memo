
import PricingPlans from "@/components/PricingPlans";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, loading } = useAuth();

  // Check user credits if authenticated
  const { data: userCredits } = useQuery({
    queryKey: ['user-credits', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-lg">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated, show pricing plans
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <PricingPlans />
      </div>
    );
  }

  // If user is authenticated but has no credits, redirect to pricing
  if (userCredits && userCredits.credits <= 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">No Credits Available</h2>
          <p className="text-muted-foreground mb-8">Please purchase credits to access the dashboard.</p>
          <PricingPlans />
        </div>
      </div>
    );
  }

  // User is authenticated and has credits, show dashboard
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Dashboard />
    </div>
  );
};

export default Index;
