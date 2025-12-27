// Mock data for demo purposes
export interface PortfolioBalance {
    token: string;
    symbol: string;
    balance: number;
    value: number;
    change24h: number;
}

export interface Transaction {
    id: string;
    type: 'rebalance' | 'grant' | 'revoke' | 'pause' | 'resume';
    timestamp: number;
    fromToken?: string;
    toToken?: string;
    amount?: number;
    gasUsed?: number;
    gasSaved?: number;
    status: 'success' | 'pending' | 'failed';
    hash: string;
}

export interface PermissionEvent {
    id: string;
    type: 'granted' | 'revoked' | 'paused' | 'resumed';
    timestamp: number;
    spendingCap?: number;
    expiresAt?: number;
}

export interface DailyMetric {
    date: string;
    rebalances: number;
    gasUsed: number;
    gasSaved: number;
    volume: number;
}

export const mockPortfolio: PortfolioBalance[] = [
    {
        token: 'ETH',
        symbol: 'ETH',
        balance: 2.5,
        value: 5750.0,
        change24h: 3.2,
    },
    {
        token: 'USDC',
        symbol: 'USDC',
        balance: 10000,
        value: 10000,
        change24h: 0.1,
    },
    {
        token: 'WETH',
        symbol: 'WETH',
        balance: 1.2,
        value: 2760.0,
        change24h: 3.1,
    },
];

export const mockTransactions: Transaction[] = [
    {
        id: '1',
        type: 'rebalance',
        timestamp: Date.now() - 3600000,
        fromToken: 'USDC',
        toToken: 'ETH',
        amount: 1000,
        gasUsed: 0.002,
        gasSaved: 0.0006,
        status: 'success',
        hash: '0x1234...5678',
    },
    {
        id: '2',
        type: 'rebalance',
        timestamp: Date.now() - 7200000,
        fromToken: 'ETH',
        toToken: 'USDC',
        amount: 0.5,
        gasUsed: 0.0018,
        gasSaved: 0.0005,
        status: 'success',
        hash: '0x2345...6789',
    },
    {
        id: '3',
        type: 'grant',
        timestamp: Date.now() - 86400000,
        status: 'success',
        hash: '0x3456...7890',
    },
    {
        id: '4',
        type: 'rebalance',
        timestamp: Date.now() - 172800000,
        fromToken: 'USDC',
        toToken: 'WETH',
        amount: 2000,
        gasUsed: 0.0022,
        gasSaved: 0.0007,
        status: 'success',
        hash: '0x4567...8901',
    },
];

export const mockPermissionEvents: PermissionEvent[] = [
    {
        id: '1',
        type: 'granted',
        timestamp: Date.now() - 86400000,
        spendingCap: 5000,
        expiresAt: Date.now() + 2505600000, // 29 days from now
    },
];

export const mockDailyMetrics: DailyMetric[] = [
    { date: '2024-12-20', rebalances: 3, gasUsed: 0.006, gasSaved: 0.0018, volume: 4500 },
    { date: '2024-12-21', rebalances: 5, gasUsed: 0.01, gasSaved: 0.003, volume: 7200 },
    { date: '2024-12-22', rebalances: 2, gasUsed: 0.004, gasSaved: 0.0012, volume: 3000 },
    { date: '2024-12-23', rebalances: 4, gasUsed: 0.008, gasSaved: 0.0024, volume: 5800 },
    { date: '2024-12-24', rebalances: 6, gasUsed: 0.012, gasSaved: 0.0036, volume: 8900 },
    { date: '2024-12-25', rebalances: 3, gasUsed: 0.006, gasSaved: 0.0018, volume: 4200 },
    { date: '2024-12-26', rebalances: 7, gasUsed: 0.014, gasSaved: 0.0042, volume: 10500 },
];

export const simulateMarketMovement = () => {
    // Simulate random price changes
    const change = (Math.random() - 0.5) * 10; // -5% to +5%
    return {
        message: `Market simulated: ${change > 0 ? '+' : ''}${change.toFixed(2)}% price movement`,
        change,
        shouldRebalance: Math.abs(change) > 3,
    };
};

export const executeRebalance = () => {
    const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'rebalance',
        timestamp: Date.now(),
        fromToken: Math.random() > 0.5 ? 'USDC' : 'ETH',
        toToken: Math.random() > 0.5 ? 'ETH' : 'USDC',
        amount: Math.random() * 1000 + 500,
        gasUsed: Math.random() * 0.003 + 0.001,
        gasSaved: Math.random() * 0.001 + 0.0003,
        status: 'success',
        hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
    };

    return newTransaction;
};

export const getPermissionStatus = () => {
    return {
        isActive: true,
        isPaused: false,
        spendingCap: 5000,
        spentThisMonth: 3200,
        expiresAt: Date.now() + 2505600000, // 29 days from now
        grantedAt: Date.now() - 86400000,
    };
};
