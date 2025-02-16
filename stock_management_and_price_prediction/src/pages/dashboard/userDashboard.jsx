import React, { useEffect, useState } from "react";
import { Typography, Card, CardHeader, CardBody } from "@material-tailwind/react";
import ReactECharts from "echarts-for-react";
import axiosInstance from "@/configs/axiosInstance";
import { StatisticsCard } from "@/widgets/cards";
import {
  BanknotesIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/solid";

export function UserDashboard() {
  const [userStocks, setUserStocks] = useState([]);
  const [stockPerformanceData, setStockPerformanceData] = useState([]);
  const [profitLossData, setProfitLossData] = useState([]);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's stocks
        const userStocksResponse = await axiosInstance.get(`/api/user-dashboard/stocks?user_id=${user.id}`);
        setUserStocks(userStocksResponse.data);

        // Fetch stock performance data
        const stockPerformanceResponse = await axiosInstance.get(`/api/user-dashboard/performance?user_id=${user.id}`);
        setStockPerformanceData(stockPerformanceResponse.data);

        // Fetch profit and loss data
        const profitLossResponse = await axiosInstance.get(`/api/user-dashboard/profit-loss?user_id=${user.id}`);
        setProfitLossData(profitLossResponse.data.data);
        setTotalProfitLoss(profitLossResponse.data.totalProfitLoss);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user.id]);

  // Chart options for stock performance
  const stockPerformanceChartOptions = {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: stockPerformanceData.map((item) => item.date),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Stock Performance",
        type: "line",
        data: stockPerformanceData.map((item) => item.close),
      },
    ],
  };

  // Chart options for profit and loss
  const profitLossChartOptions = {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: profitLossData.map((item) => item.date),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Profit/Loss",
        type: "line",
        data: profitLossData.map((item) => item.profitLoss),
      },
    ],
  };

  return (
    <div className="mt-12">
      {/* Static Cards */}
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        <StatisticsCard
          key={'total-stocks'}
          {...{ color: 'gray', value: userStocks.length }}
          title={'Total Stocks'}
          icon={React.createElement(BanknotesIcon, {
            className: "w-6 h-6 text-white",
          })}
        />
        <StatisticsCard
          key={'total-profit-loss'}
          {...{ color: totalProfitLoss >= 0 ? 'green' : 'red', value: `$${totalProfitLoss.toFixed(2)}` }}
          title={'Total Profit/Loss'}
          icon={React.createElement(totalProfitLoss >= 0 ? ArrowUpIcon : ArrowDownIcon, {
            className: "w-6 h-6 text-white",
          })}
        />
      </div>
      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2">
        <Card>
          <CardHeader variant="gradient" color="blue" className="mb-4 p-6">
            <Typography variant="h6" color="white">
              Stock Performance Over Time
            </Typography>
          </CardHeader>
          <CardBody>
            <ReactECharts option={stockPerformanceChartOptions} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader variant="gradient" color={totalProfitLoss >= 0 ? "green" : "red"} className="mb-4 p-6">
            <Typography variant="h6" color="white">
              Profit/Loss Over Time
            </Typography>
          </CardHeader>
          <CardBody>
            <ReactECharts option={profitLossChartOptions} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default UserDashboard;