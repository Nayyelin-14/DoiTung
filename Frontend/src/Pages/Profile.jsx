import UserProfile from "@/Appcomponents/UserProfile/UserProfile";
import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.user);

  return <div>{user.role === "user" && <UserProfile />}</div>;
};

export default Profile;
