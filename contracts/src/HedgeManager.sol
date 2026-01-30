// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title HedgeManager
 * @notice Tracks hedge positions for FX risk management
 * @dev Off-chain execution on Binance, on-chain accounting
 */
contract HedgeManager is AccessControl, ReentrancyGuard {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant RISK_MANAGER_ROLE = keccak256("RISK_MANAGER_ROLE");

    enum PositionSide { LONG, SHORT }
    enum PositionStatus { OPEN, CLOSED }

    struct HedgePosition {
        bytes32 positionId;
        bytes32 lockId;           // Associated rate lock
        string instrument;        // e.g., "USDTUSDC-PERP"
        PositionSide side;
        uint256 size;             // USD notional (6 decimals)
        uint256 entryPrice;       // Entry price (6 decimals)
        uint256 exitPrice;        // Exit price (6 decimals)
        int256 realizedPnL;       // Realized P&L (6 decimals, can be negative)
        uint256 openedAt;
        uint256 closedAt;
        PositionStatus status;
    }

    // Storage
    mapping(bytes32 => HedgePosition) public positions;
    mapping(bytes32 => bytes32[]) public lockHedges; // lockId => positionIds
    bytes32[] public allPositionIds;

    uint256 public totalPositionsOpened;
    uint256 public totalPositionsClosed;
    int256 public cumulativePnL;
    
    // Risk limits
    uint256 public maxPositionSize = 100000 * 1e6; // $100k max per position
    uint256 public maxTotalExposure = 1000000 * 1e6; // $1M max total exposure

    // Events
    event PositionOpened(
        bytes32 indexed positionId,
        bytes32 indexed lockId,
        string instrument,
        PositionSide side,
        uint256 size,
        uint256 entryPrice,
        uint256 timestamp
    );

    event PositionClosed(
        bytes32 indexed positionId,
        uint256 exitPrice,
        int256 realizedPnL,
        uint256 timestamp
    );

    event RiskLimitsUpdated(
        uint256 maxPositionSize,
        uint256 maxTotalExposure
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        _grantRole(RISK_MANAGER_ROLE, msg.sender);
    }

    /**
     * @notice Record opening of a hedge position
     * @param positionId Unique position identifier
     * @param lockId Associated lock ID
     * @param instrument Trading instrument
     * @param side Position side (LONG/SHORT)
     * @param size Position size in USD
     * @param entryPrice Entry price
     */
    function recordHedgeOpen(
        bytes32 positionId,
        bytes32 lockId,
        string calldata instrument,
        PositionSide side,
        uint256 size,
        uint256 entryPrice
    ) external onlyRole(OPERATOR_ROLE) nonReentrant {
        require(positions[positionId].positionId == bytes32(0), "Position already exists");
        require(size > 0, "Size must be > 0");
        require(size <= maxPositionSize, "Exceeds max position size");
        require(entryPrice > 0, "Invalid entry price");

        // Check total exposure
        uint256 currentExposure = getTotalExposure();
        require(currentExposure + size <= maxTotalExposure, "Exceeds max total exposure");

        positions[positionId] = HedgePosition({
            positionId: positionId,
            lockId: lockId,
            instrument: instrument,
            side: side,
            size: size,
            entryPrice: entryPrice,
            exitPrice: 0,
            realizedPnL: 0,
            openedAt: block.timestamp,
            closedAt: 0,
            status: PositionStatus.OPEN
        });

        lockHedges[lockId].push(positionId);
        allPositionIds.push(positionId);
        totalPositionsOpened++;

        emit PositionOpened(
            positionId,
            lockId,
            instrument,
            side,
            size,
            entryPrice,
            block.timestamp
        );
    }

    /**
     * @notice Record closing of a hedge position
     * @param positionId Position identifier
     * @param exitPrice Exit price
     */
    function recordHedgeClose(
        bytes32 positionId,
        uint256 exitPrice
    ) external onlyRole(OPERATOR_ROLE) nonReentrant {
        HedgePosition storage position = positions[positionId];
        
        require(position.status == PositionStatus.OPEN, "Position not open");
        require(exitPrice > 0, "Invalid exit price");

        position.exitPrice = exitPrice;
        position.closedAt = block.timestamp;
        position.status = PositionStatus.CLOSED;

        // Calculate P&L
        int256 pnl = _calculatePnL(position);
        position.realizedPnL = pnl;

        cumulativePnL += pnl;
        totalPositionsClosed++;

        emit PositionClosed(positionId, exitPrice, pnl, block.timestamp);
    }

    /**
     * @notice Get position details
     * @param positionId Position identifier
     * @return position HedgePosition struct
     */
    function getPosition(bytes32 positionId) 
        external 
        view 
        returns (HedgePosition memory) 
    {
        return positions[positionId];
    }

    /**
     * @notice Get all hedge positions for a lock
     * @param lockId Lock identifier
     * @return Array of position IDs
     */
    function getLockHedges(bytes32 lockId) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return lockHedges[lockId];
    }

    /**
     * @notice Get net FX exposure across all open positions
     * @return Net exposure in USD (positive = long, negative = short)
     */
    function getNetExposure() external view returns (int256) {
        int256 netExposure = 0;

        for (uint256 i = 0; i < allPositionIds.length; i++) {
            HedgePosition memory position = positions[allPositionIds[i]];
            
            if (position.status == PositionStatus.OPEN) {
                if (position.side == PositionSide.LONG) {
                    netExposure += int256(position.size);
                } else {
                    netExposure -= int256(position.size);
                }
            }
        }

        return netExposure;
    }

    /**
     * @notice Get total exposure (sum of all open position sizes)
     * @return Total exposure in USD
     */
    function getTotalExposure() public view returns (uint256) {
        uint256 totalExposure = 0;

        for (uint256 i = 0; i < allPositionIds.length; i++) {
            HedgePosition memory position = positions[allPositionIds[i]];
            
            if (position.status == PositionStatus.OPEN) {
                totalExposure += position.size;
            }
        }

        return totalExposure;
    }

    /**
     * @notice Get unrealized P&L for all open positions
     * @param currentPrices Array of current prices matching position order
     * @return Total unrealized P&L
     */
    function getUnrealizedPnL(uint256[] calldata currentPrices) 
        external 
        view 
        returns (int256) 
    {
        require(currentPrices.length == allPositionIds.length, "Price array mismatch");
        
        int256 totalUnrealizedPnL = 0;

        for (uint256 i = 0; i < allPositionIds.length; i++) {
            HedgePosition memory position = positions[allPositionIds[i]];
            
            if (position.status == PositionStatus.OPEN) {
                int256 priceDiff;
                
                if (position.side == PositionSide.LONG) {
                    priceDiff = int256(currentPrices[i]) - int256(position.entryPrice);
                } else {
                    priceDiff = int256(position.entryPrice) - int256(currentPrices[i]);
                }
                
                int256 pnl = (priceDiff * int256(position.size)) / int256(position.entryPrice);
                totalUnrealizedPnL += pnl;
            }
        }

        return totalUnrealizedPnL;
    }

    /**
     * @notice Update risk limits
     * @param _maxPositionSize New max position size
     * @param _maxTotalExposure New max total exposure
     */
    function updateRiskLimits(
        uint256 _maxPositionSize,
        uint256 _maxTotalExposure
    ) external onlyRole(RISK_MANAGER_ROLE) {
        require(_maxPositionSize > 0, "Invalid position size");
        require(_maxTotalExposure > 0, "Invalid total exposure");
        require(_maxTotalExposure >= _maxPositionSize, "Total must be >= position");

        maxPositionSize = _maxPositionSize;
        maxTotalExposure = _maxTotalExposure;

        emit RiskLimitsUpdated(_maxPositionSize, _maxTotalExposure);
    }

    /**
     * @notice Get hedge statistics
     * @return stats Tuple of statistics
     */
    function getHedgeStats() external view returns (
        uint256 totalOpened,
        uint256 totalClosed,
        int256 cumPnL,
        uint256 currentExposure,
        int256 netExp
    ) {
        return (
            totalPositionsOpened,
            totalPositionsClosed,
            cumulativePnL,
            getTotalExposure(),
            this.getNetExposure()
        );
    }

    // Internal functions

    function _calculatePnL(HedgePosition memory position) 
        internal 
        pure 
        returns (int256) 
    {
        int256 priceDiff;
        
        if (position.side == PositionSide.LONG) {
            priceDiff = int256(position.exitPrice) - int256(position.entryPrice);
        } else {
            priceDiff = int256(position.entryPrice) - int256(position.exitPrice);
        }
        
        return (priceDiff * int256(position.size)) / int256(position.entryPrice);
    }
}
