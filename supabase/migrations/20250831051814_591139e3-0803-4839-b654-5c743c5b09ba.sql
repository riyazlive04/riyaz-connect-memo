
-- Create employees table for team management
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  project_manager_id UUID REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to employees table
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to view employees (for now, can be restricted later)
CREATE POLICY "Allow read access to employees" 
  ON public.employees 
  FOR SELECT 
  USING (true);

-- Create policy that allows everyone to insert employees (can be restricted later)
CREATE POLICY "Allow insert access to employees" 
  ON public.employees 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that allows everyone to update employees (can be restricted later)
CREATE POLICY "Allow update access to employees" 
  ON public.employees 
  FOR UPDATE 
  USING (true);

-- Create policy that allows everyone to delete employees (can be restricted later)
CREATE POLICY "Allow delete access to employees" 
  ON public.employees 
  FOR DELETE 
  USING (true);

-- Add missing columns to existing tables to match the interfaces
ALTER TABLE public.meetings 
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS date TIMESTAMP WITH TIME ZONE DEFAULT meeting_date,
ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '30 min',
ADD COLUMN IF NOT EXISTS participants INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS transcription TEXT,
ADD COLUMN IF NOT EXISTS mom_content TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'processing',
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS employee_id UUID REFERENCES public.employees(id),
ADD COLUMN IF NOT EXISTS title TEXT DEFAULT task,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS meeting_title TEXT,
ADD COLUMN IF NOT EXISTS assignee TEXT DEFAULT owner;

-- Update existing data to have proper IDs if they don't exist
UPDATE public.meetings SET id = gen_random_uuid() WHERE id IS NULL;
UPDATE public.tasks SET id = gen_random_uuid() WHERE id IS NULL;
UPDATE public.tasks SET title = task WHERE title IS NULL AND task IS NOT NULL;
