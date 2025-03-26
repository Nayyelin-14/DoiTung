import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "./Sidebar/Appsidebar";
import Links from "../Creation/CourseCreate/Links";
import LangSelector from "../Detector/LangSelector";

export default function AdminSide({ children }) {
  // const infoRoute = window.location.pathname.includes("dashboard");
  const dashboardRoute = window.location.pathname.includes("dashboard");
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full ">
        <div className="flex items-center justify-between">
          <SidebarTrigger />
          <div className="mt-3 mr-8">
            <LangSelector />
          </div>
        </div>
        {!dashboardRoute && <Links />}
        {children}
      </main>
    </SidebarProvider>
  );
}
