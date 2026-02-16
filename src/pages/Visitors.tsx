import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, QrCode } from "lucide-react";

interface Visitor {
  id: string;
  name: string;
  purpose: string;
  visiting: string;
  idNumber: string;
  timeIn: string;
  timeOut: string;
  date: string;
}

export default function Visitors() {
  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const saved = localStorage.getItem("visitors");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", purpose: "", visiting: "", idNumber: "" });

  const filtered = visitors.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.name || !form.purpose) return;
    const now = new Date();
    const visitor: Visitor = {
      id: crypto.randomUUID(), ...form,
      timeIn: now.toLocaleTimeString(),
      timeOut: "",
      date: now.toISOString().split("T")[0],
    };
    const updated = [visitor, ...visitors];
    setVisitors(updated);
    localStorage.setItem("visitors", JSON.stringify(updated));
    setForm({ name: "", purpose: "", visiting: "", idNumber: "" });
    setDialogOpen(false);
  };

  const handleCheckOut = (id: string) => {
    const updated = visitors.map((v) =>
      v.id === id ? { ...v, timeOut: new Date().toLocaleTimeString() } : v
    );
    setVisitors(updated);
    localStorage.setItem("visitors", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Visitor Register</h1>
          <p className="page-description">Log and track school visitors</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Log Visitor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Log New Visitor</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Visitor Name *</Label><Input className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>ID Number</Label><Input className="mt-1.5" value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} /></div>
              </div>
              <div><Label>Purpose *</Label><Input className="mt-1.5" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="e.g. Parent meeting" /></div>
              <div><Label>Visiting</Label><Input className="mt-1.5" value={form.visiting} onChange={(e) => setForm({ ...form, visiting: e.target.value })} placeholder="Person or office" /></div>
            </div>
            <Button onClick={handleAdd} disabled={!form.name || !form.purpose} className="w-full">Log Visitor</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search visitors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {visitors.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <QrCode className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No visitors logged today</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead><TableHead>Purpose</TableHead><TableHead>Visiting</TableHead><TableHead>ID</TableHead><TableHead>Time In</TableHead><TableHead>Time Out</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell>{v.purpose}</TableCell>
                  <TableCell>{v.visiting || "—"}</TableCell>
                  <TableCell>{v.idNumber || "—"}</TableCell>
                  <TableCell>{v.timeIn}</TableCell>
                  <TableCell>{v.timeOut || <Badge variant="outline" className="text-xs bg-success/10 text-success">In</Badge>}</TableCell>
                  <TableCell>{!v.timeOut && <Button variant="outline" size="sm" className="text-xs" onClick={() => handleCheckOut(v.id)}>Check Out</Button>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
