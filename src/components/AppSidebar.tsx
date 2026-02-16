import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useSchool } from "@/contexts/SchoolContext";
import { getNavGroups } from "@/lib/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { GraduationCap, LogOut } from "lucide-react";

export function AppSidebar() {
  const { settings } = useSchool();
  const groups = getNavGroups(settings.schoolType);

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-semibold text-sidebar-foreground">
              {settings.schoolName || "School Manager"}
            </span>
            <span className="text-xs capitalize text-sidebar-foreground/60">
              {settings.schoolType === "kindergarten" ? "ECD / Kindergarten" : `${settings.schoolType} School`}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-2">
        {Object.entries(groups).map(([groupName, items]) => (
          <SidebarGroup key={groupName}>
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-sidebar-foreground/40 px-3 mb-1">
              {groupName}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.url + item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2 text-xs text-sidebar-foreground/50">
          <div className="h-2 w-2 rounded-full bg-success" />
          Offline — All data stored locally
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
