# AutoPilot DeFi - Complete Implementation

## File Tree

```
metamask/
├── contracts/
│   ├── AutoPilot.sol                    # Enhanced with permissions & events
│   ├── hardhat.config.js
│   ├── package.json
│   └── scripts/
│       └── deploy.js
│
├── envio/
│   ├── config.yaml                      # Sepolia network config
│   ├── schema.graphql                   # GraphQL schema
│   └── src/
│       └── EventHandlers.ts             # Event processing logic
│
├── backend/
│   ├── main.py                          # FastAPI with Envio integration
│   ├── services/
│   │   └── envio_client.py              # GraphQL client
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.tsx            # Main dashboard
    │   │   ├── PermissionManager.tsx    # Smart account UI
    │   │   ├── EnvioDashboard.tsx       # Analytics dashboard
    │   │   └── ConnectWallet.tsx
    │   ├── hooks/
    │   │   └── useSmartAccount.ts       # Permission hook
    │   ├── lib/
    │   │   └── smartAccount.ts          # Ethers.js integration
    │   └── contexts/
    │       └── WalletContext.tsx
    ├── package.json
    └── .env
```

## Local Run Steps

### 1. Deploy Smart Contract

```bash
cd contracts
npm install
echo "PRIVATE_KEY=your_key" > .env
echo "SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com" >> .env
npx hardhat run scripts/deploy.js --network sepolia
# Copy deployed address
```

### 2. Configure Envio

```bash
cd envio
# Update config.yaml with deployed contract address
npm install -g envio
envio dev
# GraphQL endpoint: http://localhost:8080/v1/graphql
```

### 3. Start Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
echo "ENVIO_GRAPHQL_URL=http://localhost:8080/v1/graphql" > .env
python main.py
# API: http://localhost:8000
```

### 4. Start Frontend

```bash
cd frontend
npm install
echo "VITE_CONTRACT_ADDRESS=0xYOUR_CONTRACT" > .env
echo "VITE_BACKEND_URL=http://localhost:8000" >> .env
npm run dev
# App: http://localhost:5173
```

## GraphQL Queries

### Get Permission
```graphql
query GetPermission($user: String!) {
  Permission(where: {user: {_eq: $user}, active: {_eq: true}}, limit: 1) {
    spendingCap
    spent
    expiry
    active
    grantedAt
  }
}
```

### Get Rebalances
```graphql
query GetRebalances($user: String!, $limit: Int!) {
  Rebalance(
    where: {user: {_eq: $user}}
    order_by: {timestamp: desc}
    limit: $limit
  ) {
    tokenIn
    tokenOut
    amountIn
    amountOut
    gasUsed
    timestamp
    transactionHash
  }
}
```

### Get User Stats
```graphql
query GetUserStats($user: String!) {
  UserStats(where: {user: {_eq: $user}}) {
    totalRebalances
    totalGasUsed
    totalSpent
    lastRebalance
  }
}
```

## Smart Contract Functions

```solidity
// Grant permission
grantPermission(uint256 spendingCap, uint256 durationDays)

// Revoke permission
revokePermission()

// Configure slippage
setConfig(uint256 slippageLimitBps)

// Pause/unpause
togglePause(bool pause)

// Get permission details
getPermission(address user) returns (spendingCap, spent, expiry, active, grantedAt)
```

## Events

```solidity
event PermissionGranted(address user, uint256 spendingCap, uint256 expiry, uint256 timestamp)
event PermissionRevoked(address user, uint256 timestamp)
event PermissionUsed(address user, uint256 amount, uint256 remaining)
event Rebalanced(address user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut, uint256 gasUsed, uint256 timestamp)
```

## Testing Flow

1. Connect MetaMask to Sepolia
2. Click "Grant Permission" - MetaMask popup appears
3. Set spending cap and duration
4. Approve transaction
5. View permission details in UI
6. Trigger rebalance (if executor authorized)
7. View analytics in Envio Dashboard
8. Pause/Resume or Revoke permission

## Environment Variables

### Frontend (.env)
```
VITE_CONTRACT_ADDRESS=0x...
VITE_BACKEND_URL=http://localhost:8000
```

### Backend (.env)
```
ENVIO_GRAPHQL_URL=http://localhost:8080/v1/graphql
```

### Contracts (.env)
```
PRIVATE_KEY=...
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```
