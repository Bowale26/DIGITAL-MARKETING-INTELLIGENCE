-- Flux Agency Relational Schema (PostgreSQL/Supabase compatible)

CREATE TABLE IF NOT EXISTS merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    store_name TEXT,
    industry TEXT,
    tier TEXT DEFAULT 'seed',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id),
    score INT CHECK (score BETWEEN 0 AND 100),
    service_type TEXT NOT NULL, -- 'seo', 'ppc', 'performance'
    findings JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id),
    stripe_session_id TEXT UNIQUE,
    amount DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    status TEXT, -- 'pending', 'complete', 'failed'
    created_at TIMESTAMPTZ DEFAULT now()
);
