
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PricingPlans = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const plans = [
    {
      name: 'Starter',
      price: '₹99',
      credits: 10,
      features: [
        '10 Meeting Credits',
        'Basic Meeting Analysis',
        'Email Support',
        'Standard Processing'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '₹299',
      credits: 35,
      features: [
        '35 Meeting Credits',
        'Advanced Meeting Analysis',
        'Priority Support',
        'Fast Processing',
        'Team Collaboration'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '₹599',
      credits: 80,
      features: [
        '80 Meeting Credits',
        'Premium Meeting Analysis',
        '24/7 Support',
        'Instant Processing',
        'Advanced Team Features',
        'Custom Integrations'
      ],
      popular: false
    }
  ];

  const handlePayment = async (planName: string, amount: number, credits: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase a plan.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create order via Supabase edge function
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: amount * 100, // Convert to paise
          credits: credits,
          planName: planName
        }
      });

      if (error) throw error;

      // Initialize Razorpay
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: 'INR',
        name: 'Meeting Manager',
        description: `${planName} Plan - ${credits} Credits`,
        order_id: data.order_id,
        handler: async function (response: any) {
          // Verify payment
          const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              credits: credits,
              planName: planName
            }
          });

          if (verifyError) {
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if amount was deducted.",
              variant: "destructive"
            });
            return;
          }

          toast({
            title: "Payment Successful!",
            description: `${credits} credits added to your account.`,
          });
        },
        prefill: {
          email: user.email,
          name: user.user_metadata?.full_name || ''
        },
        theme: {
          color: '#3B82F6'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your Plan</h2>
          <p className="text-xl text-muted-foreground">Get credits to process your meetings with AI-powered analysis</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground"> / {plan.credits} credits</span>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button 
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handlePayment(plan.name, parseInt(plan.price.replace('₹', '')), plan.credits)}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Secure payments powered by Razorpay • All plans include GST • Instant credit activation
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
