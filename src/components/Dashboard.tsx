
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, Clock, CheckCircle2, ArrowLeft, Upload } from "lucide-react";
import MeetingCard from "./MeetingCard";
import TaskCard from "./TaskCard";
import TeamManagement from "./TeamManagement";
import MeetingDetails from "./MeetingDetails";
import MeetingUpload from "./MeetingUpload";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Types based on actual database schema
interface Meeting {
  id: string
  title: string
  date: string
  duration: string
  participants: number
  transcription?: string
  mom_content?: string
  status: string
  file_url?: string
  created_at: string
  updated_at: string
}

interface Task {
  id: string
  meeting_id: string
  employee_id?: string
  title: string
  description?: string
  due_date?: string
  status: string
  priority: string
  meeting_title?: string
  assignee?: string
  created_at: string
  updated_at: string
}

// Database row types (what actually comes from Supabase)
interface MeetingRow {
  meeting_id: string
  created_at: string
  meeting_date: string
  mom: any
  title: string
}

interface TaskRow {
  task_id: string
  created_at: string
  updated_at: string
  status: string
  priority: string
  dependencies: string
  task: string
  owner: string
  meeting_id: string
  due_date: string
}

// Dummy data for when there are no meetings
const dummyMeetings = [
  {
    id: "demo-1",
    title: "Q4 Sprint Planning Meeting",
    date: new Date().toISOString(),
    duration: "45 min",
    participants: 6,
    transcription: "Welcome everyone to our Q4 sprint planning session. Today we'll be discussing our upcoming features and sprint goals...",
    mom_content: JSON.stringify({
      summary: "Discussed Q4 sprint planning, feature prioritization, and team capacity allocation. Decided on 3-week sprint cycles with focus on user experience improvements.",
      keyDecisions: [
        "Implement new dashboard analytics",
        "Upgrade payment processing system", 
        "Add mobile responsive features"
      ],
      attendees: ["Sarah Johnson", "Mike Chen", "Elena Rodriguez", "David Kim", "Lisa Wang", "Alex Thompson"]
    }),
    status: "completed",
    file_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-2", 
    title: "Weekly Team Sync",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: "30 min",
    participants: 4,
    transcription: "Good morning team. Let's start with our weekly sync to discuss progress and blockers...",
    mom_content: JSON.stringify({
      summary: "Weekly team synchronization covering individual progress updates, current blockers, and next week's priorities.",
      keyDecisions: [
        "Move user authentication to higher priority",
        "Schedule code review sessions",
        "Allocate additional resources to testing"
      ],
      attendees: ["Sarah Johnson", "Mike Chen", "Elena Rodriguez", "David Kim"]
    }),
    status: "completed",
    file_url: null,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "demo-3",
    title: "Client Requirements Review",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    duration: "60 min",
    participants: 8,
    transcription: "Thank you all for joining today's client requirements review. We have several important items to cover...",
    mom_content: JSON.stringify({
      summary: "Comprehensive review of client requirements for the upcoming project phase. Clarified scope, timeline, and deliverables.",
      keyDecisions: [
        "Extend project timeline by 2 weeks",
        "Add additional security features",
        "Schedule weekly client check-ins"
      ],
      attendees: ["Sarah Johnson", "Mike Chen", "Elena Rodriguez", "David Kim", "Lisa Wang", "Alex Thompson", "Client Rep A", "Client Rep B"]
    }),
    status: "completed",
    file_url: null,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const dummyTasks = [
  {
    id: "task-1",
    meeting_id: "demo-1",
    employee_id: "emp-1",
    title: "Implement Dashboard Analytics Component",
    description: "Create a comprehensive analytics dashboard with charts, metrics, and real-time data visualization for user engagement tracking.",
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "in-progress",
    priority: "high",
    meeting_title: "Q4 Sprint Planning Meeting",
    assignee: "Sarah Johnson",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "task-2",
    meeting_id: "demo-1",
    employee_id: "emp-2",
    title: "Upgrade Payment Processing System",
    description: "Integrate new payment gateway with enhanced security features, support for multiple currencies, and improved transaction tracking.",
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    priority: "high",
    meeting_title: "Q4 Sprint Planning Meeting",
    assignee: "Mike Chen",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "task-3",
    meeting_id: "demo-1",
    employee_id: "emp-3",
    title: "Mobile Responsive Design Implementation",
    description: "Optimize all components for mobile devices, ensure touch-friendly interfaces, and implement progressive web app features.",
    due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    priority: "medium",
    meeting_title: "Q4 Sprint Planning Meeting",
    assignee: "Elena Rodriguez",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "task-4",
    meeting_id: "demo-2",
    employee_id: "emp-1",
    title: "User Authentication System Review",
    description: "Conduct security audit of current authentication system, implement 2FA, and enhance password policies.",
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "in-progress",
    priority: "high",
    meeting_title: "Weekly Team Sync",
    assignee: "Sarah Johnson",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "task-5",
    meeting_id: "demo-2",
    employee_id: "emp-4",
    title: "Code Review Process Optimization",
    description: "Establish automated code review workflows, create review templates, and schedule regular peer review sessions.",
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    priority: "medium",
    meeting_title: "Weekly Team Sync",
    assignee: "David Kim",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "task-6",
    meeting_id: "demo-3",
    employee_id: "emp-5",
    title: "Enhanced Security Features Implementation",
    description: "Implement advanced security measures including data encryption, audit logging, and compliance reporting features.",
    due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    priority: "high",
    meeting_title: "Client Requirements Review",
    assignee: "Lisa Wang",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "task-7",
    meeting_id: "demo-3",
    employee_id: "emp-6",
    title: "Client Communication Portal Setup",
    description: "Create dedicated client portal for project updates, file sharing, and real-time communication with automated notifications.",
    due_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: "overdue",
    priority: "medium",
    meeting_title: "Client Requirements Review",
    assignee: "Alex Thompson",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Meeting operations
const meetingService = {
  async getAll(): Promise<MeetingRow[]> {
    // For now, get all meetings regardless of user_id to show dummy data
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<MeetingRow> {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('meeting_id', id)
      .single()
    
    if (error) throw error
    return data
  }
}

// Task operations
const taskService = {
  async getAll(): Promise<TaskRow[]> {
    // For now, get all tasks regardless of user association to show dummy data
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('task_id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

const Dashboard = () => {
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDummyData, setShowDummyData] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [meetingsData, tasksData] = await Promise.all([
        meetingService.getAll(),
        taskService.getAll()
      ]);
      
      // Check if we have real data
      const hasRealData = meetingsData.length > 0 || tasksData.length > 0;
      
      if (!hasRealData) {
        // Use dummy data if no real data exists
        setMeetings(dummyMeetings);
        setTasks(dummyTasks);
        setShowDummyData(true);
      } else {
        // Transform real data
        const transformedMeetings: Meeting[] = meetingsData.map(meeting => ({
          id: meeting.meeting_id || '',
          title: meeting.title || '',
          date: meeting.meeting_date || '',
          duration: '30 min',
          participants: meeting.mom?.attendees?.length || 0,
          transcription: undefined,
          mom_content: meeting.mom ? JSON.stringify(meeting.mom) : undefined,
          status: 'completed',
          file_url: undefined,
          created_at: meeting.created_at || '',
          updated_at: meeting.created_at || ''
        }));

        const transformedTasks: Task[] = tasksData.map(task => ({
          id: task.task_id || '',
          meeting_id: task.meeting_id || '',
          employee_id: undefined,
          title: task.task || '',
          description: task.dependencies || '',
          due_date: task.due_date,
          status: task.status?.toLowerCase() || 'pending',
          priority: task.priority?.toLowerCase() || 'medium',
          meeting_title: 'Meeting',
          assignee: task.owner || 'Unassigned',
          created_at: task.created_at || '',
          updated_at: task.updated_at || ''
        }));
        
        setMeetings(transformedMeetings);
        setTasks(transformedTasks);
        setShowDummyData(false);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load dashboard data');
      // Fallback to dummy data on error
      setMeetings(dummyMeetings);
      setTasks(dummyTasks);
      setShowDummyData(true);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from real data
  const stats = {
    totalMeetings: meetings.length,
    activeTasks: tasks.filter(task => task.status === 'in-progress' || task.status === 'pending').length,
    completedTasks: tasks.filter(task => task.status === 'completed').length,
    totalHours: meetings.reduce((acc, meeting) => {
      const hours = parseInt(meeting.duration?.match(/\d+/)?.[0] || '0');
      return acc + hours;
    }, 0)
  };

  // Transform meetings data for MeetingCard component
  const transformedMeetings = meetings.map(meeting => ({
    id: meeting.id,
    title: meeting.title,
    date: new Date(meeting.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }),
    duration: meeting.duration || '30 min',
    participants: meeting.participants || 0,
    tasksTotal: tasks.filter(task => task.meeting_id === meeting.id).length,
    tasksCompleted: tasks.filter(task => task.meeting_id === meeting.id && task.status === 'completed').length,
    status: meeting.status as "processing" | "completed" | "failed"
  }));

  // Transform tasks data for TaskCard component
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

  const handleTaskStatusChange = async (taskId: string, status: string) => {
    try {
      await taskService.updateStatus(taskId, status);
      toast.success(`Task status updated to ${status}`);
      loadData(); // Reload data to reflect changes
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleViewMeetingDetails = (meetingId: string) => {
    setSelectedMeeting(meetingId);
  };

  const handleBackToOverview = () => {
    setSelectedMeeting(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  // If upload view is selected, show meeting upload
  if (showUpload) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setShowUpload(false)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
        </div>
        
        <MeetingUpload />
      </div>
    );
  }

  // If a meeting is selected, show meeting details
  if (selectedMeeting) {
    const meeting = meetings.find(m => m.id === selectedMeeting);
    const meetingTasks = tasks.filter(task => task.meeting_id === selectedMeeting);
    
    if (!meeting) {
      return (
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-muted-foreground">Meeting not found</div>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={handleBackToOverview}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Overview</span>
          </Button>
        </div>
        
        <MeetingDetails 
          meeting={meeting} 
          tasks={meetingTasks}
          onTaskStatusChange={handleTaskStatusChange}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Demo Data Banner */}
      {showDummyData && (
        <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">Demo Mode</h3>
                <p className="text-sm text-muted-foreground">
                  You're viewing sample data. Upload files to Google Drive to start processing real meetings and tasks.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Meeting Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <Button 
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Meeting Audio
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMeetings}</div>
            <p className="text-xs text-muted-foreground">
              {showDummyData ? 'Demo meetings' : 'From database'}
            </p>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTasks}</div>
            <p className="text-xs text-muted-foreground">In progress + pending</p>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meeting Hours</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">Total recorded</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="meetings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="meetings">Recent Meetings ({transformedMeetings.length})</TabsTrigger>
          <TabsTrigger value="tasks">My Tasks ({transformedTasks.length})</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
        </TabsList>

        <TabsContent value="meetings" className="space-y-4">
          {transformedMeetings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">No meetings yet</h3>
                <p className="text-sm text-muted-foreground">Upload files to Google Drive to start processing meetings</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onClick={() => handleViewMeetingDetails(meeting.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          {transformedTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">No tasks yet</h3>
                <p className="text-sm text-muted-foreground">Tasks will appear here when meetings are processed</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleTaskStatusChange}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <TeamManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
