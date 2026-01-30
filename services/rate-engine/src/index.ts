import { createClient } from 'redis';
import { Pool } from 'pg';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// ============================================================================
// INTERFACES
// ============================================================================

interface RateQuote {
    usdAmount: number;
    lockType: 'instant' | '7day' | '30day';
    midMarketRate: number;
    quotedRate: number;
    kesRequired: number;
    expiresAt: Date;
    savings: {
        vsBank: number;
        percentage: number;
    };
    spread: number;
    volatilityAdjustment: number;
    utilizationAdjustment: number;
}

interface MarketCondition {
    volatility: number;
    poolUtilization: number;
    circuitBreakerStatus: string;
    spreadAdjustment: number;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const BANK_RATE = 131.0; // KES per USD (reference bank rate)

const BASE_SPREADS = {
    instant: 0.8,
    '7day': 1.4,
    '30day': 2.2,
};

const VOLATILITY_THRESHOLDS = {
    low: 1.0,      // < 1% = low volatility
    medium: 2.0,   // 1-2% = medium
    high: 3.0,     // 2-3% = high
    extreme: 5.0,  // > 5% = extreme
};

// ============================================================================
// CLIENTS
// ============================================================================

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

const db = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'fxplatform',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
});

const provider = new ethers.JsonRpcProvider(
    process.env.BASE_RPC_URL || 'https://mainnet.base.org'
);

// ============================================================================
// ORACLE INTEGRATION
// ============================================================================

const ORACLE_ABI = [
    'function getLatestKESUSDRate() external view returns (uint256 rate, uint256 timestamp)',
    'function calculateVolatility(uint256 periods) external view returns (uint256)',
];

async function getChainlinkRate(): Promise<number> {
    try {
        const oracleAddress = process.env.ORACLE_CONTRACT_ADDRESS;
        if (!oracleAddress) {
            console.warn('Oracle contract not configured, using fallback rate');
            return 129.5; // Fallback rate
        }

        const oracle = new ethers.Contract(oracleAddress, ORACLE_ABI, provider);
        const [rate] = await oracle.getLatestKESUSDRate();

        // Convert from 8 decimals to regular number
        return Number(rate) / 1e8;
    } catch (error) {
        console.error('Error fetching Chainlink rate:', error);

        // Fallback to database
        const result = await db.query(
            `SELECT mid_market FROM rate_history 
       WHERE source = 'chainlink' 
       ORDER BY time DESC LIMIT 1`
        );

        return result.rows[0]?.mid_market || 129.5;
    }
}

async function calculate7DayVolatility(): Promise<number> {
    try {
        const result = await db.query(
            `SELECT mid_market FROM rate_history 
       WHERE time >= NOW() - INTERVAL '7 days'
       ORDER BY time ASC`
        );

        if (result.rows.length < 2) {
            return 0;
        }

        const rates = result.rows.map(r => r.mid_market);
        const startRate = rates[0];
        const endRate = rates[rates.length - 1];

        const change = Math.abs((endRate - startRate) / startRate) * 100;
        return change;
    } catch (error) {
        console.error('Error calculating volatility:', error);
        return 0;
    }
}

// ============================================================================
// POOL UTILIZATION
// ============================================================================

async function getPoolUtilization(): Promise<number> {
    try {
        const result = await db.query(
            `SELECT utilization_percent FROM pool_snapshots 
       ORDER BY snapshot_at DESC LIMIT 1`
        );

        return result.rows[0]?.utilization_percent || 0;
    } catch (error) {
        console.error('Error fetching pool utilization:', error);
        return 0;
    }
}

// ============================================================================
// MARKET CONDITION ANALYSIS
// ============================================================================

async function analyzeMarketCondition(): Promise<MarketCondition> {
    const volatility = await calculate7DayVolatility();
    const poolUtilization = await getPoolUtilization();

    // Determine circuit breaker status
    let circuitBreakerStatus = 'NORMAL';
    let spreadAdjustment = 0;

    if (volatility >= VOLATILITY_THRESHOLDS.extreme) {
        circuitBreakerStatus = 'EXTREME';
        spreadAdjustment = 0; // Locks paused
    } else if (volatility >= VOLATILITY_THRESHOLDS.high) {
        circuitBreakerStatus = 'HIGH_VOLATILITY';
        spreadAdjustment = -0.6; // Narrow spread
    }

    return {
        volatility,
        poolUtilization,
        circuitBreakerStatus,
        spreadAdjustment,
    };
}

// ============================================================================
// RATE CALCULATION
// ============================================================================

