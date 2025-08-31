
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Pencil, Trash2, Mail, User } from "lucide-react";
import { toast } from "sonner";

// For now, we'll manage employees locally since the employees table isn't in the current TypeScript types
// This is a temporary solution until the database types are updated
interface Employee {
  id: string
  name: string
  email: string
  role: string
  project_manager_id?: string
  created_at: string
  updated_at: string
}

// Mock employee service - replace with actual Supabase calls once types are updated
const employeeService = {
  async getAll(): Promise<Employee[]> {
    // For now, return mock data
    const mockEmployees: Employee[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Frontend Developer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Product Manager',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockEmployees;
  },

  async create(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
    // Mock implementation - in real app this would call Supabase
    const newEmployee: Employee = {
      ...employee,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return newEmployee;
  },

  async update(id: string, updates: Partial<Employee>): Promise<Employee> {
    // Mock implementation
    const updatedEmployee: Employee = {
      id,
      name: updates.name || '',
      email: updates.email || '',
      role: updates.role || '',
      project_manager_id: updates.project_manager_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return updatedEmployee;
  },

  async delete(id: string): Promise<void> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

const TeamManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: ""
  });

  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "UI/UX Designer", 
    "Product Manager",
    "Project Manager",
    "QA Engineer",
    "DevOps Engineer",
    "Data Analyst",
    "Marketing Specialist"
  ];

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (editingEmployee) {
        await employeeService.update(editingEmployee.id, formData);
        toast.success('Team member updated successfully');
      } else {
        await employeeService.create(formData);
        toast.success('Team member added successfully');
      }
      
      setFormData({ name: "", email: "", role: "" });
      setEditingEmployee(null);
      setIsDialogOpen(false);
      loadEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Failed to save team member');
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) {
      return;
    }

    try {
      await employeeService.delete(id);
      toast.success('Team member removed successfully');
      loadEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to remove team member');
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", role: "" });
    setEditingEmployee(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading team members...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-primary" />
            <span>Team Management</span>
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingEmployee ? 'Edit Team Member' : 'Add New Team Member'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="btn-primary flex-1">
                    {editingEmployee ? 'Update Member' : 'Add Member'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {employees.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No team members yet</h3>
            <p className="text-sm text-muted-foreground">Add your first team member to get started</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{employee.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{employee.role}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(employee.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(employee)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(employee.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamManagement;
