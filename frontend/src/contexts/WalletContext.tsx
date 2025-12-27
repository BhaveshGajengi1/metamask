// src/contexts/WalletContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider } from 'ethers';

interface WalletContextType {
  provider: BrowserProvider | null;
  signer: any | null;
  userAddress: string;
  chainId: number;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<any | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [chainId, setChainId] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    checkConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await setupProvider();
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      await setupProvider();
    }
  };

  const handleChainChanged = async (chainId: string) => {
    window.location.reload();
  };

  const setupProvider = async () => {
    try {
      const web3Provider = new BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const address = await web3Signer.getAddress();
      const network = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setUserAddress(address);
      setChainId(Number(network.chainId));
      setIsConnected(true);
    } catch (error) {
      console.error('Error setting up provider:', error);
    }
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await setupProvider();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setUserAddress('');
    setChainId(0);
    setIsConnected(false);
  };

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        userAddress,
        chainId,
        isConnected,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};