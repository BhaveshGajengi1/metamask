// src/components/ConnectWallet.tsx
import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';

const ConnectWallet: React.FC = () => {
  const { userAddress, isConnected, connectWallet, disconnectWallet } = useWallet();
  const [copied, setCopied] = useState(false);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    if (userAddress) {
      navigator.clipboard.writeText(userAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {isConnected && userAddress ? (
        <>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <button
              onClick={copyAddress}
              className="text-green-800 dark:text-green-300 text-sm font-semibold hover:text-green-600 dark:hover:text-green-200 transition-colors"
              title="Click to copy address"
            >
              {copied ? '✓ Copied!' : shortenAddress(userAddress)}
            </button>
          </div>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-glow transition-all font-bold shadow-lg transform hover:scale-105 animate-gradient"
        >
          🦊 Connect MetaMask
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;