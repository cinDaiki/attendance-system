CREATE TABLE public.leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    leave_type TEXT NOT NULL,

    reason TEXT NOT NULL,

    start_date DATE NOT NULL,

    end_date DATE NOT NULL,

    status TEXT NOT NULL DEFAULT 'Pending'
        CHECK (status IN ('Pending', 'Approved', 'Rejected')),

    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.leave_requests
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees view own leave"
ON public.leave_requests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Employees insert own leave"
ON public.leave_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Employees update own pending leave"
ON public.leave_requests
FOR UPDATE
TO authenticated
USING (
    auth.uid() = user_id
    AND status = 'Pending'
);