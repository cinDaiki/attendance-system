ALTER TABLE public.profiles
ADD COLUMN department TEXT NOT NULL DEFAULT 'IT';

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_department_check
CHECK (department IN (
'HR',
'IT',
'Finance',
'Operations'
));

COMMENT ON COLUMN public.profiles.department IS
'Employee department';