export async function calculateQuote(
    usdAmount: number,
    lockType: 'instant' | '7day' | '30day'
): Promise<RateQuote> {
    // Get mid-market rate
    const midMarketRate = await getChainlinkRate();

    // Analyze market conditions
    const marketCondition = await analyzeMarketCondition();

    // Base spread for lock type
    let spread = BASE_SPREADS[lockType];

    // Volatility adjustment
    let volatilityAdjustment = 0;
    if (marketCondition.volatility > VOLATILITY_THRESHOLDS.high) {
        volatilityAdjustment = -0.6; // Narrow spread in high volatility
    } else if (marketCondition.volatility < VOLATILITY_THRESHOLDS.low) {
        volatilityAdjustment = 0.2; // Widen spread in low volatility
    }

    // Pool utilization adjustment
    let utilizationAdjustment = 0;
    if (marketCondition.poolUtilization > 70) {
        utilizationAdjustment = -0.4; // Narrow spread when low liquidity
    } else if (marketCondition.poolUtilization < 30) {
        utilizationAdjustment = 0.3; // Widen spread when high liquidity
    }

    // Apply circuit breaker adjustment
    spread += marketCondition.spreadAdjustment;

    // Apply other adjustments
    spread += volatilityAdjustment + utilizationAdjustment;

    // Ensure minimum spread
    spread = Math.max(spread, 0.3);

    // Calculate quoted rate (customer pays this rate)
    const quotedRate = midMarketRate - spread;

    // Calculate KES required
    const kesRequired = usdAmount * quotedRate;

    // Calculate savings vs bank
    const bankTotal = usdAmount * BANK_RATE;
    const ourTotal = kesRequired;
    const savings = bankTotal - ourTotal;
    const savingsPercentage = (savings / bankTotal) * 100;

    // Quote expires in 2 minutes
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    return {
        usdAmount,
        lockType,
        midMarketRate,
        quotedRate,
        kesRequired,
        expiresAt,
        savings: {
            vsBank: savings,
            percentage: savingsPercentage,
        },
        spread,
        volatilityAdjustment,
        utilizationAdjustment,
    };
}

// ============================================================================
// CACHING
// ============================================================================

async function cacheQuote(quote: RateQuote): Promise<string> {
    const quoteId = `quote:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;

    await redisClient.setEx(
        quoteId,
        120, // 2 minutes TTL
        JSON.stringify(quote)
    );

    return quoteId;
}

async function getQuoteFromCache(quoteId: string): Promise<RateQuote | null> {
    const cached = await redisClient.get(quoteId);

    if (!cached) {
        return null;
    }

    return JSON.parse(cached);
}

// ============================================================================
// RATE HISTORY RECORDING
// ============================================================================

async function recordRateHistory(quote: RateQuote): Promise<void> {
    try {
        await db.query(
            `INSERT INTO rate_history 
       (time, source, mid_market, instant_quote, day7_quote, day30_quote, spread_bps)
       VALUES (NOW(), 'rate_engine', $1, $2, $3, $4, $5)`,
            [
                quote.midMarketRate,
                quote.lockType === 'instant' ? quote.quotedRate : null,
                quote.lockType === '7day' ? quote.quotedRate : null,
                quote.lockType === '30day' ? quote.quotedRate : null,
                Math.round(quote.spread * 100), // Convert to basis points
            ]
        );
    } catch (error) {
        console.error('Error recording rate history:', error);
    }
}

// ============================================================================
// MAIN SERVICE
// ============================================================================

async function startRateEngine() {
    try {
        // Connect to Redis
        await redisClient.connect();
        console.log('✅ Redis connected');

        // Test database
        await db.query('SELECT NOW()');
        console.log('✅ Database connected');

        // Test blockchain connection
        const blockNumber = await provider.getBlockNumber();
        console.log(`✅ Base L2 connected (block: ${blockNumber})`);

        console.log('🚀 Rate Engine started');

        // Update rates every 30 seconds
        setInterval(async () => {
            try {
                const midMarket = await getChainlinkRate();
                const volatility = await calculate7DayVolatility();
                const utilization = await getPoolUtilization();

                console.log(`📊 Rate: ${midMarket.toFixed(4)} KES/USD | Volatility: ${volatility.toFixed(2)}% | Pool: ${utilization.toFixed(1)}%`);

                // Cache current rates for quick access
                const instantQuote = await calculateQuote(1000, 'instant');
                const day7Quote = await calculateQuote(1000, '7day');
                const day30Quote = await calculateQuote(1000, '30day');

                await redisClient.setEx(
                    'current_rates',
                    60,
                    JSON.stringify({
                        midMarket,
                        instant: instantQuote.quotedRate,
                        day7: day7Quote.quotedRate,
                        day30: day30Quote.quotedRate,
                        volatility,
                        utilization,
                        timestamp: new Date().toISOString(),
                    })
                );
            } catch (error) {
                console.error('Error updating rates:', error);
            }
        }, 30000);

    } catch (error) {
        console.error('❌ Failed to start Rate Engine:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down...');
    await redisClient.quit();
    await db.end();
    process.exit(0);
});

// Start the service
startRateEngine();

// Export for use by other services
export {
    getChainlinkRate,
    calculate7DayVolatility,
    getPoolUtilization,
    analyzeMarketCondition,
    cacheQuote,
    getQuoteFromCache,
    recordRateHistory,
};
