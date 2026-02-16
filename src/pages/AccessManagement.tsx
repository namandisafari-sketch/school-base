import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSchool } from "@/contexts/SchoolContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Lock, Unlock, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getFilteredNavItems } from "@/lib/navigation";
import { navTitleKeys } from "@/lib/translations";

// Pages that are always admin-only and can't be toggled
const alwaysAdminOnly = ["/settings", "/users", "/access-management"];

export default function AccessManagement() {
  const { isAdmin } = useAuth();
  const { t, language } = useLanguage();
  const { settings } = useSchool();
  const { toast } = useToast();
  const isAr = language === "ar";

  const allPages = getFilteredNavItems(settings.schoolType).filter(
    item => !alwaysAdminOnly.includes(item.url)
  );

  const [permissions, setPermissions] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("page_permissions");
    if (saved) return JSON.parse(saved);
    // Default: all pages accessible to teachers
    const defaults: Record<string, boolean> = {};
    allPages.forEach(p => { defaults[p.url] = true; });
    return defaults;
  });

  const handleToggle = (url: string) => {
    setPermissions(prev => ({ ...prev, [url]: !prev[url] }));
  };

  const handleSave = () => {
    localStorage.setItem("page_permissions", JSON.stringify(permissions));
    toast({
      title: isAr ? "تم الحفظ" : "Saved",
      description: isAr ? "تم تحديث صلاحيات الوصول" : "Page access permissions updated.",
    });
  };

  const enabledCount = Object.values(permissions).filter(Boolean).length;
  const disabledCount = allPages.length - enabledCount;

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{isAr ? "غير مصرح لك بالوصول" : "You don't have permission to access this page."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAr ? "إدارة صلاحيات الصفحات" : "Page Access Management"}</h1>
          <p className="page-description">{isAr ? "تحكم في الصفحات التي يمكن للمعلمين الوصول إليها" : "Control which pages teachers can access"}</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 me-2" />
          {isAr ? "حفظ التغييرات" : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Unlock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{enabledCount}</p>
                <p className="text-xs text-muted-foreground">{isAr ? "صفحات مفتوحة" : "Pages Accessible"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <Lock className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{disabledCount}</p>
                <p className="text-xs text-muted-foreground">{isAr ? "صفحات مقفلة" : "Pages Restricted"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{alwaysAdminOnly.length}</p>
                <p className="text-xs text-muted-foreground">{isAr ? "للمسؤول فقط" : "Admin Only"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-primary" />
            {isAr ? "صلاحيات المعلمين" : "Teacher Permissions"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {isAr
              ? "قم بتشغيل أو إيقاف الصفحات لتحديد ما يمكن للمعلمين الوصول إليه. المسؤولون دائماً لديهم وصول كامل."
              : "Toggle pages on/off to control what teachers can access. Admins always have full access."}
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isAr ? "الصفحة" : "Page"}</TableHead>
                <TableHead>{isAr ? "القسم" : "Section"}</TableHead>
                <TableHead className="text-center">{isAr ? "المسار" : "Path"}</TableHead>
                <TableHead className="text-center">{isAr ? "وصول المعلمين" : "Teacher Access"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Always admin-only rows */}
              {alwaysAdminOnly.map(url => (
                <TableRow key={url} className="opacity-60">
                  <TableCell className="font-medium">
                    {url === "/settings" ? (isAr ? "الإعدادات" : "Settings")
                      : url === "/users" ? (isAr ? "إدارة المستخدمين" : "User Management")
                      : (isAr ? "إدارة الصلاحيات" : "Access Management")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{isAr ? "النظام" : "System"}</Badge>
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs">{url}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="destructive" className="text-xs">
                      <Lock className="h-3 w-3 me-1" />
                      {isAr ? "للمسؤول فقط" : "Admin Only"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {/* Toggleable pages */}
              {allPages.map(page => (
                <TableRow key={page.url}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <page.icon className="h-4 w-4 text-muted-foreground" />
                      {t(navTitleKeys[page.title] || page.title)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{page.group}</Badge>
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs">{page.url}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={permissions[page.url] !== false}
                      onCheckedChange={() => handleToggle(page.url)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
