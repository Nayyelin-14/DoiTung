import * as React from "react";
import {
  Frame,
  HardDriveDownload,
  LayoutDashboard,
  ListTodo,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  TableOfContents,
  Users,
} from "lucide-react";
import Logo2 from "../../../Appcomponents/Images/Logo2.png";

import { NavUser } from "@/Appcomponents/AdminSide/Sidebar/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { Navgeneral } from "./navgeneral";

// This is sample data.

export function AppSidebar({ ...props }) {
  const { user } = useSelector((state) => state.user);

  const items = [
    {
      title: "Dashboard",
      url: `/admin/dashboard/${user.user_id}`,
      icon: LayoutDashboard,
    },

    {
      title: "User management",
      url: "/admin/users_management",
      icon: Users,
    },
    {
      title: "Course management",
      url: "/admin/course_management",
      icon: TableOfContents,
    },
    {
      title: "Enrollments",
      url: `/admin/enrollment/${user.user_id}`,
      icon: HardDriveDownload,
    },
    // {
    //   title: "Home",
    //   url: "#",
    //   icon: Home,
    // },
  ];
  return (
    <Sidebar collapsible="icon" {...props} variant="floating">
      <SidebarHeader className="flex items-center justify-center">
        <img src={Logo2} alt="" className="w-25 h-8" />
      </SidebarHeader>
      <SidebarContent>
        <Navgeneral items={items} {...props} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} {...props} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
