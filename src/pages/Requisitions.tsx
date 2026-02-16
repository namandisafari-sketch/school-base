import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, ClipboardList, Check, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Requisition {
  id: string;
  title: string;
  description: string;
  requestedBy: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  date: string;
}

export default function Requisitions() {
  const { t } = useLanguage();
  const [requisitions, setRequisitions] = useState<Requisition[]>(() => {
    const saved = localStorage.getItem("requisitions");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", requestedBy: "", amount: "" });

  const filtered = requisitions.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.title || !form.requestedBy) return;
    const req: Requisition = {
      id: crypto.randomUUID(),
      title: form.title,
      description: form.description,
      requestedBy: form.requestedBy,
      amount: parseFloat(form.amount) || 0,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    };
    const updated = [req, ...requisitions];
    setRequisitions(updated);
    localStorage.setItem("requisitions", JSON.stringify(updated));
    setForm({ title: "", description: "", requestedBy: "", amount: "" });
    setDialogOpen(false);
  };

  const updateStatus = (id: string, status: "approved" | "rejected") => {
    const updated = requisitions.map((r) => r.id === id ? { ...r, status } : r);
    setRequisitions(updated);
    localStorage.setItem("requisitions", JSON.stringify(updated));
  };

  const statusColor = (s: string) => {
    if (s === "approved") return "bg-success/10 text-success";
    if (s === "rejected") return "bg-destructive/10 text-destructive";
    return "bg-warning/10 text-warning";
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("requisitions.title")}</h1>
          <p className="page-description">{t("requisitions.description")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> {t("requisitions.new")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t("requisitions.submit")}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div><Label>{t("common.name")} *</Label><Input className="mt-1.5" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("requisitions.requestedBy")} *</Label><Input className="mt-1.5" value={form.requestedBy} onChange={(e) => setForm({ ...form, requestedBy: e.target.value })} /></div>
                <div><Label>{t("common.amount")} (UGX)</Label><Input className="mt-1.5" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
              </div>
              <div><Label>{t("common.description")}</Label><Textarea className="mt-1.5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            </div>
            <Button onClick={handleAdd} disabled={!form.title || !form.requestedBy} className="w-full">{t("requisitions.submit")}</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t("requisitions.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {requisitions.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <ClipboardList className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">{t("requisitions.noRequisitions")}</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>{t("common.name")}</TableHead><TableHead>{t("requisitions.requestedBy")}</TableHead><TableHead>{t("common.amount")}</TableHead><TableHead>{t("common.date")}</TableHead><TableHead>{t("common.status")}</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell>{r.requestedBy}</TableCell>
                  <TableCell>UGX {r.amount.toLocaleString()}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${statusColor(r.status)}`}>{t(`requisitions.${r.status}`) || r.status}</Badge></TableCell>
                  <TableCell>
                    {r.status === "pending" && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => updateStatus(r.id, "approved")}><Check className="h-4 w-4 text-success" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => updateStatus(r.id, "rejected")}><X className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
