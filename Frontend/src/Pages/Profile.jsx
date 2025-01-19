import React from "react";
import { useSelector } from "react-redux";
import UserProfile from "../Appcomponents/AdminSide/Admin";

const Profile = () => {
  const { user } = useSelector((state) => state.user);

  return <div>{user.role === "user" && <UserProfile />}</div>;
};

export default Profile;
