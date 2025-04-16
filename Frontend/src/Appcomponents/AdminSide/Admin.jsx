import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "./Sidebar/Appsidebar";
import Links from "../Creation/CourseCreate/Links";
import LangSelector from "../Detector/LangSelector";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "../../transitions.css";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
export default function AdminSide({ children }) {
  const pageRef = useRef(null);
  // const infoRoute = window.location.pathname.includes("dashboard");
  const location = useLocation();
  const dashboardRoute = window.location.pathname.includes("dashboard");
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full">
        <div className="flex items-center justify-between">
          <SidebarTrigger />
          <div className="mt-3 mr-8">
            <LangSelector />
          </div>
        </div>

        <TransitionGroup component={null}>
          <CSSTransition
            key={location.pathname}
            classNames="page"
            timeout={300}
            unmountOnExit
          >
            <div ref={pageRef} className="page">
              {/* Add a content wrapper if needed for styling */}
              {!dashboardRoute && <Links />}
              {children}
            </div>
          </CSSTransition>
        </TransitionGroup>
      </main>
    </SidebarProvider>
  );
}
