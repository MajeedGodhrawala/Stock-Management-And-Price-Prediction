import pandas as pd
import yfinance as yf
from sklearn.linear_model import LinearRegression
from flask import Flask, request, jsonify
from flask_cors import CORS  

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

def is_valid_ticker(ticker):
    """Check if the stock ticker exists on Yahoo Finance."""
    stock = yf.Ticker(ticker)
    info = stock.history(period="1d")
    return not info.empty 

def predict_stock_price(ticker):
    print(f"Received ticker: {ticker}")

    try:
        if not is_valid_ticker(ticker):
            return {"error": f"Invalid stock ticker: {ticker}. Please check the symbol."}

        stock_data = yf.download(ticker, start="2020-01-01", end="2025-02-27", auto_adjust=True)

        if stock_data.empty:
            return {"error": f"No data found for {ticker}"}

        stock_data['Days'] = (stock_data.index - stock_data.index[0]).days
        X = stock_data[['Days']]
        Y = stock_data['Close']

        model = LinearRegression()
        model.fit(X, Y)

        next_day = stock_data['Days'].iloc[-1] + 1
        predicted_price = model.predict([[next_day]])
        
        return {"ticker": ticker, "predicted_price": round(float(predicted_price[0]), 2)}

    except Exception as e:
        print(f"Error predicting stock price: {str(e)}") 
        return {"error": str(e)}

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        ticker = data.get("ticker")  

        if not ticker:
            return jsonify({"error": "Ticker is required"}), 400

        result = predict_stock_price(ticker)

        return jsonify(result)

    except Exception as e:
        print(f"Server error: {str(e)}")  
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
