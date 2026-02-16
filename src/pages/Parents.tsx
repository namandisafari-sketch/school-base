import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Upload, UserCog } from "lucide-react";

interface Parent {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  childrenNames: string;
  relationship: string;
}

export default function Parents() {
  const [parents, setParents] = useState<Parent[]>(() => {
    const saved = localStorage.getItem("parents");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", childrenNames: "", relationship: "" });

  const filtered = parents.filter((p) =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  const handleAdd = () => {
    if (!form.fullName || !form.phone) return;
    const newParent: Parent = { id: crypto.randomUUID(), ...form };
    const updated = [...parents, newParent];
    setParents(updated);
    localStorage.setItem("parents", JSON.stringify(updated));
    setForm({ fullName: "", phone: "", email: "", childrenNames: "", relationship: "" });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Parents</h1>
          <p className="page-description">{parents.length} parents registered</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Upload className="mr-2 h-4 w-4" /> Import</Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><UserPlus className="mr-2 h-4 w-4" /> Add Parent</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Register Parent</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Full Name *</Label><Input className="mt-1.5" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Jane Doe" /></div>
                  <div><Label>Phone *</Label><Input className="mt-1.5" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+256..." /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Email</Label><Input className="mt-1.5" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" /></div>
                  <div><Label>Relationship</Label><Input className="mt-1.5" value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })} placeholder="Father/Mother/Guardian" /></div>
                </div>
                <div><Label>Children Names</Label><Input className="mt-1.5" value={form.childrenNames} onChange={(e) => setForm({ ...form, childrenNames: e.target.value })} placeholder="Comma separated names" /></div>
              </div>
              <Button onClick={handleAdd} disabled={!form.fullName || !form.phone} className="w-full">Register Parent</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search parents..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {parents.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <UserCog className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No parents registered yet</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead><TableHead>Phone</TableHead><TableHead>Email</TableHead><TableHead>Children</TableHead><TableHead>Relationship</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.fullName}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell>{p.email || "—"}</TableCell>
                  <TableCell>{p.childrenNames || "—"}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{p.relationship || "—"}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
