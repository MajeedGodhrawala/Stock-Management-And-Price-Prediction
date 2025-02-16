import { useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import Field from "@/components/Field";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "@/configs/axiosInstance";
import { useUser } from "@/context/UserContext"; 



export function SignIn() {
  const navigate = useNavigate();
  const { loginUser } = useUser();

  const user =  JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on input
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    axiosInstance
    .post("/api/users/login", formData)
    .then((response) => {
      const { token, user } = response.data;

      localStorage.setItem("token", token);

      const { created_at, ...userWithoutCreatedAt } = user;
      loginUser(userWithoutCreatedAt);

      toast.success("Login successful!");

      if(user?.id == '67a6962b00d871416f095e9f'){
        navigate("/dashboard/admin-dashboard"); 
      }else {
        navigate("/dashboard/user-dashboard"); 
      }
      window.location.reload();
    })
    .catch(function (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    });
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Enter your email and password to Sign In.
          </Typography>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="flex flex-col gap-6">
            <Field
              label="Email"
              type="email"
              name="email"
              placeholder="name@mail.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Field
              label="Password"
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
          </div>

          <Button type="submit" className="mt-6" fullWidth>
            Sign In
          </Button>

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">Create account</Link>
          </Typography>
        </form>
      </div>

      <div className="w-2/5 h-screen hidden lg:block">
        <img src="/img/stock-trading-6525081_1280.jpg" className="h-full w-full object-cover rounded-3xl" />
      </div>
    </section>
  );
}

export default SignIn;
