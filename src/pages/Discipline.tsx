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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
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
          <h1 className="page-title">{t("discipline.title")}</h1>
          <p className="page-description">{cases.length} {t("discipline.recorded")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> {t("discipline.logIncident")}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{t("discipline.logTitle")}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("discipline.studentName")} *</Label><Input className="mt-1.5" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} /></div>
                <div><Label>{t("discipline.incidentType")} *</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder={t("common.select")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="truancy">{t("discipline.truancy")}</SelectItem>
                      <SelectItem value="fighting">{t("discipline.fighting")}</SelectItem>
                      <SelectItem value="bullying">{t("discipline.bullying")}</SelectItem>
                      <SelectItem value="damage">{t("discipline.damage")}</SelectItem>
                      <SelectItem value="misconduct">{t("discipline.misconduct")}</SelectItem>
                      <SelectItem value="other">{t("students.other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>{t("discipline.severity")}</Label>
                <Select value={form.severity} onValueChange={(v) => setForm({ ...form, severity: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder={t("common.select")} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">{t("discipline.minor")}</SelectItem>
                    <SelectItem value="moderate">{t("discipline.moderate")}</SelectItem>
                    <SelectItem value="severe">{t("discipline.severe")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>{t("common.description")}</Label><Textarea className="mt-1.5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><Label>{t("discipline.actionTaken")}</Label><Input className="mt-1.5" value={form.actionTaken} onChange={(e) => setForm({ ...form, actionTaken: e.target.value })} /></div>
            </div>
            <Button onClick={handleAdd} disabled={!form.studentName || !form.type} className="w-full">{t("discipline.logIncident")}</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t("discipline.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {cases.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <AlertTriangle className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">{t("discipline.noCases")}</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>{t("gate.student")}</TableHead><TableHead>{t("common.type")}</TableHead><TableHead>{t("discipline.severity")}</TableHead><TableHead>{t("discipline.actionTaken")}</TableHead><TableHead>{t("common.date")}</TableHead><TableHead>{t("common.status")}</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.studentName}</TableCell>
                  <TableCell className="capitalize">{c.type}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${severityColor(c.severity)}`}>{c.severity ? t(`discipline.${c.severity}`) : "—"}</Badge></TableCell>
                  <TableCell>{c.actionTaken || "—"}</TableCell>
                  <TableCell>{c.date}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${c.status === "resolved" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{t(`discipline.${c.status}`)}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
