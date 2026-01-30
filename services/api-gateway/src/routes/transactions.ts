import { Router, Request, Response } from 'express';
import { db } from '../server';
import { authenticate, AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

// ============================================================================
// GET TRANSACTION BY ID
// ============================================================================
router.get('/:txId', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { txId } = req.params;
        const userId = req.userId;

        const result = await db.query(
            `SELECT t.*, l.usd_amount, l.locked_rate
       FROM transactions t
       LEFT JOIN locks l ON t.lock_id = l.lock_id
       WHERE t.tx_id = $1 AND t.user_id = $2`,
            [txId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found',
            });
        }

        const tx = result.rows[0];

        res.json({
            success: true,
            data: {
                txId: tx.tx_id,
                lockId: tx.lock_id,
                type: tx.type,
                status: tx.status,
                usdAmount: parseFloat(tx.usd_amount),
                kesAmount: parseFloat(tx.kes_amount),
                exchangeRate: parseFloat(tx.exchange_rate),
                feeAmount: parseFloat(tx.fee_amount),
                mpesaTransactionId: tx.mpesa_transaction_id,
                blockchainTxHash: tx.blockchain_tx_hash,
                createdAt: tx.created_at,
                completedAt: tx.completed_at,
                errorMessage: tx.error_message,
                metadata: tx.metadata,
            },
        });
    } catch (error) {
        logger.error('Error fetching transaction:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});

// ============================================================================
// GET USER'S TRANSACTION HISTORY
// ============================================================================
router.get('/user/:userId', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;

        // Verify user can only access their own transactions
        if (userId !== req.userId) {
            return res.status(403).json({
                success: false,
                error: 'Forbidden',
                message: 'You can only access your own transactions',
            });
        }

        const { type, status, limit = 50, offset = 0 } = req.query;

        let query = `
      SELECT t.*, l.locked_rate
      FROM transactions t
      LEFT JOIN locks l ON t.lock_id = l.lock_id
      WHERE t.user_id = $1
    `;

        const params: any[] = [userId];

        if (type) {
            query += ` AND t.type = $${params.length + 1}`;
            params.push(type);
        }

        if (status) {
            query += ` AND t.status = $${params.length + 1}`;
            params.push(status);
        }

        query += ` ORDER BY t.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await db.query(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) FROM transactions WHERE user_id = $1';
        const countParams: any[] = [userId];

        if (type) {
            countQuery += ` AND type = $${countParams.length + 1}`;
            countParams.push(type);
        }

        if (status) {
            countQuery += ` AND status = $${countParams.length + 1}`;
            countParams.push(status);
        }

        const countResult = await db.query(countQuery, countParams);
        const totalCount = parseInt(countResult.rows[0].count);

        res.json({
            success: true,
            data: {
                transactions: result.rows.map(tx => ({
                    txId: tx.tx_id,
                    lockId: tx.lock_id,
                    type: tx.type,
                    status: tx.status,
                    usdAmount: tx.usd_amount ? parseFloat(tx.usd_amount) : null,
                    kesAmount: tx.kes_amount ? parseFloat(tx.kes_amount) : null,
                    exchangeRate: tx.exchange_rate ? parseFloat(tx.exchange_rate) : null,
                    feeAmount: parseFloat(tx.fee_amount || 0),
                    createdAt: tx.created_at,
                    completedAt: tx.completed_at,
                    mpesaTransactionId: tx.mpesa_transaction_id,
                })),
                pagination: {
                    limit: parseInt(limit as string),
                    offset: parseInt(offset as string),
                    total: totalCount,
                    hasMore: parseInt(offset as string) + result.rows.length < totalCount,
                },
            },
        });
    } catch (error) {
        logger.error('Error fetching transaction history:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});

// ============================================================================
// GET TRANSACTION STATISTICS
// ============================================================================
router.get('/user/:userId/stats', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;

        if (userId !== req.userId) {
            return res.status(403).json({
                success: false,
                error: 'Forbidden',
            });
        }

        const result = await db.query(
            `SELECT 
        COUNT(*) as total_transactions,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_transactions,
        COUNT(*) FILTER (WHERE status = 'failed') as failed_transactions,
        SUM(usd_amount) FILTER (WHERE status = 'completed') as total_usd_volume,
        SUM(kes_amount) FILTER (WHERE status = 'completed') as total_kes_volume,
        SUM(fee_amount) as total_fees_paid
       FROM transactions
       WHERE user_id = $1`,
            [userId]
        );

        const stats = result.rows[0];

        // Get savings from locks
        const savingsResult = await db.query(
            `SELECT SUM(savings_amount) as total_savings
       FROM locks
       WHERE user_id = $1 AND status = 'executed'`,
            [userId]
        );

        res.json({
            success: true,
            data: {
                totalTransactions: parseInt(stats.total_transactions),
                completedTransactions: parseInt(stats.completed_transactions),
                failedTransactions: parseInt(stats.failed_transactions),
                totalUsdVolume: parseFloat(stats.total_usd_volume || 0),
                totalKesVolume: parseFloat(stats.total_kes_volume || 0),
                totalFeesPaid: parseFloat(stats.total_fees_paid || 0),
                totalSavings: parseFloat(savingsResult.rows[0].total_savings || 0),
                successRate: stats.total_transactions > 0
                    ? (stats.completed_transactions / stats.total_transactions * 100).toFixed(2)
                    : 0,
            },
        });
    } catch (error) {
        logger.error('Error fetching transaction stats:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});

export default router;
