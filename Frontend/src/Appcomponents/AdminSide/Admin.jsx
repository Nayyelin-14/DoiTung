import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "./Sidebar/Appsidebar";
import Links from "../Creation/CourseCreate/Links";
import LangSelector from "../Detector/LangSelector";
import { motion } from "framer-motion";
export default function AdminSide({ children }) {
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

        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.05, // Reduced delay for quicker start
            duration: 0.3, // Shorter duration for faster animation
            ease: "easeInOut", // Standard easing function
          }}
        >
          {" "}
          {/* Add a content wrapper if needed for styling */}
          {!dashboardRoute && <Links />}
          {children}
        </motion.div>
      </main>
    </SidebarProvider>
  );
}
