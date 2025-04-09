-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.damages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read all profiles"
ON public.users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can create users"
ON public.users FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Shipments table policies
CREATE POLICY "View shipments"
ON public.shipments FOR SELECT
TO authenticated
USING (
    assigned_to = auth.uid() OR
    client_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
    )
);

CREATE POLICY "Manage shipments"
ON public.shipments FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
    )
);

-- Tasks table policies
CREATE POLICY "View tasks"
ON public.tasks FOR SELECT
TO authenticated
USING (
    assigned_to = auth.uid() OR
    created_by = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
    )
);

CREATE POLICY "Manage tasks"
ON public.tasks FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
    )
);

-- Payments table policies
CREATE POLICY "View payments"
ON public.payments FOR SELECT
TO authenticated
USING (
    client_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
    )
);

CREATE POLICY "Manage payments"
ON public.payments FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
    )
);

-- Damages table policies
CREATE POLICY "View damages"
ON public.damages FOR SELECT
TO authenticated
USING (
    reported_by = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
    )
);

CREATE POLICY "Report damages"
ON public.damages FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Manage damages"
ON public.damages FOR UPDATE OR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
    )
);

-- Complaints table policies
CREATE POLICY "View complaints"
ON public.complaints FOR SELECT
TO authenticated
USING (
    client_id = auth.uid() OR
    assigned_to = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
    )
);

CREATE POLICY "Submit complaints"
ON public.complaints FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Manage complaints"
ON public.complaints FOR UPDATE OR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
    )
); 