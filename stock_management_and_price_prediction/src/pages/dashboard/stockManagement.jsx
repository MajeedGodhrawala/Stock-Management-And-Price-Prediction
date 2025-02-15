import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import axiosInstance from "@/configs/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Field from "@/components/Field";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export function StockManagement() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [errors, setErrors] = useState({});

  const fetchStocks = async () => {
    try {
      const response = await axiosInstance.get("/api/stocks");
      setStocks(response.data);
    } catch (error) {
      toast.error("Failed to fetch stocks");
      console.error("Error fetching stocks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleOpen = () => setOpen(!open);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSave = async () => {
    try {
      if (!editData.name || !editData.short_name) {
        setErrors({
          name: !editData.name ? "Name is required" : "",
          short_name: !editData.short_name ? "Short name is required" : "",
        });
        return;
      }

      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("short_name", editData.short_name);

      if (editData.stock_pic instanceof File) {
        formData.append("stock_pic", editData.stock_pic);
      }

      if (editData.historical_data_file instanceof File) {
        formData.append("historical_data_file", editData.historical_data_file);
      }

      if (editData._id) {
        await axiosInstance.put(`/api/stocks/${editData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Stock updated successfully!");
      } else {
        await axiosInstance.post("/api/stocks", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Stock added successfully!");
      }

      handleOpen();
      fetchStocks();
    } catch (error) {
      console.error("Error saving stock:", error);
      toast.error("Failed to save stock.");
    }
  };

  const deleteStock = async (id) => {
    if (!window.confirm("Are you sure you want to delete this stock?")) return;
    try {
      await axiosInstance.delete(`/api/stocks/${id}`);
      toast.success("Stock deleted successfully!");
      fetchStocks();
    } catch (error) {
      console.error("Error deleting stock:", error);
      toast.error("Failed to delete stock.");
    }
  };

  const handleFileUpload = async (e, stockId) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axiosInstance.post(`/api/stocks/${stockId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file.");
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">
            Stock Management
          </Typography>
          <Button color="blue" onClick={handleOpen}>
            Add Stock
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {loading ? (
            <Typography className="text-center text-blue-gray-500 py-4">
              Loading stocks...
            </Typography>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Stock Name", "Short Name", "Stock Pic", "Created At", "Actions"].map((el) => (
                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                      <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stocks.map(({ _id, name, short_name, stock_pic, created_at }, index) => {
                  const className = `py-3 px-5 ${index === stocks.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                  return (
                    <tr key={_id}>
                      <td className={className}>
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {name || "N/A"}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {short_name || "N/A"}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Avatar src={`http://localhost:5000/uploads/${stock_pic}`} alt={name} size="sm" />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {new Date(created_at).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="flex gap-2">
                          <Typography
                            as="a"
                            href="#"
                            onClick={() => {
                              setEditData({ _id, name, short_name, stock_pic });
                              handleOpen();
                            }}
                            className="text-xs font-semibold text-blue-600 cursor-pointer mr-2"
                          >
                            Edit
                          </Typography>
                          <Typography
                            as="a"
                            href="#"
                            onClick={() => deleteStock(_id)}
                            className="text-xs font-semibold text-red-600 cursor-pointer"
                          >
                            Delete
                          </Typography>
                          <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={(e) => handleFileUpload(e, _id)}
                            className="hidden"
                            id={`file-upload-${_id}`}
                          />
                          <label
                            htmlFor={`file-upload-${_id}`}
                            className="text-xs font-semibold text-green-600 cursor-pointer ml-2"
                          >
                            Upload
                          </label>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>{editData._id ? "Edit Stock" : "Add Stock"}</DialogHeader>
        <DialogBody>
          <div className="grid grid-cols-1 gap-3">
            <Field
              label="Stock Name"
              name="name"
              placeholder="Enter stock name"
              value={editData.name}
              onChange={handleChange}
              error={errors.name}
            />
            <Field
              label="Short Name"
              name="short_name"
              placeholder="Enter short name"
              value={editData.short_name}
              onChange={handleChange}
              error={errors.short_name}
            />
            <div className="flex flex-col gap-4">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Stock Picture
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setEditData({ ...editData, stock_pic: e.target.files[0] });
                }}
              />
              {editData.stock_pic && (
                <Typography variant="small" className="text-blue-gray-500">
                  {editData.stock_pic.name}
                </Typography>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Upload Historical Data (Excel)
              </Typography>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => {
                  setEditData({ ...editData, historical_data_file: e.target.files[0] });
                }}
              />
              {editData.historical_data_file && (
                <Typography variant="small" className="text-blue-gray-500">
                  {editData.historical_data_file.name}
                </Typography>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpen} className="mr-2">
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

export default StockManagement;