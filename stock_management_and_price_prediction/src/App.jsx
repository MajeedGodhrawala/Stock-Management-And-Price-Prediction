import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "@/configs/PrivateRoute.jsx";

function App() {
  return (
    <>
    <ToastContainer />

    <Routes>
      <Route path="/auth/*" element={<Auth />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
    </>
  );
}

export default App;
