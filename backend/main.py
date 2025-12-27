from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.envio_client import EnvioClient
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AutoPilot DeFi API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

envio_url = os.getenv("ENVIO_GRAPHQL_URL", "http://localhost:8080/v1/graphql")
envio = EnvioClient(envio_url)

@app.get("/")
def root():
    return {"status": "ok", "service": "AutoPilot DeFi API"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/permission/{wallet_address}")
def get_permission(wallet_address: str):
    try:
        perm = envio.get_permission(wallet_address)
        return {"success": True, "data": perm}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/permission-events/{wallet_address}")
def get_permission_events(wallet_address: str, limit: int = 10):
    try:
        events = envio.get_permission_events(wallet_address, limit)
        return {"success": True, "data": events}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/rebalances/{wallet_address}")
def get_rebalances(wallet_address: str, limit: int = 20):
    try:
        rebalances = envio.get_rebalances(wallet_address, limit)
        return {"success": True, "data": rebalances}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats/{wallet_address}")
def get_stats(wallet_address: str):
    try:
        stats = envio.get_user_stats(wallet_address)
        return {"success": True, "data": stats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/daily-metrics")
def get_daily_metrics(days: int = 7):
    try:
        metrics = envio.get_daily_metrics(days)
        return {"success": True, "data": metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/dashboard/{wallet_address}")
def get_dashboard(wallet_address: str):
    try:
        data = envio.get_dashboard_data(wallet_address)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
