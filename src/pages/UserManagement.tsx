import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Shield, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserManagement() {
  const { users, user: currentUser, deleteUser, updateUserRole, isAdmin } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const isAr = language === "ar";

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{isAr ? "غير مصرح لك بالوصول" : "You don't have permission to access this page."}</p>
      </div>
    );
  }

  const handleRoleChange = (userId: string, role: UserRole) => {
    if (userId === currentUser?.id) {
      toast({ title: isAr ? "خطأ" : "Error", description: isAr ? "لا يمكنك تغيير دورك الخاص" : "You cannot change your own role.", variant: "destructive" });
      return;
    }
    updateUserRole(userId, role);
    toast({ title: isAr ? "تم التحديث" : "Updated", description: isAr ? "تم تحديث دور المستخدم" : "User role updated." });
  };

  const handleDelete = (userId: string, username: string) => {
    if (userId === currentUser?.id) {
      toast({ title: isAr ? "خطأ" : "Error", description: isAr ? "لا يمكنك حذف حسابك" : "You cannot delete your own account.", variant: "destructive" });
      return;
    }
    deleteUser(userId);
    toast({ title: isAr ? "تم الحذف" : "Deleted", description: isAr ? `تم حذف ${username}` : `${username} has been removed.` });
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAr ? "إدارة المستخدمين" : "User Management"}</h1>
          <p className="page-description">{isAr ? "إدارة حسابات المستخدمين والأدوار" : "Manage user accounts and roles"}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-xs text-muted-foreground">{isAr ? "إجمالي المستخدمين" : "Total Users"}</p>
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
                <p className="text-2xl font-bold">{users.filter(u => u.role === "admin").length}</p>
                <p className="text-xs text-muted-foreground">{isAr ? "المسؤولون" : "Admins"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.role === "teacher").length}</p>
                <p className="text-xs text-muted-foreground">{isAr ? "المعلمون" : "Teachers"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isAr ? "جميع المستخدمين" : "All Users"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isAr ? "الاسم" : "Name"}</TableHead>
                <TableHead>{isAr ? "اسم المستخدم" : "Username"}</TableHead>
                <TableHead>{isAr ? "الدور" : "Role"}</TableHead>
                <TableHead>{isAr ? "تاريخ الإنشاء" : "Created"}</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    {u.fullName}
                    {u.id === currentUser?.id && (
                      <Badge variant="outline" className="ms-2 text-xs">{isAr ? "أنت" : "You"}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{u.username}</TableCell>
                  <TableCell>
                    <Select
                      value={u.role}
                      onValueChange={(v) => handleRoleChange(u.id, v as UserRole)}
                      disabled={u.id === currentUser?.id}
                    >
                      <SelectTrigger className="w-[120px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          <span className="flex items-center gap-1.5">
                            <Shield className="h-3 w-3" />
                            {isAr ? "مسؤول" : "Admin"}
                          </span>
                        </SelectItem>
                        <SelectItem value="teacher">
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3 w-3" />
                            {isAr ? "معلم" : "Teacher"}
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      disabled={u.id === currentUser?.id}
                      onClick={() => handleDelete(u.id, u.username)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
