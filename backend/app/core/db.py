import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

def get_db_client() -> Client:
    if not url or not key:
        print("Warning: Supabase credentials missing.")
        return None
    return create_client(url, key)
