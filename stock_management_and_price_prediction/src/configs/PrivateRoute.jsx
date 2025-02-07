import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const PrivateRoute = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return token ? <Outlet /> : <Navigate to="/auth/sign-in" />;
};

export default PrivateRoute;
