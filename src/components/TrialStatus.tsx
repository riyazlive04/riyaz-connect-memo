
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrialStatusProps {
  trialEndDate: string;
  credits: number;
  trialCreditsUsed: number;
  onUpgrade?: () => void;
}

const TrialStatus = ({ trialEndDate, credits, trialCreditsUsed, onUpgrade }: TrialStatusProps) => {
  const endDate = new Date(trialEndDate);
  const now = new Date();
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = daysRemaining <= 0;

  return (
    <div className="flex items-center space-x-2">
      <Badge 
        variant={isExpired ? "destructive" : daysRemaining <= 3 ? "secondary" : "outline"}
        className="flex items-center space-x-1"
      >
        <Clock className="w-4 h-4" />
        <span>
          {isExpired ? 'Trial Expired' : `${daysRemaining} days left`}
        </span>
      </Badge>
      
      <Badge variant="secondary" className="flex items-center space-x-1">
        <CreditCard className="w-4 h-4" />
        <span>{credits} Credits</span>
      </Badge>

      {(daysRemaining <= 3 || credits <= 2) && onUpgrade && (
        <Button size="sm" variant="default" onClick={onUpgrade}>
          Upgrade
        </Button>
      )}
    </div>
  );
};

export default TrialStatus;
</TrialStatus>
