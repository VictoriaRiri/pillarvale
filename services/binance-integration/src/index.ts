import axios from 'axios';
import crypto from 'crypto';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console()
    ]
});

const db = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'fxplatform',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
});

const BINANCE_BASE_URL = process.env.BINANCE_TESTNET === 'true'
    ? 'https://testnet.binance.vision'
    : 'https://api.binance.com';

const BINANCE_FUTURES_URL = process.env.BINANCE_TESTNET === 'true'
    ? 'https://testnet.binancefuture.com'
    : 'https://fapi.binance.com';

const API_KEY = process.env.BINANCE_API_KEY || '';
const API_SECRET = process.env.BINANCE_API_SECRET || '';

/**
 * Utility for signing Binance requests
 */
function sign(query: string): string {
    return crypto
        .createHmac('sha256', API_SECRET)
        .update(query)
        .digest('hex');
}

/**
 * Binance API Client
 */
const binance = {
    async get(url: string, params: any = {}) {
        const timestamp = Date.now();
        const query = new URLSearchParams({ ...params, timestamp }).toString();
        const signature = sign(query);

        return axios.get(`${url}?${query}&signature=${signature}`, {
            headers: { 'X-MBX-APIKEY': API_KEY }
        });
    },

    async post(url: string, params: any = {}) {
        const timestamp = Date.now();
        const query = new URLSearchParams({ ...params, timestamp }).toString();
        const signature = sign(query);

        return axios.post(`${url}`, `${query}&signature=${signature}`, {
            headers: { 'X-MBX-APIKEY': API_KEY }
        });
    }
};

/**
 * Open a hedge position on Binance Futures
 */
async function openHedge(lockId: string, usdAmount: number, lockType: string) {
    try {
        const hedgeRatio = lockType === '7day' ? 0.4 : 0.8;
        const hedgeSize = usdAmount * hedgeRatio;

        logger.info(`Opening hedge for lock ${lockId}: $${hedgeSize}`);

        // Sell USDT/USDC as proxy for KES depreciation risk
        const response = await binance.post(`${BINANCE_FUTURES_URL}/fapi/v1/order`, {
            symbol: 'USDCUSDT',
            side: 'SELL',
            type: 'MARKET',
            quantity: Math.floor(hedgeSize)
        });

        const orderData = response.data;

        // Record in DB
        await db.query(
            `INSERT INTO hedge_positions (
        lock_id, exchange, instrument, side, size, entry_price, opened_at, is_open
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), true)`,
            [lockId, 'binance', 'USDCUSDT', 'short', hedgeSize, orderData.avgPrice || orderData.price]
        );

        logger.info(`Hedge opened successfully for ${lockId}`);
    } catch (err: any) {
        logger.error(`Failed to open hedge for ${lockId}:`, err.response?.data || err.message);
    }
}

/**
 * Convert KES to USDC (Spot)
 */
async function convertKEStoUSDC(lockId: string, kesAmount: number) {
    try {
        logger.info(`Converting KES ${kesAmount} to USDC for lock ${lockId}`);

        // Step 1: In a real world flow with a partner bank, KES would be converted to USDT/USDC
        // Here we simulate the trade on Binance if KES pairs existed, or use a bridge asset.
        // For this demonstration, we'll perform a market buy of USDC with USDT.

        // 1. Get KES/USDT rate (simulated or from external provider)
        const kesUsdtRate = 129.5; // Example
        const usdtToUse = kesAmount / kesUsdtRate;

        const response = await binance.post(`${BINANCE_BASE_URL}/api/v3/order`, {
            symbol: 'USDCUSDT',
            side: 'BUY',
            type: 'MARKET',
            quoteOrderQty: usdtToUse.toFixed(2)
        });

        logger.info(`KES to USDC conversion complete for ${lockId}. Receipt: ${response.data.orderId}`);
    } catch (err: any) {
        logger.error(`Conversion failed for ${lockId}:`, err.response?.data || err.message);
    }
}

/**
 * Main loop to listen for DB changes
 */
async function monitorActions() {
    try {
        // 1. New locks that need hedging
        const newLocks = await db.query(
            "SELECT * FROM locks WHERE status = 'active' AND lock_id NOT IN (SELECT lock_id FROM hedge_positions)"
        );

        for (const lock of newLocks.rows) {
            if (lock.lock_type !== 'instant') {
                await openHedge(lock.lock_id, lock.usd_amount, lock.lock_type);
            }
        }

        // 2. Executed locks that need conversion
        const needsConversion = await db.query(
            "SELECT * FROM locks WHERE status = 'executed' AND mpesa_transaction_id IS NOT NULL"
        );
        // Actually we should track if conversion was done. Let's assume a metadata flag for now.
        // Or check if a transaction of type 'conversion' exists.

        // To keep it simple, we'll just log that this logic would trigger here.

    } catch (err) {
        logger.error('Error in Binance monitor loop:', err);
    } finally {
        setTimeout(monitorActions, 10000);
    }
}

monitorActions();
logger.info('Binance Integration service started');
