
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      })
    }

    const requestData = await req.json()
    console.log('Received data from n8n:', requestData)

    // Extract meeting data
    const meetingData = {
      title: requestData.title || `Meeting ${new Date().toLocaleDateString()}`,
      date: requestData.date || new Date().toISOString().split('T')[0],
      duration: requestData.duration || '30 min',
      participants: requestData.participants || 0,
      transcription: requestData.transcription || '',
      mom_content: requestData.mom_content || requestData.minutes || '',
      status: 'completed',
      file_url: requestData.file_url || ''
    }

    // Insert meeting
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .insert(meetingData)
      .select()
      .single()

    if (meetingError) {
      console.error('Meeting insert error:', meetingError)
      throw meetingError
    }

    console.log('Meeting created:', meeting)

    // Extract and insert tasks
    const tasks = requestData.tasks || []
    const taskInserts = []

    for (const task of tasks) {
      // Try to find employee by name or email
      let employee = null
      if (task.assignee) {
        const { data: employeeData } = await supabase
          .from('employees')
          .select('*')
          .or(`name.ilike.%${task.assignee}%,email.ilike.%${task.assignee}%`)
          .limit(1)
          .single()
        
        employee = employeeData
      }

      const taskData = {
        meeting_id: meeting.id,
        employee_id: employee?.id || null,
        title: task.title || task.task || 'Untitled Task',
        description: task.description || task.details || '',
        due_date: task.due_date || task.dueDate || null,
        status: 'pending',
        priority: task.priority || 'medium',
        meeting_title: meetingData.title,
        assignee: task.assignee || 'Unassigned'
      }

      taskInserts.push(taskData)
    }

    if (taskInserts.length > 0) {
      const { data: createdTasks, error: tasksError } = await supabase
        .from('tasks')
        .insert(taskInserts)
        .select()

      if (tasksError) {
        console.error('Tasks insert error:', tasksError)
      } else {
        console.log('Tasks created:', createdTasks)
        
        // Send email notifications for assigned tasks
        for (const task of createdTasks) {
          if (task.employee_id) {
            // Get employee email
            const { data: employee } = await supabase
              .from('employees')
              .select('email, name')
              .eq('id', task.employee_id)
              .single()

            if (employee?.email) {
              // You can integrate with email service here
              console.log(`Should send email to ${employee.email} for task: ${task.title}`)
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        meeting: meeting,
        tasks_created: taskInserts.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
