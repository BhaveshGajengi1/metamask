# AutoPilot DeFi

A MetaMask-native DeFi automation application.

## Features
- **Automated Rebalancing**: Maintains target portfolio allocation via permissioned smart contracts.
- **Granular Permissions**: Users set spending caps, slippage limits, and can pause/revoke access.
- **On-Chain Enforcement**: All logic enforced by smart contracts; non-custodial.
- **Data Indexing**: Uses Envio for real-time portfolio tracking.

## Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Python (FastAPI)
- **Smart Contracts**: Solidity (Hardhat)
- **Indexing**: Envio

## Setup
1. `cd frontend && npm install`
2. `cd backend && pip install -r requirements.txt`
3. `cd contracts && npm install`
