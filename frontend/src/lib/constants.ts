// src/lib/constants.ts
// Contract address - update this with your deployed contract
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0xYourContractAddressHere';

// Chain configurations
export const CHAINS = {
  BASE_SEPOLIA: {
    id: 84532,
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    currency: 'ETH',
    explorer: 'https://sepolia.basescan.org',
  },
  // Add other EIP-7702 supported chains
} as const;

// Token addresses (Base Sepolia)
export const TOKENS = {
  USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  WETH: '0x4200000000000000000000000000000000000006',
} as const;

// Default settings
export const DEFAULT_SETTINGS = {
  monthlyCap: '1000', // USDC
  slippage: '5', // percent
  rebalanceThreshold: '5', // percent
  ethTarget: '60', // percent
  usdcTarget: '40', // percent
} as const;

// Check if we're on Base Sepolia
export const isSupportedChain = (chainId: number): boolean => {
  return chainId === CHAINS.BASE_SEPOLIA.id;
};