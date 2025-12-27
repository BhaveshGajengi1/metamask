// src/components/Dashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import PermissionManager from './PermissionManager';
import EnvioDashboard from './EnvioDashboard';
import ConnectWallet from './ConnectWallet';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from './ToastContainer';
import { simulateMarketMovement, executeRebalance, mockTransactions } from '../utils/mockData';

const Dashboard: React.FC = () => {
  const { userAddress } = useWallet();
  const { showToast } = useToast();
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const permissionRef = useRef<HTMLDivElement>(null);
  const analyticsRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Set dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Scroll animation observer
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    [permissionRef, analyticsRef, actionsRef].forEach(ref => {
      if (ref.current) {
        ref.current.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-1000');
        observer.observe(ref.current);
      }
    });

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleSimulateMarket = async () => {
    setIsSimulating(true);
    showToast('info', '🎲 Simulating market movement...', 2000);

    setTimeout(() => {
      const result = simulateMarketMovement();
      setIsSimulating(false);

      if (result.shouldRebalance) {
        showToast('warning', `${result.message} - Rebalance recommended!`, 4000);
      } else {
        showToast('success', `${result.message} - Portfolio balanced`, 3000);
      }
    }, 1500);
  };

  const handleManualRebalance = async () => {
    if (!userAddress) {
      showToast('error', 'Please connect your wallet first', 3000);
      return;
    }

    setIsRebalancing(true);
    showToast('info', '⚡ Executing rebalance...', 2000);

    setTimeout(() => {
      const transaction = executeRebalance();
      setIsRebalancing(false);
      showToast('success', `✓ Rebalanced ${transaction.amount?.toFixed(2)} ${transaction.fromToken} → ${transaction.toToken}. Gas saved: ${transaction.gasSaved?.toFixed(4)} ETH`, 5000);
    }, 2000);
  };

  const handleViewHistory = () => {
    setShowHistory(!showHistory);
    if (!showHistory) {
      showToast('info', '📊 Transaction history loaded', 2000);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black transition-all duration-500 relative overflow-hidden">
        {/* Ultra Premium Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Animated Gradient Orbs */}
          <div
            className="absolute w-[800px] h-[800px] bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse-slow"
            style={{
              top: `${20 - scrollY * 0.1}%`,
              left: `${10 + scrollY * 0.05}%`,
              transform: 'translate(-50%, -50%)'
            }}
          ></div>
          <div
            className="absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse-slow"
            style={{
              animationDelay: '1s',
              bottom: `${10 + scrollY * 0.08}%`,
              right: `${15 - scrollY * 0.06}%`,
              transform: 'translate(50%, 50%)'
            }}
          ></div>
          <div
            className="absolute w-[700px] h-[700px] bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-full blur-3xl animate-pulse-slow"
            style={{
              animationDelay: '2s',
              top: `${50 + scrollY * 0.04}%`,
              left: `${50 - scrollY * 0.03}%`,
              transform: 'translate(-50%, -50%)'
            }}
          ></div>

          {/* Animated Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse-slow"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Ultra Premium Header */}
            <header className="mb-12 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="group">
                  <h1 className="text-5xl md:text-7xl font-black mb-3 relative inline-block">
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                      🚀 AutoPilot DeFi
                    </span>
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
                  </h1>
                  <p className="text-gray-400 text-lg md:text-xl font-medium">
                    Automated portfolio rebalancing with{' '}
                    <span className="font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                      MetaMask Advanced Permissions
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="group relative p-4 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl hover:shadow-glow transition-all transform hover:scale-110 border border-gray-700 overflow-hidden"
                    title="Toggle theme"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <span className="text-3xl relative z-10 block group-hover:rotate-180 transition-transform duration-500">
                      {darkMode ? '☀️' : '🌙'}
                    </span>
                  </button>
                  <ConnectWallet />
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <div ref={permissionRef}>
                  <PermissionManager />
                </div>
                <div ref={analyticsRef}>
                  <EnvioDashboard />
                </div>
              </div>

              {/* Sidebar with Ultra Premium Actions */}
              <div className="space-y-8" ref={actionsRef}>
                {/* Quick Actions Card */}
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/50 transform transition-all duration-500 hover:scale-[1.02]">
                  <h3 className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                    <span className="text-4xl animate-bounce-slow">⚡</span> Quick Actions
                  </h3>
                  <div className="space-y-4">
                    {/* Simulate Market Button */}
                    <button
                      onClick={handleSimulateMarket}
                      disabled={isSimulating}
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-5 px-6 rounded-2xl transition-all font-black text-lg shadow-xl hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        <span className="text-2xl group-hover:rotate-180 transition-transform duration-500">
                          {isSimulating ? '⏳' : '🎲'}
                        </span>
                        <span>Simulate Market</span>
                      </div>
                    </button>

                    {/* Manual Rebalance Button */}
                    <button
                      onClick={handleManualRebalance}
                      disabled={isRebalancing || !userAddress}
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-5 px-6 rounded-2xl transition-all font-black text-lg shadow-xl hover:shadow-glow-success disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[-100%] transition-transform duration-700"></div>
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                          {isRebalancing ? '⏳' : '⚡'}
                        </span>
                        <span>Manual Rebalance</span>
                      </div>
                    </button>

                    {/* View History Button */}
                    <button
                      onClick={handleViewHistory}
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-5 px-6 rounded-2xl transition-all font-black text-lg shadow-xl hover:shadow-glow disabled:opacity-50 transform hover:scale-105 active:scale-95"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full"></div>
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">📊</span>
                        <span>View History</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Transaction History Modal */}
                {showHistory && (
                  <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/50 animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Recent Transactions
                      </h3>
                      <button
                        onClick={() => setShowHistory(false)}
                        className="text-gray-400 hover:text-white transition-colors text-2xl hover:rotate-90 transform duration-300"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                      {mockTransactions.slice(0, 5).map((tx, idx) => (
                        <div
                          key={tx.id}
                          className="p-4 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl hover:from-blue-900/30 hover:to-purple-900/30 transition-all duration-300 transform hover:scale-[1.02] border border-gray-600/30"
                          style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-black text-white capitalize text-lg">{tx.type}</div>
                              {tx.fromToken && tx.toToken && (
                                <div className="text-sm text-gray-400 mt-2 flex items-center gap-2">
                                  <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 font-bold">{tx.fromToken}</span>
                                  <span>→</span>
                                  <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 font-bold">{tx.toToken}</span>
                                </div>
                              )}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-black ${tx.status === 'success' ? 'bg-green-500/20 text-green-400' :
                                tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                              }`}>
                              {tx.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-3 font-mono">{tx.hash}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Network Info Card */}
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/50 transform transition-all duration-500 hover:scale-[1.02]">
                  <h3 className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                    <span className="text-4xl animate-pulse-slow">🔗</span> Network
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Chain', value: 'Sepolia', gradient: 'from-blue-500 to-cyan-500' },
                      { label: 'Indexer', value: 'Envio', gradient: 'from-green-500 to-emerald-500' },
                      { label: 'Status', value: 'Live', gradient: 'from-green-500 to-emerald-500', pulse: true }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-xl hover:from-gray-700/50 hover:to-gray-800/50 transition-all duration-300 transform hover:scale-105"
                      >
                        <span className="text-gray-400 font-bold">{item.label}</span>
                        <span className={`font-black text-lg bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent flex items-center gap-2`}>
                          {item.pulse && <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>}
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Ultra Premium Footer */}
            <footer className="mt-16 pt-8 border-t border-gray-800 text-center animate-fade-in">
              <p className="text-gray-400 text-lg font-medium">
                AutoPilot DeFi • Powered by{' '}
                <span className="font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  MetaMask Advanced Permissions
                </span>
                {' '}+{' '}
                <span className="font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Envio
                </span>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
