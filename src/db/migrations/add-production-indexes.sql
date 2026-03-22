-- Performance indexes for DakkapellenKosten.nl
-- Run against production PostgreSQL to improve query performance.
-- These are safe to run on a live database (CREATE INDEX CONCURRENTLY).

-- Leads: frequently queried by email (dedup), status (filtering), postcode (matching)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_email ON leads (email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_postcode ON leads (postcode);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_expires_at ON leads (expires_at) WHERE expires_at IS NOT NULL;

-- Companies: queried by city, verification status
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_city ON companies (city);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_verified ON companies (is_verified) WHERE is_verified = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_deleted_at ON companies (deleted_at) WHERE deleted_at IS NULL;

-- Lead matches: queried by company and lead
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lead_matches_company ON lead_matches (company_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lead_matches_lead ON lead_matches (lead_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lead_matches_status ON lead_matches (status);

-- Subscriptions: checked during matching
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_company ON subscriptions (company_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_status ON subscriptions (status);

-- Credit balances: checked during lead acceptance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_credit_balances_company ON credit_balances (company_id);

-- Audit events: queried for admin timeline
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_events_created_at ON audit_events (created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_events_entity ON audit_events (entity_type, entity_id);

-- Articles: queried by slug, status
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_articles_status ON articles (status) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_articles_scheduled ON articles (scheduled_at) WHERE status = 'scheduled' AND deleted_at IS NULL;

-- Pages: queried by slug, status
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pages_status ON pages (status) WHERE deleted_at IS NULL;

-- Credit transactions: queried by company for history
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_credit_transactions_company ON credit_transactions (company_id);

-- Content locks: cleanup query
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_locks_expires ON content_locks (expires_at);
