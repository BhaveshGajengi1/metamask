# Deployment Instructions

## 🚀 Quick Deployment Steps

### 1. Configure Private Key

Create `contracts/.env` file:

```bash
PRIVATE_KEY=your_private_key_without_0x_prefix
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
ETHERSCAN_API_KEY=your_etherscan_api_key_optional
```

### 2. Get Sepolia ETH

Visit: https://sepoliafaucet.com/

### 3. Deploy Contract

```bash
cd contracts
npx hardhat run scripts/deploy.js --network sepolia
```

### 4. Update Configuration

After deployment, update these files with the contract address:
- `indexing/config.yaml`
- `frontend/.env` (create from `.env.example`)

### 5. Start Services

```bash
# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
python main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit: http://localhost:5173

## ✅ Ready to Deploy

All dependencies installed and configurations prepared!
