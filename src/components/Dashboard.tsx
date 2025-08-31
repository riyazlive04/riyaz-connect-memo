
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ChevronDown, Plus, User, Upload } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MeetingUpload from "./MeetingUpload";
import MeetingDetails from "./MeetingDetails";

interface Task {
  id: string;
  title: string;
  assignee: string;
  status: string;
  priority: string;
  due_date: string;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: number;
  status: string;
  mom_content: string;
  tasks: Task[];
}

const Dashboard = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    duration: "",
    participants: 0,
    mom_content: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    // In a real application, you would fetch meetings from an API
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Meeting Scheduled!",
      description: "Your meeting has been scheduled successfully.",
    });
    setIsDialogOpen(false);
  };

  const handleMeetingClick = (meeting: Meeting) => {
    console.log("Meeting clicked:", meeting);
    setSelectedMeeting(meeting);
  };

  const handleBackToOverview = () => {
    setSelectedMeeting(null);
  };

  const handleTaskStatusChange = (taskId: string, status: string) => {
    // Update task status in the selected meeting
    if (selectedMeeting) {
      const updatedTasks = selectedMeeting.tasks.map(task => 
        task.id === taskId ? { ...task, status } : task
      );
      setSelectedMeeting({ ...selectedMeeting, tasks: updatedTasks });
    }
    toast({
      title: "Task Updated",
      description: "Task status has been updated successfully.",
    });
  };

  // Dummy data for demonstration
  const dummyMeetings = [
    {
      id: '1',
      title: 'Weekly Sprint Planning',
      date: '2024-01-15',
      duration: '45 min',
      participants: 5,
      status: 'completed',
      mom_content: 'Discussed upcoming sprint goals, reviewed backlog items, and assigned tasks for the week. Key decisions: Migration to new framework approved, testing phase extended by 2 days.',
      tasks: [
        {
          id: 't1',
          title: 'Implement user authentication system',
          assignee: 'Nandhu',
          status: 'in-progress',
          priority: 'high',
          due_date: '2024-01-20'
        },
        {
          id: 't2',
          title: 'Design payment gateway integration',
          assignee: 'Riyaz',
          status: 'pending',
          priority: 'medium',
          due_date: '2024-01-22'
        },
        {
          id: 't3',
          title: 'Create responsive mobile layouts',
          assignee: 'Priya',
          status: 'completed',
          priority: 'high',
          due_date: '2024-01-18'
        }
      ]
    },
    {
      id: '2',
      title: 'Client Requirements Review',
      date: '2024-01-12',
      duration: '60 min',
      participants: 4,
      status: 'completed',  
      mom_content: 'Reviewed client feedback on initial mockups. Client requested changes to color scheme and navigation flow. Timeline adjusted to accommodate additional revisions.',
      tasks: [
        {
          id: 't4',
          title: 'Update UI color scheme based on client feedback',
          assignee: 'Sanjay',
          status: 'in-progress',
          priority: 'high',
          due_date: '2024-01-19'
        },
        {
          id: 't5',
          title: 'Revise navigation flow mockups',
          assignee: 'Haja',
          status: 'pending',
          priority: 'medium',
          due_date: '2024-01-21'
        }
      ]
    },
    {
      id: '3',
      title: 'Technical Architecture Discussion',
      date: '2024-01-10',
      duration: '90 min',
      participants: 6,
      status: 'completed',
      mom_content: 'Deep dive into system architecture decisions. Discussed database schema, API design patterns, and deployment strategy. Decided on microservices approach.',
      tasks: [
        {
          id: 't6',
          title: 'Design database schema for user management',
          assignee: 'Nandhu',
          status: 'completed',
          priority: 'high',
          due_date: '2024-01-14'
        },
        {
          id: 't7',
          title: 'Setup CI/CD pipeline',
          assignee: 'Riyaz',
          status: 'in-progress',
          priority: 'medium',
          due_date: '2024-01-25'
        },
        {
          id: 't8',
          title: 'Create API documentation template',
          assignee: 'Priya',
          status: 'pending',
          priority: 'low',
          due_date: '2024-01-28'
        }
      ]
    }
  ];

  // Transform tasks for MeetingDetails component
  const transformTasksForMeetingDetails = (tasks: Task[]) => {
    return tasks.map(task => ({
      id: task.id,
      meeting_id: selectedMeeting?.id || '',
      employee_id: undefined,
      title: task.title,
      description: `Task assigned from meeting: ${selectedMeeting?.title}`,
      due_date: task.due_date,
      status: task.status,
      priority: task.priority,
      meeting_title: selectedMeeting?.title,
      assignee: task.assignee,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  };

  // Transform meeting for MeetingDetails component
  const transformMeetingForDetails = (meeting: Meeting) => {
    return {
      id: meeting.id,
      title: meeting.title,
      date: meeting.date,
      duration: meeting.duration,
      participants: meeting.participants,
      transcription: undefined,
      mom_content: meeting.mom_content,
      status: meeting.status,
      file_url: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  };

  // If a meeting is selected, show the details view
  if (selectedMeeting) {
    return (
      <div className="container mx-auto py-10">
        <MeetingDetails
          meeting={transformMeetingForDetails(selectedMeeting)}
          tasks={transformTasksForMeetingDetails(selectedMeeting.tasks)}
          onTaskStatusChange={handleTaskStatusChange}
          onBack={handleBackToOverview}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="meetings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="meetings">Meetings Dashboard</TabsTrigger>
          <TabsTrigger value="upload">Upload Meeting Audio</TabsTrigger>
        </TabsList>

        <TabsContent value="meetings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calendar Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Meetings</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-center">
                      <Plus className="mr-2 h-4 w-4" />
                      Schedule Meeting
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Schedule a Meeting</DialogTitle>
                      <DialogDescription>
                        Create a new meeting and set its details.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
                        </Label>
                        <Input
                          type="text"
                          id="title"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Date
                        </Label>
                        <Input
                          type="date"
                          id="date"
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="duration" className="text-right">
                          Duration
                        </Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30 min">30 min</SelectItem>
                            <SelectItem value="45 min">45 min</SelectItem>
                            <SelectItem value="60 min">60 min</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="participants" className="text-right">
                          Participants
                        </Label>
                        <Input
                          type="number"
                          id="participants"
                          value={formData.participants}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              participants: parseInt(e.target.value),
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mom_content" className="text-right">
                          Minutes of Meeting
                        </Label>
                        <Input
                          type="text"
                          id="mom_content"
                          value={formData.mom_content}
                          onChange={(e) =>
                            setFormData({ ...formData, mom_content: e.target.value })
                          }
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <Button type="submit" onClick={handleSubmit}>Schedule</Button>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Meetings List Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Recent Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dummyMeetings.map((meeting) => (
                      <TableRow 
                        key={meeting.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          console.log("Row clicked:", meeting.title);
                          handleMeetingClick(meeting);
                        }}
                      >
                        <TableCell className="font-medium hover:text-primary transition-colors">
                          {meeting.title}
                        </TableCell>
                        <TableCell>{meeting.date}</TableCell>
                        <TableCell>{meeting.duration}</TableCell>
                        <TableCell>{meeting.participants}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{meeting.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <MeetingUpload />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
