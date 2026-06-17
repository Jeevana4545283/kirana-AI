import os
import json
import urllib.request
from app.agents.inventory import check_inventory_status
from app.agents.seasonality import get_seasonal_context

def handle_chat(message: str, language: str = "en") -> dict:
    """
    Multilingual LLM Agent using OpenRouter API via urllib.request.
    """
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        print("Warning: OPENROUTER_API_KEY not found. Returning mock response.")
        return mock_chat(message, language)
        
    try:
        # Gather current context to ground the LLM
        alerts = check_inventory_status()
        season_data = get_seasonal_context()
        
        season_str = season_data.get("current_season", "Unknown")
        upcoming = season_data.get("upcoming_festival")
        days_away = season_data.get("festival_days_away")
        
        dynamic_instruction = ""
        if upcoming:
            prods = ", ".join([f"{p['name']} by {p['spike_percent']}%" for p in season_data.get("festival_products", [])])
            dynamic_instruction = f"CRITICAL DEMO INSTRUCTION: You MUST start your response by mentioning: 'Festival detected: {upcoming} in {days_away} days. Increase stock for {prods}.'"
        else:
            prods = ", ".join([f"{p['name']} by {p['spike_percent']}%" for p in season_data.get("season_products", [])])
            dynamic_instruction = f"CRITICAL DEMO INSTRUCTION: You MUST start your response by mentioning: 'Season detected: {season_str}. Increase stock for {prods}.'"
        
        system_prompt = (
            f"You are KiranaAI, an expert AI purchasing manager for small Kirana stores in India. "
            f"You MUST respond in this language code: {language}. "
            f"Be very concise and helpful. "
            f"Here is the current low-stock situation: {alerts}. "
            f"{dynamic_instruction} "
            f"Then answer the user's query."
        )
        
        req = urllib.request.Request(
            "https://openrouter.ai/api/v1/chat/completions",
            data=json.dumps({
                "model": "deepseek/deepseek-chat",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ]
            }).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "KiranaAI"
            }
        )
        
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode("utf-8"))
            
        return {
            "response_text": result["choices"][0]["message"]["content"],
            "action_items": []
        }
    except Exception as e:
        return {"response_text": f"Error: {str(e)}", "action_items": []}

def mock_chat(message: str, language: str) -> dict:
    if language.lower() in ["te", "telugu"]:
        return {
            "response_text": "మీ స్టాక్ ఆధారంగా, మీరు ఈరోజు 50 ప్యాకెట్ల ఆశీర్వాద్ ఆటా ఆర్డర్ చేయాలి. నేను ఆర్డర్ ప్లేస్ చేయమంటారా?",
            "action_items": [{"product_id": 101, "suggested_qty": 50}]
        }
    elif language.lower() in ["hi", "hindi"]:
        return {
            "response_text": "आपके स्टॉक के आधार पर, आपको 50 पैकेट आशीर्वाद आटा ऑर्डर करना चाहिए। क्या मैं ऑर्डर प्लेस कर दूं?",
            "action_items": [{"product_id": 101, "suggested_qty": 50}]
        }
    else:
        return {
            "response_text": "Based on your stock, you should order 50 packets of Aashirvaad Atta today. Shall I place the order?",
            "action_items": [{"product_id": 101, "suggested_qty": 50}]
        }
