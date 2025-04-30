import * as React from "react";
import {
  HardDriveDownload,
  LayoutDashboard,
  TableOfContents,
  Users,
} from "lucide-react";
import Logo2 from "../../../Appcomponents/Images/MLFL_Logo.png";

import { NavUser } from "@/Appcomponents/AdminSide/Sidebar/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSelector } from "react-redux";

import { Navgeneral } from "./navgeneral";
import { useTranslation } from "react-i18next";

// This is sample data.

export function AppSidebar({ ...props }) {
  const { user } = useSelector((state) => state.user);
  //
  const { t } = useTranslation();
  const { Dashboard, Course_management, Enrollments, User_management } = t(
    "sidebar",
    {
      returnObjects: true,
    }
  );

  //
  const items = [
    {
      title: Dashboard,
      url: `/admin/dashboard/${user.user_id}`,
      icon: LayoutDashboard,
      roles: ["superadmin"],
    },

    {
      title: User_management,
      url: `/admin/users_management`,
      icon: Users,
      roles: ["superadmin"],
    },
    {
      title: Course_management,
      url: `/admin/course_management`,
      icon: TableOfContents,
      roles: ["admin", "superadmin"],
    },
    {
      title: Enrollments,
      url: `/admin/enrollment`,
      icon: HardDriveDownload,
      roles: ["admin", "superadmin"],
    },
  ];
  const FilterLinks = items.filter((item) => item.roles.includes(user.role));

  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props} variant="floating">
      <SidebarHeader className="flex items-center justify-center">
        <img src={Logo2} alt="" className="w-25 h-8" />
        {state === "expanded" && (
          <p
            className="text-base font-bold ml-2"
            style={{ minHeight: "10px" }} // Avoid layout shift
          >
            MFLF Foundation
          </p>
        )}
      </SidebarHeader>
      <SidebarContent>
        <Navgeneral items={FilterLinks} {...props} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} {...props} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
