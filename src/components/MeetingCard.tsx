
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, FileText, CheckCircle2, AlertCircle, PlayCircle, Eye } from "lucide-react";

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
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20 animate-pulse">
            <Clock className="w-3 h-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="animate-pulse">
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
    }
  };

  const completionRate = meeting.tasksTotal > 0 ? (meeting.tasksCompleted / meeting.tasksTotal) * 100 : 0;

  return (
    <Card 
      className="card-hover cursor-pointer transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 group glass-card border-0 shadow-soft hover:shadow-large"
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {meeting.title}
          </CardTitle>
          {getStatusBadge()}
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2 bg-muted/30 rounded-lg px-3 py-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="font-medium">{meeting.date}</span>
          </div>
          <div className="flex items-center space-x-2 bg-muted/30 rounded-lg px-3 py-1.5">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-medium">{meeting.duration}</span>
          </div>
          <div className="flex items-center space-x-2 bg-muted/30 rounded-lg px-3 py-1.5">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-medium">{meeting.participants}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">
                Tasks Progress
              </span>
              <div className="text-xs text-muted-foreground">
                {meeting.tasksCompleted}/{meeting.tasksTotal} completed
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">{Math.round(completionRate)}%</div>
          </div>
        </div>
        
        {meeting.tasksTotal > 0 && (
          <div className="mb-6">
            <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-primary h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden" 
                style={{ width: `${completionRate}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 hover:bg-primary hover:text-primary-foreground transition-all duration-200 group/btn border-primary/20"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            View Details
          </Button>
          
          {meeting.status === "completed" && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-3 hover:bg-accent hover:text-accent-foreground"
              onClick={(e) => {
                e.stopPropagation();
                // Handle replay action
              }}
            >
              <PlayCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingCard;
