// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract AutoPilotDeFi {
    
    // Sepolia Testnet Token Addresses
    address public constant USDC = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;
    address public constant WETH = 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9;
    
    struct UserPermission {
        uint256 spendingCap;
        uint256 spent;
        uint256 expiry;
        bool active;
        uint256 grantedAt;
    }
    
    struct RebalanceConfig {
        uint256 slippageLimitBps;
        uint256 lastRebalanceTimestamp;
        bool isPaused;
    }

    mapping(address => UserPermission) public permissions;
    mapping(address => RebalanceConfig) public configs;
    mapping(address => mapping(address => bool)) public authorizedExecutors;

    event PermissionGranted(address indexed user, uint256 spendingCap, uint256 expiry, uint256 timestamp);
    event PermissionRevoked(address indexed user, uint256 timestamp);
    event PermissionUsed(address indexed user, uint256 amount, uint256 remaining);
    event Rebalanced(
        address indexed user,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 gasUsed,
        uint256 timestamp
    );
    event ConfigUpdated(address indexed user, uint256 slippageLimit);
    event Paused(address indexed user);
    event Unpaused(address indexed user);

    modifier onlyExecutor(address user) {
        require(authorizedExecutors[user][msg.sender], "Not authorized");
        _;
    }

    modifier hasActivePermission(address user) {
        UserPermission storage perm = permissions[user];
        require(perm.active, "No active permission");
        require(block.timestamp < perm.expiry, "Permission expired");
        _;
    }

    function grantPermission(uint256 _spendingCap, uint256 _durationDays) external {
        require(_spendingCap > 0, "Invalid cap");
        require(_durationDays > 0 && _durationDays <= 365, "Invalid duration");
        
        uint256 expiry = block.timestamp + (_durationDays * 1 days);
        
        permissions[msg.sender] = UserPermission({
            spendingCap: _spendingCap,
            spent: 0,
            expiry: expiry,
            active: true,
            grantedAt: block.timestamp
        });
        
        emit PermissionGranted(msg.sender, _spendingCap, expiry, block.timestamp);
    }

    function revokePermission() external {
        permissions[msg.sender].active = false;
        emit PermissionRevoked(msg.sender, block.timestamp);
    }

    function setConfig(uint256 _slippageLimitBps) external {
        require(_slippageLimitBps <= 1000, "Slippage too high");
        configs[msg.sender].slippageLimitBps = _slippageLimitBps;
        emit ConfigUpdated(msg.sender, _slippageLimitBps);
    }

    function togglePause(bool _pause) external {
        configs[msg.sender].isPaused = _pause;
        if (_pause) {
            emit Paused(msg.sender);
        } else {
            emit Unpaused(msg.sender);
        }
    }

    function authorizeExecutor(address _executor, bool _status) external {
        authorizedExecutors[msg.sender][_executor] = _status;
    }

    function executeRebalance(
        address user,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin
    ) external onlyExecutor(user) hasActivePermission(user) {
        uint256 gasStart = gasleft();
        
        RebalanceConfig storage config = configs[user];
        require(!config.isPaused, "Paused");
        
        UserPermission storage perm = permissions[user];
        require(perm.spent + amountIn <= perm.spendingCap, "Cap exceeded");
        
        // Execute swap (simplified - in production use DEX router)
        IERC20(tokenIn).transferFrom(user, address(this), amountIn);
        
        perm.spent += amountIn;
        config.lastRebalanceTimestamp = block.timestamp;
        
        uint256 gasUsed = gasStart - gasleft();
        
        emit PermissionUsed(user, amountIn, perm.spendingCap - perm.spent);
        emit Rebalanced(user, tokenIn, tokenOut, amountIn, amountOutMin, gasUsed, block.timestamp);
    }

    function getPermission(address user) external view returns (
        uint256 spendingCap,
        uint256 spent,
        uint256 expiry,
        bool active,
        uint256 grantedAt
    ) {
        UserPermission storage perm = permissions[user];
        return (perm.spendingCap, perm.spent, perm.expiry, perm.active, perm.grantedAt);
    }
}
