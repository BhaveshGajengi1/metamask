from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AutoPilot DeFi Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PortfolioConfig(BaseModel):
    target_allocation: dict
    rebalance_threshold: float
    monthly_spending_cap: float
    slippage_limit: float

class RebalanceAction(BaseModel):
    token_in: str
    token_out: str
    amount: float
    reason: str

@app.get("/")
def read_root():
    return {"status": "active", "service": "AutoPilot DeFi Backend"}

@app.get("/portfolio/{wallet_address}")
def get_portfolio(wallet_address: str):
    # TODO: Fetch from indexed data (Envio)
    return {
        "wallet": wallet_address,
        "current_allocation": {"ETH": 55, "USDC": 45},
        "target_allocation": {"ETH": 60, "USDC": 40},
        "drift": 5.0,
        "estimated_gas_saved": 12.50
    }

@app.post("/rebalance/calculate")
def calculate_rebalance(config: PortfolioConfig):
    # Mock logic for MVP
    # In production: Fetch current pool prices from Envio/Uniswap
    
    # 1. Calculate drift (mock)
    current_eth_alloc = 55.0
    target_eth_alloc = config.target_allocation.get("ETH", 60.0)
    drift = target_eth_alloc - current_eth_alloc # 5% drift
    
    actions = []
    
    # 2. Rebalance if drift > threshold
    if abs(drift) >= config.rebalance_threshold:
        actions.append({
            "token_in": "USDC",
            "token_out": "ETH",
            "amount": 250.00, # Mock amount
            "reason": f"Drift {drift}% > Threshold {config.rebalance_threshold}%"
        })
        
    # 3. Calculate Gas Savings
    # Assumption: User would have manually checked 5 times and executed 1 swap at higher gas
    avg_gas_gwei = 35
    current_gas_gwei = 22 # We execute now because it's low
    gas_used = 150000 # Swap gas
    eth_price = 2200
    
    savings_eth = (avg_gas_gwei - current_gas_gwei) * 1e-9 * gas_used
    savings_usd = savings_eth * eth_price
    
    return {
        "actions": actions,
        "estimated_gas_saved_usd": round(savings_usd, 2),
        "execution_price_gwei": current_gas_gwei,
        "status": "Ready to Execute"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
