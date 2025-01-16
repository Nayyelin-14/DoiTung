import React from "react";
import { useSelector } from "react-redux";
import UserProfile from "../Appcomponents/UserProfile/UserProfile";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  console.log(user);
  return <div>{user.role === "user" && <UserProfile />}</div>;
};

export default Profile;
