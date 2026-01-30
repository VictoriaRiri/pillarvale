// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title RateLockManager
 * @notice Core contract for managing FX rate locks
 * @dev Handles creation, execution, and cancellation of rate locks
 */
contract RateLockManager is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant CIRCUIT_BREAKER_ROLE = keccak256("CIRCUIT_BREAKER_ROLE");

    enum LockType { INSTANT, SEVEN_DAY, THIRTY_DAY }
    enum LockStatus { PENDING, ACTIVE, EXECUTED, CANCELLED, EXPIRED }

    struct Lock {
        bytes32 lockId;
        address user;
        uint256 usdAmount;          // USD amount in 6 decimals (USDC standard)
        uint256 lockedRate;         // KES per USD, scaled by 1e6
        uint256 kesRequired;        // Total KES customer must pay, scaled by 1e6
        LockType lockType;
        LockStatus status;
        uint256 createdAt;
        uint256 expiresAt;
        bytes32 mpesaTransactionId;
        uint256 executedAt;
    }

    // Storage
    mapping(bytes32 => Lock) public locks;
    mapping(address => bytes32[]) public userLocks;
    mapping(bytes32 => bool) public usedMpesaIds;
    
    uint256 public totalLocksCreated;
    uint256 public totalLocksExecuted;
    uint256 public totalUsdLocked;
    uint256 public totalUsdSettled;

    // Lock duration constants (in seconds)
    uint256 public constant INSTANT_LOCK_DURATION = 2 hours;
    uint256 public constant SEVEN_DAY_LOCK_DURATION = 7 days;
    uint256 public constant THIRTY_DAY_LOCK_DURATION = 30 days;

    // Limits
    uint256 public minUsdAmount = 10 * 1e6;      // $10 minimum
    uint256 public maxUsdAmount = 50000 * 1e6;   // $50,000 maximum
    uint256 public maxActiveLocksPerUser = 10;

    // Events
    event LockCreated(
        bytes32 indexed lockId,
        address indexed user,
        uint256 usdAmount,
        uint256 lockedRate,
        uint256 kesRequired,
        LockType lockType,
        uint256 expiresAt
    );

    event LockExecuted(
        bytes32 indexed lockId,
        address indexed user,
        bytes32 mpesaTransactionId,
        uint256 executedAt
    );

    event LockCancelled(
        bytes32 indexed lockId,
        address indexed user,
        uint256 cancelledAt
    );

    event LockExpired(
        bytes32 indexed lockId,
        address indexed user,
        uint256 expiredAt
    );

    event LimitsUpdated(
        uint256 minUsdAmount,
        uint256 maxUsdAmount,
        uint256 maxActiveLocksPerUser
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        _grantRole(CIRCUIT_BREAKER_ROLE, msg.sender);
    }

    /**
     * @notice Create a new rate lock
     * @param usdAmount Amount in USD (6 decimals)
     * @param lockedRate KES per USD rate (6 decimals)
     * @param kesRequired Total KES required (6 decimals)
     * @param lockType Type of lock (0=instant, 1=7day, 2=30day)
     * @return lockId Unique identifier for the lock
     */
    function createLock(
        uint256 usdAmount,
        uint256 lockedRate,
        uint256 kesRequired,
        LockType lockType
    ) external whenNotPaused nonReentrant returns (bytes32 lockId) {
        require(usdAmount >= minUsdAmount, "Amount below minimum");
        require(usdAmount <= maxUsdAmount, "Amount exceeds maximum");
        require(lockedRate > 0, "Invalid rate");
        require(kesRequired > 0, "Invalid KES amount");

        // Check user's active locks
        uint256 activeLocks = _getActiveLocksCount(msg.sender);
        require(activeLocks < maxActiveLocksPerUser, "Too many active locks");

        // Generate unique lock ID
        lockId = keccak256(
            abi.encodePacked(
                msg.sender,
                usdAmount,
                lockedRate,
                block.timestamp,
                totalLocksCreated
            )
        );

        // Calculate expiry
        uint256 expiresAt = block.timestamp + _getLockDuration(lockType);

        // Create lock
        locks[lockId] = Lock({
            lockId: lockId,
            user: msg.sender,
            usdAmount: usdAmount,
            lockedRate: lockedRate,
            kesRequired: kesRequired,
            lockType: lockType,
            status: LockStatus.ACTIVE,
            createdAt: block.timestamp,
            expiresAt: expiresAt,
            mpesaTransactionId: bytes32(0),
            executedAt: 0
        });

        userLocks[msg.sender].push(lockId);
        totalLocksCreated++;
        totalUsdLocked += usdAmount;

        emit LockCreated(
            lockId,
            msg.sender,
            usdAmount,
            lockedRate,
            kesRequired,
            lockType,
            expiresAt
        );

        return lockId;
    }

    /**
     * @notice Execute a rate lock after M-Pesa payment
     * @param lockId Lock identifier
     * @param mpesaTransactionId M-Pesa transaction ID
     */
    function executeLock(
        bytes32 lockId,
        bytes32 mpesaTransactionId
    ) external onlyRole(OPERATOR_ROLE) nonReentrant {
        Lock storage lock = locks[lockId];
        
        require(lock.status == LockStatus.ACTIVE, "Lock not active");
        require(block.timestamp <= lock.expiresAt, "Lock expired");
        require(!usedMpesaIds[mpesaTransactionId], "M-Pesa ID already used");
        require(mpesaTransactionId != bytes32(0), "Invalid M-Pesa ID");

        lock.status = LockStatus.EXECUTED;
        lock.mpesaTransactionId = mpesaTransactionId;
        lock.executedAt = block.timestamp;
        
        usedMpesaIds[mpesaTransactionId] = true;
        totalLocksExecuted++;
        totalUsdSettled += lock.usdAmount;

        emit LockExecuted(lockId, lock.user, mpesaTransactionId, block.timestamp);
    }

    /**
     * @notice Cancel an active lock
     * @param lockId Lock identifier
     */
    function cancelLock(bytes32 lockId) external nonReentrant {
        Lock storage lock = locks[lockId];
        
        require(lock.user == msg.sender, "Not lock owner");
        require(lock.status == LockStatus.ACTIVE, "Lock not active");

        lock.status = LockStatus.CANCELLED;

        emit LockCancelled(lockId, msg.sender, block.timestamp);
    }

    /**
     * @notice Mark expired locks (called by backend cron)
     * @param lockIds Array of lock IDs to check
     */
    function markExpiredLocks(bytes32[] calldata lockIds) 
        external 
        onlyRole(OPERATOR_ROLE) 
    {
        for (uint256 i = 0; i < lockIds.length; i++) {
            Lock storage lock = locks[lockIds[i]];
            
            if (
                lock.status == LockStatus.ACTIVE &&
                block.timestamp > lock.expiresAt
            ) {
                lock.status = LockStatus.EXPIRED;
                emit LockExpired(lockIds[i], lock.user, block.timestamp);
            }
        }
    }

    /**
     * @notice Get lock details
     * @param lockId Lock identifier
     * @return lock Lock struct
     */
    function getLock(bytes32 lockId) external view returns (Lock memory) {
        return locks[lockId];
    }

    /**
     * @notice Get user's lock IDs
     * @param user User address
     * @return Array of lock IDs
     */
    function getUserLocks(address user) external view returns (bytes32[] memory) {
        return userLocks[user];
    }

    /**
     * @notice Get count of active locks for a user
     * @param user User address
     * @return count Number of active locks
     */
    function getActiveLocksCount(address user) external view returns (uint256) {
        return _getActiveLocksCount(user);
    }

    /**
     * @notice Update platform limits
     * @param _minUsdAmount New minimum USD amount
     * @param _maxUsdAmount New maximum USD amount
     * @param _maxActiveLocksPerUser New max active locks per user
     */
    function updateLimits(
        uint256 _minUsdAmount,
        uint256 _maxUsdAmount,
        uint256 _maxActiveLocksPerUser
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_minUsdAmount < _maxUsdAmount, "Invalid limits");
        
        minUsdAmount = _minUsdAmount;
        maxUsdAmount = _maxUsdAmount;
        maxActiveLocksPerUser = _maxActiveLocksPerUser;

        emit LimitsUpdated(_minUsdAmount, _maxUsdAmount, _maxActiveLocksPerUser);
    }

    /**
     * @notice Pause contract (circuit breaker)
     */
    function pause() external onlyRole(CIRCUIT_BREAKER_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyRole(CIRCUIT_BREAKER_ROLE) {
        _unpause();
    }

    // Internal functions

    function _getActiveLocksCount(address user) internal view returns (uint256) {
        bytes32[] memory userLockIds = userLocks[user];
        uint256 count = 0;
        
        for (uint256 i = 0; i < userLockIds.length; i++) {
            if (locks[userLockIds[i]].status == LockStatus.ACTIVE) {
                count++;
            }
        }
        
        return count;
    }

    function _getLockDuration(LockType lockType) internal pure returns (uint256) {
        if (lockType == LockType.INSTANT) return INSTANT_LOCK_DURATION;
        if (lockType == LockType.SEVEN_DAY) return SEVEN_DAY_LOCK_DURATION;
        return THIRTY_DAY_LOCK_DURATION;
    }
}
