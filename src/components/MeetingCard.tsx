
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface MeetingCardProps {
  meeting: {
    id: string;
    title: string;
    date: string;
    duration: string;
    participants: number;
    tasksTotal: number;
    tasksCompleted: number;
    status: "processing" | "completed" | "failed";
  };
  onClick?: () => void;
}

const MeetingCard = ({ meeting, onClick }: MeetingCardProps) => {
  const getStatusBadge = () => {
    switch (meeting.status) {
      case "processing":
        return <Badge variant="secondary" className="bg-warning/10 text-warning">Processing</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-success/10 text-success">Completed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (meeting.status) {
      case "processing":
        return <Clock className="w-4 h-4 text-warning animate-spin" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const completionRate = (meeting.tasksCompleted / meeting.tasksTotal) * 100;

  return (
    <Card 
      className="card-hover cursor-pointer transition-all duration-200 hover:border-primary/20"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {meeting.title}
          </CardTitle>
          {getStatusBadge()}
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{meeting.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{meeting.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{meeting.participants} participants</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Tasks: {meeting.tasksCompleted}/{meeting.tasksTotal}
            </span>
          </div>
          {getStatusIcon()}
        </div>
        
        {meeting.tasksTotal > 0 && (
          <div className="w-full bg-muted rounded-full h-2 mb-3">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${completionRate}%` }}
            />
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default MeetingCard;
