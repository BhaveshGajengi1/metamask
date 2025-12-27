# AutoPilot DeFi - Deployment Guide

## 📋 Prerequisites

- Node.js v18+ and npm
- Python 3.9+
- MetaMask wallet with Sepolia ETH
- Hardhat for smart contract deployment
- Envio CLI for indexing

## 🚀 Deployment Steps

### 1. Smart Contract Deployment to Sepolia

```bash
cd contracts

# Install dependencies
npm install

# Create .env file with your private key
echo "PRIVATE_KEY=your_private_key_here" > .env
echo "SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com" >> .env

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Note the deployed contract address
# Update the address in:
# - indexing/config.yaml
# - frontend/.env
```

### 2. Envio Indexer Setup

```bash
cd indexing

# Install Envio CLI
npm install -g envio

# Update config.yaml with deployed contract address

# Initialize Envio project
envio init

# Start Envio indexer
envio dev

# Note the GraphQL endpoint (usually http://localhost:8080/v1/graphql)
# Update in backend/.env and frontend/.env
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Update ENVIO_GRAPHQL_URL with your Envio endpoint

# Start backend server
python main.py
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Update:
# - VITE_CONTRACT_ADDRESS with deployed contract address
# - VITE_ENVIO_GRAPHQL_URL with Envio endpoint
# - VITE_BACKEND_URL with backend URL

# Start development server
npm run dev
```

## 🔧 Configuration Files to Update

### After Contract Deployment:
1. `indexing/config.yaml` - Update contract address
2. `frontend/.env` - Update VITE_CONTRACT_ADDRESS

### After Envio Deployment:
1. `backend/.env` - Update ENVIO_GRAPHQL_URL
2. `frontend/.env` - Update VITE_ENVIO_GRAPHQL_URL

## 🧪 Testing the Demo

1. **Connect Wallet**
   - Open frontend (http://localhost:5173)
   - Click "Connect Wallet"
   - Connect MetaMask to Sepolia

2. **Grant Permission**
   - Set monthly spending cap
   - Set slippage tolerance
   - Click "Grant Advanced Permission"
   - Approve in MetaMask popup

3. **View Analytics**
   - Scroll down to see Envio Dashboard
   - View real-time indexed data
   - Check gas analytics and charts

4. **Test Rebalance**
   - Trigger a rebalance action
   - View transaction in Envio dashboard
   - Check updated gas savings

## 📊 Verification

### Contract Verification on Etherscan
```bash
cd contracts
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### Check Envio Indexing
```bash
# Query GraphQL endpoint
curl -X POST http://localhost:8080/v1/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ UserConfig { id user spendingCap } }"}'
```

### Test Backend API
```bash
curl http://localhost:8000/health
curl http://localhost:8000/portfolio/YOUR_WALLET_ADDRESS
```

## 🎯 Demo Flow for Judges

1. **Introduction** (30 seconds)
   - Show landing page
   - Explain AutoPilot DeFi concept

2. **MetaMask Advanced Permissions** (1 minute)
   - Connect wallet
   - Configure spending limits
   - Grant permission - **SHOW METAMASK POPUP**
   - Highlight granular controls

3. **Envio Analytics** (1 minute)
   - Scroll to analytics dashboard
   - Show real-time indexed data
   - Highlight gas savings chart
   - Show permission event history

4. **Live Rebalance** (1 minute)
   - Trigger rebalance
   - Show transaction execution
   - Dashboard updates in real-time
   - Point out gas optimization

5. **Key Features** (30 seconds)
   - Advanced Permissions (ERC-7715)
   - Envio blockchain indexing
   - Gas optimization
   - Auto-expiry security

## 🐛 Troubleshooting

### MetaMask Permission Popup Not Showing
- Ensure using latest MetaMask version
- Check network is Sepolia
- Verify contract address is correct

### Envio Not Indexing
- Check Envio service is running
- Verify contract address in config.yaml
- Check start_block is before deployment block

### Backend Connection Error
- Verify Envio GraphQL URL is correct
- Check CORS settings
- Ensure Envio service is accessible

## 📦 Production Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist folder
```

### Backend (Railway/Render)
```bash
cd backend
# Use Dockerfile for deployment
```

### Envio (Hosted)
- Deploy to Envio Cloud
- Update GraphQL endpoints in all configs

## 🔗 Important Links

- Sepolia Faucet: https://sepoliafaucet.com/
- Sepolia Explorer: https://sepolia.etherscan.io/
- MetaMask Docs: https://docs.metamask.io/
- Envio Docs: https://docs.envio.dev/

## ✅ Checklist Before Demo

- [ ] Contract deployed to Sepolia
- [ ] Contract verified on Etherscan
- [ ] Envio indexer running and synced
- [ ] Backend API responding
- [ ] Frontend loading correctly
- [ ] MetaMask connected to Sepolia
- [ ] Test wallet has Sepolia ETH
- [ ] Permission grant flow tested
- [ ] Analytics dashboard showing data
- [ ] Dark mode toggle working
