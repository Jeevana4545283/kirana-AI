from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.inventory import check_inventory_status
from app.agents.demand import generate_forecast
from app.agents.supplier import get_best_supplier
from app.agents.chat import handle_chat
from app.agents.seasonality import get_seasonal_context

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    language: str = "en"

class OrderRequest(BaseModel):
    product_id: int
    quantity: int

@router.get("/inventory")
def get_inventory():
    alerts = check_inventory_status()
    return {"status": "ok", "alerts": alerts}

@router.get("/season")
def get_season():
    return get_seasonal_context()

@router.get("/forecast/{product_id}")
def get_forecast(product_id: int):
    forecast = generate_forecast(product_id, days=7)
    return {"product_id": product_id, "forecast": forecast}

@router.post("/suppliers/compare")
def compare_suppliers(product_id: int):
    result = get_best_supplier(product_id)
    return result

@router.post("/chat")
def chat_with_agent(request: ChatRequest):
    return handle_chat(request.message, request.language)

@router.post("/orders/generate")
def generate_order(request: OrderRequest):
    # Simulate Auto-Reorder logic
    # In reality, this would insert a row in purchase_orders and trigger a WhatsApp notification
    supplier_info = get_best_supplier(request.product_id)
    return {
        "status": "success",
        "order_id": 999,
        "message": "Simulated WhatsApp order placed.",
        "supplier_used": supplier_info.get("recommended_supplier", {}).get("name", "Unknown")
    }
