-- First, disable RLS temporarily
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can do everything" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for users based on email" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.users;

-- Create admin user first
INSERT INTO public.users (
    username,
    email,
    full_name,
    role,
    company
) VALUES (
    'admin',
    'admin@logitrack.com',
    'System Administrator',
    'admin',
    'LogiTrack'
) ON CONFLICT (email) DO NOTHING;

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create simple policies
CREATE POLICY "Allow full access to admins"
ON public.users
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.email = auth.jwt() ->> 'email'
        AND u.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.email = auth.jwt() ->> 'email'
        AND u.role = 'admin'
    )
);

CREATE POLICY "Users can manage their own profile"
ON public.users
TO authenticated
USING (email = auth.jwt() ->> 'email')
WITH CHECK (email = auth.jwt() ->> 'email'); 