-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can do everything" ON public.users;

-- Create better policies
CREATE POLICY "Enable read access for all users"
ON public.users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for users based on email"
ON public.users FOR INSERT
TO authenticated
WITH CHECK (auth.jwt() ->> 'email' = email);

CREATE POLICY "Enable update for users based on id"
ON public.users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create admin user directly in the database
INSERT INTO public.users (
    id,
    username,
    email,
    full_name,
    role,
    company
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'admin',
    'admin@logitrack.com',
    'System Administrator',
    'admin',
    'LogiTrack'
); 