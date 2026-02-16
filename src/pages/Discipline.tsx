import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, AlertTriangle } from "lucide-react";

interface DisciplineCase {
  id: string;
  studentName: string;
  type: string;
  severity: string;
  description: string;
  actionTaken: string;
  status: "open" | "resolved" | "escalated";
  date: string;
}

export default function Discipline() {
  const [cases, setCases] = useState<DisciplineCase[]>(() => {
    const saved = localStorage.getItem("discipline");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ studentName: "", type: "", severity: "", description: "", actionTaken: "" });

  const filtered = cases.filter((c) => c.studentName.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.studentName || !form.type) return;
    const newCase: DisciplineCase = {
      id: crypto.randomUUID(), ...form,
      status: "open",
      date: new Date().toISOString().split("T")[0],
    };
    const updated = [newCase, ...cases];
    setCases(updated);
    localStorage.setItem("discipline", JSON.stringify(updated));
    setForm({ studentName: "", type: "", severity: "", description: "", actionTaken: "" });
    setDialogOpen(false);
  };

  const severityColor = (s: string) => {
    if (s === "minor") return "bg-info/10 text-info";
    if (s === "moderate") return "bg-warning/10 text-warning";
    return "bg-destructive/10 text-destructive";
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Discipline Cases</h1>
          <p className="page-description">{cases.length} incidents recorded</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Log Incident</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Log Discipline Incident</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Student Name *</Label><Input className="mt-1.5" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} /></div>
                <div><Label>Incident Type *</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="truancy">Truancy</SelectItem>
                      <SelectItem value="fighting">Fighting</SelectItem>
                      <SelectItem value="bullying">Bullying</SelectItem>
                      <SelectItem value="damage">Property Damage</SelectItem>
                      <SelectItem value="misconduct">General Misconduct</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Severity</Label>
                <Select value={form.severity} onValueChange={(v) => setForm({ ...form, severity: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Description</Label><Textarea className="mt-1.5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><Label>Action Taken</Label><Input className="mt-1.5" value={form.actionTaken} onChange={(e) => setForm({ ...form, actionTaken: e.target.value })} placeholder="e.g. Warning, Suspension" /></div>
            </div>
            <Button onClick={handleAdd} disabled={!form.studentName || !form.type} className="w-full">Log Incident</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search cases..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {cases.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <AlertTriangle className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No discipline cases recorded</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Student</TableHead><TableHead>Type</TableHead><TableHead>Severity</TableHead><TableHead>Action</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.studentName}</TableCell>
                  <TableCell className="capitalize">{c.type}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${severityColor(c.severity)}`}>{c.severity || "—"}</Badge></TableCell>
                  <TableCell>{c.actionTaken || "—"}</TableCell>
                  <TableCell>{c.date}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${c.status === "resolved" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{c.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
