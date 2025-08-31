
-- Create a team_members table for storing team member information
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  project_manager_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure project managers can only see their own team members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policy that allows project managers to view their own team members
CREATE POLICY "Project managers can view their own team members" 
  ON public.team_members 
  FOR SELECT 
  USING (auth.uid() = project_manager_id);

-- Create policy that allows project managers to insert their own team members
CREATE POLICY "Project managers can create their own team members" 
  ON public.team_members 
  FOR INSERT 
  WITH CHECK (auth.uid() = project_manager_id);

-- Create policy that allows project managers to update their own team members
CREATE POLICY "Project managers can update their own team members" 
  ON public.team_members 
  FOR UPDATE 
  USING (auth.uid() = project_manager_id);

-- Create policy that allows project managers to delete their own team members
CREATE POLICY "Project managers can delete their own team members" 
  ON public.team_members 
  FOR DELETE 
  USING (auth.uid() = project_manager_id);
