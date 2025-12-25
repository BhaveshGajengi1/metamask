// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AutoPilotDeFi
 * @notice Handles permisisoned portfolio rebalancing with strict limits
 */
contract AutoPilotDeFi {
    
    struct UserConfig {
        uint256 monthlySpendingCap; // e.g. in USD 18 decimals or native
        uint256 slippageLimitBps;   // 100 = 1%
        uint256 lastRebalanceTimestamp;
        uint256 monthlySpent;
        uint256 currentMonthStart;
        bool isPaused;
    }

    mapping(address => UserConfig) public userConfigs;
    mapping(address => mapping(address => bool)) public authorizedExecutors;

    event ConfigUpdated(address indexed user, uint256 spendingCap, uint256 slippageLimit);
    event RebalanceExecuted(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event Paused(address indexed user);
    event Unpaused(address indexed user);

    modifier onlyExecutor(address user) {
        require(authorizedExecutors[user][msg.sender], "Not authorized executor");
        _;
    }

    function setConfig(uint256 _monthlySpendingCap, uint256 _slippageLimitBps) external {
        UserConfig storage config = userConfigs[msg.sender];
        config.monthlySpendingCap = _monthlySpendingCap;
        config.slippageLimitBps = _slippageLimitBps;
        if (config.currentMonthStart == 0) {
            config.currentMonthStart = block.timestamp;
        }
        emit ConfigUpdated(msg.sender, _monthlySpendingCap, _slippageLimitBps);
    }

    function togglePause(bool _pause) external {
        userConfigs[msg.sender].isPaused = _pause;
        if (_pause) emit Paused(msg.sender);
        else emit Unpaused(msg.sender);
    }

    function authorizeExecutor(address _executor, bool _status) external {
        authorizedExecutors[msg.sender][_executor] = _status;
    }

    // Placeholder for actual swap logic (would integrate with Uniswap Router)
    function executeRebalance(
        address user,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin
    ) external onlyExecutor(user) {
        UserConfig storage config = userConfigs[user];
        require(!config.isPaused, "User paused automation");
        
        // Reset monthly tracking if needed
        if (block.timestamp >= config.currentMonthStart + 30 days) {
            config.monthlySpent = 0;
            config.currentMonthStart = block.timestamp;
        }

        require(config.monthlySpent + amountIn <= config.monthlySpendingCap, "Monthly cap exceeded");

        // Execute Swap (Pseudo-code for MVP)
        // IERC20(tokenIn).transferFrom(user, address(this), amountIn);
        // ... swap logic ...
        // IERC20(tokenOut).transfer(user, amountOutActual);

        config.monthlySpent += amountIn;
        config.lastRebalanceTimestamp = block.timestamp;

        emit RebalanceExecuted(user, tokenIn, tokenOut, amountIn, amountOutMin);
    }
}
