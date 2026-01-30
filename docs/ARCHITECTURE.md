# FX Rate Lock Platform - Architecture Documentation

## **System Overview**

The FX Rate Lock Platform is a production-grade, blockchain-based remittance system that enables users to lock favorable exchange rates for cross-border transfers between Kenya and international destinations.

---

## **Core Architecture**

### **1. Dual-Chain Blockchain Strategy**

#### **Primary Chain: Base L2 (Coinbase)**
- **Purpose**: Smart contracts, rate locks, Aave yield generation
- **Chain ID**: 8453 (Mainnet), 84532 (Sepolia Testnet)
- **Gas Costs**: $0.01-0.10 per transaction
- **Why Base**: Low fees, EVM compatibility, Coinbase backing for institutional trust

**Smart Contracts Deployed:**
1. **RateLockManager.sol** - Core rate locking logic
2. **AavePoolManager.sol** - Liquidity pool management
3. **HedgeManager.sol** - Hedge position tracking
4. **CircuitBreaker.sol** - Market volatility monitoring
5. **OracleConsumer.sol** - Chainlink price feed integration

#### **Secondary Chain: XRP Ledger**
- **Purpose**: Final settlement, ultra-low-cost transfers
- **Transaction Cost**: ~$0.0001
- **Settlement Time**: 3-5 seconds
- **Why XRP**: Built for cross-border payments, existing bank infrastructure via RippleNet

**Bridge Strategy:**
- Batch small transfers (10-50) before bridging to save costs
- Use Axelar or LayerZero for cross-chain messaging
- Alternative: Manual bridge via centralized exchange

---

### **2. Microservices Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                     API GATEWAY (Port 3000)                  │
│  - Authentication (JWT)                                      │
│  - Rate limiting (100 req/min)                              │
│  - Request routing                                           │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌───────▼────────┐   ┌───────▼────────┐
│  RATE ENGINE   │   │ LOCK MANAGER   │   │ AAVE MANAGER   │
│  - Chainlink   │   │ - Smart        │   │ - Pool         │
│  - Volatility  │   │   contracts    │   │   management   │
│  - Dynamic     │   │ - Lifecycle    │   │ - Yield        │
│    pricing     │   │   tracking     │   │   tracking     │
└────────────────┘   └────────────────┘   └────────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌───────▼────────┐   ┌───────▼────────┐
│    BINANCE     │   │  XRP SETTLE    │   │  M-PESA SVC    │
│  - Spot trade  │   │ - XRP Ledger   │   │ - STK Push     │
│  - Futures     │   │ - RippleNet    │   │ - Callbacks    │
│  - Hedging     │   │   ODL          │   │ - Daraja API   │
└────────────────┘   └────────────────┘   └────────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌───────▼────────┐   ┌───────▼────────┐
│ CIRCUIT        │   │ NOTIFICATION   │   │  ANALYTICS     │
│  BREAKER       │   │   SERVICE      │   │ - Metrics      │
│ - Volatility   │   │ - Email        │   │ - Reporting    │
│ - Kill switch  │   │ - SMS          │   │ - Dashboards   │
└────────────────┘   └────────────────┘   └────────────────┘
```

---

### **3. Data Layer**

#### **PostgreSQL + TimescaleDB**
- **Primary Database**: User data, locks, transactions
- **TimescaleDB Extension**: Time-series rate history
- **Connection Pool**: 20 connections max
- **Backup**: Every 6 hours to S3

**Key Tables:**
- `users` - User accounts and KYC
- `locks` - Rate locks (active, executed, cancelled)
- `transactions` - All platform transactions
- `hedge_positions` - Hedge tracking for risk management
- `pool_snapshots` - Aave pool balance snapshots
- `rate_history` - Historical FX rates (hypertable)
- `audit_log` - Audit trail for compliance

#### **Redis**
- **Purpose**: Caching, session management, rate limiting
- **TTL Strategy**: 
  - Current rates: 60 seconds
  - Quotes: 120 seconds (2 minutes)
  - User sessions: 30 days

---

### **4. Transaction Flow**

#### **Complete User Journey**

```
1. USER REQUESTS QUOTE
   ├─> API: POST /api/v1/rates/quote
   ├─> Rate Engine calculates dynamic price
   ├─> Factors: volatility, pool utilization, lock type
   └─> Returns: quoted rate, savings vs bank, expiry (2 min)

2. USER CREATES LOCK
   ├─> API: POST /api/v1/locks/create
   ├─> Validates: KYC status, active locks count
   ├─> Database: Insert lock record (status: pending)
   ├─> Smart Contract: RateLockManager.createLock()
   ├─> Blockchain confirmation
   └─> Update status: active

