import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import axiosInstance from "@/configs/axiosInstance";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import StockCard from "@/components/StockCard";
import StockChart from "@/components/StockChart"; // Import the new StockChart component

export function Stock() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null); // Track the selected stock

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

  const handleStockClick = (stock) => {
    setSelectedStock(stock); // Set the selected stock when a card is clicked
  };

  if (loading) {
    return <Typography variant="h6">Loading stocks...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="red">{error}</Typography>;
  }

  return (
    <>
      <div className="mt-12">
        <div className="px-4 py-8">
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            navigation
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            modules={[Navigation]}
            className="mySwiper"
          >
            {stocks.length > 0 ? (
              stocks.map((stock) => (
                <SwiperSlide key={stock._id} onClick={() => handleStockClick(stock)}>
                  <StockCard stock={stock} />
                </SwiperSlide>
              ))
            ) : (
              <Typography variant="h6">No stocks available.</Typography>
            )}
          </Swiper>
        </div>
      </div>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              {selectedStock ? `${selectedStock.name} Analytics` : "Stock Overview"}
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            {selectedStock && (
              <StockChart
                stockId={selectedStock._id}
                stockName={selectedStock.name}
              />
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default Stock;