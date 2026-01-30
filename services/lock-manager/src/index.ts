import { ethers } from 'ethers';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();

// Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'lock-manager.log' })
    ]
});

// DB Setup
const db = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'fxplatform',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
});

// Blockchain Setup
const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY || '', provider);

const RATE_LOCK_ABI = [
    'function createLock(uint256 usdAmount, uint256 lockedRate, uint256 kesRequired, uint8 lockType) external returns (bytes32 lockId)',
    'function executeLock(bytes32 lockId, bytes32 mpesaTransactionId) external',
    'function cancelLock(bytes32 lockId) external',
    'event LockCreated(bytes32 indexed lockId, address indexed user, uint256 usdAmount, uint256 lockedRate, uint256 kesRequired, uint8 lockType, uint256 expiresAt)',
    'event LockExecuted(bytes32 indexed lockId, address indexed user, bytes32 mpesaTransactionId, uint256 executedAt)'
];

const rateLockContract = new ethers.Contract(
    process.env.RATE_LOCK_CONTRACT_ADDRESS || '',
    RATE_LOCK_ABI,
    wallet
);

/**
 * Sync Database with Blockchain Events
 */
async function startEventListener() {
    logger.info('Starting Blockchain Event Listener...');

    rateLockContract.on('LockCreated', async (lockId, user, usdAmount, lockedRate, kesRequired, lockType, expiresAt, event) => {
        logger.info(`On-chain LockCreated detected: ${lockId}`);

        try {
            // Find the pending lock in DB by values (since we don't have the on-chain ID yet)
            // In a real system, we'd use a temporary ID or a quote ID to match
            await db.query(
                `UPDATE locks 
         SET blockchain_lock_id = $1, 
             blockchain_tx_hash = $2,
             status = 'active'
         WHERE quote_id::text = (SELECT quote_id::text FROM locks WHERE status = 'pending' AND usd_amount = $3 LIMIT 1)`,
                [lockId, event.transactionHash, Number(usdAmount) / 1e6]
            );
        } catch (err) {
            logger.error('Error syncing LockCreated event:', err);
        }
    });

    rateLockContract.on('LockExecuted', async (lockId, user, mpesaId, executedAt, event) => {
        logger.info(`On-chain LockExecuted detected: ${lockId}`);

        try {
            await db.query(
                `UPDATE locks 
         SET status = 'executed', 
             executed_at = to_timestamp($1),
             blockchain_tx_hash = $2
         WHERE blockchain_lock_id = $3`,
                [Number(executedAt), event.transactionHash, lockId]
            );
        } catch (err) {
            logger.error('Error syncing LockExecuted event:', err);
        }
    });
}

/**
 * Polling for DB changes to trigger on-chain actions
 */
async function processPendingActions() {
    try {
        // 1. Find locks that need to be created on-chain
        const pendingLocks = await db.query(
            "SELECT * FROM locks WHERE status = 'pending' AND blockchain_lock_id IS NULL"
        );

        for (const lock of pendingLocks.rows) {
            try {
                logger.info(`Creating lock on-chain for DB lock ${lock.lock_id}`);

                // Map lock type string to enum
                const typeMap: Record<string, number> = { 'instant': 0, '7day': 1, '30day': 2 };

                const tx = await rateLockContract.createLock(
                    ethers.parseUnits(lock.usd_amount.toString(), 6),
                    ethers.parseUnits(lock.locked_rate.toString(), 6),
                    ethers.parseUnits(lock.kes_required.toString(), 6),
                    typeMap[lock.lock_type]
                );

                const receipt = await tx.wait();
                logger.info(`On-chain lock created safely. Tx: ${receipt.hash}`);
            } catch (err) {
                logger.error(`Failed to create on-chain lock for ${lock.lock_id}:`, err);
            }
        }

        // 2. Find locks that were paid via M-Pesa but not yet executed on-chain
        // Note: status 'executed' in DB might have been set by the M-Pesa callback service
        // But we need to make sure the blockchain transaction follows.
        // In our schema, we should probably have a 'payment_received' status vs 'executed' (on-chain).
        // Let's assume 'executed' status with null blockchain_tx_hash means it needs on-chain execution.

        const readyForExecution = await db.query(
            "SELECT * FROM locks WHERE status = 'executed' AND mpesa_transaction_id IS NOT NULL AND blockchain_tx_hash IS NULL"
        );

        for (const lock of readyForExecution.rows) {
            try {
                logger.info(`Executing lock on-chain for ${lock.lock_id}`);

                // Convert M-Pesa ID to bytes32 (padded)
                const mpesaBytes32 = ethers.encodeBytes32String(lock.mpesa_transaction_id.substring(0, 31));

                const tx = await rateLockContract.executeLock(
                    lock.blockchain_lock_id,
                    mpesaBytes32
                );

                const receipt = await tx.wait();
                logger.info(`On-chain lock execution successful. Tx: ${receipt.hash}`);

                // Update DB with the TX hash
                await db.query(
                    "UPDATE locks SET blockchain_tx_hash = $1 WHERE lock_id = $2",
                    [receipt.hash, lock.lock_id]
                );
            } catch (err) {
                logger.error(`Failed to execute on-chain lock for ${lock.lock_id}:`, err);
            }
        }

    } catch (err) {
        logger.error('Error in processPendingActions loop:', err);
    } finally {
        setTimeout(processPendingActions, 5000); // Poll every 5 seconds
    }
}

async function start() {
    await startEventListener();
    processPendingActions();
    logger.info('Lock Manager Service is running...');
}

start().catch(err => {
    logger.error('Lock Manager Fatal Error:', err);
    process.exit(1);
});
