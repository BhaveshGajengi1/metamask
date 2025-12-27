import React, { useState, useEffect } from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useWallet } from '../contexts/WalletContext';
import { mockDailyMetrics, mockTransactions } from '../utils/mockData';

const EnvioDashboard: React.FC = () => {
    const { userAddress } = useWallet();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation on mount
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!userAddress) {
        return (
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-gray-700/50 transform transition-all duration-500 hover:scale-[1.02]">
                <div className="text-7xl mb-6 animate-bounce-slow">📊</div>
                <h3 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    Analytics Dashboard
                </h3>
                <p className="text-gray-400 text-lg">Connect your wallet to view real-time analytics</p>
            </div>
        );
    }

    // Mock data for demonstration
    const chartData = mockDailyMetrics.map(metric => ({
        date: metric.date.split('-')[2],
        rebalances: metric.rebalances,
        gasUsed: metric.gasUsed * 1000,
        gasSaved: metric.gasSaved * 1000,
        volume: metric.volume,
    }));

    const stats = {
        totalRebalances: mockTransactions.filter(t => t.type === 'rebalance').length,
        totalGasSaved: mockTransactions.reduce((acc, t) => acc + (t.gasSaved || 0), 0),
        totalVolume: mockDailyMetrics.reduce((acc, m) => acc + m.volume, 0),
        avgGasPerTx: 0.0021,
    };

    return (
        <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Header Card with Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white transform transition-all duration-500 hover:shadow-glow-lg hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 hover:opacity-100 transition-opacity duration-500 animate-gradient"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-black mb-3 flex items-center gap-3">
                        <span className="text-5xl animate-pulse-slow">📊</span> Analytics Dashboard
                    </h2>
                    <p className="text-xl opacity-90 font-medium">Real-time data indexed by Envio • Live on Sepolia</p>
                </div>

                {/* Animated Background Orbs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Stats Grid with Unique Animations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Rebalances', value: stats.totalRebalances, icon: '🔄', color: 'from-blue-500 to-cyan-500', delay: '0s' },
                    { label: 'Gas Saved', value: `${stats.totalGasSaved.toFixed(4)} ETH`, icon: '⛽', color: 'from-green-500 to-emerald-500', delay: '0.1s' },
                    { label: 'Total Volume', value: `$${stats.totalVolume.toLocaleString()}`, icon: '💰', color: 'from-purple-500 to-pink-500', delay: '0.2s' },
                    { label: 'Avg Gas/Tx', value: `${stats.avgGasPerTx} ETH`, icon: '📈', color: 'from-orange-500 to-red-500', delay: '0.3s' },
                ].map((stat, idx) => (
                    <div
                        key={idx}
                        className="group relative overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-700/50 transform transition-all duration-500 hover:scale-110 hover:shadow-glow cursor-pointer"
                        style={{ animationDelay: stat.delay }}
                    >
                        {/* Animated Gradient Border */}
                        <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl p-[2px]">
                            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} animate-gradient rounded-2xl`}></div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-4xl group-hover:scale-125 transition-transform duration-300">{stat.icon}</span>
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                            </div>
                            <div className="text-gray-400 text-sm font-semibold mb-2">{stat.label}</div>
                            <div className="text-3xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                                {stat.value}
                            </div>
                        </div>

                        {/* Hover Glow Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`}></div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Rebalance Volume Chart */}
                <div className="group bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/50 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-glow">
                    <h3 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                        <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">📈</span>
                        Rebalance Volume
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #374151',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                                }}
                                labelStyle={{ color: '#f3f4f6' }}
                            />
                            <Area type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Gas Metrics Chart */}
                <div className="group bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/50 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-glow-success">
                    <h3 className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                        <span className="text-3xl group-hover:scale-125 transition-transform duration-300">⛽</span>
                        Gas Savings
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #374151',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                                }}
                                labelStyle={{ color: '#f3f4f6' }}
                            />
                            <Legend />
                            <Bar dataKey="gasUsed" fill="#ef4444" name="Gas Used" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="gasSaved" fill="#10b981" name="Gas Saved" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="group bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/50 transform transition-all duration-500 hover:shadow-glow">
                <h3 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                    <span className="text-3xl group-hover:rotate-180 transition-transform duration-500">🔄</span>
                    Recent Rebalances
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left py-4 px-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="text-left py-4 px-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Swap</th>
                                <th className="text-right py-4 px-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="text-right py-4 px-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Gas Saved</th>
                                <th className="text-right py-4 px-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockTransactions.filter(t => t.type === 'rebalance').slice(0, 5).map((tx, idx) => (
                                <tr
                                    key={tx.id}
                                    className="border-b border-gray-800 hover:bg-gradient-to-r hover:from-blue-900/20 hover:to-purple-900/20 transition-all duration-300 transform hover:scale-[1.01]"
                                    style={{ animationDelay: `${idx * 0.1}s` }}
                                >
                                    <td className="py-4 px-6 text-sm text-gray-300 font-medium">
                                        {new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="py-4 px-6 text-sm">
                                        <span className="inline-flex items-center gap-2">
                                            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-bold">{tx.fromToken}</span>
                                            <span className="text-gray-500">→</span>
                                            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-bold">{tx.toToken}</span>
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-right font-bold text-white">
                                        {tx.amount?.toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-right font-bold text-green-400">
                                        {tx.gasSaved?.toFixed(4)} ETH
                                    </td>
                                    <td className="py-4 px-6 text-sm text-right">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-bold text-xs">
                                            ✓ {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EnvioDashboard;
