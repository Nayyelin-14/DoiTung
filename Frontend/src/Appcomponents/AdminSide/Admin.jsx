import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "./Sidebar/Appsidebar";
import Links from "../Creation/CourseCreate/Links";

export default function AdminSide({ children }) {
  // const infoRoute = window.location.pathname.includes("dashboard");
  const dashboardRoute = window.location.pathname.includes("dashboard");
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full ">
        <SidebarTrigger />
        {!dashboardRoute && <Links />}
        {children}
      </main>
    </SidebarProvider>
  );
}
