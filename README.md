# FX Rate Lock Platform

> **Production-grade cross-border FX rate-locking remittance platform for Africa-Asia corridor**

A white-label blockchain-based platform that allows users to lock favorable exchange rates for 7-30 days, with 15-minute settlement and transparent audit trails. Built on Base L2 with Aave yield generation, Binance hedging, and XRP settlement.

---

## 🎯 **Core Value Proposition**

- **Lock rates 2-4 KES better than banks** (127 vs 131 KES per USD)
- **15-minute settlement** vs 3-5 days traditional
- **Blockchain audit trail** for full transparency
- **3-4% APY yield** on idle liquidity via Aave V3
- **Regulatory compliant** via white-label bank partnerships

---

## 🏗️ **Architecture Overview**

### **Dual-Chain Approach**

1. **Base L2 (Primary)** - Smart contracts, rate locks, Aave yield
   - Chain ID: 8453 (Mainnet), 84532 (Sepolia Testnet)
   - Gas: $0.01-0.10 per transaction
   - RPC: https://mainnet.base.org

2. **XRP Ledger (Secondary)** - Final settlement, ultra-low-cost transfers
   - Network: XRP Mainnet
   - Fees: ~$0.0001 per transaction
   - RPC: wss://xrplcluster.com

### **Technology Stack**

- **Smart Contracts**: Solidity 0.8.20, Hardhat, OpenZeppelin
- **Backend**: Node.js, TypeScript, Express
- **Database**: PostgreSQL + TimescaleDB
- **Cache**: Redis
- **Blockchain**: Base L2, XRP Ledger
- **Oracles**: Chainlink (KES/USD price feeds)
- **DeFi**: Aave V3 (USDC lending)
- **Exchanges**: Binance (spot + futures)
- **Payments**: M-Pesa (Safaricom Daraja API)
- **Monitoring**: Prometheus + Grafana

---

## 📦 **Project Structure**

```
fx-rate-lock-platform/
├── contracts/                 # Smart contracts (Solidity)
│   ├── src/
│   │   ├── RateLockManager.sol
│   │   ├── AavePoolManager.sol
│   │   ├── HedgeManager.sol
│   │   ├── CircuitBreaker.sol
│   │   └── OracleConsumer.sol
│   ├── scripts/
│   │   └── deploy.js
│   ├── test/
│   ├── hardhat.config.js
│   └── package.json
│
├── services/                  # Microservices (Node.js/TypeScript)
│   ├── api-gateway/          # Main API (port 3000)
│   ├── rate-engine/          # Dynamic pricing
│   ├── lock-manager/         # Lock lifecycle management
│   ├── aave-manager/         # Aave V3 integration
│   ├── binance-integration/  # Spot + futures trading
│   ├── xrp-settlement/       # XRP Ledger settlement
│   ├── mpesa-service/        # M-Pesa integration (port 3001)
│   ├── circuit-breaker/      # Risk monitoring
│   ├── notification-service/ # Email + SMS
│   └── analytics/            # Business metrics
│
├── database/
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── SECURITY.md
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 18+ and npm
- Docker & Docker Compose
- PostgreSQL 14+ with TimescaleDB extension
- Redis 7+
- Git

### **1. Clone Repository**

```bash
git clone <repository-url>
cd fx-rate-lock-platform
```

### **2. Environment Setup**

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env
```

**Required variables:**
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `DB_PASSWORD` - Secure database password
- `DEPLOYER_PRIVATE_KEY` - Ethereum wallet private key
- `BINANCE_API_KEY` & `BINANCE_API_SECRET`
- `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_PASSKEY`
- `SENDGRID_API_KEY`, `AFRICAS_TALKING_API_KEY`

### **3. Install Dependencies**

```bash
# Install contract dependencies
cd contracts
npm install

# Install service dependencies (repeat for each service)
cd ../services/api-gateway
npm install
```

### **4. Database Setup**

```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres

# Run migrations
psql -h localhost -U postgres -d fxplatform -f database/migrations/001_initial_schema.sql
```

