
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, BarChart3, Users, Clock, CheckCircle2 } from "lucide-react";
import MeetingCard from "./MeetingCard";
import TaskCard from "./TaskCard";
import TeamManagement from "./TeamManagement";
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
  meeting_id: number
  created_at: string
  meeting_date: string
  mom: any
  title: string
}

interface TaskRow {
  task_id: number
  created_at: string
  updated_at: string
  status: string
  priority: string
  dependencies: string
  task: string
  owner: string
  meeting_id: number
  due_date: string
}

// Meeting operations
const meetingService = {
  async getAll(): Promise<MeetingRow[]> {
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
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

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
      
      // Transform meetings data to match interface
      const transformedMeetings: Meeting[] = meetingsData.map(meeting => ({
        id: meeting.meeting_id?.toString() || '',
        title: meeting.title || '',
        date: meeting.meeting_date || '',
        duration: '30 min', // default since not in DB
        participants: 0, // default since not in DB
        transcription: undefined, // not in current DB
        mom_content: meeting.mom ? JSON.stringify(meeting.mom) : undefined,
        status: 'completed', // default status
        file_url: undefined, // not in current DB
        created_at: meeting.created_at || '',
        updated_at: meeting.created_at || '' // use created_at as fallback
      }));

      // Transform tasks data to match interface
      const transformedTasks: Task[] = tasksData.map(task => ({
        id: task.task_id?.toString() || '',
        meeting_id: task.meeting_id?.toString() || '',
        employee_id: undefined, // not in current DB
        title: task.task || '',
        description: task.dependencies || '', // use dependencies as description for now
        due_date: task.due_date,
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        meeting_title: 'Meeting', // default since not joined
        assignee: task.owner || 'Unassigned',
        created_at: task.created_at || '',
        updated_at: task.updated_at || ''
      }));
      
      setMeetings(transformedMeetings);
      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load dashboard data');
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

  const handleUploadMeeting = () => {
    toast.info("Upload feature is now connected to n8n backend. Files uploaded to Google Drive will be processed automatically.");
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
            <p className="text-xs text-muted-foreground">From database</p>
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
              <span>Connected to n8n</span>
            </Button>
            <p className="text-sm text-muted-foreground">
              Files uploaded to Google Drive are automatically processed by n8n workflow
            </p>
          </div>
        </CardContent>
      </Card>

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
                  onClick={() => setSelectedMeeting(meeting.id)}
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
