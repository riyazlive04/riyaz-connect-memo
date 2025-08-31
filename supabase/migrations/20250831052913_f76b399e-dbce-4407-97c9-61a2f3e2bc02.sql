
-- First, we need to handle the foreign key constraint and update the data types
-- Step 1: Drop the foreign key constraint if it exists
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_meeting_id_fkey;

-- Step 2: Add new string columns
ALTER TABLE meetings ADD COLUMN new_meeting_id TEXT;
ALTER TABLE tasks ADD COLUMN new_task_id TEXT;
ALTER TABLE tasks ADD COLUMN new_meeting_id TEXT;

-- Step 3: Populate the new columns with string versions of the IDs
UPDATE meetings SET new_meeting_id = meeting_id::text;
UPDATE tasks SET new_task_id = task_id::text;
UPDATE tasks SET new_meeting_id = meeting_id::text;

-- Step 4: Drop the old columns
ALTER TABLE meetings DROP COLUMN meeting_id;
ALTER TABLE tasks DROP COLUMN task_id;
ALTER TABLE tasks DROP COLUMN meeting_id;

-- Step 5: Rename the new columns
ALTER TABLE meetings RENAME COLUMN new_meeting_id TO meeting_id;
ALTER TABLE tasks RENAME COLUMN new_task_id TO task_id;
ALTER TABLE tasks RENAME COLUMN new_meeting_id TO meeting_id;

-- Step 6: Set the new columns as primary keys and not null
ALTER TABLE meetings ALTER COLUMN meeting_id SET NOT NULL;
ALTER TABLE tasks ALTER COLUMN task_id SET NOT NULL;

-- Step 7: Add primary key constraints
ALTER TABLE meetings ADD PRIMARY KEY (meeting_id);
ALTER TABLE tasks ADD PRIMARY KEY (task_id);

-- Step 8: Recreate the foreign key constraint
ALTER TABLE tasks ADD CONSTRAINT tasks_meeting_id_fkey 
  FOREIGN KEY (meeting_id) REFERENCES meetings(meeting_id);

-- Step 9: Update sequences to generate string IDs (we'll use a function for this)
CREATE OR REPLACE FUNCTION generate_string_id(table_name text) 
RETURNS text AS $$
BEGIN
  RETURN table_name || '_' || extract(epoch from now())::bigint::text || '_' || floor(random() * 1000)::text;
END;
$$ LANGUAGE plpgsql;

-- Step 10: Set default values for new records
ALTER TABLE meetings ALTER COLUMN meeting_id SET DEFAULT generate_string_id('meeting');
ALTER TABLE tasks ALTER COLUMN task_id SET DEFAULT generate_string_id('task');