### **5. Deploy Smart Contracts**

**Testnet (Base Sepolia):**

```bash
cd contracts

# Compile contracts
npm run compile

# Deploy to testnet
npm run deploy:sepolia

# Verify on Basescan
npm run verify:sepolia
```

**Mainnet (Base):**

```bash
# Deploy to mainnet (CAUTION: Real funds)
npm run deploy:mainnet

# Verify on Basescan
npm run verify:mainnet
```

**Update `.env` with deployed contract addresses.**

### **6. Start Services**

**Option A: Docker Compose (Recommended)**

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

**Option B: Manual (Development)**

```bash
# Terminal 1: API Gateway
cd services/api-gateway
npm run dev

# Terminal 2: Rate Engine
cd services/rate-engine
npm run dev

# Terminal 3: Lock Manager
cd services/lock-manager
npm run dev

# ... repeat for other services
```

### **7. Verify Installation**

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Get current rates
curl http://localhost:3000/api/v1/rates/current
```

---

## 📡 **API Endpoints**

### **Authentication**

```http
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/verify
```

### **Rates**

```http
GET    /api/v1/rates/current           # Current rates for all tiers
POST   /api/v1/rates/quote              # Get personalized quote
```

### **Locks**

```http
POST   /api/v1/locks/create             # Create rate lock
GET    /api/v1/locks/:lockId            # Get lock details
GET    /api/v1/locks/user/:userId       # List user's locks
POST   /api/v1/locks/:lockId/execute    # Execute transfer
POST   /api/v1/locks/:lockId/cancel     # Cancel lock
```

### **Transactions**

```http
GET    /api/v1/transactions/:txId       # Get transaction status
GET    /api/v1/transactions/user/:userId # Transaction history
```

**Full API documentation:** See `docs/API.md`

---

## 🔐 **Security**

### **Smart Contract Security**

- ✅ OpenZeppelin battle-tested libraries
- ✅ ReentrancyGuard on all state-changing functions
- ✅ AccessControl for role-based permissions
- ✅ Pausable for emergency shutdown
- ⚠️ **REQUIRED**: Professional audit before mainnet (Trail of Bits, OpenZeppelin)

### **API Security**

- HTTPS only (TLS 1.3)
- JWT authentication (30-day expiry)
- Rate limiting (100 req/min per user)
- Helmet.js security headers
- Input validation with Zod
- SQL injection prevention (parameterized queries)

### **Operational Security**

- Private keys in AWS KMS (never in code)
- Hot/cold wallet separation (90% cold storage)
- 2FA for admin accounts
- Audit logging for all privileged operations
- Encrypted PII at rest (AES-256)

**Full security documentation:** See `docs/SECURITY.md`

---

## 🧪 **Testing**

### **Smart Contract Tests**

```bash
cd contracts

# Run all tests
npm test

# Coverage report
npm run test:coverage

# Gas report
REPORT_GAS=true npm test
```

### **Integration Tests**

```bash
cd services/api-gateway

# Run tests
npm test

