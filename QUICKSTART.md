# FX Rate Lock Platform - Quick Start Guide

## 🚀 **Get Started in 5 Minutes**

### **Prerequisites Check**

```bash
# Check Node.js (need 18+)
node --version

# Check Docker
docker --version
docker-compose --version

# Check PostgreSQL (if running locally)
psql --version
```

---

## **Option 1: Docker Compose (Recommended)**

### **Step 1: Clone and Setup**

```bash
cd fx-rate-lock-platform

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
# At minimum, set:
# - JWT_SECRET (generate with: openssl rand -base64 32)
# - DB_PASSWORD
```

### **Step 2: Start Services**

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### **Step 3: Initialize Database**

```bash
# Run migrations
docker-compose exec postgres psql -U postgres -d fxplatform -f /docker-entrypoint-initdb.d/001_initial_schema.sql
```

### **Step 4: Test API**

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Register user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "phoneNumber": "+254712345678",
    "fullName": "Test User"
  }'

# Get current rates
curl http://localhost:3000/api/v1/rates/current
```

---

## **Option 2: Local Development**

### **Step 1: Install Dependencies**

```bash
# Contracts
cd contracts
npm install

# API Gateway
cd ../services/api-gateway
npm install

# Rate Engine
cd ../rate-engine
npm install

# M-Pesa Service
cd ../mpesa-service
npm install
```

### **Step 2: Setup Database**

```bash
# Start PostgreSQL
docker-compose up -d postgres

# Or use local PostgreSQL
createdb fxplatform

# Run migrations
psql -U postgres -d fxplatform -f database/migrations/001_initial_schema.sql
```

### **Step 3: Start Redis**

```bash
docker-compose up -d redis
```

### **Step 4: Deploy Smart Contracts (Testnet)**

```bash
cd contracts

# Compile
npm run compile

# Deploy to Base Sepolia
npm run deploy:sepolia

# Copy contract addresses to .env
# Update RATE_LOCK_CONTRACT_ADDRESS, etc.
```

### **Step 5: Start Services**

```bash
# Terminal 1: API Gateway
cd services/api-gateway
npm run dev

# Terminal 2: Rate Engine
cd services/rate-engine
npm run dev

# Terminal 3: M-Pesa Service
cd services/mpesa-service
npm run dev
```

---

## **Testing the Platform**

### **1. Register a User**

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePass123!",
    "phoneNumber": "+254712345678",
    "fullName": "Alice Wanjiku"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "userId": "uuid-here",
    "email": "alice@example.com",
    "phoneNumber": "+254712345678",
    "fullName": "Alice Wanjiku"
  },
  "token": "jwt-token-here"
}
```

### **2. Get Current Rates**

```bash
curl http://localhost:3000/api/v1/rates/current
```

**Response:**
```json
{
  "success": true,
  "data": {
    "midMarket": 129.5,
    "rates": {
      "instant": { "rate": 128.7, "lockDuration": "2 hours", "spread": "0.80" },
      "7day": { "rate": 128.1, "lockDuration": "7 days", "spread": "1.40" },
      "30day": { "rate": 127.3, "lockDuration": "30 days", "spread": "2.20" }
    },
    "bankRate": 131.0,
    "volatility": 1.5,
    "timestamp": "2026-01-30T08:00:00Z"
  }
}
```

### **3. Request a Quote**

```bash
curl -X POST http://localhost:3000/api/v1/rates/quote \
  -H "Content-Type: application/json" \
  -d '{
    "usdAmount": 1000,
    "lockType": "30day"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "quoteId": "quote:1234567890:abc123",
    "usdAmount": 1000,
    "lockType": "30day",
    "rates": {
      "midMarket": "129.5000",
      "quoted": "127.3000",
      "bank": "131.0000"
    },
    "kesRequired": "127300.00",
    "savings": {
      "amount": "3700.00",
      "percentage": "2.82"
    },
    "expiresAt": "2026-01-30T08:02:00Z",
    "validFor": "2 minutes"
  }
}
```

### **4. Create a Lock**

