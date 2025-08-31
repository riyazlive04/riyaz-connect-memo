
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable. Please configure your Supabase connection.')
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable. Please configure your Supabase connection.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Employee {
  id: string
  name: string
  email: string
  role: string
  project_manager_id?: string
  created_at: string
  updated_at: string
}

export interface Meeting {
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

export interface Task {
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

// Employee operations
export const employeeService = {
  async getAll() {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  async create(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('employees')
      .insert(employee)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Employee>) {
    const { data, error } = await supabase
      .from('employees')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Meeting operations
export const meetingService = {
  async getAll() {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
}

// Task operations
export const taskService = {
  async getAll() {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        employees:employee_id (
          name,
          email,
          role
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getByMeeting(meetingId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        employees:employee_id (
          name,
          email,
          role
        )
      `)
      .eq('meeting_id', meetingId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async assignToEmployee(taskId: string, employeeId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        employee_id: employeeId, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', taskId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