3. USER EXECUTES LOCK (Pays via M-Pesa)
   ├─> API: POST /api/v1/locks/:lockId/execute
   ├─> M-Pesa Service: Initiate STK Push
   ├─> User receives M-Pesa prompt on phone
   ├─> User enters PIN
   └─> M-Pesa processes payment

4. M-PESA CALLBACK
   ├─> Webhook: POST /webhooks/mpesa/callback
   ├─> Verify payment successful
   ├─> Update lock: status = executed
   ├─> Create transaction record
   └─> Trigger settlement process

5. SETTLEMENT (Backend)
   ├─> Binance: Convert KES → USDC
   ├─> Aave: Withdraw USDC from pool
   ├─> Bridge: Base → XRP (if needed)
   ├─> XRP Ledger: Send to recipient
   ├─> Notification: Email + SMS confirmation
   └─> Total time: <15 minutes
```

---

### **5. Risk Management**

#### **Hedging Strategy**

**Hedge Ratios by Lock Duration:**
- Instant (2 hours): 0% hedge (too short, rely on netting)
- 7-day: 40% hedge on Binance futures
- 30-day: 80% hedge on Binance futures

**Hedge Instruments:**
- Primary: USDT perpetual futures (proxy for KES/USD)
- Alternative: Currency options (when available)

**Rebalancing:**
- Check every 30 minutes
- Rebalance if drift > $10,000
- Close hedges when locks execute

#### **Circuit Breaker Rules**

**Market Conditions:**
1. **NORMAL**: Volatility < 2% in 7 days
   - Spread: Full (0.8 - 2.2 KES)
   - Action: None

2. **HIGH_VOLATILITY**: 2-5% move in 7 days
   - Spread: Narrowed by 0.6 KES
   - Action: Increase monitoring

3. **EXTREME**: >5% move in <3 days
   - Spread: N/A
   - Action: **PAUSE NEW LOCKS**
   - Notification: Alert all admins

**Pool Utilization:**
- >85%: Warning, narrow spreads
- >90%: Pause new locks temporarily
- <30%: Widen spreads (excess liquidity)

---

### **6. Revenue Model**

#### **Revenue Streams**

1. **FX Margin** (Primary)
   - Embedded in quoted rate
   - Target: 0.5-1% of transaction value
   - Example: $1,000 transfer = $5-10 revenue

2. **Aave Yield** (Passive)
   - 3-4% APY on idle USDC
   - Average pool size: $500K
   - Monthly yield: ~$1,458

3. **Hedge Gains** (Opportunistic)
   - Profit from favorable hedge exits
   - Estimated: 10-20% of hedges profitable
   - Monthly: ~$2,000

4. **Netting** (Cost Savings)
   - Match opposite flows (KES→USD vs USD→KES)
   - Zero hedging cost when netted
   - Estimated: 20-30% of volume

#### **Example Economics**

**Monthly Volume: $1M USD**

| Revenue Stream | Calculation | Amount |
|----------------|-------------|--------|
| FX Margin (0.75%) | $1M × 0.75% | $7,500 |
| Aave Yield (3.5% APY) | $500K × 3.5% / 12 | $1,458 |
| Hedge Gains | Estimated | $2,000 |
| **Total Revenue** | | **$10,958** |

**Costs:**
- Gas fees (Base): ~$500
- Exchange fees (Binance): ~$1,000
- Operations: ~$3,000
- **Total Costs**: ~$4,500

**Net Profit**: ~$6,500/month at $1M volume

**Profit Margin**: 59%

---

### **7. Security Architecture**

#### **Smart Contract Security**

✅ **Implemented:**
- OpenZeppelin libraries (AccessControl, ReentrancyGuard, Pausable)
- Role-based access control (Admin, Operator, Emergency)
- Circuit breaker for emergency shutdown
- Input validation on all functions
- Event emission for all state changes

⚠️ **Required Before Mainnet:**
- Professional audit (Trail of Bits or OpenZeppelin)
- Bug bounty program ($100K rewards)
- Multi-sig wallet for admin functions (3-of-5)
- Timelock on parameter changes (24-48 hours)

#### **API Security**

- HTTPS only (TLS 1.3)
- JWT authentication (30-day expiry)
- Rate limiting (100 req/min per user, 10K global)
- Helmet.js security headers
- Input validation (Zod schemas)
- SQL injection prevention (parameterized queries)
- CORS whitelist

#### **Operational Security**

- Private keys in AWS KMS (never in code)
- Hot wallet: 10% of funds
- Cold wallet: 90% of funds (multi-sig)
- 2FA for all admin accounts
- Audit logging for privileged operations
- Encrypted PII at rest (AES-256)
- GDPR compliance (right to erasure)

---

### **8. Monitoring & Observability**

#### **Prometheus Metrics**

**Business Metrics:**
- `locks_created_total` - Total locks created
- `locks_executed_total` - Total locks executed
- `volume_usd_total` - Total USD volume
- `revenue_total` - Total revenue earned
- `savings_delivered_total` - Customer savings

**Risk Metrics:**
- `pool_utilization_percent` - Aave pool utilization
- `hedge_ratio_percent` - Current hedge ratio
- `net_exposure_usd` - Net FX exposure
- `volatility_7d_bps` - 7-day volatility

**Operational Metrics:**
- `settlement_duration_seconds` - Settlement time (p50, p95, p99)
- `api_request_duration_seconds` - API latency
- `mpesa_success_rate` - M-Pesa payment success rate
- `blockchain_tx_success_rate` - Smart contract success rate

#### **Grafana Dashboards**

1. **Platform Overview**
   - Active locks, total volume, revenue
   - User growth, transaction count
   - Success rates, error rates

2. **Risk Dashboard**
   - Pool utilization, net exposure
   - Hedge ratios, open positions
   - VaR (Value at Risk) at 95% and 99%

3. **Operational Dashboard**
   - API latency, throughput
   - Settlement times, success rates
   - Error logs, failed transactions

4. **Financial Dashboard**
   - Revenue breakdown (FX, yield, hedges)
   - Costs (gas, fees, operations)
   - Profit margins, ROI

---

### **9. Compliance & Regulatory**

#### **KYC/AML Requirements**

**User Verification:**
- Email verification (mandatory)
- Phone verification (mandatory)
- ID document upload (for limits >$1,000)
- Selfie verification (for limits >$5,000)

**Transaction Monitoring:**
- Flag transactions >$10,000
- Monitor velocity (>$50K in 30 days)
- Screen against sanctions lists (OFAC, UN, EU)
- Report suspicious activity to partner bank

**Data Retention:**
- Transaction records: 7 years
- KYC documents: 5 years after account closure
- Audit logs: 7 years

#### **Licensing Strategy**

**White-Label Model:**
- Platform operates under partner bank's license
- Bank holds money transmission license in Kenya
- Platform is technology provider (not money transmitter)
- Legal opinion confirming structure

**Partner Bank Requirements:**
- Licensed in Kenya (Central Bank of Kenya)
- Existing M-Pesa integration
- Compliance team for AML/KYC
- Insurance coverage ($1M minimum)

---

### **10. Deployment Strategy**

#### **Phase 1: Testnet (Months 1-2)**

✅ **Completed:**
- Smart contracts on Base Sepolia
- Database schema
- API Gateway + Rate Engine
- M-Pesa sandbox integration

⏳ **In Progress:**
- Aave testnet integration
- Binance testnet trading
- XRP testnet settlement

#### **Phase 2: Beta (Months 3-4)**

- Smart contract audit
- Mainnet deployment
- 100 beta users
- $100K volume target
- Insurance coverage

#### **Phase 3: Production (Months 5-6)**

- Partner bank integration
- Regulatory approval
- Marketing launch
- Customer support team
- 1,000 users, $1M volume

#### **Phase 4: Scale (Months 7-12)**

- Multi-corridor (NGN, INR, GHS)
- Mobile apps (iOS, Android)
- API for third-party integrations
- Institutional partnerships

---

## **Technology Decisions**

### **Why Base L2?**
1. Low gas fees ($0.01-0.10 vs $5-50 on Ethereum)
2. EVM compatible (use existing Solidity tools)
3. Coinbase backing (institutional trust)
4. Growing ecosystem (Aave V3 available)

### **Why XRP Ledger?**
1. Built for cross-border payments
2. Ultra-low fees (~$0.0001)
3. 3-5 second settlement
4. RippleNet ODL for bank partnerships

### **Why Aave V3?**
1. Battle-tested protocol ($10B+ TVL)
2. Competitive yields (3-4% on USDC)
3. Available on Base L2
4. Instant liquidity

### **Why Binance?**
1. Highest liquidity for KES/USDT
2. Futures for hedging
3. Low fees (0.1% spot, 0.02% futures)
4. API reliability

---

## **Conclusion**

This architecture provides:
- ✅ **Scalability**: Microservices can scale independently
- ✅ **Reliability**: Redundancy at every layer
- ✅ **Security**: Defense in depth
- ✅ **Compliance**: Built-in audit trails
- ✅ **Profitability**: Multiple revenue streams

**Next Steps:**
1. Complete remaining microservices
2. Smart contract audit
3. Load testing (1,000 concurrent users)
4. Partner bank negotiations
5. Regulatory approval

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-30  
**Author**: Development Team
