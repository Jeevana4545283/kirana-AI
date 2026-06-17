from app.core.db import get_db_client

def get_best_supplier(product_id: int) -> dict:
    """
    Compares suppliers for a given product and returns the best one
    based on a scoring algorithm factoring price, delivery time, and reliability.
    """
    supabase = get_db_client()
    if not supabase:
        print("Warning: DB client not found. Returning mock supplier.")
        return mock_supplier(product_id)
        
    response = supabase.table("suppliers").select("*").eq("product_id", product_id).execute()
    suppliers = response.data
    
    if not suppliers:
        return {"error": f"No suppliers found for product {product_id}"}
        
    best_supplier = None
    best_score = float('inf')
    
    for s in suppliers:
        # Lower score is better.
        # Arbitrary weights: $1 = 1 point, 1 day delivery = 5 points, 1% reliability = -10 points
        score = float(s['price']) + (int(s['delivery_time_days']) * 5) - (float(s['reliability_score']) * 10)
        
        if score < best_score:
            best_score = score
            best_supplier = s
            
    return {
        "recommended_supplier": best_supplier,
        "reasoning": f"Chosen for optimal balance: ₹{best_supplier['price']} with {best_supplier['delivery_time_days']}-day delivery and {best_supplier['reliability_score']*100}% reliability."
    }

def mock_supplier(product_id: int) -> dict:
    return {
        "recommended_supplier": {
            "id": 1,
            "name": "Mock Wholesale",
            "price": 150.0,
            "delivery_time_days": 1,
            "reliability_score": 0.99
        },
        "reasoning": "Mock supplier used because DB is disconnected."
    }
