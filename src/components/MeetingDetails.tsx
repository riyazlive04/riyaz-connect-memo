
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, FileText, CheckCircle2, AlertCircle, Timer } from "lucide-react";
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
}

const MeetingDetails = ({ meeting, tasks, onTaskStatusChange }: MeetingDetailsProps) => {
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
            <Timer className="w-3 h-3 mr-1" />
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
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
    }
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

  return (
    <div className="space-y-6">
      {/* Meeting Header */}
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div>
              <CardTitle className="text-2xl font-bold mb-2">{meeting.title}</CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{formatDate(meeting.date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{meeting.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{meeting.participants} participants</span>
                </div>
              </div>
            </div>
            {getStatusBadge(meeting.status)}
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Tasks Overview */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Tasks Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    {completedTasks}/{totalTasks} tasks completed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{Math.round(completionRate)}%</div>
              </div>
            </div>
            
            {totalTasks > 0 && (
              <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-primary h-full rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            )}
          </div>

          {/* Meeting Summary */}
          {meeting.mom_content && (
            <div className="mt-6">
              <h4 className="text-md font-semibold mb-3">Meeting Summary</h4>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  {typeof meeting.mom_content === 'string' 
                    ? meeting.mom_content 
                    : JSON.stringify(meeting.mom_content)
                  }
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Meeting Tasks ({totalTasks})</h2>
        {transformedTasks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">No tasks for this meeting</h3>
              <p className="text-sm text-muted-foreground">Tasks will appear here when they are created</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
