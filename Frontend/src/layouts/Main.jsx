import React, { useRef, lazy, Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Badge from "./Badge";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "../transitions.css";
import { OrbitProgress } from "react-loading-indicators";

// Lazy-load Navigation
const Navigation = lazy(() => import("./Navigation"));

const Main = () => {
  const location = useLocation();
  const pageRef = useRef(null);

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
