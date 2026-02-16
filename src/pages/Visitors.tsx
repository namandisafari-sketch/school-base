import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, QrCode } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
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
          <h1 className="page-title">{t("visitors.title")}</h1>
          <p className="page-description">{t("visitors.description")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> {t("visitors.logVisitor")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t("visitors.logNew")}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("visitors.visitorName")} *</Label><Input className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>{t("visitors.idNumber")}</Label><Input className="mt-1.5" value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} /></div>
              </div>
              <div><Label>{t("visitors.purpose")} *</Label><Input className="mt-1.5" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} /></div>
              <div><Label>{t("visitors.visiting")}</Label><Input className="mt-1.5" value={form.visiting} onChange={(e) => setForm({ ...form, visiting: e.target.value })} /></div>
            </div>
            <Button onClick={handleAdd} disabled={!form.name || !form.purpose} className="w-full">{t("visitors.logVisitor")}</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t("visitors.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {visitors.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <QrCode className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">{t("visitors.noVisitors")}</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>{t("common.name")}</TableHead><TableHead>{t("visitors.purpose")}</TableHead><TableHead>{t("visitors.visiting")}</TableHead><TableHead>{t("visitors.idNumber")}</TableHead><TableHead>{t("visitors.timeIn")}</TableHead><TableHead>{t("visitors.timeOut")}</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell>{v.purpose}</TableCell>
                  <TableCell>{v.visiting || "—"}</TableCell>
                  <TableCell>{v.idNumber || "—"}</TableCell>
                  <TableCell>{v.timeIn}</TableCell>
                  <TableCell>{v.timeOut || <Badge variant="outline" className="text-xs bg-success/10 text-success">{t("visitors.in")}</Badge>}</TableCell>
                  <TableCell>{!v.timeOut && <Button variant="outline" size="sm" className="text-xs" onClick={() => handleCheckOut(v.id)}>{t("visitors.checkOut")}</Button>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
