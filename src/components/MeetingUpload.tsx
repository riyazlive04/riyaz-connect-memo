
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, FileAudio, Loader2, CheckCircle2, Mail } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  assignee: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
}

interface MeetingResult {
  title: string;
  date: string;
  participants: string[];
  summary: string;
  keyDecisions: string[];
  tasks: Task[];
}

const MeetingUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [meetingResult, setMeetingResult] = useState<MeetingResult | null>(null);
  const [emailsSent, setEmailsSent] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's an audio file
      if (!file.type.startsWith('audio/')) {
        toast.error('Please select an audio file');
        return;
      }
      setUploadedFile(file);
      setMeetingResult(null);
      setEmailsSent(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock meeting result
      const result: MeetingResult = {
        title: "Weekly Sprint Planning Meeting",
        date: new Date().toLocaleDateString(),
        participants: ["Sarah Johnson", "Mike Chen", "Elena Rodriguez", "David Kim", "Lisa Wang"],
        summary: "Discussed Q4 sprint goals, reviewed current progress, and allocated tasks for the upcoming sprint. Team capacity was evaluated and priorities were set for the next two weeks.",
        keyDecisions: [
          "Implement new dashboard analytics feature",
          "Prioritize mobile responsiveness improvements", 
          "Schedule code review sessions twice weekly",
          "Allocate additional QA resources for testing"
        ],
        tasks: [
          {
            id: "1",
            title: "Implement Dashboard Analytics Component",
            assignee: "Sarah Johnson",
            status: "pending",
            priority: "high",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
          },
          {
            id: "2", 
            title: "Mobile Responsive Design Updates",
            assignee: "Mike Chen",
            status: "pending",
            priority: "high",
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString()
          },
          {
            id: "3",
            title: "Setup Code Review Process",
            assignee: "Elena Rodriguez", 
            status: "pending",
            priority: "medium",
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
          },
          {
            id: "4",
            title: "QA Testing Framework Enhancement",
            assignee: "David Kim",
            status: "pending", 
            priority: "medium",
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()
          },
          {
            id: "5",
            title: "API Documentation Updates",
            assignee: "Lisa Wang",
            status: "pending",
            priority: "low", 
            dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString()
          }
        ]
      };
      
      setMeetingResult(result);
      toast.success('Meeting processed successfully!');
      
      // Simulate sending emails
      setTimeout(() => {
        setEmailsSent(true);
        toast.success('Task assignment emails sent to all team members!');
      }, 1500);
      
    } catch (error) {
      toast.error('Failed to process meeting file');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "in-progress":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Meeting Audio File
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="audio-file">Select Audio File</Label>
            <div className="flex items-center gap-4">
              <Input
                id="audio-file"
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="flex-1"
              />
              {uploadedFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileAudio className="h-4 w-4" />
                  {uploadedFile.name}
                </div>
              )}
            </div>
          </div>
          
          <Button 
            onClick={handleUpload} 
            disabled={!uploadedFile || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Meeting Audio...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload and Process
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {meetingResult && (
        <>
          {/* Meeting Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{meetingResult.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Date: {meetingResult.date} • Participants: {meetingResult.participants.length}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Meeting Summary</h4>
                <p className="text-sm text-muted-foreground">{meetingResult.summary}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Key Decisions</h4>
                <ul className="list-disc list-inside space-y-1">
                  {meetingResult.keyDecisions.map((decision, index) => (
                    <li key={index} className="text-sm text-muted-foreground">{decision}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Participants</h4>
                <div className="flex flex-wrap gap-2">
                  {meetingResult.participants.map((participant, index) => (
                    <Badge key={index} variant="outline">{participant}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Generated Tasks ({meetingResult.tasks.length})
                {emailsSent && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Mail className="h-4 w-4" />
                    <CheckCircle2 className="h-4 w-4" />
                    Emails sent to assignees
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meetingResult.tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.assignee}</TableCell>
                      <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default MeetingUpload;
