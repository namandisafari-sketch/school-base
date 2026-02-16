import { NavLink } from "@/components/NavLink";
import { useSchool } from "@/contexts/SchoolContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { getNavGroups } from "@/lib/navigation";
import { navTitleKeys, navGroupKeys } from "@/lib/translations";
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
import { GraduationCap, LogOut, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const adminOnlyUrls = ["/settings", "/users", "/access-management"];

export function AppSidebar() {
  const { settings } = useSchool();
  const { t, isRTL, language } = useLanguage();
  const { user, logout, isAdmin } = useAuth();
  const groups = getNavGroups(settings.schoolType);
  const isAr = language === "ar";

  // Load page permissions for teachers
  const pagePermissions: Record<string, boolean> = (() => {
    if (isAdmin) return {};
    const saved = localStorage.getItem("page_permissions");
    return saved ? JSON.parse(saved) : {};
  })();

  return (
    <Sidebar className="border-r-0" side={isRTL ? "right" : "left"}>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-semibold text-sidebar-foreground">
              {settings.schoolName || (isRTL ? "إدارة المدرسة" : "School Manager")}
            </span>
            <span className="text-xs capitalize text-sidebar-foreground/60">
              {settings.schoolType === "kindergarten"
                ? (isRTL ? "رياض الأطفال" : "ECD / Kindergarten")
                : (isRTL ? `مدرسة ${settings.schoolType === "primary" ? "ابتدائية" : "ثانوية"}` : `${settings.schoolType} School`)}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-2">
        {Object.entries(groups).map(([groupName, items]) => {
          // Filter out admin-only items for non-admin users
          const filteredItems = isAdmin
            ? items
            : items.filter(item =>
                !adminOnlyUrls.includes(item.url) &&
                pagePermissions[item.url] !== false
              );

          if (filteredItems.length === 0) return null;

          return (
            <SidebarGroup key={groupName}>
              <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-sidebar-foreground/40 px-3 mb-1">
                {t(navGroupKeys[groupName] || groupName)}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredItems.map((item) => (
                    <SidebarMenuItem key={item.url + item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                          activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span>{t(navTitleKeys[item.title] || item.title)}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3 space-y-3">
        {/* Current user info */}
        {user && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
              {isAdmin ? <Shield className="h-3.5 w-3.5 text-sidebar-primary" /> : <User className="h-3.5 w-3.5 text-sidebar-foreground/70" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-medium text-sidebar-foreground">{user.fullName}</p>
              <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                {isAdmin ? (isAr ? "مسؤول" : "Admin") : (isAr ? "معلم" : "Teacher")}
              </Badge>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:text-sidebar-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          {isAr ? "تسجيل الخروج" : "Sign Out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
