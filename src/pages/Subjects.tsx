import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, BookOpen } from "lucide-react";

interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: string;
  isCompulsory: boolean;
}

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem("subjects");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", teacher: "", isCompulsory: true });

  const filtered = subjects.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.name) return;
    const newSubject: Subject = { id: crypto.randomUUID(), ...form };
    const updated = [...subjects, newSubject];
    setSubjects(updated);
    localStorage.setItem("subjects", JSON.stringify(updated));
    setForm({ name: "", code: "", teacher: "", isCompulsory: true });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Subjects</h1>
          <p className="page-description">{subjects.length} subjects registered</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Subject</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Subject</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Subject Name *</Label><Input className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mathematics" /></div>
                <div><Label>Code</Label><Input className="mt-1.5" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. MATH" /></div>
              </div>
              <div><Label>Assigned Teacher</Label><Input className="mt-1.5" value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} /></div>
            </div>
            <Button onClick={handleAdd} disabled={!form.name} className="w-full">Add Subject</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search subjects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {subjects.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <BookOpen className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No subjects added yet</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Subject</TableHead><TableHead>Code</TableHead><TableHead>Teacher</TableHead><TableHead>Type</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.code || "—"}</TableCell>
                  <TableCell>{s.teacher || "Unassigned"}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{s.isCompulsory ? "Compulsory" : "Elective"}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
