import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from './ToastContainer';
import { smartAccountManager } from '../lib/smartAccount';

const PermissionManager: React.FC = () => {
  const { userAddress, signer } = useWallet();
  const { showToast } = useToast();

  const [spendingCap, setSpendingCap] = useState(5000);
  const [duration, setDuration] = useState(30);
  const [permissionStatus, setPermissionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (userAddress && signer) {
      loadPermissionStatus();
    }
  }, [userAddress, signer]);

  const loadPermissionStatus = async () => {
    try {
      if (!signer) {
        console.log('No signer available');
        return;
      }

      smartAccountManager.initialize(signer);
      const permission = await smartAccountManager.getPermission(userAddress!);

      if (permission.active) {
        setPermissionStatus({
          isActive: permission.active,
          isPaused: false,
          spendingCap: Number(permission.spendingCap) / 1e6, // Convert from USDC decimals
          spentThisMonth: Number(permission.spent) / 1e6,
          expiresAt: Number(permission.expiry) * 1000,
          grantedAt: Number(permission.grantedAt) * 1000,
        });
      }
    } catch (error) {
      console.error('Error loading permission:', error);
    }
  };

  const handleGrant = async () => {
    if (!signer) {
      showToast('error', 'Please connect your wallet first!', 3000);
      return;
    }

    try {
      setLoading(true);
      showToast('info', '🔐 Requesting permission... Check MetaMask!', 3000);

      smartAccountManager.initialize(signer);
      const txHash = await smartAccountManager.grantPermission(spendingCap, duration);

      showToast('success', `✓ Permission granted! Transaction: ${txHash.slice(0, 10)}...`, 5000);

      // Reload permission status
      await loadPermissionStatus();
    } catch (error: any) {
      console.error('Error granting permission:', error);
      showToast('error', `Failed: ${error.message || 'Transaction rejected'}`, 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!signer) {
      showToast('error', 'Please connect your wallet first!', 3000);
      return;
    }

    try {
      setLoading(true);
      showToast('info', '🗑️ Revoking permission... Check MetaMask!', 3000);

      smartAccountManager.initialize(signer);
      const txHash = await smartAccountManager.revokePermission();

      setPermissionStatus(null);
      showToast('success', `✓ Permission revoked! Transaction: ${txHash.slice(0, 10)}...`, 5000);
    } catch (error: any) {
      console.error('Error revoking permission:', error);
      showToast('error', `Failed: ${error.message || 'Transaction rejected'}`, 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePause = async () => {
    if (!signer) {
      showToast('error', 'Please connect your wallet first!', 3000);
      return;
    }

    try {
      setLoading(true);
      const newPauseState = !isPaused;
      showToast('info', `${newPauseState ? '⏸️ Pausing' : '▶️ Resuming'} automation... Check MetaMask!`, 3000);

      smartAccountManager.initialize(signer);
      const txHash = await smartAccountManager.togglePause(newPauseState);

      setIsPaused(newPauseState);
      setPermissionStatus({ ...permissionStatus, isPaused: newPauseState });
      showToast('success', `✓ Automation ${newPauseState ? 'paused' : 'resumed'}! Transaction: ${txHash.slice(0, 10)}...`, 5000);
    } catch (error: any) {
      console.error('Error toggling pause:', error);
      showToast('error', `Failed: ${error.message || 'Transaction rejected'}`, 4000);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeRemaining = () => {
    if (!permissionStatus?.expiresAt) return '';
    const remaining = permissionStatus.expiresAt - Date.now();
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    return `${days}d ${hours}h`;
  };

  const calculateUsagePercentage = () => {
    if (!permissionStatus) return 0;
    return (permissionStatus.spentThisMonth / permissionStatus.spendingCap) * 100;
  };

  if (!userAddress) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 text-center border border-gray-200/50 dark:border-gray-700/50">
        <div className="text-6xl mb-4 animate-bounce-slow">🔒</div>
        <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Connect Wallet</h3>
        <p className="text-gray-500 dark:text-gray-400">Connect your wallet to manage advanced permissions</p>
      </div>
    );
  }

  const hasPermission = permissionStatus?.isActive;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
          <span className="text-3xl">🛡️</span> Advanced Permissions
        </h2>
        {hasPermission && (
          <div className={`px-4 py-2 rounded-xl text-sm font-bold shadow-md ${isPaused
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 animate-pulse-slow'
            }`}>
            {isPaused ? '⏸️ Paused' : '✓ Active'}
          </div>
        )}
      </div>

      {hasPermission ? (
        <div className="space-y-6">
          {/* Permission Stats */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-800/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Spending Cap</div>
                <div className="text-2xl font-black text-gray-800 dark:text-white">${permissionStatus.spendingCap}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">USDC</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Spent</div>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">${permissionStatus.spentThisMonth}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">this month</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Remaining</div>
                <div className="text-2xl font-black text-green-600 dark:text-green-400">
                  ${permissionStatus.spendingCap - permissionStatus.spentThisMonth}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">available</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Expires In</div>
                <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{calculateTimeRemaining()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">remaining</div>
              </div>
            </div>

            {/* Usage Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Usage</span>
                <span className="text-gray-800 dark:text-white font-bold">{calculateUsagePercentage().toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 rounded-full"
                  style={{ width: `${calculateUsagePercentage()}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleTogglePause}
              disabled={loading}
              className="group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl transition-all font-bold shadow-md hover:shadow-glow-warning disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              <div className="relative z-10">
                {loading ? '⏳ Processing...' : isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </div>
            </button>
            <button
              onClick={handleRevoke}
              disabled={loading}
              className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 px-4 rounded-xl transition-all font-bold shadow-md hover:shadow-glow-error disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              <div className="relative z-10">
                {loading ? '⏳ Processing...' : '🗑️ Revoke'}
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Configuration Panel */}
          <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-xl border border-gray-200 dark:border-gray-600">
            <h3 className="font-bold mb-6 text-gray-800 dark:text-white text-lg">Configure Permission</h3>

            <div className="space-y-6">
              {/* Spending Cap Slider */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Monthly Spending Cap: <span className="text-blue-600 dark:text-blue-400 text-xl">${spendingCap.toLocaleString()}</span> USDC
                </label>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={spendingCap}
                  onChange={(e) => setSpendingCap(Number(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #a855f7 ${(spendingCap / 10000) * 100}%, #e5e7eb ${(spendingCap / 10000) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  <span>$100</span>
                  <span>$5,000</span>
                  <span>$10,000</span>
                </div>
              </div>

              {/* Duration Slider */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Duration: <span className="text-purple-600 dark:text-purple-400 text-xl">{duration}</span> days
                </label>
                <input
                  type="range"
                  min="7"
                  max="365"
                  step="1"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #a855f7 0%, #ec4899 ${(duration / 365) * 100}%, #e5e7eb ${(duration / 365) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  <span>7 days</span>
                  <span>6 months</span>
                  <span>1 year</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grant Button */}
          <button
            onClick={handleGrant}
            disabled={loading}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 px-4 rounded-xl transition-all font-bold text-lg shadow-lg hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 animate-gradient"
          >
            <div className="relative z-10">
              {loading ? '⏳ Processing...' : '🚀 Grant Permission'}
            </div>
          </button>
        </div>
      )}

      {/* Features List */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-green-500 text-lg">✓</div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Scoped spending caps</span>
          </div>
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-blue-500 text-lg">✓</div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Auto-expiry security</span>
          </div>
          <div className="flex items-start gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-purple-500 text-lg">✓</div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Revocable anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionManager;