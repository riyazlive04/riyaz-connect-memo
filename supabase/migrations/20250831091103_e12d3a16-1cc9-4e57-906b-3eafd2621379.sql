
-- Insert dummy meeting data
INSERT INTO public.meetings (title, meeting_date, mom, user_id) VALUES
(
  'Q4 Planning Session',
  '2024-01-15 10:00:00',
  '{"summary": "Discussed Q4 objectives and key initiatives", "action_items": ["Finalize budget allocation", "Set team OKRs", "Plan product roadmap"], "attendees": ["John Smith", "Sarah Johnson", "Mike Davis"]}',
  null
),
(
  'Product Launch Review',
  '2024-01-20 14:30:00',
  '{"summary": "Reviewed product launch metrics and customer feedback", "action_items": ["Address critical bugs", "Improve onboarding flow", "Schedule customer interviews"], "attendees": ["Sarah Johnson", "Alex Chen", "Lisa Wang"]}',
  null
),
(
  'Weekly Team Standup',
  '2024-01-25 09:00:00',
  '{"summary": "Weekly progress update and blockers discussion", "action_items": ["Complete API integration", "Update documentation", "Prepare demo for stakeholders"], "attendees": ["Mike Davis", "John Smith", "Emma Brown"]}',
  null
),
(
  'Client Feedback Session',
  '2024-01-30 16:00:00',
  '{"summary": "Collected client feedback on new features", "action_items": ["Implement requested changes", "Schedule follow-up meeting", "Update project timeline"], "attendees": ["Lisa Wang", "Sarah Johnson", "David Wilson"]}',
  null
),
(
  'Budget Review Meeting',
  '2024-02-05 11:00:00',
  '{"summary": "Reviewed current budget allocation and resource planning", "action_items": ["Approve additional resources", "Revise project timelines", "Update financial projections"], "attendees": ["John Smith", "Mike Davis", "Sarah Johnson"]}',
  null
);

-- Insert corresponding dummy task data
INSERT INTO public.tasks (task, dependencies, due_date, status, priority, owner, meeting_id) VALUES
('Finalize budget allocation', 'Pending finance approval', '2024-02-01', 'In Progress', 'High', 'John Smith', (SELECT meeting_id FROM meetings WHERE title = 'Q4 Planning Session' LIMIT 1)),
('Set team OKRs', 'Budget allocation completion', '2024-02-05', 'Pending', 'High', 'Sarah Johnson', (SELECT meeting_id FROM meetings WHERE title = 'Q4 Planning Session' LIMIT 1)),
('Plan product roadmap', 'OKRs finalization', '2024-02-10', 'Pending', 'Medium', 'Mike Davis', (SELECT meeting_id FROM meetings WHERE title = 'Q4 Planning Session' LIMIT 1)),

('Address critical bugs', 'Bug report analysis', '2024-01-25', 'Completed', 'High', 'Alex Chen', (SELECT meeting_id FROM meetings WHERE title = 'Product Launch Review' LIMIT 1)),
('Improve onboarding flow', 'User feedback analysis', '2024-02-01', 'In Progress', 'Medium', 'Lisa Wang', (SELECT meeting_id FROM meetings WHERE title = 'Product Launch Review' LIMIT 1)),
('Schedule customer interviews', 'Customer list preparation', '2024-01-28', 'Completed', 'Low', 'Sarah Johnson', (SELECT meeting_id FROM meetings WHERE title = 'Product Launch Review' LIMIT 1)),

('Complete API integration', 'Technical specifications', '2024-01-30', 'In Progress', 'High', 'Mike Davis', (SELECT meeting_id FROM meetings WHERE title = 'Weekly Team Standup' LIMIT 1)),
('Update documentation', 'API integration completion', '2024-02-02', 'Pending', 'Medium', 'Emma Brown', (SELECT meeting_id FROM meetings WHERE title = 'Weekly Team Standup' LIMIT 1)),
('Prepare demo for stakeholders', 'Feature completion', '2024-02-05', 'Pending', 'High', 'John Smith', (SELECT meeting_id FROM meetings WHERE title = 'Weekly Team Standup' LIMIT 1)),

('Implement requested changes', 'Client feedback review', '2024-02-08', 'Pending', 'High', 'David Wilson', (SELECT meeting_id FROM meetings WHERE title = 'Client Feedback Session' LIMIT 1)),
('Schedule follow-up meeting', 'Changes implementation', '2024-02-10', 'Pending', 'Medium', 'Lisa Wang', (SELECT meeting_id FROM meetings WHERE title = 'Client Feedback Session' LIMIT 1)),
('Update project timeline', 'Resource assessment', '2024-02-12', 'Pending', 'Low', 'Sarah Johnson', (SELECT meeting_id FROM meetings WHERE title = 'Client Feedback Session' LIMIT 1)),

('Approve additional resources', 'Budget review completion', '2024-02-07', 'Pending', 'High', 'John Smith', (SELECT meeting_id FROM meetings WHERE title = 'Budget Review Meeting' LIMIT 1)),
('Revise project timelines', 'Resource approval', '2024-02-10', 'Pending', 'Medium', 'Mike Davis', (SELECT meeting_id FROM meetings WHERE title = 'Budget Review Meeting' LIMIT 1)),
('Update financial projections', 'Timeline revision', '2024-02-15', 'Pending', 'Medium', 'Sarah Johnson', (SELECT meeting_id FROM meetings WHERE title = 'Budget Review Meeting' LIMIT 1));
