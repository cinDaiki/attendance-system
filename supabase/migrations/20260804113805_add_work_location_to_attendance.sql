ALTER TABLE public.attendance
ADD COLUMN work_location TEXT DEFAULT 'Office';

COMMENT ON COLUMN public.attendance.work_location IS
'Employee work location: Office, Remote, or Field.';