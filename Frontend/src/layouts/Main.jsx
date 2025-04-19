import React, { lazy, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";

import { OrbitProgress } from "react-loading-indicators";

// Lazy-load Navigation
const Navigation = lazy(() => import("./Navigation"));

const Main = () => {
  const location = useLocation();

  const isAuthPage = location.pathname.includes("auth");
  const isAdminPage = location.pathname.includes("admin");

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <OrbitProgress color="#32cd32" size="medium" text="" textColor="" />;
        </div>
      }
    >
      {!isAuthPage && !isAdminPage && <Navigation />}

      <Outlet />

      {!isAdminPage && <Footer />}
    </Suspense>
  );
};

export default Main;
