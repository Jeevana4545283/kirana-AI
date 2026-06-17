import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv('backend/.env')
api_key = os.environ.get("GEMINI_API_KEY")

genai.configure(api_key=api_key)

print("Available Models:")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print("Error:", e)
