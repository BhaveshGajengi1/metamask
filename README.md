# 🚀 AutoPilot DeFi - MetaMask Advanced Permissions Hackathon

> Automated portfolio rebalancing with MetaMask Advanced Permissions (ERC-7715) + Envio blockchain indexing

[![MetaMask](https://img.shields.io/badge/MetaMask-Advanced_Permissions-orange)](https://metamask.io)
[![Envio](https://img.shields.io/badge/Envio-Blockchain_Indexing-blue)](https://envio.dev)
[![Sepolia](https://img.shields.io/badge/Network-Sepolia-purple)](https://sepolia.etherscan.io)

## 🎯 Overview

AutoPilot DeFi is a next-generation DeFi automation platform that leverages **MetaMask Advanced Permissions (ERC-7715)** to provide secure, granular control over automated portfolio rebalancing. Unlike traditional unlimited ERC-20 approvals, our solution offers:

- ✅ **Spending Caps** - Monthly limits on automated transactions
- ✅ **Auto-Expiry** - Permissions automatically expire after 30 days
- ✅ **Pause/Resume** - One-click control over automation
- ✅ **Real-time Analytics** - Powered by Envio blockchain indexing
- ✅ **Gas Optimization** - Save up to 30% on transaction costs

## 🏆 Hackathon Features

### 1. MetaMask Advanced Permissions (ERC-7715)
- Replaces unlimited ERC-20 approvals with granular permissions
- Monthly spending caps and per-transaction limits
- Permission lifecycle management (grant, pause, revoke, expiry)
- Clear UI showing permission status and countdown

### 2. Envio Blockchain Indexing
- Real-time indexing on Sepolia testnet
- Portfolio balance tracking
- Rebalance history with gas analytics
- Permission event timeline
- GraphQL API for efficient queries

### 3. Smart Contract (Sepolia)
- Sepolia token constants (USDC, WETH)
- Permission-related events for Envio
- Gas-optimized rebalancing logic
- Demo-ready with clear function naming

### 4. Production-Ready UI
- Professional Tailwind CSS styling
- Dark/light mode support
- Responsive design (mobile-friendly)
- Loading states and success animations
- Tooltips explaining Advanced Permissions

## 📁 Project Structure

```
metamask/
├── contracts/              # Solidity smart contracts
│   ├── AutoPilot.sol      # Main contract with ERC-7715 support
│   ├── hardhat.config.js  # Hardhat configuration
│   └── scripts/deploy.js  # Deployment script
├── indexing/              # Envio blockchain indexer
│   ├── config.yaml        # Envio configuration (Sepolia)
│   ├── schema.graphql     # GraphQL schema
│   └── src/
│       └── EventHandlers.ts  # Event processing logic
├── backend/               # Python FastAPI backend
│   ├── main.py           # API endpoints
│   ├── services/
│   │   └── envio_client.py  # Envio GraphQL client
│   └── requirements.txt
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx         # Main dashboard
│   │   │   ├── PermissionManager.tsx # Permission controls
│   │   │   ├── EnvioDashboard.tsx    # Analytics dashboard
│   │   │   └── ConnectWallet.tsx     # Wallet connection
│   │   ├── lib/
│   │   │   └── permissions.ts        # Advanced Permissions SDK
│   │   └── hooks/
│   │       └── usePermissions.ts     # Permission hooks
│   ├── tailwind.config.js
│   └── package.json
└── DEPLOYMENT.md          # Deployment guide
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- MetaMask with Sepolia ETH

### 1. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
pip install -r requirements.txt

# Contracts
cd contracts
npm install
```

### 2. Configure Environment

```bash
# Frontend
cp frontend/.env.example frontend/.env
# Update VITE_CONTRACT_ADDRESS after deployment

# Backend
cp backend/.env.example backend/.env
# Update ENVIO_GRAPHQL_URL after Envio setup
```

### 3. Deploy Smart Contract

```bash
cd contracts
npx hardhat run scripts/deploy.js --network sepolia
# Note the contract address
```

### 4. Start Envio Indexer

```bash
cd indexing
# Update config.yaml with contract address
envio dev
```

### 5. Run Backend

```bash
cd backend
python main.py
```

### 6. Run Frontend

```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` 🎉

## 🎬 Demo Flow

1. **Connect Wallet** → MetaMask on Sepolia
2. **Grant Permission** → Set spending cap, see MetaMask popup
3. **View Analytics** → Real-time Envio dashboard with charts
4. **Trigger Rebalance** → Watch gas savings accumulate
5. **Manage Permissions** → Pause, resume, or revoke anytime

## 🔑 Key Technologies

- **Smart Contracts**: Solidity 0.8.19
- **Advanced Permissions**: @metamask/smart-accounts-kit
- **Blockchain Indexing**: Envio
- **Backend**: Python FastAPI
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Network**: Ethereum Sepolia Testnet

## 📊 Features Showcase

### Permission Manager
- Configure monthly spending limits
- Set slippage tolerance
- Grant/revoke permissions with one click
- Visual status indicators (Active/Paused/Revoked)
- Expiration countdown

### Envio Analytics Dashboard
- Live portfolio balances (ETH, USDC)
- Historical rebalance chart
- Gas usage trends
- Permission event timeline
- Transaction history table

### Smart Contract Events
- `PermissionGranted` - Track when permissions are granted
- `PermissionRevoked` - Monitor revocations
- `PermissionPaused/Resumed` - Lifecycle management
- `RebalanceExecuted` - Record all rebalances with gas data

## 🛡️ Security Features

- **No Unlimited Approvals** - All permissions have spending caps
- **Auto-Expiry** - Permissions expire after 30 days
- **Pause Anytime** - Users can pause automation instantly
- **Granular Control** - Per-transaction and monthly limits
- **Transparent** - All events indexed and visible

## 📈 Gas Optimization

- Automated execution during low gas periods
- Batch operations when possible
- Estimated 30% savings vs manual execution
- Real-time gas analytics via Envio

## 🎨 UI/UX Highlights

- **Dark Mode** - Toggle between light and dark themes
- **Responsive** - Mobile-first design
- **Animations** - Smooth transitions and success states
- **Tooltips** - Contextual help for Advanced Permissions
- **Loading States** - Clear feedback during operations

## 📝 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Step-by-step deployment
- [Smart Contract](./contracts/AutoPilot.sol) - Contract source code
- [Envio Schema](./indexing/schema.graphql) - GraphQL schema

## 🏅 Hackathon Submission

**Track**: Best Integration of MetaMask Advanced Permissions

**Highlights**:
- ✅ Full ERC-7715 implementation
- ✅ Envio real-time indexing
- ✅ Production-ready UI/UX
- ✅ Comprehensive analytics
- ✅ Demo-ready on Sepolia

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Video Demo**: [Coming Soon]
- **Sepolia Contract**: [Update after deployment]
- **Envio Dashboard**: [Update after deployment]

## 👥 Team

Built with ❤️ for the MetaMask Advanced Permissions Hackathon

## 📄 License

MIT License

---

**Made with** 🚀 **MetaMask Advanced Permissions** + 📊 **Envio Indexing**