# Watch mode
npm run test:watch
```

### **Load Testing**

```bash
# Simulate 1000 concurrent users
artillery run tests/load/rate-quotes.yml
```

---

## 📊 **Monitoring**

### **Grafana Dashboards**

Access: http://localhost:3030 (admin / password from `.env`)

**Pre-configured dashboards:**
- Platform Overview (locks, volume, revenue)
- Risk Metrics (exposure, hedge ratios, VaR)
- Operational Metrics (latency, success rates, errors)
- Pool Health (Aave balance, yield, utilization)

### **Prometheus Metrics**

Access: http://localhost:9090

**Key metrics:**
- `locks_created_total`
- `locks_executed_total`
- `settlement_duration_seconds`
- `pool_utilization_percent`
- `hedge_ratio_percent`

---

## 🔄 **Transaction Flow**

### **Example: $1,000 USD Transfer**

1. **User requests quote**
   - API: `POST /api/v1/rates/quote`
   - Response: 127 KES/USD (saves 4,000 KES vs bank's 131)

2. **User creates lock**
   - API: `POST /api/v1/locks/create`
   - Smart contract: `RateLockManager.createLock()`
   - Lock valid for 30 days

3. **User initiates M-Pesa payment**
   - API: `POST /api/v1/locks/:lockId/execute`
   - M-Pesa STK Push: 127,000 KES

4. **Backend processes payment**
   - Verify M-Pesa callback
   - Convert KES → USDC on Binance
   - Withdraw from Aave pool
   - Bridge to XRP (if needed)

5. **Settlement**
   - Deliver $1,000 USD to recipient
   - Update lock status: `executed`
   - Send confirmation (email + SMS)
   - **Total time: <15 minutes**

---

## 💰 **Revenue Model**

### **Revenue Streams**

1. **FX Margin**: 0.5-1% embedded in quoted rate
2. **Aave Yield**: 3-4% APY on idle USDC
3. **Hedge Gains**: Profitable hedging on volatility
4. **Netting**: Opposite flow matching (zero cost)

### **Example Economics (Monthly)**

- **Volume**: $1M USD settled
- **FX Margin** (0.75%): $7,500
- **Aave Yield** (3.5% APY on $500K avg): $1,458
- **Hedge Gains** (estimated): $2,000
- **Total Revenue**: ~$11,000/month

**Costs**: Gas fees ($500), exchange fees ($1,000), ops ($3,000)  
**Net Profit**: ~$6,500/month at $1M volume

---

## 🌍 **Deployment**

### **Testnet Deployment**

1. Deploy contracts to Base Sepolia
2. Configure testnet APIs (Binance testnet, M-Pesa sandbox, XRP testnet)
3. Run 100 test transactions
4. Verify all flows work end-to-end

### **Mainnet Deployment**

1. **Smart contract audit** (mandatory)
2. **Insurance coverage** ($1M minimum)
3. **Partner bank agreement** (white-label license)
4. **Regulatory approval** (Kenya, target countries)
5. Deploy to Base mainnet
6. Gradual rollout (beta → production)

**Full deployment guide:** See `docs/DEPLOYMENT.md`

---

## 🛠️ **Development**

### **Adding a New Service**

```bash
# Create service directory
mkdir -p services/my-service/src

# Initialize package.json
cd services/my-service
npm init -y

# Install dependencies
npm install express typescript @types/node

# Create Dockerfile
cat > Dockerfile << EOF
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
EOF

# Add to docker-compose.yml
```

### **Code Style**

- TypeScript strict mode
- ESLint + Prettier
- Conventional Commits
- PR reviews required

---

## 📈 **Roadmap**

### **Phase 1: MVP** (Months 1-2)
- ✅ Smart contracts on testnet
- ✅ Basic API (quote, lock, execute)
- ✅ M-Pesa integration (sandbox)
- ✅ Aave integration (testnet)

### **Phase 2: Beta** (Months 3-4)
- ⏳ Smart contract audit
- ⏳ Mainnet deployment
- ⏳ Automated hedging
- ⏳ 100 beta transactions

### **Phase 3: Production** (Months 5-6)
- ⏳ Partner bank integration
- ⏳ Insurance coverage
- ⏳ Regulatory approval
- ⏳ Marketing launch

### **Phase 4: Scale** (Months 7-12)
- ⏳ Multi-corridor (USD/NGN, USD/INR)
- ⏳ Mobile apps (iOS, Android)
- ⏳ API for third-party integrations
- ⏳ Institutional partnerships

---

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 **License**

MIT License - see `LICENSE` file for details

---

## 📞 **Support**

- **Email**: support@yourplatform.com
- **Docs**: https://docs.yourplatform.com
- **Discord**: https://discord.gg/yourplatform
- **Twitter**: @yourplatform

---

## ⚠️ **Disclaimer**

This platform handles real financial transactions. Always:
- Test thoroughly on testnet before mainnet
- Get professional smart contract audits
- Comply with local regulations
- Maintain adequate insurance coverage
- Never commit private keys to version control

---

**Built with ❤️ for the Africa-Asia remittance corridor**
