import { useState } from "react";
import {
  Card,
  Button, 
  Select, 
  Option,
  Typography
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import Field from "@/components/Field";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import axiosInstance from "@/configs/axiosInstance";


export function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name:"",
    last_name:"",
    gender:"",
    dob:"",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    axiosInstance
    .post("/api/users/register", formData)
    .then((response) => {
      window.location.href = "/auth/sign-in"; 
      
    })
    .catch(function (error) {
      if (error.response && error.response.data.errors) {
        const formattedErrors = {};
        error.response.data.errors.forEach((err) => {
          formattedErrors[err.path] = err.msg; 
        });
        
                setErrors(formattedErrors);
              } else {
                console.error("Signup error:", error);
                setErrors({ general: "An unexpected error occurred. Please try again." });
              }
            });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  return (
    <section className="m-8 flex">
            <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Username"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
            />
            <Field
              label="Email"
              name="email"
              placeholder="name@mail.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Field
              label="First Name"
              name="first_name"
              placeholder="Enter first name"
              value={formData.first_name}
              onChange={handleChange}
              error={errors.first_name}
            />
            <Field
              label="Last Name"
              name="last_name"
              placeholder="Enter last name"
              value={formData.last_name}
              onChange={handleChange}
              error={errors.last_name}
            />

            <div className="flex flex-col gap-4">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Gender
              </Typography>
              <div className="relative">
                <Select
                  value={formData.gender}
                  onChange={(value) => handleChange({ target: { name: "gender", value } })}
                  className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${errors.gender ? "!border-red-500" : ""}`}
                > <Option value="-1">Select Gender</Option>

                  <Option value="0">Male</Option>
                  <Option value="1">Female</Option>
                </Select>
                {errors.gender && <ExclamationCircleIcon className="absolute right-3 top-3 h-5 w-5 text-red-500" />}
              </div>
              {errors.gender && <Typography className="text-red-500 text-sm">{errors.gender}</Typography>}
            </div>
            <Field
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              error={errors.dob}
            />

            {/* Fourth Row - Password and Confirm Password */}
            <Field
              label="Password"
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            <Field
              label="Confirm Password"
              type="password"
              name="confirm_password"
              placeholder="Confirm password"
              value={formData.confirm_password}
              onChange={handleChange}
              error={errors.confirm_password}
            />
          </div>
          
          <Button className="mt-6" fullWidth type="submit">
            Register Now
          </Button>
        </form>

        <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Already have an account?
            <Link to="/auth/sign-in" className="text-gray-900 ml-1">Sign in</Link>
          </Typography>
      </div>
    </section>
  );
}

export default SignUp;
