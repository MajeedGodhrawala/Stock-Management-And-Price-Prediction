// src/components/StockChart.jsx
import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import axiosInstance from "@/configs/axiosInstance";

// Define colors for candlestick chart
const upColor = "#00da3c";
const downColor = "#ec0000";

// Helper function to transform raw data into candlestick format
const splitData = (rawData) => {
  const categoryData = []; // Dates
  const values = []; // Candlestick data [open, close, lowest, highest]
  const volumes = []; // Volume data [index, volume, direction]

  for (let i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i].date); // Date
    values.push([rawData[i].open, rawData[i].close, rawData[i].low, rawData[i].high]);
    volumes.push([i, rawData[i].volume, rawData[i].open > rawData[i].close ? 1 : -1]);
  }

  return { categoryData, values, volumes };
};

// Helper function to calculate moving averages
const calculateMA = (dayCount, data) => {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < dayCount) {
      result.push("-");
      continue;
    }
    let sum = 0;
    for (let j = 0; j < dayCount; j++) {
      sum += data[i - j][1]; // Use the close price for MA calculation
    }
    result.push(+(sum / dayCount).toFixed(3));
  }
  return result;
};

const StockChart = ({ stockId, stockName }) => {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/user-stocks/${stockId}/historical-data`
        );
        setHistoricalData(response.data);
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    };

    fetchHistoricalData();
  }, [stockId]);

  // Transform historical data into candlestick format
  const { categoryData, values, volumes } = splitData(historicalData);

  // Configure ECharts options
  const chartOptions = {
    animation: false,
    legend: {
      bottom: 10,
      left: "center",
      data: [`${stockName}`, "MA5", "MA10", "MA20", "MA30"],
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 10,
      textStyle: {
        color: "#000",
      },
    },
    axisPointer: {
      link: [{ xAxisIndex: "all" }],
      label: {
        backgroundColor: "#777",
      },
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: false,
        },
        brush: {
          type: ["lineX", "clear"],
        },
      },
    },
    brush: {
      xAxisIndex: "all",
      brushLink: "all",
      outOfBrush: {
        colorAlpha: 0.1,
      },
    },
    visualMap: {
      show: false,
      seriesIndex: 5,
      dimension: 2,
      pieces: [
        { value: 1, color: downColor }, // Downward trend
        { value: -1, color: upColor }, // Upward trend
      ],
    },
    grid: [
      {
        left: "10%",
        right: "8%",
        height: "50%",
      },
      {
        left: "10%",
        right: "8%",
        top: "63%",
        height: "16%",
      },
    ],
    xAxis: [
      {
        type: "category",
        data: categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: "dataMin",
        max: "dataMax",
      },
      {
        type: "category",
        gridIndex: 1,
        data: categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        min: "dataMin",
        max: "dataMax",
      },
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true,
        },
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
    ],
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0, 1],
        start: 98,
        end: 100,
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: "slider",
        top: "85%",
        start: 98,
        end: 100,
      },
    ],
    series: [
      {
        name: stockName,
        type: "candlestick",
        data: values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: undefined,
          borderColor0: undefined,
        },
      },
      {
        name: "MA5",
        type: "line",
        data: calculateMA(5, values),
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: "MA10",
        type: "line",
        data: calculateMA(10, values),
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: "MA20",
        type: "line",
        data: calculateMA(20, values),
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: "MA30",
        type: "line",
        data: calculateMA(30, values),
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: "Volume",
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: volumes,
      },
    ],
  };

  return <ReactECharts option={chartOptions} style={{ height: "500px", width: "100%" }} />;
};

export default StockChart;