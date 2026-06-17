from app.core.db import get_db_client
from app.agents.demand import generate_forecast

def check_inventory_status() -> list:
    """
    Checks current stock levels against reorder levels and dynamic demand forecasts.
    Returns a list of low stock alerts.
    """
    supabase = get_db_client()
    if not supabase:
        print("Warning: DB client not found. Returning mock alerts.")
        return mock_inventory_alerts()
        
    # Get all inventory with product details
    inv_response = supabase.table("inventory").select("*, products(name, category)").execute()
    inventory = inv_response.data
    
    alerts = []
    
    if not inventory:
        return alerts
        
    for item in inventory:
        product_id = item['product_id']
        current = item['current_stock']
        reorder = item['reorder_level']
        
        if current <= reorder:
            # Check dynamic forecast for next 3 days
            forecast = generate_forecast(product_id, days=3)
            needed_3d = sum([f['predicted_demand'] for f in forecast]) if isinstance(forecast, list) else 0
            
            alerts.append({
                "product_id": product_id,
                "product_name": item['products']['name'] if item.get('products') else f"Product {product_id}",
                "current_stock": current,
                "reorder_level": reorder,
                "predicted_demand_3d": needed_3d,
                "status": "CRITICAL" if current < needed_3d else "WARNING"
            })
            
    return alerts

def mock_inventory_alerts() -> list:
    return [
        {
            "product_id": 101,
            "product_name": "Aashirvaad Atta 5kg",
            "current_stock": 8,
            "reorder_level": 15,
            "predicted_demand_3d": 12,
            "status": "CRITICAL"
        },
        {
            "product_id": 102,
            "product_name": "Fortune Oil 1L",
            "current_stock": 5,
            "reorder_level": 10,
            "predicted_demand_3d": 4,
            "status": "WARNING"
        }
    ]
