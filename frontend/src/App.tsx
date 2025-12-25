import React, { useState, useEffect } from 'react';
import './index.css';
import { connectMetaMask } from './utils/ethereum';

// Default Mock Data (fallback)
const DEFAULT_PORTFOLIO = {
  totalValue: 12450.32,
  drift: 3.2,
  allocation: { "ETH": 58, "USDC": 42 },
  estimated_gas_saved: 0
};

function App() {
  const [wallet, setWallet] = useState<any>(null);
  const [portfolio, setPortfolio] = useState(DEFAULT_PORTFOLIO);
  const [config, setConfig] = useState({
    spendingCap: 1000,
    slippage: 1.0,
    paused: false
  });
  const [rebalanceActions, setRebalanceActions] = useState<any[]>([]);

  const connect = async () => {
    try {
      const data = await connectMetaMask();
      if (data) {
        setWallet(data);
        fetchPortfolio(data.address);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPortfolio = async (address: string) => {
    try {
      // Try to fetch from backend
      const res = await fetch(`${import.meta.env.VITE_API_URL}/portfolio/${address}`);
      const data = await res.json();
      if (data) {
        setPortfolio({
          totalValue: 12450.32, // Mock value as backend returns alloc only
          drift: data.drift,
          allocation: data.current_allocation,
          estimated_gas_saved: data.estimated_gas_saved
        });
      }
    } catch (err) {
      console.log("Backend not ready, using mock data");
    }
  };

  // Simulate Check Rebalance
  const checkRebalance = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/rebalance/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_allocation: { "ETH": 60, "USDC": 40 },
          rebalance_threshold: 5.0,
          monthly_spending_cap: config.spendingCap,
          slippage_limit: config.slippage
        })
      });
      const data = await res.json();
      if (data.actions) {
        setRebalanceActions(data.actions);
      }
    } catch (err) {
      console.log("Backend calc failed");
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <nav className="glass-panel" style={{ margin: '24px', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          AutoPilot <span className="text-gradient">DeFi</span>
        </h1>
        <button
          className="btn-primary"
          onClick={connect}
        >
          {wallet ? `${wallet.address.substring(0, 6)}...${wallet.address.substring(38)}` : 'Connect Wallet'}
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-grid animate-fade-in">

        {/* Portfolio Overview */}
        <section className="glass-panel" style={{ padding: '24px', gridColumn: 'span 2' }}>
          <h2 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>TOTAL PORTFOLIO VALUE</h2>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            ${portfolio.totalValue.toLocaleString()}
          </div>
          <div style={{ marginTop: '16px', display: 'flex', gap: '24px' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Current Allocation</div>
              <div style={{ fontWeight: '600' }}>
                ETH {portfolio.allocation['ETH']}% / USDC {portfolio.allocation['USDC']}%
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Target</div>
              <div style={{ fontWeight: '600' }}>ETH 60% / USDC 40%</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Drift</div>
              <div style={{ color: 'var(--success)', fontWeight: '600' }}>{portfolio.drift}%</div>
            </div>
          </div>
        </section>

        {/* Permissions Panel */}
        <section className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3>Automation Settings</h3>
            <span style={{
              padding: '4px 12px',
              borderRadius: '20px',
              background: config.paused ? '#ef444420' : '#22c55e20',
              color: config.paused ? '#ef4444' : '#22c55e',
              fontSize: '0.8rem'
            }}>
              {config.paused ? 'PAUSED' : 'ACTIVE'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={{ color: 'var(--text-secondary)' }}>Monthly Cap</label>
                <span>${config.spendingCap}</span>
              </div>
              <input type="range" min="100" max="5000" value={config.spendingCap} onChange={(e) => setConfig({ ...config, spendingCap: Number(e.target.value) })} style={{ width: '100%' }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={{ color: 'var(--text-secondary)' }}>Max Slippage</label>
                <span>{config.slippage}%</span>
              </div>
              <input type="range" min="0.1" max="5" step="0.1" value={config.slippage} onChange={(e) => setConfig({ ...config, slippage: Number(e.target.value) })} style={{ width: '100%' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button
                className="btn-primary"
                style={{ flex: 1, background: config.paused ? 'var(--success)' : '#ef4444' }}
                onClick={() => setConfig({ ...config, paused: !config.paused })}
              >
                {config.paused ? 'Resume' : 'Pause'} Automation
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1, background: '#3b82f6' }}
                onClick={checkRebalance}
              >
                Check Rebalance
              </button>
            </div>
          </div>
        </section>

        {/* Activity / Actions Feed */}
        <section className="glass-panel" style={{ padding: '24px' }}>
          <h3>
            {rebalanceActions.length > 0 ? 'Proposed Actions' : 'Recent Activity'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>

            {rebalanceActions.length > 0 ? (
              rebalanceActions.map((action, i) => (
                <div key={i} style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid #3b82f6' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Recommendation: EXECUTE SWAP</div>
                  <div>Sell {action.amount} {action.token_in} for {action.token_out}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Reason: {action.reason}</div>
                  <button className="btn-primary" style={{ marginTop: '8px', width: '100%', fontSize: '0.8rem' }}>
                    Approve & Execute On-Chain
                  </button>
                </div>
              ))
            ) : (
              // History placeholders
              [1, 2].map((i) => (
                <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Rebalanced ETH &#8594; USDC</span>
                    <span style={{ color: 'var(--text-secondary)' }}>2d ago</span>
                  </div>
                  <div style={{ color: 'var(--success)', fontSize: '0.8rem', marginTop: '4px' }}>
                    Saved ${portfolio.estimated_gas_saved || '4.50'} in gas
                  </div>
                </div>
              ))
            )}

          </div>
        </section>

      </main>
    </div>
  );
}

export default App;
