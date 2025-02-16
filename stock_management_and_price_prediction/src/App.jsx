import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "@/configs/PrivateRoute.jsx";
import 'swiper/css';
import 'swiper/css/navigation';

function App() {
const user =  JSON.parse(localStorage.getItem('user'));
const default_route = user?.id == '67a6962b00d871416f095e9f' ? '/dashboard/admin-dashboard' : '/dashboard/user-dashboard'
  return (
    <>
    <ToastContainer />

    <Routes>
      <Route path="/auth/*" element={<Auth />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to={default_route} replace />} />
    </Routes>
    </>
  );
}

export default App;
