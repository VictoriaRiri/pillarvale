// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title CircuitBreaker
 * @notice Dynamic pricing and emergency kill switch for market volatility
 * @dev Monitors market conditions and can pause platform operations
 */
contract CircuitBreaker is AccessControl, Pausable {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");

    enum MarketCondition { NORMAL, HIGH_VOLATILITY, EXTREME }

    struct VolatilityThresholds {
        uint256 tier2Threshold;  // High volatility threshold (basis points)
        uint256 tier3Threshold;  // Extreme volatility threshold (basis points)
        uint256 timeWindow;      // Time window for measurement (seconds)
    }

    struct MarketSnapshot {
        uint256 rate;
        uint256 timestamp;
        uint256 volatility;      // Basis points
        MarketCondition condition;
    }

    // State
    MarketCondition public currentCondition;
    VolatilityThresholds public thresholds;
    
    MarketSnapshot[] public snapshots;
    uint256 public constant MAX_SNAPSHOTS = 100;
    
    bool public newLocksEnabled;
    uint256 public lastConditionChange;
    
    // Spread adjustments per condition (basis points)
    mapping(MarketCondition => uint256) public spreadAdjustments;

    // Events
    event MarketConditionChanged(
        MarketCondition oldCondition,
        MarketCondition newCondition,
        uint256 volatility,
        uint256 timestamp
    );

    event VolatilityThresholdsUpdated(
        uint256 tier2Threshold,
        uint256 tier3Threshold,
        uint256 timeWindow
    );

    event NewLocksStatusChanged(bool enabled, string reason);

    event EmergencyShutdown(address indexed triggeredBy, string reason);

    event SnapshotRecorded(
        uint256 rate,
        uint256 volatility,
        MarketCondition condition,
        uint256 timestamp
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        _grantRole(EMERGENCY_ROLE, msg.sender);

        // Default thresholds
        thresholds = VolatilityThresholds({
            tier2Threshold: 200,    // 2% = high volatility
            tier3Threshold: 500,    // 5% = extreme volatility
            timeWindow: 7 days
        });

        // Default spread adjustments (basis points to subtract)
        spreadAdjustments[MarketCondition.NORMAL] = 0;
        spreadAdjustments[MarketCondition.HIGH_VOLATILITY] = 60;  // -0.6 KES
        spreadAdjustments[MarketCondition.EXTREME] = 0;           // Pause instead

        currentCondition = MarketCondition.NORMAL;
        newLocksEnabled = true;
    }

    /**
     * @notice Record market snapshot and update condition
     * @param rate Current KES/USD rate (6 decimals)
     * @param volatility Calculated volatility (basis points)
     */
    function recordSnapshot(uint256 rate, uint256 volatility) 
        external 
        onlyRole(OPERATOR_ROLE) 
    {
        require(rate > 0, "Invalid rate");

        MarketCondition newCondition = _determineCondition(volatility);

        // Store snapshot
        if (snapshots.length >= MAX_SNAPSHOTS) {
            // Remove oldest snapshot
            for (uint256 i = 0; i < snapshots.length - 1; i++) {
                snapshots[i] = snapshots[i + 1];
            }
            snapshots.pop();
        }

        snapshots.push(MarketSnapshot({
            rate: rate,
            timestamp: block.timestamp,
            volatility: volatility,
            condition: newCondition
        }));

        emit SnapshotRecorded(rate, volatility, newCondition, block.timestamp);

        // Update condition if changed
        if (newCondition != currentCondition) {
            _updateMarketCondition(newCondition, volatility);
        }
    }

    /**
     * @notice Manually set market condition (emergency override)
     * @param condition New market condition
     * @param reason Reason for manual override
     */
    function setMarketCondition(MarketCondition condition, string calldata reason) 
        external 
        onlyRole(EMERGENCY_ROLE) 
    {
        emit MarketConditionChanged(
            currentCondition,
            condition,
            0,
            block.timestamp
        );

        currentCondition = condition;
        lastConditionChange = block.timestamp;

        // Auto-disable new locks if EXTREME
        if (condition == MarketCondition.EXTREME && newLocksEnabled) {
            newLocksEnabled = false;
            emit NewLocksStatusChanged(false, reason);
        }
    }

    /**
     * @notice Pause new lock creation
     * @param reason Reason for pausing
     */
    function pauseNewLocks(string calldata reason) 
        external 
        onlyRole(EMERGENCY_ROLE) 
    {
        newLocksEnabled = false;
        emit NewLocksStatusChanged(false, reason);
    }

    /**
     * @notice Resume new lock creation
     */
    function resumeNewLocks() external onlyRole(EMERGENCY_ROLE) {
        require(
            currentCondition != MarketCondition.EXTREME,
            "Cannot resume during EXTREME condition"
        );
        
        newLocksEnabled = true;
        emit NewLocksStatusChanged(true, "Manually resumed");
    }

    /**
     * @notice Emergency shutdown - pause entire platform
     * @param reason Reason for shutdown
     */
    function emergencyShutdown(string calldata reason) 
        external 
        onlyRole(EMERGENCY_ROLE) 
    {
        _pause();
        newLocksEnabled = false;
        
        emit EmergencyShutdown(msg.sender, reason);
        emit NewLocksStatusChanged(false, reason);
    }

    /**
     * @notice Resume platform after emergency
     */
    function resumePlatform() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
        
        // Don't auto-enable new locks - requires separate call
    }

    /**
     * @notice Update volatility thresholds
     * @param tier2 High volatility threshold (basis points)
     * @param tier3 Extreme volatility threshold (basis points)
     * @param timeWindow Time window for measurement (seconds)
     */
    function updateVolatilityThresholds(
        uint256 tier2,
        uint256 tier3,
        uint256 timeWindow
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(tier2 < tier3, "Tier2 must be < Tier3");
        require(tier2 > 0, "Tier2 must be > 0");
        require(timeWindow > 0, "Time window must be > 0");

        thresholds = VolatilityThresholds({
            tier2Threshold: tier2,
            tier3Threshold: tier3,
            timeWindow: timeWindow
        });

        emit VolatilityThresholdsUpdated(tier2, tier3, timeWindow);
    }

    /**
     * @notice Update spread adjustments for market conditions
     * @param condition Market condition
     * @param adjustment Spread adjustment in basis points
     */
    function updateSpreadAdjustment(
        MarketCondition condition,
        uint256 adjustment
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        spreadAdjustments[condition] = adjustment;
    }

    /**
     * @notice Check if new locks are allowed
     * @return allowed True if new locks can be created
     */
    function areNewLocksAllowed() external view returns (bool) {
        return newLocksEnabled && !paused();
    }

    /**
     * @notice Get current spread adjustment
     * @return adjustment Spread adjustment in basis points
     */
    function getCurrentSpreadAdjustment() external view returns (uint256) {
        return spreadAdjustments[currentCondition];
    }

    /**
     * @notice Get recent snapshots
     * @param count Number of recent snapshots to retrieve
     * @return Array of snapshots
     */
    function getRecentSnapshots(uint256 count) 
        external 
        view 
        returns (MarketSnapshot[] memory) 
    {
        uint256 snapshotCount = snapshots.length;
        if (count > snapshotCount) {
            count = snapshotCount;
        }

        MarketSnapshot[] memory recent = new MarketSnapshot[](count);
        
        for (uint256 i = 0; i < count; i++) {
            recent[i] = snapshots[snapshotCount - count + i];
        }

        return recent;
    }

    /**
     * @notice Get volatility statistics
     * @return avgVolatility Average volatility over recent snapshots
     * @return maxVolatility Maximum volatility
     * @return minVolatility Minimum volatility
     */
    function getVolatilityStats() external view returns (
        uint256 avgVolatility,
        uint256 maxVolatility,
        uint256 minVolatility
    ) {
        if (snapshots.length == 0) {
            return (0, 0, 0);
        }

        uint256 sum = 0;
        maxVolatility = 0;
        minVolatility = type(uint256).max;

        for (uint256 i = 0; i < snapshots.length; i++) {
            uint256 vol = snapshots[i].volatility;
            sum += vol;
            
            if (vol > maxVolatility) maxVolatility = vol;
            if (vol < minVolatility) minVolatility = vol;
        }

        avgVolatility = sum / snapshots.length;
    }

    // Internal functions

    function _determineCondition(uint256 volatility) 
        internal 
        view 
        returns (MarketCondition) 
    {
        if (volatility >= thresholds.tier3Threshold) {
            return MarketCondition.EXTREME;
        } else if (volatility >= thresholds.tier2Threshold) {
            return MarketCondition.HIGH_VOLATILITY;
        } else {
            return MarketCondition.NORMAL;
        }
    }

    function _updateMarketCondition(
        MarketCondition newCondition,
        uint256 volatility
    ) internal {
        MarketCondition oldCondition = currentCondition;
        currentCondition = newCondition;
        lastConditionChange = block.timestamp;

        emit MarketConditionChanged(
            oldCondition,
            newCondition,
            volatility,
            block.timestamp
        );

        // Auto-disable new locks if moving to EXTREME
        if (newCondition == MarketCondition.EXTREME && newLocksEnabled) {
            newLocksEnabled = false;
            emit NewLocksStatusChanged(
                false,
                "Automatic pause due to extreme volatility"
            );
        }

        // Auto-enable new locks if moving back to NORMAL from HIGH_VOLATILITY
        if (
            newCondition == MarketCondition.NORMAL &&
            oldCondition == MarketCondition.HIGH_VOLATILITY &&
            !newLocksEnabled
        ) {
            newLocksEnabled = true;
            emit NewLocksStatusChanged(
                true,
                "Automatic resume - volatility normalized"
            );
        }
    }
}
