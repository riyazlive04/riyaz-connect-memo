-- Add user_id column to associate meetings with users
ALTER TABLE public.meetings 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Enable Row Level Security on meetings table
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own meetings
CREATE POLICY "Users can view their own meetings" 
ON public.meetings 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow users to create their own meetings
CREATE POLICY "Users can create their own meetings" 
ON public.meetings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own meetings
CREATE POLICY "Users can update their own meetings" 
ON public.meetings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own meetings
CREATE POLICY "Users can delete their own meetings" 
ON public.meetings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Also enable RLS on tasks table for consistency
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policy for tasks - users can view tasks for meetings they own
CREATE POLICY "Users can view tasks for their meetings" 
ON public.tasks 
FOR SELECT 
USING (
  meeting_id IN (
    SELECT meeting_id FROM public.meetings WHERE user_id = auth.uid()
  )
);

-- Create policy for tasks - users can manage tasks for meetings they own
CREATE POLICY "Users can manage tasks for their meetings" 
ON public.tasks 
FOR ALL 
USING (
  meeting_id IN (
    SELECT meeting_id FROM public.meetings WHERE user_id = auth.uid()
  )
);

-- Update existing meetings to have a user_id (set to null for now)
-- In a real scenario, you'd want to assign them to appropriate users
COMMENT ON COLUMN public.meetings.user_id IS 'User who created/owns this meeting - required for RLS security';