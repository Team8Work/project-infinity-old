-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'employee',
    company TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipments table
CREATE TABLE public.shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_number TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    client_id UUID REFERENCES public.users(id),
    assigned_to UUID REFERENCES public.users(id),
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    weight DECIMAL,
    dimensions TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    priority TEXT NOT NULL DEFAULT 'medium',
    assigned_to UUID REFERENCES public.users(id),
    created_by UUID REFERENCES public.users(id),
    due_date TIMESTAMP WITH TIME ZONE,
    shipment_id UUID REFERENCES public.shipments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount DECIMAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT,
    shipment_id UUID REFERENCES public.shipments(id),
    client_id UUID REFERENCES public.users(id),
    transaction_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Damages table
CREATE TABLE public.damages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID REFERENCES public.shipments(id),
    description TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'minor',
    reported_by UUID REFERENCES public.users(id),
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Complaints table
CREATE TABLE public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID REFERENCES public.shipments(id),
    client_id UUID REFERENCES public.users(id),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    priority TEXT NOT NULL DEFAULT 'medium',
    assigned_to UUID REFERENCES public.users(id),
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Users table policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON public.users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can do everything"
ON public.users
USING (EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
));

-- Shipments table policies
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assigned shipments"
ON public.shipments FOR SELECT
USING (
    auth.uid() = assigned_to OR
    auth.uid() = client_id OR
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
    )
);

-- Tasks table policies
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assigned tasks"
ON public.tasks FOR SELECT
USING (
    auth.uid() = assigned_to OR
    auth.uid() = created_by OR
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
    )
);

-- Payments table policies
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view related payments"
ON public.payments FOR SELECT
USING (
    auth.uid() = client_id OR
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
    )
);

-- Damages table policies
ALTER TABLE public.damages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view damages"
ON public.damages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.shipments
        WHERE shipments.id = shipment_id AND
        (shipments.assigned_to = auth.uid() OR
         shipments.client_id = auth.uid() OR
         EXISTS (
             SELECT 1 FROM public.users
             WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
         ))
    )
);

-- Complaints table policies
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view related complaints"
ON public.complaints FOR SELECT
USING (
    auth.uid() = client_id OR
    auth.uid() = assigned_to OR
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
    )
);

-- Create indexes for better performance
CREATE INDEX idx_shipments_tracking_number ON public.shipments(tracking_number);
CREATE INDEX idx_shipments_status ON public.shipments(status);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_payments_client_id ON public.payments(client_id);
CREATE INDEX idx_complaints_client_id ON public.complaints(client_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shipments_updated_at
    BEFORE UPDATE ON public.shipments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_damages_updated_at
    BEFORE UPDATE ON public.damages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at
    BEFORE UPDATE ON public.complaints
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 