
-- Update the create-trial-account function to give 5 credits by default
-- First, let's add some dummy meeting and task data

-- Insert dummy meetings
INSERT INTO meetings (meeting_id, title, meeting_date, mom, created_at) VALUES
('meeting_1735632000_123', 'Q4 Planning Meeting', '2024-12-30 10:00:00', '{"summary": "Discussed Q4 goals and objectives", "action_items": ["Finalize budget", "Review team assignments"]}', '2024-12-30 10:00:00'),
('meeting_1735545600_456', 'Product Roadmap Review', '2024-12-29 14:30:00', '{"summary": "Reviewed product roadmap for 2025", "action_items": ["Update feature priorities", "Schedule user interviews"]}', '2024-12-29 14:30:00'),
('meeting_1735459200_789', 'Weekly Team Standup', '2024-12-28 09:15:00', '{"summary": "Team progress updates and blockers discussion", "action_items": ["Resolve API integration issues", "Update documentation"]}', '2024-12-28 09:15:00'),
('meeting_1735372800_101', 'Client Feedback Session', '2024-12-27 16:00:00', '{"summary": "Collected client feedback on latest features", "action_items": ["Implement UI improvements", "Fix reported bugs"]}', '2024-12-27 16:00:00'),
('meeting_1735286400_202', 'Marketing Strategy Meeting', '2024-12-26 11:30:00', '{"summary": "Discussed marketing campaigns for new product launch", "action_items": ["Create landing page", "Plan social media strategy"]}', '2024-12-26 11:30:00');

-- Insert dummy tasks
INSERT INTO tasks (task_id, meeting_id, task, owner, due_date, priority, status, dependencies, created_at, updated_at) VALUES
('task_1735632100_001', 'meeting_1735632000_123', 'Finalize Q4 budget allocation', 'John Smith', '2025-01-05', 'high', 'in-progress', 'Requires approval from finance team', '2024-12-30 10:30:00', '2024-12-30 10:30:00'),
('task_1735632200_002', 'meeting_1735632000_123', 'Review team assignments for Q4', 'Sarah Johnson', '2025-01-03', 'medium', 'pending', 'None', '2024-12-30 10:35:00', '2024-12-30 10:35:00'),
('task_1735545700_003', 'meeting_1735545600_456', 'Update feature priorities in roadmap', 'Mike Chen', '2025-01-08', 'high', 'completed', 'Stakeholder input required', '2024-12-29 14:45:00', '2024-12-31 09:00:00'),
('task_1735545800_004', 'meeting_1735545600_456', 'Schedule user interviews', 'Emily Davis', '2025-01-10', 'medium', 'pending', 'Research team availability', '2024-12-29 15:00:00', '2024-12-29 15:00:00'),
('task_1735459300_005', 'meeting_1735459200_789', 'Resolve API integration issues', 'Alex Wilson', '2025-01-02', 'high', 'in-progress', 'Backend team support needed', '2024-12-28 09:30:00', '2024-12-28 09:30:00'),
('task_1735459400_006', 'meeting_1735459200_789', 'Update technical documentation', 'Lisa Brown', '2025-01-07', 'low', 'pending', 'Code review completion', '2024-12-28 09:45:00', '2024-12-28 09:45:00'),
('task_1735372900_007', 'meeting_1735372800_101', 'Implement UI improvements', 'David Kim', '2025-01-04', 'medium', 'in-progress', 'Design team mockups', '2024-12-27 16:15:00', '2024-12-30 14:20:00'),
('task_1735373000_008', 'meeting_1735372800_101', 'Fix reported client bugs', 'Tom Rodriguez', '2025-01-06', 'high', 'completed', 'QA testing required', '2024-12-27 16:30:00', '2024-12-31 11:30:00'),
('task_1735286500_009', 'meeting_1735286400_202', 'Create product landing page', 'Jessica Lee', '2025-01-15', 'medium', 'pending', 'Content approval needed', '2024-12-26 11:45:00', '2024-12-26 11:45:00'),
('task_1735286600_010', 'meeting_1735286400_202', 'Plan social media strategy', 'Mark Thompson', '2025-01-12', 'medium', 'in-progress', 'Marketing budget confirmation', '2024-12-26 12:00:00', '2024-12-29 10:15:00');
