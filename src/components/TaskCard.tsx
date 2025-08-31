import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, User, CheckCircle2, Clock, AlertTriangle, Play, Check, ArrowRight, Mail } from "lucide-react";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    assignee: string;
    dueDate: string;
    status: "pending" | "in-progress" | "completed" | "overdue";
    priority: "low" | "medium" | "high";
    meetingTitle: string;
  };
  onStatusChange?: (taskId: string, status: string) => void;
  onFollowUp?: (taskId: string, assignee: string) => void;
}

const TaskCard = ({ task, onStatusChange, onFollowUp }: TaskCardProps) => {
  const getStatusBadge = () => {
    switch (task.status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-muted">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="destructive" className="animate-pulse">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Overdue
          </Badge>
        );
    }
  };

  const getPriorityBadge = () => {
    switch (task.priority) {
      case "low":
        return <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 text-xs">Low</Badge>;
      case "medium":
        return <Badge variant="outline" className="border-yellow-200 text-yellow-700 bg-yellow-50 text-xs">Medium</Badge>;
      case "high":
        return <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50 text-xs">High</Badge>;
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case "low": return "border-l-green-400";
      case "medium": return "border-l-yellow-400";
      case "high": return "border-l-red-400";
    }
  };

  return (
    <Card className={`card-hover transition-all duration-300 hover:-translate-y-1 group glass-card border-0 border-l-4 ${getPriorityColor()} shadow-soft hover:shadow-large`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-snug text-base">
            {task.title}
          </h3>
          {getPriorityBadge()}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {task.description}
        </p>
        
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3 bg-muted/30 rounded-lg p-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="font-medium text-sm">{task.assignee}</span>
              <div className="text-xs text-muted-foreground">Assignee</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-muted/30 rounded-lg p-3">
            <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-accent" />
            </div>
            <div>
              <span className="font-medium text-sm">Due: {task.dueDate}</span>
              <div className="text-xs text-muted-foreground">Deadline</div>
            </div>
          </div>
          
          <div className="bg-muted/20 rounded-lg p-3 border-l-2 border-primary/30">
            <div className="text-xs text-muted-foreground mb-1">From meeting:</div>
            <div className="text-sm font-medium line-clamp-1">{task.meetingTitle}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          {task.status !== "completed" && (
            <div className="flex gap-2">
              {task.status === "pending" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 hover:bg-warning hover:text-white hover:border-warning transition-all duration-200 group/btn"
                  onClick={() => onStatusChange?.(task.id, "in-progress")}
                >
                  <Play className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                  Start Task
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              )}
              {task.status === "in-progress" && (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1 btn-primary group/btn shadow-medium hover:shadow-large"
                  onClick={() => onStatusChange?.(task.id, "completed")}
                >
                  <Check className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                  Mark Complete
                </Button>
              )}
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 group/mail"
            onClick={() => onFollowUp?.(task.id, task.assignee)}
          >
            <Mail className="w-4 h-4 mr-2 group-hover/mail:scale-110 transition-transform" />
            Follow Up with {task.assignee}
          </Button>
          
          {task.status === "completed" && (
            <div className="text-center py-2">
              <div className="inline-flex items-center text-success text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Task Completed
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
