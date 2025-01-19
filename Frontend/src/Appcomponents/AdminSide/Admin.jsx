import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "./Sidebar/Appsidebar";

export default function AdminSide({ children }) {
  // const infoRoute = window.location.pathname.includes("dashboard");

  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full ">
        <SidebarTrigger />
        {children}
        hi
      </main>
    </SidebarProvider>
  );
}
