// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title OracleConsumer
 * @notice Chainlink price feed integration for KES/USD rates
 * @dev Fetches and stores rate history for volatility calculations
 */
contract OracleConsumer is AccessControl {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    AggregatorV3Interface public priceFeed;
    
    struct RateSnapshot {
        uint256 rate;        // KES per USD (8 decimals from Chainlink)
        uint256 timestamp;
        uint80 roundId;
    }

    RateSnapshot[] public rateHistory;
    uint256 public constant MAX_HISTORY = 365; // Store up to 365 data points

    uint256 public lastUpdateTime;
    uint256 public updateInterval = 1 hours; // Minimum time between updates

    // Fallback oracle (in case primary fails)
    AggregatorV3Interface public fallbackPriceFeed;
    bool public useFallback;

    // Events
    event RateUpdated(
        uint256 rate,
        uint256 timestamp,
        uint80 roundId,
        bool isFallback
    );

    event PriceFeedUpdated(
        address indexed oldFeed,
        address indexed newFeed,
        bool isFallback
    );

    event FallbackActivated(string reason);

    constructor(address _priceFeed) {
        require(_priceFeed != address(0), "Invalid price feed");
        
        priceFeed = AggregatorV3Interface(_priceFeed);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
    }

    /**
     * @notice Get latest KES/USD rate from Chainlink
     * @return rate Latest rate (8 decimals)
     * @return timestamp Rate timestamp
     */
    function getLatestKESUSDRate() external view returns (
        uint256 rate,
        uint256 timestamp
    ) {
        AggregatorV3Interface feed = useFallback ? fallbackPriceFeed : priceFeed;
        
        (
            uint80 roundId,
            int256 price,
            ,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = feed.latestRoundData();

        require(price > 0, "Invalid price");
        require(answeredInRound >= roundId, "Stale price");
        require(updatedAt > 0, "Invalid timestamp");

        return (uint256(price), updatedAt);
    }

    /**
     * @notice Update rate history with latest data
     * @dev Called by backend cron job
     */
    function updateRateHistory() external onlyRole(OPERATOR_ROLE) {
        require(
            block.timestamp >= lastUpdateTime + updateInterval,
            "Update too frequent"
        );

        (uint256 rate, uint256 timestamp) = this.getLatestKESUSDRate();
        
        AggregatorV3Interface feed = useFallback ? fallbackPriceFeed : priceFeed;
        (uint80 roundId, , , ,) = feed.latestRoundData();

        // Add to history
        if (rateHistory.length >= MAX_HISTORY) {
            // Remove oldest entry
            for (uint256 i = 0; i < rateHistory.length - 1; i++) {
                rateHistory[i] = rateHistory[i + 1];
            }
            rateHistory.pop();
        }

        rateHistory.push(RateSnapshot({
            rate: rate,
            timestamp: timestamp,
            roundId: roundId
        }));

        lastUpdateTime = block.timestamp;

        emit RateUpdated(rate, timestamp, roundId, useFallback);
    }

    /**
     * @notice Get rate history for specified lookback period
     * @param lookbackPeriod Number of recent snapshots to retrieve
     * @return rates Array of historical rates
     * @return timestamps Array of timestamps
     */
    function getRateHistory(uint256 lookbackPeriod) 
        external 
        view 
        returns (uint256[] memory rates, uint256[] memory timestamps) 
    {
        uint256 historyLength = rateHistory.length;
        if (lookbackPeriod > historyLength) {
            lookbackPeriod = historyLength;
        }

        rates = new uint256[](lookbackPeriod);
        timestamps = new uint256[](lookbackPeriod);

        for (uint256 i = 0; i < lookbackPeriod; i++) {
            uint256 index = historyLength - lookbackPeriod + i;
            rates[i] = rateHistory[index].rate;
            timestamps[i] = rateHistory[index].timestamp;
        }

        return (rates, timestamps);
    }

    /**
     * @notice Calculate volatility over specified number of periods
     * @param periods Number of periods to analyze
     * @return volatility Volatility in basis points
     */
    function calculateVolatility(uint256 periods) 
        external 
        view 
        returns (uint256 volatility) 
    {
        require(periods > 1, "Need at least 2 periods");
        require(periods <= rateHistory.length, "Insufficient history");

        uint256 startIndex = rateHistory.length - periods;
        uint256 startRate = rateHistory[startIndex].rate;
        uint256 endRate = rateHistory[rateHistory.length - 1].rate;

        // Calculate percentage change
        uint256 change;
        if (endRate > startRate) {
            change = ((endRate - startRate) * 10000) / startRate;
        } else {
            change = ((startRate - endRate) * 10000) / startRate;
        }

        return change; // Returns basis points
    }

    /**
     * @notice Calculate average rate over specified periods
     * @param periods Number of periods to average
     * @return avgRate Average rate
     */
    function getAverageRate(uint256 periods) 
        external 
        view 
        returns (uint256 avgRate) 
    {
        require(periods > 0, "Periods must be > 0");
        require(periods <= rateHistory.length, "Insufficient history");

        uint256 sum = 0;
        uint256 startIndex = rateHistory.length - periods;

        for (uint256 i = startIndex; i < rateHistory.length; i++) {
            sum += rateHistory[i].rate;
        }

        return sum / periods;
    }

    /**
     * @notice Get rate at specific historical index
     * @param index Index in rate history (0 = oldest)
     * @return snapshot RateSnapshot at index
     */
    function getRateAtIndex(uint256 index) 
        external 
        view 
        returns (RateSnapshot memory) 
    {
        require(index < rateHistory.length, "Index out of bounds");
        return rateHistory[index];
    }

    /**
     * @notice Get total number of historical snapshots
     * @return count Number of snapshots
     */
    function getHistoryLength() external view returns (uint256) {
        return rateHistory.length;
    }

    /**
     * @notice Update primary price feed address
     * @param newPriceFeed New Chainlink price feed address
     */
    function updatePriceFeed(address newPriceFeed) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(newPriceFeed != address(0), "Invalid address");
        
        address oldFeed = address(priceFeed);
        priceFeed = AggregatorV3Interface(newPriceFeed);

        emit PriceFeedUpdated(oldFeed, newPriceFeed, false);
    }

    /**
     * @notice Set fallback price feed
     * @param _fallbackPriceFeed Fallback Chainlink price feed address
     */
    function setFallbackPriceFeed(address _fallbackPriceFeed) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(_fallbackPriceFeed != address(0), "Invalid address");
        
        address oldFeed = address(fallbackPriceFeed);
        fallbackPriceFeed = AggregatorV3Interface(_fallbackPriceFeed);

        emit PriceFeedUpdated(oldFeed, _fallbackPriceFeed, true);
    }

    /**
     * @notice Activate fallback price feed
     * @param reason Reason for activation
     */
    function activateFallback(string calldata reason) 
        external 
        onlyRole(OPERATOR_ROLE) 
    {
        require(address(fallbackPriceFeed) != address(0), "No fallback configured");
        
        useFallback = true;
        emit FallbackActivated(reason);
    }

    /**
     * @notice Deactivate fallback (return to primary)
     */
    function deactivateFallback() external onlyRole(DEFAULT_ADMIN_ROLE) {
        useFallback = false;
    }

    /**
     * @notice Update minimum update interval
     * @param newInterval New interval in seconds
     */
    function updateInterval(uint256 newInterval) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(newInterval > 0, "Invalid interval");
        updateInterval = newInterval;
    }

    /**
     * @notice Get price feed decimals
     * @return decimals Number of decimals
     */
    function getDecimals() external view returns (uint8) {
        AggregatorV3Interface feed = useFallback ? fallbackPriceFeed : priceFeed;
        return feed.decimals();
    }

    /**
     * @notice Get price feed description
     * @return description Feed description
     */
    function getDescription() external view returns (string memory) {
        AggregatorV3Interface feed = useFallback ? fallbackPriceFeed : priceFeed;
        return feed.description();
    }
}
