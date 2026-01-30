// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IPool {
    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256);
}

interface IAToken is IERC20 {
    function UNDERLYING_ASSET_ADDRESS() external view returns (address);
}

/**
 * @title AavePoolManager
 * @notice Manages liquidity pool on Aave V3 for yield generation
 * @dev Handles deposits, withdrawals, and yield tracking
 */
contract AavePoolManager is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");

    IPool public immutable aavePool;
    IERC20 public immutable usdc;
    IAToken public immutable aUsdc;

    uint256 public totalDeposited;
    uint256 public totalWithdrawn;
    uint256 public totalYieldClaimed;

    // Reserve ratio (percentage of funds to keep liquid, not in Aave)
    uint256 public reserveRatio = 10; // 10% by default
    uint256 public constant MAX_RESERVE_RATIO = 50; // Max 50%

    // Events
    event Deposited(uint256 amount, uint256 timestamp);
    event Withdrawn(uint256 amount, address recipient, uint256 timestamp);
    event YieldClaimed(uint256 amount, uint256 timestamp);
    event ReserveRatioUpdated(uint256 oldRatio, uint256 newRatio);

    constructor(
        address _aavePool,
        address _usdc,
        address _aUsdc
    ) {
        require(_aavePool != address(0), "Invalid Aave pool");
        require(_usdc != address(0), "Invalid USDC");
        require(_aUsdc != address(0), "Invalid aUSDC");

        aavePool = IPool(_aavePool);
        usdc = IERC20(_usdc);
        aUsdc = IAToken(_aUsdc);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        _grantRole(TREASURY_ROLE, msg.sender);
    }

    /**
     * @notice Deposit USDC to Aave pool
     * @param amount Amount of USDC to deposit (6 decimals)
     */
    function depositToAave(uint256 amount) 
        external 
        onlyRole(OPERATOR_ROLE) 
        nonReentrant 
    {
        require(amount > 0, "Amount must be > 0");
        
        uint256 contractBalance = usdc.balanceOf(address(this));
        require(contractBalance >= amount, "Insufficient USDC balance");

        // Approve Aave pool
        usdc.safeApprove(address(aavePool), amount);

        // Deposit to Aave
        aavePool.supply(
            address(usdc),
            amount,
            address(this),
            0 // referral code
        );

        totalDeposited += amount;

        emit Deposited(amount, block.timestamp);
    }

    /**
     * @notice Withdraw USDC from Aave pool
     * @param amount Amount of USDC to withdraw (6 decimals)
     * @param recipient Address to receive USDC
     */
    function withdrawFromAave(uint256 amount, address recipient) 
        external 
        onlyRole(OPERATOR_ROLE) 
        nonReentrant 
        returns (uint256)
    {
        require(amount > 0, "Amount must be > 0");
        require(recipient != address(0), "Invalid recipient");

        // Withdraw from Aave
        uint256 withdrawn = aavePool.withdraw(
            address(usdc),
            amount,
            recipient
        );

        totalWithdrawn += withdrawn;

        emit Withdrawn(withdrawn, recipient, block.timestamp);

        return withdrawn;
    }

    /**
     * @notice Claim accrued yield and send to treasury
     * @param recipient Treasury address
     */
    function claimYield(address recipient) 
        external 
        onlyRole(TREASURY_ROLE) 
        nonReentrant 
        returns (uint256)
    {
        require(recipient != address(0), "Invalid recipient");

        uint256 currentBalance = getAaveBalance();
        uint256 netDeposited = totalDeposited - totalWithdrawn;
        
        require(currentBalance > netDeposited, "No yield to claim");

        uint256 yieldAmount = currentBalance - netDeposited;

        // Withdraw yield
        uint256 withdrawn = aavePool.withdraw(
            address(usdc),
            yieldAmount,
            recipient
        );

        totalYieldClaimed += withdrawn;

        emit YieldClaimed(withdrawn, block.timestamp);

        return withdrawn;
    }

    /**
     * @notice Rebalance funds between Aave and contract based on reserve ratio
     */
    function rebalance() external onlyRole(OPERATOR_ROLE) nonReentrant {
        uint256 totalLiquidity = getTotalLiquidity();
        uint256 targetReserve = (totalLiquidity * reserveRatio) / 100;
        uint256 currentReserve = usdc.balanceOf(address(this));

        if (currentReserve < targetReserve) {
            // Withdraw from Aave to meet reserve
            uint256 toWithdraw = targetReserve - currentReserve;
            uint256 aaveBalance = getAaveBalance();
            
            if (toWithdraw > aaveBalance) {
                toWithdraw = aaveBalance;
            }

            if (toWithdraw > 0) {
                aavePool.withdraw(
                    address(usdc),
                    toWithdraw,
                    address(this)
                );
                totalWithdrawn += toWithdraw;
            }
        } else if (currentReserve > targetReserve) {
            // Deposit excess to Aave
            uint256 toDeposit = currentReserve - targetReserve;
            
            usdc.safeApprove(address(aavePool), toDeposit);
            aavePool.supply(
                address(usdc),
                toDeposit,
                address(this),
                0
            );
            totalDeposited += toDeposit;
        }
    }

    /**
     * @notice Update reserve ratio
     * @param newRatio New reserve ratio (0-50)
     */
    function updateReserveRatio(uint256 newRatio) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(newRatio <= MAX_RESERVE_RATIO, "Ratio too high");
        
        uint256 oldRatio = reserveRatio;
        reserveRatio = newRatio;

        emit ReserveRatioUpdated(oldRatio, newRatio);
    }

    /**
     * @notice Get current balance in Aave
     * @return Balance of aUSDC (represents USDC + accrued interest)
     */
    function getAaveBalance() public view returns (uint256) {
        return aUsdc.balanceOf(address(this));
    }

    /**
     * @notice Get total liquidity (Aave + contract balance)
     * @return Total USDC available
     */
    function getTotalLiquidity() public view returns (uint256) {
        return getAaveBalance() + usdc.balanceOf(address(this));
    }

    /**
     * @notice Get accrued yield
     * @return Yield amount in USDC
     */
    function getAccruedYield() public view returns (uint256) {
        uint256 currentBalance = getAaveBalance();
        uint256 netDeposited = totalDeposited - totalWithdrawn;
        
        if (currentBalance > netDeposited) {
            return currentBalance - netDeposited;
        }
        
        return 0;
    }

    /**
     * @notice Get pool utilization percentage
     * @return Utilization percentage (0-100)
     */
    function getUtilization() public view returns (uint256) {
        uint256 totalLiquidity = getTotalLiquidity();
        if (totalLiquidity == 0) return 0;
        
        return (getAaveBalance() * 100) / totalLiquidity;
    }

    /**
     * @notice Emergency withdraw all funds from Aave
     * @dev Only callable by admin in emergency situations
     */
    function emergencyWithdrawAll() 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
        nonReentrant 
    {
        uint256 aaveBalance = getAaveBalance();
        
        if (aaveBalance > 0) {
            aavePool.withdraw(
                address(usdc),
                type(uint256).max, // Withdraw all
                address(this)
            );
        }
    }
}
