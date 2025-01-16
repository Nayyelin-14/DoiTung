"use client";

import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";

export function NavMain({ items }) {
  const { state } = useSidebar();
  const href = useLocation().pathname; // Get the current pathname from useLocation
  console.log(href);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = checkIsActive(href, item, true);
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive} // Dynamically set defaultOpen based on active state
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubActive = checkIsActive(href, subItem);
                      return (
                        <SidebarMenuSubItem key={subItem.title} href={href}>
                          <SidebarMenuSubButton asChild>
                            <a
                              href={subItem.url}
                              className={`${isSubActive ? "bg-pale" : ""}`}
                            >
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function checkIsActive(href, item, mainNav = false) {
  return (
    href === item.url || // Exact match
    href.split("?")[0] === item.url || // Ignore query params
    !!item?.items?.some((subItem) => subItem.url === href) || // Active if a child item matches
    (mainNav &&
      href.split("/")[1] !== "" &&
      href.split("/")[1] === item?.url?.split("/")[1]) // Match main nav sections
  );
}
