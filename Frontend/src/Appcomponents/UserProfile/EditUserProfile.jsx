import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { editUserProfile } from "../../EndPoints/auth"; 
import { setUser } from "../../store/Slices/UserSlice";
import { toast } from "sonner";
import { Camera, User, Mail } from "lucide-react";
import usericon from "../../../assets/usericon.jpg";
import { Button } from "@/components/ui/button"

const EditUserProfile = () => {

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedImg, setSelectedImg] = useState(null);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    currentPassword: "",
    newPassword: "",
    profilePicture: null,
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>{
        const image = reader.result;
        setSelectedImg(image);
        setFormData({ ...formData, profilePicture: image });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await editUserProfile(formData, token);

    if (response.isSuccess) {
      dispatch(setUser(response.updatedUser[0])); // Update the user info in the Redux store
      const user = response.updatedUser[0]
      toast.success("Profile updated successfully");
      navigate(`/user-profile/${user.userID}`); 
    } else {
      toast.error(response.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-pale rounded-xl p-7 space-y-8 shadow-xl my-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-heading ">Edit Profile</h1>
        <p className="mt-2">Your profile information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={user.user_profileImage || selectedImg || usericon}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4 "
            />
            <label
              htmlFor="profilePicture"
              className={`
                absolute bottom-0 right-0 
                bg-base-content bg-gray-200 hover:scale-105
                p-2 rounded-full cursor-pointer 
                transition-all duration-200 
              `}
            >
              <Camera className="w-5 h-5 text-base-200" />
              <input
                type="file"
                id="profilePicture"
                className="hidden"
                name="profilePicture"
                onChange={handleChange}
              />
            </label>
          </div>
            <p className="text-sm text-zinc-400">
              Click the camera icon to update your photo
            </p>
        </div>


        <div className="flex flex-col">
          <label htmlFor="username" className="text-sm font-medium">
              <div className="text-sm flex items-center gap-2">
                <User className="w-4 h-4" />
                User Name
              </div>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md"
            placeholder={user.user_name}
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="username" className="text-sm font-medium">
              <div className="text-sm flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </div>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.user_email}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md"
            placeholder={user.user_email}
            disabled
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="currentPassword" className="text-sm font-medium">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md"
            placeholder="Enter current password"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md"
            placeholder="Enter new password"
          />
        </div>

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-customGreen text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserProfile;



        {/* <div className="flex flex-col">
<label htmlFor="profilePicture" className="text-sm font-medium">Profile Picture</label>
<input
  type="file"
  id="profilePicture"
  name="profilePicture"
  onChange={handleChange}
  className="mt-1 p-2 border rounded-md"
/>
</div> */}