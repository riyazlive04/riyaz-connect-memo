
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, FileText, CheckCircle2, AlertCircle, Timer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskCard from "./TaskCard";

interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: number;
  transcription?: string;
  mom_content?: string;
  status: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
}

interface Task {
  id: string;
  meeting_id: string;
  employee_id?: string;
  title: string;
  description?: string;
  due_date?: string;
  status: string;
  priority: string;
  meeting_title?: string;
  assignee?: string;
  created_at: string;
  updated_at: string;
}

interface MeetingDetailsProps {
  meeting: Meeting;
  tasks: Task[];
  onTaskStatusChange: (taskId: string, status: string) => void;
  onBack?: () => void;
}

const MeetingDetails = ({ meeting, tasks, onTaskStatusChange, onBack }: MeetingDetailsProps) => {
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/30">
            <Timer className="w-3 h-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-success/15 text-success border-success/30">
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
      default:
        return (
          <Badge variant="secondary" className="bg-success/15 text-success border-success/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
    }
  };

  const getTaskStatusSummary = () => {
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const overdueTasks = tasks.filter(task => task.status === 'overdue').length;
    
    return { pendingTasks, inProgressTasks, overdueTasks, completedTasks };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const transformedTasks = tasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    assignee: task.assignee || 'Unassigned',
    dueDate: task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date',
    status: task.status as "pending" | "in-progress" | "completed" | "overdue",
    priority: task.priority as "low" | "medium" | "high",
    meetingTitle: task.meeting_title || 'Unknown Meeting'
  }));

  const { pendingTasks, inProgressTasks, overdueTasks } = getTaskStatusSummary();

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Button>
        <div className="h-6 w-px bg-border"></div>
        <h1 className="text-2xl font-bold gradient-text">Meeting Details</h1>
      </div>

      {/* Meeting Header Card */}
      <Card className="glass-card border-0 shadow-soft hover:shadow-medium transition-all duration-300">
        <CardHeader className="pb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold mb-3 text-foreground leading-tight">
                {meeting.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center space-x-3 bg-primary/5 rounded-xl px-4 py-2.5 border border-primary/10">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">{formatDate(meeting.date)}</span>
                    <div className="text-xs text-muted-foreground">Meeting Date</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-accent/5 rounded-xl px-4 py-2.5 border border-accent/10">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">{meeting.duration}</span>
                    <div className="text-xs text-muted-foreground">Duration</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-success/5 rounded-xl px-4 py-2.5 border border-success/10">
                  <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">{meeting.participants}</span>
                    <div className="text-xs text-muted-foreground">Participants</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-6">
              {getStatusBadge(meeting.status)}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Tasks Overview with Status Breakdown */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medium">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Tasks Overview</h3>
                  <p className="text-sm text-muted-foreground">
                    {completedTasks}/{totalTasks} tasks completed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold gradient-text">{Math.round(completionRate)}%</div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
            </div>
            
            {/* Status Breakdown Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-success/5 border-success/20 hover:bg-success/10 transition-colors">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success">{completedTasks}</div>
                  <div className="text-xs text-success/80 font-medium">Completed</div>
                </CardContent>
              </Card>
              <Card className="bg-warning/5 border-warning/20 hover:bg-warning/10 transition-colors">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-warning">{inProgressTasks}</div>
                  <div className="text-xs text-warning/80 font-medium">In Progress</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50 border-muted hover:bg-muted/70 transition-colors">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-muted-foreground">{pendingTasks}</div>
                  <div className="text-xs text-muted-foreground font-medium">Pending</div>
                </CardContent>
              </Card>
              <Card className="bg-destructive/5 border-destructive/20 hover:bg-destructive/10 transition-colors">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-destructive">{overdueTasks}</div>
                  <div className="text-xs text-destructive/80 font-medium">Overdue</div>
                </CardContent>
              </Card>
            </div>
            
            {totalTasks > 0 && (
              <div className="relative">
                <div className="w-full bg-muted/30 rounded-full h-4 overflow-hidden shadow-inner">
                  <div 
                    className="bg-gradient-primary h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden shadow-soft" 
                    style={{ width: `${completionRate}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-center">
                  Progress: {Math.round(completionRate)}% of all tasks completed
                </div>
              </div>
            )}
          </div>

          {/* Meeting Summary */}
          {meeting.mom_content && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Meeting Summary
              </h4>
              <Card className="bg-muted/20 border-muted/30">
                <CardContent className="p-6">
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {typeof meeting.mom_content === 'string' 
                      ? meeting.mom_content 
                      : JSON.stringify(meeting.mom_content)
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-foreground">Meeting Tasks</h2>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'}
          </Badge>
        </div>
        
        {transformedTasks.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No tasks for this meeting</h3>
              <p className="text-sm text-muted-foreground">Tasks will appear here when they are created from meeting discussions</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {transformedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={onTaskStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingDetails;
