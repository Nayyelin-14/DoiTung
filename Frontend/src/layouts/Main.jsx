import React, { useRef, lazy, Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Badge from "./Badge";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "../transitions.css";

// Lazy-load Navigation
const Navigation = lazy(() => import("./Navigation"));

const Main = () => {
  const location = useLocation();
  const pageRef = useRef(null);

  const isAuthPage = location.pathname.includes("auth");
  const isAdminPage = location.pathname.includes("admin");

  return (
    <div>
      {!isAuthPage && !isAdminPage && (
        <Suspense fallback={null}>
          <Navigation />
        </Suspense>
      )}

      {/* <TransitionGroup component={null}>
        <CSSTransition
          key={location.pathname}
          classNames="page"
          timeout={300}
          unmountOnExit
        > */}
      {/* <div ref={pageRef} className="page"> */}
      <Outlet />
      {/* </div> */}
      {/* </CSSTransition> */}
      {/* </TransitionGroup> */}

      {!isAdminPage && <Footer />}
    </div>
  );
};

export default Main;
