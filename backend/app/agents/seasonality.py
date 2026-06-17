import json
import os
from datetime import datetime

def get_current_season(month: int) -> dict:
    if 3 <= month <= 6:
        return {
            "name": "Summer",
            "products": [
                {"name": "Soft Drinks", "spike_percent": 30, "recommended_qty": "50 crates"},
                {"name": "Buttermilk", "spike_percent": 40, "recommended_qty": "100 pkts"},
                {"name": "Ice Cream", "spike_percent": 50, "recommended_qty": "30 boxes"}
            ]
        }
    elif 7 <= month <= 9:
        return {
            "name": "Monsoon",
            "products": [
                {"name": "Tea", "spike_percent": 40, "recommended_qty": "20 kg"},
                {"name": "Maggi", "spike_percent": 50, "recommended_qty": "100 pkts"},
                {"name": "Snacks", "spike_percent": 35, "recommended_qty": "50 pkts"}
            ]
        }
    elif 10 <= month <= 11:
        return {
            "name": "Autumn/Festive",
            "products": [
                {"name": "Sweets", "spike_percent": 30, "recommended_qty": "40 boxes"},
                {"name": "Dry Fruits", "spike_percent": 25, "recommended_qty": "10 kg"}
            ]
        }
    else:
        return {
            "name": "Winter",
            "products": [
                {"name": "Coffee", "spike_percent": 35, "recommended_qty": "15 kg"},
                {"name": "Moisturizer", "spike_percent": 40, "recommended_qty": "30 units"},
                {"name": "Soup", "spike_percent": 45, "recommended_qty": "50 pkts"}
            ]
        }

def get_seasonal_context() -> dict:
    today = datetime.now()
    # For testing, we use actual current date, which is June 17, 2026
    
    season_info = get_current_season(today.month)
    
    upcoming_festival = None
    festival_days_away = None
    festival_products = []
    
    # Read festivals.json
    try:
        # Resolve path relative to this file
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        filepath = os.path.join(base_dir, "data", "festivals.json")
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        closest_diff = 45 # lookahead window
        for fest in data.get("festivals", []):
            fest_date = datetime.strptime(fest["date"], "%Y-%m-%d")
            diff = (fest_date - today).days
            
            if 0 <= diff <= closest_diff:
                closest_diff = diff
                upcoming_festival = fest["name"]
                festival_days_away = diff
                festival_products = fest.get("products", [])
    except Exception as e:
        print(f"Error loading festivals config: {e}")
        
    return {
        "current_season": season_info["name"],
        "season_products": season_info["products"],
        "upcoming_festival": upcoming_festival,
        "festival_days_away": festival_days_away,
        "festival_products": festival_products
    }
