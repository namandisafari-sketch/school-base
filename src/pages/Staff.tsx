import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Upload, UserCog } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Employee {
  id: string;
  fullName: string;
  role: string;
  phone: string;
  email: string;
  department: string;
  status: "active" | "inactive";
}

export default function Staff() {
  const { t } = useLanguage();
  const [staff, setStaff] = useState<Employee[]>(() => {
    const saved = localStorage.getItem("staff");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ fullName: "", role: "", phone: "", email: "", department: "" });

  const filtered = staff.filter((s) => s.fullName.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.fullName || !form.role) return;
    const newStaff: Employee = { id: crypto.randomUUID(), ...form, status: "active" };
    const updated = [...staff, newStaff];
    setStaff(updated);
    localStorage.setItem("staff", JSON.stringify(updated));
    setForm({ fullName: "", role: "", phone: "", email: "", department: "" });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("staff.title")}</h1>
          <p className="page-description">{staff.length} {t("staff.employees")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Upload className="mr-2 h-4 w-4" /> {t("common.import")}</Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><UserPlus className="mr-2 h-4 w-4" /> {t("staff.addStaff")}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>{t("staff.addEmployee")}</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>{t("students.fullName")} *</Label><Input className="mt-1.5" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
                  <div><Label>{t("staff.role")} *</Label>
                    <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder={t("common.select")} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teacher">{t("staff.teacher")}</SelectItem>
                        <SelectItem value="admin">{t("staff.administrator")}</SelectItem>
                        <SelectItem value="bursar">{t("staff.bursar")}</SelectItem>
                        <SelectItem value="support">{t("staff.supportStaff")}</SelectItem>
                        <SelectItem value="security">{t("staff.security")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>{t("common.phone")}</Label><Input className="mt-1.5" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                  <div><Label>{t("common.email")}</Label><Input className="mt-1.5" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                </div>
                <div><Label>{t("staff.department")}</Label><Input className="mt-1.5" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></div>
              </div>
              <Button onClick={handleAdd} disabled={!form.fullName || !form.role} className="w-full">{t("staff.addEmployee")}</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t("staff.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {staff.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <UserCog className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">{t("staff.noStaff")}</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>{t("common.name")}</TableHead><TableHead>{t("staff.role")}</TableHead><TableHead>{t("staff.department")}</TableHead><TableHead>{t("common.phone")}</TableHead><TableHead>{t("common.status")}</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.fullName}</TableCell>
                  <TableCell className="capitalize">{s.role}</TableCell>
                  <TableCell>{s.department || "—"}</TableCell>
                  <TableCell>{s.phone || "—"}</TableCell>
                  <TableCell><Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">{s.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
