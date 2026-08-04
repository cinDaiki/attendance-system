ALTER TABLE public.attendance
ADD COLUMN IF NOT EXISTS work_location TEXT NOT NULL DEFAULT 'Office';

ALTER TABLE public.attendance
DROP CONSTRAINT IF EXISTS attendance_work_location_check;

ALTER TABLE public.attendance
ADD CONSTRAINT attendance_work_location_check
CHECK (work_location IN (
  'Office',
  'Home',
  'Client Site'
));