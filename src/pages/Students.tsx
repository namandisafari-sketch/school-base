import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Upload, Users } from "lucide-react";
import { useSchool } from "@/contexts/SchoolContext";

interface Student {
  id: string;
  fullName: string;
  admissionNumber: string;
  gender: string;
  className: string;
  status: "active" | "suspended" | "withdrawn";
  guardianName: string;
  guardianPhone: string;
}

export default function Students() {
  const { settings } = useSchool();
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    admissionNumber: "",
    gender: "",
    className: "",
    guardianName: "",
    guardianPhone: "",
  });

  const isKindergarten = settings.schoolType === "kindergarten";
  const title = isKindergarten ? "ECD Pupils" : "Students";

  const filtered = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.fullName || !form.admissionNumber) return;
    const newStudent: Student = {
      id: crypto.randomUUID(),
      ...form,
      status: "active",
    };
    const updated = [...students, newStudent];
    setStudents(updated);
    localStorage.setItem("students", JSON.stringify(updated));
    setForm({ fullName: "", admissionNumber: "", gender: "", className: "", guardianName: "", guardianPhone: "" });
    setDialogOpen(false);
  };

  const statusColor = (s: string) => {
    if (s === "active") return "bg-success/10 text-success border-success/20";
    if (s === "suspended") return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-description">{students.length} {title.toLowerCase()} enrolled</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" /> Import
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" /> Add {isKindergarten ? "Pupil" : "Student"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Enroll New {isKindergarten ? "Pupil" : "Student"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input className="mt-1.5" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="John Doe" />
                  </div>
                  <div>
                    <Label>Admission No. *</Label>
                    <Input className="mt-1.5" value={form.admissionNumber} onChange={(e) => setForm({ ...form, admissionNumber: e.target.value })} placeholder="ADM/001" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Gender</Label>
                    <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Class</Label>
                    <Input className="mt-1.5" value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} placeholder="e.g. P1, S2, Baby" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Guardian Name</Label>
                    <Input className="mt-1.5" value={form.guardianName} onChange={(e) => setForm({ ...form, guardianName: e.target.value })} />
                  </div>
                  <div>
                    <Label>Guardian Phone</Label>
                    <Input className="mt-1.5" value={form.guardianPhone} onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })} />
                  </div>
                </div>
              </div>
              <Button onClick={handleAdd} disabled={!form.fullName || !form.admissionNumber} className="w-full">
                Enroll {isKindergarten ? "Pupil" : "Student"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name or admission no..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Table */}
      {students.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No {title.toLowerCase()} enrolled yet</p>
            <p className="text-xs text-muted-foreground">Click "Add {isKindergarten ? "Pupil" : "Student"}" to get started</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Adm. No.</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Guardian</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.fullName}</TableCell>
                    <TableCell>{s.admissionNumber}</TableCell>
                    <TableCell className="capitalize">{s.gender}</TableCell>
                    <TableCell>{s.className}</TableCell>
                    <TableCell>
                      <div>{s.guardianName}</div>
                      <div className="text-xs text-muted-foreground">{s.guardianPhone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColor(s.status)}>
                        {s.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
