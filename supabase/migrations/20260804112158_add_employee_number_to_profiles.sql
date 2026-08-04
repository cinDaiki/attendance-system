ALTER TABLE public.profiles
ADD COLUMN employee_number TEXT;

CREATE UNIQUE INDEX profiles_employee_number_key
ON public.profiles(employee_number);