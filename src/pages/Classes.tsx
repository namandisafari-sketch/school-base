import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, GraduationCap, Users } from "lucide-react";

interface SchoolClass {
  id: string;
  name: string;
  level: string;
  classTeacher: string;
  capacity: number;
  studentCount: number;
}

export default function Classes() {
  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    const saved = localStorage.getItem("classes");
    return saved ? JSON.parse(saved) : [];
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", level: "", classTeacher: "", capacity: "" });

  const handleAdd = () => {
    if (!form.name) return;
    const newClass: SchoolClass = {
      id: crypto.randomUUID(),
      name: form.name,
      level: form.level,
      classTeacher: form.classTeacher,
      capacity: parseInt(form.capacity) || 40,
      studentCount: 0,
    };
    const updated = [...classes, newClass];
    setClasses(updated);
    localStorage.setItem("classes", JSON.stringify(updated));
    setForm({ name: "", level: "", classTeacher: "", capacity: "" });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Classes</h1>
          <p className="page-description">{classes.length} classes configured</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Class</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Class</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div>
                <Label>Class Name *</Label>
                <Input className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. P1, S2, Baby Class" />
              </div>
              <div>
                <Label>Level</Label>
                <Input className="mt-1.5" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="e.g. Lower Primary" />
              </div>
              <div>
                <Label>Class Teacher</Label>
                <Input className="mt-1.5" value={form.classTeacher} onChange={(e) => setForm({ ...form, classTeacher: e.target.value })} placeholder="Teacher name" />
              </div>
              <div>
                <Label>Capacity</Label>
                <Input className="mt-1.5" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="40" />
              </div>
            </div>
            <Button onClick={handleAdd} disabled={!form.name} className="w-full">Create Class</Button>
          </DialogContent>
        </Dialog>
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <GraduationCap className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No classes created yet</p>
            <p className="text-xs text-muted-foreground">Create your first class to start organizing students</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <Card key={cls.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{cls.name}</h3>
                    {cls.level && <p className="text-sm text-muted-foreground">{cls.level}</p>}
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {cls.studentCount}/{cls.capacity}
                  </div>
                  {cls.classTeacher && (
                    <Badge variant="outline" className="text-xs">{cls.classTeacher}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