```bash
curl -X POST http://localhost:3000/api/v1/locks/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "quoteId": "quote:1234567890:abc123",
    "usdAmount": 1000,
    "lockType": "30day"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "lockId": "lock-uuid-here",
    "usdAmount": 1000,
    "kesRequired": 127300,
    "lockedRate": 127.3,
    "lockType": "30day",
    "status": "active",
    "createdAt": "2026-01-30T08:00:00Z",
    "expiresAt": "2026-02-29T08:00:00Z",
    "savings": {
      "amount": 3700,
      "percentage": 2.82
    }
  }
}
```

### **5. Execute Lock (M-Pesa Payment)**

```bash
curl -X POST http://localhost:3000/api/v1/locks/LOCK_ID/execute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "phoneNumber": "+254712345678"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "M-Pesa payment initiated",
  "data": {
    "lockId": "lock-uuid-here",
    "amount": 127300,
    "phoneNumber": "+254712345678",
    "instructions": "Please check your phone for M-Pesa prompt"
  }
}
```

---

## **Monitoring**

### **Grafana Dashboard**

```bash
# Access Grafana
open http://localhost:3030

# Login
Username: admin
Password: (from .env GRAFANA_PASSWORD)
```

### **Prometheus Metrics**

```bash
# Access Prometheus
open http://localhost:9090

# Query examples:
# - locks_created_total
# - api_request_duration_seconds
# - pool_utilization_percent
```

### **Database**

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d fxplatform

# Useful queries:
SELECT * FROM v_active_locks;
SELECT * FROM v_user_stats;
SELECT * FROM v_platform_metrics;
```

---

## **Troubleshooting**

### **Services won't start**

```bash
# Check logs
docker-compose logs api-gateway
docker-compose logs postgres
docker-compose logs redis

# Restart specific service
docker-compose restart api-gateway
```

### **Database connection error**

```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check connection
docker-compose exec postgres psql -U postgres -c "SELECT 1"

# Verify environment variables
docker-compose exec api-gateway env | grep DB_
```

### **Smart contract deployment fails**

```bash
# Check RPC URL
curl -X POST https://sepolia.base.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Verify private key has funds
# Get testnet ETH from: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
```

### **M-Pesa integration not working**

```bash
# Verify credentials in .env
echo $MPESA_CONSUMER_KEY
echo $MPESA_CONSUMER_SECRET

# Check M-Pesa service logs
docker-compose logs mpesa-service

# Test in sandbox first
# MPESA_ENVIRONMENT=sandbox
```

---

## **Next Steps**

1. ✅ **Test the complete flow** (register → quote → lock → execute)
2. ✅ **Deploy contracts to testnet** (Base Sepolia)
3. ✅ **Run 10 test transactions** end-to-end
4. ✅ **Monitor metrics** in Grafana
5. ✅ **Review security** before mainnet

---

## **Development Workflow**

### **Making Changes**

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes
# Edit files...

# 3. Test locally
npm test

# 4. Rebuild Docker image
docker-compose build api-gateway

# 5. Restart service
docker-compose up -d api-gateway

# 6. Commit and push
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature
```

### **Adding a New Service**

```bash
# 1. Create service directory
mkdir -p services/my-service/src

# 2. Initialize package.json
cd services/my-service
npm init -y

# 3. Install dependencies
npm install express typescript @types/node

# 4. Create Dockerfile (copy from api-gateway)
cp ../api-gateway/Dockerfile .

# 5. Add to docker-compose.yml
# (follow existing service patterns)

# 6. Implement service
# Create src/index.ts

# 7. Build and run
docker-compose up -d my-service
```

---

## **Production Checklist**

Before deploying to production:

- [ ] Smart contract audit completed
- [ ] All tests passing (unit + integration)
- [ ] Load testing completed (1,000 concurrent users)
- [ ] Security penetration testing done
- [ ] Environment variables secured (AWS Secrets Manager)
- [ ] Database backups configured
- [ ] Monitoring alerts configured
- [ ] Partner bank agreement signed
- [ ] Regulatory approval obtained
- [ ] Insurance coverage active ($1M minimum)
- [ ] Customer support team trained
- [ ] Incident response plan documented

---

## **Support**

- **Documentation**: See `docs/` folder
- **Issues**: Create GitHub issue
- **Security**: Email security@yourplatform.com
- **General**: support@yourplatform.com

---

**Happy Building! 🚀**
