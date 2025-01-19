import * as React from "react";
import {
  Frame,
  LayoutDashboard,
  ListTodo,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
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
import Navgeneral from "./navgeneral";

// This is sample data.

export function AppSidebar({ ...props }) {
  const { user } = useSelector((state) => state.user);
  const data = {
    navMain: [
      {
        title: "Courses",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Enrolled courses",
            url: "#",
          },
          {
            title: "Progess",
            url: "#",
          },
          {
            title: "Certificates",
            url: "#",
          },
        ],
      },

      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "Profile",
            url: `/user-profile/info/${user?.user_id}`,
          },
          {
            title: "Account",
            url: `/user-profile/update/${user?.user_id}`,
          },
          {
            title: "Forgot Password",
            url: "#",
          },
          {
            title: "2 Factor",
            url: "#",
          },
        ],
      },
    ],
    Current_courses: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };

  const items = [
    {
      title: "Dashboard",
      url: `/admin/dashboard/${user.user_id}`,
      icon: LayoutDashboard,
    },
    {
      title: "Tasks",
      url: "#",
      icon: ListTodo,
    },

    {
      title: "Home",
      url: "#",
      icon: Home,
    },
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
