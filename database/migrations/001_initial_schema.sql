-- FX Rate Lock Platform Database Schema
-- PostgreSQL + TimescaleDB

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  
  -- KYC fields
  kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected', 'expired')),
  kyc_document_url TEXT,
  kyc_verified_at TIMESTAMP,
  kyc_rejection_reason TEXT,
  
  -- Wallet
  wallet_address VARCHAR(42),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_email_verified BOOLEAN DEFAULT false,
  is_phone_verified BOOLEAN DEFAULT false,
  
  -- Indexes
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT phone_format CHECK (phone_number ~* '^\+?[0-9]{10,15}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- ============================================================================
-- LOCKS TABLE
-- ============================================================================
CREATE TABLE locks (
  lock_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  
  -- Blockchain reference
  blockchain_lock_id BYTEA UNIQUE,
  blockchain_tx_hash VARCHAR(66),
  
  -- Lock details
  usd_amount DECIMAL(12,2) NOT NULL CHECK (usd_amount > 0),
  kes_required DECIMAL(15,2) NOT NULL CHECK (kes_required > 0),
  locked_rate DECIMAL(10,6) NOT NULL CHECK (locked_rate > 0),
  
  -- Lock type and status
  lock_type VARCHAR(10) NOT NULL CHECK (lock_type IN ('instant', '7day', '30day')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'executed', 'cancelled', 'expired')),
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  executed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  
  -- Payment reference
  mpesa_transaction_id VARCHAR(50) UNIQUE,
  
  -- Savings calculation
  bank_rate DECIMAL(10,6),
  savings_amount DECIMAL(15,2),
  
  -- Metadata
  quote_id UUID,
  ip_address INET,
  user_agent TEXT,
  
  CONSTRAINT valid_expiry CHECK (expires_at > created_at),
  CONSTRAINT executed_before_expiry CHECK (executed_at IS NULL OR executed_at <= expires_at)
);

CREATE INDEX idx_locks_user_id ON locks(user_id);
CREATE INDEX idx_locks_status ON locks(status);
CREATE INDEX idx_locks_user_status ON locks(user_id, status);
CREATE INDEX idx_locks_expires_at ON locks(expires_at) WHERE status = 'active';
CREATE INDEX idx_locks_created_at ON locks(created_at DESC);
CREATE INDEX idx_locks_blockchain_id ON locks(blockchain_lock_id);
CREATE INDEX idx_locks_mpesa_id ON locks(mpesa_transaction_id) WHERE mpesa_transaction_id IS NOT NULL;

