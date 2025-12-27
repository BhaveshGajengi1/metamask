import requests
from typing import Dict, List, Optional

class EnvioClient:
    def __init__(self, graphql_url: str = "http://localhost:8080/v1/graphql"):
        self.graphql_url = graphql_url
    
    def _query(self, query: str, variables: Dict = None) -> Dict:
        try:
            response = requests.post(
                self.graphql_url,
                json={"query": query, "variables": variables or {}},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
            
            if "errors" in data:
                raise Exception(f"GraphQL errors: {data['errors']}")
            
            return data.get("data", {})
        except Exception as e:
            print(f"Envio query error: {e}")
            return {}
    
    def get_permission(self, user_address: str) -> Optional[Dict]:
        query = """
        query GetPermission($user: String!) {
          Permission(where: {user: {_eq: $user}, active: {_eq: true}}, limit: 1) {
            id
            user
            spendingCap
            spent
            expiry
            active
            grantedAt
            timestamp
          }
        }
        """
        result = self._query(query, {"user": user_address.lower()})
        perms = result.get("Permission", [])
        return perms[0] if perms else None
    
    def get_permission_events(self, user_address: str, limit: int = 10) -> List[Dict]:
        query = """
        query GetPermissionEvents($user: String!, $limit: Int!) {
          PermissionEvent(
            where: {user: {_eq: $user}}
            order_by: {timestamp: desc}
            limit: $limit
          ) {
            id
            user
            eventType
            amount
            remaining
            timestamp
            blockNumber
            transactionHash
          }
        }
        """
        result = self._query(query, {"user": user_address.lower(), "limit": limit})
        return result.get("PermissionEvent", [])
    
    def get_rebalances(self, user_address: str, limit: int = 20) -> List[Dict]:
        query = """
        query GetRebalances($user: String!, $limit: Int!) {
          Rebalance(
            where: {user: {_eq: $user}}
            order_by: {timestamp: desc}
            limit: $limit
          ) {
            id
            user
            tokenIn
            tokenOut
            amountIn
            amountOut
            gasUsed
            timestamp
            blockNumber
            transactionHash
          }
        }
        """
        result = self._query(query, {"user": user_address.lower(), "limit": limit})
        return result.get("Rebalance", [])
    
    def get_user_stats(self, user_address: str) -> Optional[Dict]:
        query = """
        query GetUserStats($user: String!) {
          UserStats(where: {user: {_eq: $user}}) {
            id
            user
            totalRebalances
            totalGasUsed
            totalSpent
            lastRebalance
          }
        }
        """
        result = self._query(query, {"user": user_address.lower()})
        stats = result.get("UserStats", [])
        return stats[0] if stats else None
    
    def get_daily_metrics(self, days: int = 7) -> List[Dict]:
        query = """
        query GetDailyMetrics($limit: Int!) {
          DailyMetrics(
            order_by: {date: desc}
            limit: $limit
          ) {
            id
            date
            totalRebalances
            totalGasUsed
            uniqueUsers
            totalVolume
          }
        }
        """
        result = self._query(query, {"limit": days})
        return result.get("DailyMetrics", [])
    
    def get_dashboard_data(self, user_address: str) -> Dict:
        return {
            "permission": self.get_permission(user_address),
            "permissionEvents": self.get_permission_events(user_address, 5),
            "rebalances": self.get_rebalances(user_address, 10),
            "stats": self.get_user_stats(user_address)
        }
