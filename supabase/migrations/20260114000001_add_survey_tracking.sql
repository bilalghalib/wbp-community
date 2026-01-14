-- Add last_annual_survey_at to users table for gating access
alter table users 
add column last_annual_survey_at timestamptz;

-- Add index for potential filtering
create index users_last_survey_idx on users(last_annual_survey_at);