-- ============================================================================
-- TRANSACTIONS TABLE
-- ============================================================================
CREATE TABLE transactions (
  tx_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lock_id UUID REFERENCES locks(lock_id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  
  -- Transaction type
  type VARCHAR(20) NOT NULL CHECK (type IN ('lock_create', 'lock_execute', 'lock_cancel', 'deposit', 'withdrawal')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'reversed')),
  
  -- Amounts
  usd_amount DECIMAL(12,2),
  kes_amount DECIMAL(15,2),
  exchange_rate DECIMAL(10,6),
  fee_amount DECIMAL(12,2) DEFAULT 0,
  
  -- Payment references
  mpesa_transaction_id VARCHAR(50),
  blockchain_tx_hash VARCHAR(66),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  
  -- Error handling
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Metadata
  metadata JSONB
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_lock_id ON transactions(lock_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_mpesa_id ON transactions(mpesa_transaction_id) WHERE mpesa_transaction_id IS NOT NULL;

-- ============================================================================
-- HEDGE POSITIONS TABLE
-- ============================================================================
CREATE TABLE hedge_positions (
  position_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lock_id UUID REFERENCES locks(lock_id) ON DELETE SET NULL,
  
  -- Exchange details
  exchange VARCHAR(20) NOT NULL CHECK (exchange IN ('binance', 'coinbase', 'kraken')),
  instrument VARCHAR(50) NOT NULL,
  exchange_position_id VARCHAR(100),
  
  -- Position details
  side VARCHAR(10) NOT NULL CHECK (side IN ('long', 'short')),
  size DECIMAL(12,2) NOT NULL CHECK (size > 0),
  entry_price DECIMAL(12,6) NOT NULL CHECK (entry_price > 0),
  exit_price DECIMAL(12,6),
  
  -- P&L
  realized_pnl DECIMAL(12,2),
  unrealized_pnl DECIMAL(12,2),
  fees DECIMAL(12,2) DEFAULT 0,
  
  -- Timestamps
  opened_at TIMESTAMP DEFAULT NOW(),
  closed_at TIMESTAMP,
  
  -- Status
  is_open BOOLEAN DEFAULT true,
  
  -- Metadata
  metadata JSONB
);

CREATE INDEX idx_hedge_positions_lock_id ON hedge_positions(lock_id);
CREATE INDEX idx_hedge_positions_is_open ON hedge_positions(is_open);
CREATE INDEX idx_hedge_positions_exchange ON hedge_positions(exchange);
CREATE INDEX idx_hedge_positions_opened_at ON hedge_positions(opened_at DESC);

-- ============================================================================
-- POOL SNAPSHOTS TABLE (for yield tracking)
-- ============================================================================
CREATE TABLE pool_snapshots (
  snapshot_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Balances
  pool_balance DECIMAL(12,2) NOT NULL,
  aave_balance DECIMAL(12,2) NOT NULL,
  contract_balance DECIMAL(12,2) NOT NULL,
  
  -- Yield
  accrued_yield DECIMAL(12,2) NOT NULL DEFAULT 0,
  cumulative_yield DECIMAL(12,2) NOT NULL DEFAULT 0,
  
  -- APY
  current_apy DECIMAL(6,4) NOT NULL,
  
  -- Utilization
  utilization_percent DECIMAL(5,2) NOT NULL,
  
  -- Timestamp
  snapshot_at TIMESTAMP DEFAULT NOW(),
  
  -- Metadata
  metadata JSONB
);

CREATE INDEX idx_pool_snapshots_snapshot_at ON pool_snapshots(snapshot_at DESC);

-- ============================================================================
-- RATE HISTORY TABLE (TimescaleDB hypertable)
-- ============================================================================
CREATE TABLE rate_history (
  time TIMESTAMPTZ NOT NULL,
  
  -- Source
  source VARCHAR(20) NOT NULL CHECK (source IN ('chainlink', 'binance', 'backup', 'manual')),
  
  -- Rates
  mid_market DECIMAL(10,6) NOT NULL CHECK (mid_market > 0),
  instant_quote DECIMAL(10,6),
  day7_quote DECIMAL(10,6),
  day30_quote DECIMAL(10,6),
  
  -- Volatility
  volatility_7d DECIMAL(6,4),
  volatility_30d DECIMAL(6,4),
  
  -- Spread
  spread_bps INTEGER,
  
  -- Metadata
  metadata JSONB
);

-- Convert to hypertable (TimescaleDB)
SELECT create_hypertable('rate_history', 'time', if_not_exists => TRUE);

CREATE INDEX idx_rate_history_source ON rate_history(source, time DESC);

-- ============================================================================
-- AUDIT LOG TABLE
-- ============================================================================
CREATE TABLE audit_log (
  log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
  
  -- Action details
  action VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  
  -- Request details
  ip_address INET,
  user_agent TEXT,
  
  -- Changes
  old_values JSONB,
  new_values JSONB,
  
  -- Details
  details JSONB,
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_resource ON audit_log(resource_type, resource_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE notifications (
  notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  
  -- Notification details
  type VARCHAR(50) NOT NULL,
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('email', 'sms', 'push', 'in_app')),
  
  -- Content
  subject VARCHAR(255),
  message TEXT NOT NULL,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'read')),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  read_at TIMESTAMP,
  
  -- Error handling
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Metadata
  metadata JSONB
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================================
-- API KEYS TABLE (for merchant integrations)
-- ============================================================================
CREATE TABLE api_keys (
  key_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  
  -- Key details
  key_hash VARCHAR(255) NOT NULL UNIQUE,
  key_prefix VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  
  -- Permissions
  permissions JSONB NOT NULL DEFAULT '[]',
  
  -- Rate limiting
  rate_limit_per_minute INTEGER DEFAULT 100,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP,
  
  -- Metadata
  metadata JSONB
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Active locks summary
CREATE VIEW v_active_locks AS
SELECT 
  l.*,
  u.email,
  u.phone_number,
  u.full_name,
  EXTRACT(EPOCH FROM (l.expires_at - NOW())) / 3600 AS hours_until_expiry
FROM locks l
JOIN users u ON l.user_id = u.user_id
WHERE l.status = 'active'
ORDER BY l.expires_at ASC;

-- User statistics
CREATE VIEW v_user_stats AS
SELECT 
  u.user_id,
  u.email,
  u.full_name,
  COUNT(DISTINCT l.lock_id) AS total_locks,
  COUNT(DISTINCT l.lock_id) FILTER (WHERE l.status = 'executed') AS executed_locks,
  SUM(l.usd_amount) FILTER (WHERE l.status = 'executed') AS total_usd_settled,
  SUM(l.savings_amount) FILTER (WHERE l.status = 'executed') AS total_savings,
  MAX(l.created_at) AS last_lock_date
FROM users u
LEFT JOIN locks l ON u.user_id = l.user_id
GROUP BY u.user_id, u.email, u.full_name;

-- Platform metrics
CREATE VIEW v_platform_metrics AS
SELECT 
  COUNT(DISTINCT user_id) AS total_users,
  COUNT(DISTINCT lock_id) AS total_locks,
  COUNT(DISTINCT lock_id) FILTER (WHERE status = 'active') AS active_locks,
  COUNT(DISTINCT lock_id) FILTER (WHERE status = 'executed') AS executed_locks,
  SUM(usd_amount) FILTER (WHERE status = 'executed') AS total_volume_usd,
  SUM(savings_amount) FILTER (WHERE status = 'executed') AS total_savings_delivered,
  AVG(locked_rate) FILTER (WHERE status = 'executed') AS avg_execution_rate
FROM locks;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to expire old locks
CREATE OR REPLACE FUNCTION expire_old_locks()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  UPDATE locks
  SET status = 'expired'
  WHERE status = 'active'
    AND expires_at < NOW();
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate user's active locks count
CREATE OR REPLACE FUNCTION get_user_active_locks_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM locks
    WHERE user_id = p_user_id
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update last_login on user authentication
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_login = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Audit trail trigger
CREATE OR REPLACE FUNCTION create_audit_trail()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values
  ) VALUES (
    COALESCE(NEW.user_id, OLD.user_id),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.lock_id, OLD.lock_id),
    row_to_json(OLD),
    row_to_json(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply audit trigger to locks table
CREATE TRIGGER locks_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON locks
FOR EACH ROW EXECUTE FUNCTION create_audit_trail();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default rate history entry
INSERT INTO rate_history (time, source, mid_market, instant_quote, day7_quote, day30_quote)
VALUES (NOW(), 'manual', 129.50, 128.70, 128.10, 127.30);

COMMENT ON TABLE users IS 'User accounts with KYC information';
COMMENT ON TABLE locks IS 'FX rate locks created by users';
COMMENT ON TABLE transactions IS 'All platform transactions';
COMMENT ON TABLE hedge_positions IS 'Hedge positions for risk management';
COMMENT ON TABLE pool_snapshots IS 'Aave pool balance snapshots for yield tracking';
COMMENT ON TABLE rate_history IS 'Historical FX rate data (TimescaleDB hypertable)';
COMMENT ON TABLE audit_log IS 'Audit trail for all important actions';
COMMENT ON TABLE notifications IS 'User notifications across all channels';
COMMENT ON TABLE api_keys IS 'API keys for merchant integrations';
