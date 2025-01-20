import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Navgeneral = ({ items }) => {
  const { state } = useSidebar();
  const location = useLocation(); // Get current location

  return (
    <div>
      <SidebarGroup>
        <SidebarGroupLabel>General</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => {
              const key = `${item.title}-${item.url}`;

              if (!item.items)
                return (
                  <SidebarMenuLink
                    key={key}
                    item={item}
                    isActive={location.pathname.includes(item.url)} // Pass isActive as prop
                  />
                );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
};

const SidebarMenuLink = ({ item, isActive }) => {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={cn(isActive ? "bg-gray-200" : "")} // Conditionally apply class
        tooltip={item.title}
      >
        <Link to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
