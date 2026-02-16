import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Package } from "lucide-react";

interface Asset {
  id: string;
  name: string;
  category: string;
  location: string;
  condition: string;
  assignedTo: string;
  value: number;
}

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem("assets");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", location: "", condition: "", assignedTo: "", value: "" });

  const filtered = assets.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.name || !form.category) return;
    const asset: Asset = { id: crypto.randomUUID(), ...form, value: parseFloat(form.value) || 0 };
    const updated = [...assets, asset];
    setAssets(updated);
    localStorage.setItem("assets", JSON.stringify(updated));
    setForm({ name: "", category: "", location: "", condition: "", assignedTo: "", value: "" });
    setDialogOpen(false);
  };

  const conditionColor = (c: string) => {
    if (c === "good") return "bg-success/10 text-success";
    if (c === "fair") return "bg-warning/10 text-warning";
    return "bg-destructive/10 text-destructive";
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assets</h1>
          <p className="page-description">{assets.length} assets tracked</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Asset</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Register Asset</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Asset Name *</Label><Input className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Category *</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="vehicle">Vehicle</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Location</Label><Input className="mt-1.5" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Staff Room" /></div>
                <div><Label>Condition</Label>
                  <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Assigned To</Label><Input className="mt-1.5" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} /></div>
                <div><Label>Value (UGX)</Label><Input className="mt-1.5" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></div>
              </div>
            </div>
            <Button onClick={handleAdd} disabled={!form.name || !form.category} className="w-full">Register Asset</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search assets..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {assets.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <Package className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No assets registered yet</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Asset</TableHead><TableHead>Category</TableHead><TableHead>Location</TableHead><TableHead>Condition</TableHead><TableHead>Assigned To</TableHead><TableHead>Value</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell className="capitalize">{a.category}</TableCell>
                  <TableCell>{a.location || "—"}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${conditionColor(a.condition)}`}>{a.condition || "—"}</Badge></TableCell>
                  <TableCell>{a.assignedTo || "—"}</TableCell>
                  <TableCell>UGX {a.value.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
