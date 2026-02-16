import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Exam {
  id: string;
  name: string;
  type: string;
  term: string;
  date: string;
  status: "upcoming" | "ongoing" | "completed";
}

export default function Exams() {
  const { t } = useLanguage();
  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem("exams");
    return saved ? JSON.parse(saved) : [];
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", type: "", term: "", date: "" });

  const handleAdd = () => {
    if (!form.name || !form.type) return;
    const newExam: Exam = { id: crypto.randomUUID(), ...form, status: "upcoming" };
    const updated = [...exams, newExam];
    setExams(updated);
    localStorage.setItem("exams", JSON.stringify(updated));
    setForm({ name: "", type: "", term: "", date: "" });
    setDialogOpen(false);
  };

  const statusColor = (s: string) => {
    if (s === "upcoming") return "bg-info/10 text-info border-info/20";
    if (s === "ongoing") return "bg-warning/10 text-warning border-warning/20";
    return "bg-success/10 text-success border-success/20";
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("exams.title")}</h1>
          <p className="page-description">{t("exams.description")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> {t("exams.createExam")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t("exams.createExam")}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div><Label>{t("exams.examName")} *</Label><Input className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("common.type")} *</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder={t("common.select")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="midterm">{t("exams.midterm")}</SelectItem>
                      <SelectItem value="final">{t("exams.final")}</SelectItem>
                      <SelectItem value="mock">{t("exams.mock")}</SelectItem>
                      <SelectItem value="quiz">{t("exams.quiz")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>{t("exams.term")}</Label><Input className="mt-1.5" value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} /></div>
              </div>
              <div><Label>{t("common.date")}</Label><Input type="date" className="mt-1.5" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            </div>
            <Button onClick={handleAdd} disabled={!form.name || !form.type} className="w-full">{t("exams.createExam")}</Button>
          </DialogContent>
        </Dialog>
      </div>

      {exams.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">{t("exams.noExams")}</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>{t("exams.examName")}</TableHead><TableHead>{t("common.type")}</TableHead><TableHead>{t("exams.term")}</TableHead><TableHead>{t("common.date")}</TableHead><TableHead>{t("common.status")}</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {exams.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell className="capitalize">{e.type}</TableCell>
                  <TableCell>{e.term || "—"}</TableCell>
                  <TableCell>{e.date || "—"}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${statusColor(e.status)}`}>{t(`exams.${e.status}`)}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
