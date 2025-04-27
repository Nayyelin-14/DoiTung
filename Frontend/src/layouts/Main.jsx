import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navigation from "./Navigation";

const Main = () => {
  const location = useLocation();

  const isAuthPage = location.pathname.includes("auth");
  const isAdminPage = location.pathname.includes("admin");

  return (
    <div>
      {" "}
      {!isAuthPage && !isAdminPage && <Navigation />}
      <Outlet />
      {!isAdminPage && <Footer />}
    </div>
  );
};

export default Main;
