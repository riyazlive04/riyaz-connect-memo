
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, BarChart3, Users, Clock, CheckCircle2 } from "lucide-react";
import MeetingCard from "./MeetingCard";
import TaskCard from "./TaskCard";
import { toast } from "sonner";

const Dashboard = () => {
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);

  // Mock data - in real app, this would come from Supabase
  const stats = {
    totalMeetings: 24,
    activeTasks: 18,
    completedTasks: 42,
    totalHours: 156
  };

  const meetings = [
    {
      id: "1",
      title: "Weekly Team Standup - Engineering",
      date: "Dec 15, 2024",
      duration: "45 min",
      participants: 8,
      tasksTotal: 5,
      tasksCompleted: 3,
      status: "completed" as const
    },
    {
      id: "2", 
      title: "Product Review & Planning Session",
      date: "Dec 14, 2024",
      duration: "1h 30min",
      participants: 6,
      tasksTotal: 8,
      tasksCompleted: 2,
      status: "processing" as const
    },
    {
      id: "3",
      title: "Client Onboarding Meeting",
      date: "Dec 13, 2024", 
      duration: "1h",
      participants: 4,
      tasksTotal: 6,
      tasksCompleted: 6,
      status: "completed" as const
    }
  ];

  const tasks = [
    {
      id: "1",
      title: "Update user authentication flow",
      description: "Implement new OAuth integration for MS Teams and Gmail login",
      assignee: "Sarah Johnson",
      dueDate: "Dec 20, 2024",
      status: "in-progress" as const,
      priority: "high" as const,
      meetingTitle: "Weekly Team Standup - Engineering"
    },
    {
      id: "2",
      title: "Create meeting dashboard mockups",
      description: "Design wireframes for the new dashboard layout with task tracking",
      assignee: "Mike Chen",
      dueDate: "Dec 18, 2024",
      status: "pending" as const,
      priority: "medium" as const,
      meetingTitle: "Product Review & Planning Session"
    },
    {
      id: "3",
      title: "Set up RazorPay integration",
      description: "Configure payment gateway for subscription management",
      assignee: "Alex Kumar",
      dueDate: "Dec 16, 2024",
      status: "overdue" as const,
      priority: "high" as const,
      meetingTitle: "Product Review & Planning Session"
    }
  ];

  const handleTaskStatusChange = (taskId: string, status: string) => {
    toast.success(`Task status updated to ${status}`);
    // In real app, update Supabase here
  };

  const handleUploadMeeting = () => {
    toast.info("Upload feature will be available once backend is connected");
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMeetings}</div>
            <p className="text-xs text-muted-foreground">+4 from last month</p>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTasks}</div>
            <p className="text-xs text-muted-foreground">-2 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meeting Hours</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Upload New Meeting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button 
              className="btn-primary flex items-center space-x-2"
              onClick={handleUploadMeeting}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Recording</span>
            </Button>
            <p className="text-sm text-muted-foreground">
              Supports audio/video files from Teams, Gmail, or direct upload
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="meetings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="meetings">Recent Meetings</TabsTrigger>
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="meetings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onClick={() => setSelectedMeeting(meeting.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleTaskStatusChange}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
