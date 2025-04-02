import React, { useState, useEffect } from "react";
import { Button, Typography } from "@material-tailwind/react";
import Field from "@/components/Field";
import axiosInstance from "@/configs/axiosInstance"; // Ensure this is correctly configured

export function StockPrediction() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState(""); // Track selected stock
  const [prediction, setPrediction] = useState(null); // Store predicted price

  // Fetch available stocks
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axiosInstance.get("/api/user-stocks/get-stocks");
        setStocks(response.data);
      } catch (error) {
        console.error("Error fetching stocks:", error);
        setError("Failed to fetch stocks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  if (loading) {
    return <Typography variant="h6">Loading stocks...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="red">{error}</Typography>;
  }

  // Handle stock selection change
  const handleStockChange = (e) => {
    setSelectedStock(e.target.value);
  };

  // Handle stock prediction request
  const handlePredict = async () => {
    if (!selectedStock) {
      alert("Please select a stock.");
      return;
    }

    try {
      const response = await axiosInstance.post("http://127.0.0.1:5000/predict", { ticker: selectedStock }, 
        { headers: { "Content-Type": "application/json" },withCredentials: false }
    );

      setPrediction(response.data.predicted_price);
    } catch (error) {
      console.error("Error predicting stock price:", error);
      alert("Failed to predict stock price. Please try again.");
    }
  };

  return (
    <div className="mt-12">
      <div className="flex gap-4 items-center mb-8">
        <Field label="Select Stock">
          <select
            value={selectedStock}
            onChange={handleStockChange}
            className="border rounded p-2 w-full border-blue-gray-200"
          >
            <option value="">Select a stock</option>
            {stocks.map((stock) => (
              <option key={stock._id} value={stock.short_name}>
              {stock.name} ({stock.short_name})
            </option>
            ))}
          </select>
        </Field>

        <Button className="mt-6" variant="gradient" color="blue" onClick={handlePredict}>
          Predict
        </Button>
      </div>

      {prediction !== null && (
        <div className="flex justify-center">
        <Typography variant="h1" className="mt-4">
          

          Predicted Price: <span className="text-green-500"> ${prediction} </span>
          
        </Typography>
        </div>
       
      )}
    </div>
  );
}

export default StockPrediction;
