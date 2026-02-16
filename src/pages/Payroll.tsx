import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Wallet, DollarSign, Users, TrendingUp, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PayrollRecord {
  id: string;
  employeeName: string;
  role: string;
  basicSalary: number;
  deductions: number;
  netPay: number;
  month: string;
  status: "pending" | "paid";
}

export default function Payroll() {
  const { t } = useLanguage();

  const payrollStats = [
    { label: t("payroll.totalPayroll"), value: "UGX 0", icon: Wallet, color: "text-primary" },
    { label: t("payroll.staffCount"), value: "0", icon: Users, color: "text-info" },
    { label: t("payroll.deductions"), value: "UGX 0", icon: DollarSign, color: "text-warning" },
    { label: t("payroll.netDisbursed"), value: "UGX 0", icon: TrendingUp, color: "text-success" },
  ];

  const [records, setRecords] = useState<PayrollRecord[]>(() => {
    const saved = localStorage.getItem("payroll");
    return saved ? JSON.parse(saved) : [];
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ employeeName: "", role: "", basicSalary: "", deductions: "", month: "" });

  const handleAdd = () => {
    if (!form.employeeName || !form.basicSalary) return;
    const salary = parseFloat(form.basicSalary);
    const ded = parseFloat(form.deductions) || 0;
    const record: PayrollRecord = {
      id: crypto.randomUUID(),
      employeeName: form.employeeName,
      role: form.role,
      basicSalary: salary,
      deductions: ded,
      netPay: salary - ded,
      month: form.month || new Date().toISOString().slice(0, 7),
      status: "pending",
    };
    const updated = [...records, record];
    setRecords(updated);
    localStorage.setItem("payroll", JSON.stringify(updated));
    setForm({ employeeName: "", role: "", basicSalary: "", deductions: "", month: "" });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("payroll.title")}</h1>
          <p className="page-description">{t("payroll.description")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> {t("payroll.addRecord")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t("payroll.addTitle")}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("payroll.employeeName")} *</Label><Input className="mt-1.5" value={form.employeeName} onChange={(e) => setForm({ ...form, employeeName: e.target.value })} /></div>
                <div><Label>{t("staff.role")}</Label><Input className="mt-1.5" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("payroll.basicSalary")} *</Label><Input className="mt-1.5" type="number" value={form.basicSalary} onChange={(e) => setForm({ ...form, basicSalary: e.target.value })} /></div>
                <div><Label>{t("payroll.deductions")}</Label><Input className="mt-1.5" type="number" value={form.deductions} onChange={(e) => setForm({ ...form, deductions: e.target.value })} /></div>
              </div>
              <div><Label>{t("payroll.month")}</Label><Input className="mt-1.5" type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} /></div>
            </div>
            <Button onClick={handleAdd} disabled={!form.employeeName || !form.basicSalary} className="w-full">{t("payroll.addRecord")}</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {payrollStats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {records.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <Wallet className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">{t("payroll.noRecords")}</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>{t("payroll.employeeName")}</TableHead><TableHead>{t("staff.role")}</TableHead><TableHead>{t("payroll.basicSalary")}</TableHead><TableHead>{t("payroll.deductions")}</TableHead><TableHead>{t("payroll.netPay")}</TableHead><TableHead>{t("common.status")}</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.employeeName}</TableCell>
                  <TableCell>{r.role || "—"}</TableCell>
                  <TableCell>UGX {r.basicSalary.toLocaleString()}</TableCell>
                  <TableCell>UGX {r.deductions.toLocaleString()}</TableCell>
                  <TableCell className="font-medium">UGX {r.netPay.toLocaleString()}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${r.status === "paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{r.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
