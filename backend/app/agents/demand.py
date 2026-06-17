from app.core.db import get_db_client
from datetime import datetime, timedelta

def generate_forecast(product_id: int, days: int = 7) -> list:
    """
    Fetches historical sales data for a product, runs Prophet time-series
    forecasting, and returns predicted demand for the next 'days'.
    """
    supabase = get_db_client()
    if not supabase:
        print("Warning: DB client not found. Returning mock forecast.")
        return mock_forecast(product_id, days)
        
    # Fetch sales data
    response = supabase.table("sales").select("*").eq("product_id", product_id).execute()
    data = response.data
    
    if not data or len(data) < 2:
        print("Not enough data to forecast. Returning mock forecast.")
        return mock_forecast(product_id, days)
        
    try:
        import pandas as pd
        from prophet import Prophet
        import logging
        logging.getLogger('cmdstanpy').setLevel(logging.WARNING)
        
        df = pd.DataFrame(data)
        df = df[['sale_date', 'quantity_sold']]
        df.columns = ['ds', 'y']
        df['ds'] = pd.to_datetime(df['ds'])
        
        # Initialize and fit Prophet model
        model = Prophet(daily_seasonality=True, yearly_seasonality=False, weekly_seasonality=True)
        model.fit(df)
        
        # Predict future dates
        future = model.make_future_dataframe(periods=days)
        forecast = model.predict(future)
        
        # Get only the forecasted part
        future_forecast = forecast[['ds', 'yhat']].tail(days)
        
        predictions = []
        for _, row in future_forecast.iterrows():
            pred_val = max(0, int(round(row['yhat'])))
            predictions.append({
                "target_date": row['ds'].strftime('%Y-%m-%d'),
                "predicted_demand": pred_val
            })
            
            # Save to database
            try:
                supabase.table("predictions").upsert({
                    "product_id": product_id,
                    "target_date": row['ds'].strftime('%Y-%m-%d'),
                    "predicted_demand": pred_val
                }).execute()
            except Exception as e:
                print(f"Failed to save prediction: {e}")
                
        return predictions
    except ImportError:
        print("Warning: Prophet/Pandas not installed. Returning mock forecast.")
        return mock_forecast(product_id, days)

def mock_forecast(product_id: int, days: int) -> list:
    """Fallback if DB is not connected yet."""
    base_date = datetime.now()
    preds = []
    for i in range(1, days + 1):
        target = (base_date + timedelta(days=i)).strftime('%Y-%m-%d')
        preds.append({"target_date": target, "predicted_demand": 10 + i})
    return preds
