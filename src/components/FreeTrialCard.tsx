
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock } from 'lucide-react';

interface FreeTrialCardProps {
  onStartTrial: () => void;
  isAuthenticated: boolean;
}

const FreeTrialCard = ({ onStartTrial, isAuthenticated }: FreeTrialCardProps) => {
  const trialFeatures = [
    '5 Free Meeting Credits',
    'Basic Meeting Analysis',
    'Email Support',
    '14-Day Access',
    'No Payment Required'
  ];

  return (
    <Card className="relative border-green-500 shadow-lg">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          <Clock className="w-4 h-4" />
          Free Trial
        </span>
      </div>
      
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Free Trial</CardTitle>
        <CardDescription>
          <span className="text-4xl font-bold text-foreground">₹0</span>
          <span className="text-muted-foreground"> / 14 days</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {trialFeatures.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full bg-green-500 hover:bg-green-600"
          onClick={onStartTrial}
        >
          {isAuthenticated ? 'Start Free Trial' : 'Sign In to Start Trial'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FreeTrialCard;
