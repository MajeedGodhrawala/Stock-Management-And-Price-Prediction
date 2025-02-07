import {
  Card,
  CardBody,
  Typography,
  Tooltip,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select, 
  Option,
} from "@material-tailwind/react";
import {
  
  PencilIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import axiosInstance from "@/configs/axiosInstance"; // Ensure correct path
import { useUser } from "@/context/UserContext";
import { ProfileInfoCard } from "@/widgets/cards";
import Field from "@/components/Field";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Profile() {
  const { user } = useUser(); // Get logged-in user
  const [profile, setProfile] = useState({
  user_name : '',
  first_name : '',
     last_name : '',
    email : '',
    gender : 0,
    dob : '',
  });

  const [open, setOpen] = useState(false); // Modal state
  const [editData, setEditData] = useState({
    user_name : '',
  first_name : '',
     last_name : '',
    email : '',
    gender : 0,
    dob : '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile(user.id);
    }
  }, [user]);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/users/${userId}`);
      setProfile(response.data);
      setEditData(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleOpen = () => setOpen(!open);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSave = async () => {
    try {
      setErrors({}); // Reset errors
  
      const response = await axiosInstance.put(`/api/users/${user.id}`, editData);
  
      setProfile(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
  
      setOpen(false);
      toast.success("Update successful!");

    } catch (error) {
      console.log(error);
      
      if (error.response && error.response.data.errors) {
        const formattedErrors = {};
        error.response.data.errors.forEach((err) => {
          formattedErrors[err.path] = err.msg; 
        });
                setErrors(formattedErrors);
              } else {
              toast.error("Cant't Update Something Went Wrong!");
              setOpen(false);
              }
    }
  };

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-2 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {profile.first_name} {profile.last_name}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  {profile.username}
                </Typography>
              </div>
            </div>
            <div className="pe-5">
              <Tooltip content="Edit Profile">
              <PencilIcon
                  className="h-4 w-4 cursor-pointer text-blue-gray-500"
                  onClick={handleOpen}
                />
              </Tooltip>
            </div>
          </div>
          <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">
            {profile && (
              <ProfileInfoCard
                details={{
                  "First Name": profile.first_name,
                  "Last Name": profile.last_name,
                  "Email": profile.email,
                  "Gender":parseInt(profile.gender) ? 'Female' : "Male" ,
                  "DOB": profile.dob,
                }}
              />
            )}
          </div>
        </CardBody>
      </Card>

      {/* 🔹 Profile Edit Modal */}
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Edit Profile</DialogHeader>
        <DialogBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Username"
              name="username"
              placeholder="Enter username"
              value={editData.username}
              onChange={handleChange}
              error={errors.username}
            />
            <Field
              label="Email"
              name="email"
              placeholder="name@mail.com"
              value={editData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Field
              label="First Name"
              name="first_name"
              placeholder="Enter first name"
              value={editData.first_name}
              onChange={handleChange}
              error={errors.first_name}
            />
            <Field
              label="Last Name"
              name="last_name"
              placeholder="Enter last name"
              value={editData.last_name}
              onChange={handleChange}
              error={errors.last_name}
            />

            <div className="flex flex-col gap-4">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Gender
              </Typography>
              <div className="relative">
              <Select
  value={String(editData.gender)} 
  onChange={(value) => handleChange({ target: { name: "gender", value } })}
  className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${errors.gender ? "!border-red-500" : ""}`}
>
  <Option value="-1">Select Gender</Option>
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
              value={editData.dob}
              onChange={handleChange}
              error={errors.dob}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpen} className="mr-2">
            Cancel
          </Button>
          <Button variant="gradient" color="blue" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Profile;
