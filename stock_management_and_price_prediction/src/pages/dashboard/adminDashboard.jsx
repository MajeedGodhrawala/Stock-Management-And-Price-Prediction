import React, { useEffect, useState } from "react";
import { Typography, Card, CardHeader, CardBody } from "@material-tailwind/react";
import ReactECharts from "echarts-for-react";
import axiosInstance from "@/configs/axiosInstance";

export function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStocks, setTotalStocks] = useState(0);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [stockGrowthData, setStockGrowthData] = useState([]);

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total users
        const usersResponse = await axiosInstance.get("/api/dashboard/users/count");
        setTotalUsers(usersResponse.data.count);

        // Fetch total stocks
        const stocksResponse = await axiosInstance.get("/api/dashboard/stocks/count");
        setTotalStocks(stocksResponse.data.count);

        // Fetch user growth data
        const userGrowthResponse = await axiosInstance.get("/api/dashboard/users/growth");
        setUserGrowthData(userGrowthResponse.data);

        // Fetch stock growth data
        const stockGrowthResponse = await axiosInstance.get("/api/dashboard/stocks/growth");
        setStockGrowthData(stockGrowthResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Chart options for user growth
  const userGrowthChartOptions = {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: userGrowthData.map((item) => item.date),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Users",
        type: "line",
        data: userGrowthData.map((item) => item.count),
      },
    ],
  };

  // Chart options for stock growth
  const stockGrowthChartOptions = {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: stockGrowthData.map((item) => item.date),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Stocks",
        type: "line",
        data: stockGrowthData.map((item) => item.count),
      },
    ],
  };

  return (
    <div className="mt-12">
      {/* Static Cards */}
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader variant="gradient" color="blue" className="mb-4 p-6">
            <Typography variant="h6" color="white">
              Total Users
            </Typography>
          </CardHeader>
          <CardBody>
            <Typography variant="h3">{totalUsers}</Typography>
          </CardBody>
        </Card>
        <Card>
          <CardHeader variant="gradient" color="green" className="mb-4 p-6">
            <Typography variant="h6" color="white">
              Total Stocks
            </Typography>
          </CardHeader>
          <CardBody>
            <Typography variant="h3">{totalStocks}</Typography>
          </CardBody>
        </Card>
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2">
        <Card>
          <CardHeader variant="gradient" color="blue" className="mb-4 p-6">
            <Typography variant="h6" color="white">
              User Growth Over Time
            </Typography>
          </CardHeader>
          <CardBody>
            <ReactECharts option={userGrowthChartOptions} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader variant="gradient" color="green" className="mb-4 p-6">
            <Typography variant="h6" color="white">
              Stock Growth Over Time
            </Typography>
          </CardHeader>
          <CardBody>
            <ReactECharts option={stockGrowthChartOptions} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;