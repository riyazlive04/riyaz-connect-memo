
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
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
      meeting_date: requestData.date || new Date().toISOString(),
      mom: requestData.mom || requestData.minutes || requestData.summary || null,
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
      const taskData = {
        task: task.title || task.task || 'Untitled Task',
        dependencies: task.description || task.details || '',
        due_date: task.due_date || task.dueDate || null,
        status: task.status || 'Pending',
        priority: task.priority || 'medium',
        owner: task.assignee || task.owner || 'Unassigned',
        meeting_id: meeting.meeting_id,
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
      }
    }

    // Extract and insert team members if provided
    const teamMembers = requestData.participants || requestData.attendees || []
    const teamMemberInserts = []

    for (const member of teamMembers) {
      if (member.email && member.name) {
        // Check if team member already exists
        const { data: existingMember } = await supabase
          .from('team_members')
          .select('id')
          .eq('email', member.email)
          .single()

        if (!existingMember) {
          const memberData = {
            name: member.name,
            email: member.email,
            role: member.role || 'Team Member',
            // Note: In a real scenario, you'd need to determine the project_manager_id
            // For now, we'll use a placeholder that should be replaced with actual logic
            project_manager_id: requestData.project_manager_id || null,
          }

          if (memberData.project_manager_id) {
            teamMemberInserts.push(memberData)
          }
        }
      }
    }

    if (teamMemberInserts.length > 0) {
      const { data: createdTeamMembers, error: teamMembersError } = await supabase
        .from('team_members')
        .insert(teamMemberInserts)
        .select()

      if (teamMembersError) {
        console.error('Team members insert error:', teamMembersError)
      } else {
        console.log('Team members created:', createdTeamMembers)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        meeting: meeting,
        tasks_created: taskInserts.length,
        team_members_created: teamMemberInserts.length
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
