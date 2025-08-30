
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, User, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

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
}

const TaskCard = ({ task, onStatusChange }: TaskCardProps) => {
  const getStatusBadge = () => {
    switch (task.status) {
      case "pending":
        return <Badge variant="secondary" className="bg-muted">Pending</Badge>;
      case "in-progress":
        return <Badge variant="secondary" className="bg-warning/10 text-warning">In Progress</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-success/10 text-success">Completed</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
    }
  };

  const getPriorityBadge = () => {
    switch (task.priority) {
      case "low":
        return <Badge variant="outline" className="border-muted-foreground/30">Low</Badge>;
      case "medium":
        return <Badge variant="outline" className="border-warning text-warning">Medium</Badge>;
      case "high":
        return <Badge variant="outline" className="border-destructive text-destructive">High</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case "pending":
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-warning" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "overdue":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
    }
  };

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold line-clamp-2">{task.title}</h3>
          <div className="flex items-center space-x-1">
            {getStatusIcon()}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3">{task.description}</p>
        
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {getStatusBadge()}
          {getPriorityBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>{task.assignee}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Due: {task.dueDate}</span>
          </div>
          <div className="text-xs">
            From: {task.meetingTitle}
          </div>
        </div>
        
        {task.status !== "completed" && (
          <div className="flex space-x-2">
            {task.status === "pending" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onStatusChange?.(task.id, "in-progress")}
              >
                Start Task
              </Button>
            )}
            {task.status === "in-progress" && (
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1 btn-primary"
                onClick={() => onStatusChange?.(task.id, "completed")}
              >
                Mark Complete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
