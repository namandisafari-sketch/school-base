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
          <h1 className="page-title">Staff</h1>
          <p className="page-description">{staff.length} employees</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Upload className="mr-2 h-4 w-4" /> Import</Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><UserPlus className="mr-2 h-4 w-4" /> Add Staff</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Add Employee</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Full Name *</Label><Input className="mt-1.5" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
                  <div><Label>Role *</Label>
                    <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select role" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="bursar">Bursar</SelectItem>
                        <SelectItem value="support">Support Staff</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Phone</Label><Input className="mt-1.5" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                  <div><Label>Email</Label><Input className="mt-1.5" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                </div>
                <div><Label>Department</Label><Input className="mt-1.5" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g. Sciences, Admin" /></div>
              </div>
              <Button onClick={handleAdd} disabled={!form.fullName || !form.role} className="w-full">Add Employee</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {staff.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <UserCog className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No staff members yet</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Department</TableHead><TableHead>Phone</TableHead><TableHead>Status</TableHead>
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
