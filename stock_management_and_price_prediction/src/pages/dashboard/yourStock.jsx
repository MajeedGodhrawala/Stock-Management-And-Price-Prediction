import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import axiosInstance from "@/configs/axiosInstance";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from "react-toastify";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Field from "@/components/Field";
import UserStockCard from "@/components/UserStockCard";
import StockChart from "@/components/StockChart";

export function YourStock() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [userStocks, setUserStocks] = useState([]); // User-specific stocks
  const [stocks, setStocks] = useState([]); // All stocks with latest historical data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null); // Track the selected stock
  const [editData, setEditData] = useState({
    stock_id: "",
    date: "",
    qty: "",
  });
  const [errors, setErrors] = useState({});

  const fetchUserStocks = async () => {
    try {
      const response = await axiosInstance.get(`/api/user-stocks/get-user-stocks?user_id=${user.id}`);
      setUserStocks(response.data);
    } catch (error) {
      console.error("Error fetching user stocks:", error);
      setError("Failed to fetch user stocks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStocks = async () => {
    try {
      const response = await axiosInstance.get("/api/stocks");
      setStocks(response.data);
    } catch (error) {
      console.error("Error fetching stocks:", error);
      setError("Failed to fetch stocks. Please try again later.");
    }
  };

  useEffect(() => {
    fetchUserStocks();
  }, [user.id]);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
    if (!openModal) {
      fetchStocks(); // Fetch stocks when modal opens
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSave = async () => {
    // Validate inputs
    const newErrors = {};
    if (!editData.stock_id) newErrors.stock_id = "Stock is required";
    if (!editData.date) newErrors.date = "Date is required";
    if (!editData.qty) newErrors.qty = "Quantity is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Save user stock
      await axiosInstance.post("/api/user-stocks/add-user-stock", {
        user_id: user.id, // Use user ID from context
        stock_id: editData.stock_id,
        date: editData.date,
        qty: editData.qty,
      });

      // Close modal and refresh user stocks
      handleOpenModal();
      fetchUserStocks();
      toast.success("Stock Added!");

    } catch (error) {
      console.error("Error saving user stock:", error);
      toast.error("Duplicate Stock!");
      
    }
  };

  const handleStockClick = (stock) => {
    setSelectedStock(stock.stock_id); 
  };

  if (loading) {
    return <Typography variant="h6">Loading your stocks...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="red">{error}</Typography>;
  }

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-8">
        <Typography variant="h4">Your Stocks</Typography>
        <Button variant="gradient" color="blue" onClick={handleOpenModal}>
          Add Stock
        </Button>
      </div>

      {/* Swiper for User Stocks */}
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
    {userStocks.length > 0 ? (
      userStocks.map((stock) => (
        <SwiperSlide key={stock._id} onClick={() => handleStockClick(stock)}>
          <UserStockCard stock={stock} />
        </SwiperSlide>
      ))
    ) : (
      <Typography variant="h6">No stocks available.</Typography>
    )}
  </Swiper>
</div>
      </div>

      {/* Chart for Selected Stock */}
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

      {/* Add Stock Modal */}
      <Dialog open={openModal} handler={handleOpenModal}>
        <DialogHeader>Add Your Stock</DialogHeader>
        <DialogBody>
          <div className="grid grid-cols-1 gap-3">
            {/* Stock Selection Field */}
            <Field
              label="Select Stock"
              name="stock_id"
              value={editData.stock_id}
              onChange={handleChange}
              error={errors.stock_id}
            >
              <select
                name="stock_id"
                value={editData.stock_id}
                onChange={handleChange}
                className={`border rounded p-2 w-full ${
                  errors.stock_id ? "border-red-500" : "border-blue-gray-200"
                }`}
              >
                <option value="">Select a stock</option>
                {stocks.map((stock) => (
                  <option key={stock._id} value={stock._id}>
                    {stock.name} ({stock.short_name})
                  </option>
                ))}
              </select>
            </Field>

            {/* Date Field */}
            <Field
              label="Date"
              type="date"
              name="date"
              value={editData.date}
              onChange={handleChange}
              error={errors.date}
            />

            {/* Quantity Field */}
            <Field
              label="Quantity"
              type="number"
              name="qty"
              value={editData.qty}
              onChange={handleChange}
              error={errors.qty}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpenModal} className="mr-2">
            Cancel
          </Button>
          <Button variant="gradient" color="blue" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default YourStock;