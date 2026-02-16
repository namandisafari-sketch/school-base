import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DoorOpen, QrCode, Search, Clock, UserCheck, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CheckIn {
  id: string;
  studentName: string;
  admissionNumber: string;
  type: "arrival" | "departure";
  time: string;
  isLate: boolean;
  method: "manual" | "qr";
}

export default function Gate() {
  const { t } = useLanguage();

  const gateStats = [
    { label: t("gate.arrivalsToday"), value: "0", icon: UserCheck, color: "text-success" },
    { label: t("gate.lateArrivals"), value: "0", icon: AlertTriangle, color: "text-warning" },
    { label: t("gate.departures"), value: "0", icon: DoorOpen, color: "text-info" },
    { label: t("gate.stillInSchool"), value: "0", icon: Clock, color: "text-primary" },
  ];

  const [checkins, setCheckins] = useState<CheckIn[]>(() => {
    const saved = localStorage.getItem("gate_checkins");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [manualAdm, setManualAdm] = useState("");

  const filtered = checkins.filter((c) =>
    c.studentName.toLowerCase().includes(search.toLowerCase()) || c.admissionNumber.includes(search)
  );

  const handleManualCheckin = () => {
    if (!manualAdm) return;
    const students = JSON.parse(localStorage.getItem("students") || "[]");
    const student = students.find((s: any) => s.admissionNumber === manualAdm);
    if (!student) return;
    const now = new Date();
    const checkin: CheckIn = {
      id: crypto.randomUUID(),
      studentName: student.fullName,
      admissionNumber: student.admissionNumber,
      type: "arrival",
      time: now.toLocaleTimeString(),
      isLate: now.getHours() >= 8,
      method: "manual",
    };
    const updated = [checkin, ...checkins];
    setCheckins(updated);
    localStorage.setItem("gate_checkins", JSON.stringify(updated));
    setManualAdm("");
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("gate.title")}</h1>
          <p className="page-description">{t("gate.description")}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {gateStats.map((stat) => (
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><QrCode className="h-4 w-4" /> {t("gate.qrScanner")}</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <div className="h-48 w-48 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-4">
              <QrCode className="h-16 w-16 text-muted-foreground/30" />
            </div>
            <p className="text-sm text-muted-foreground">{t("gate.cameraNote")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><UserCheck className="h-4 w-4" /> {t("gate.manualCheckin")}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder={t("gate.enterAdm")} value={manualAdm} onChange={(e) => setManualAdm(e.target.value)} />
              <Button onClick={handleManualCheckin}>{t("gate.checkIn")}</Button>
            </div>
            <p className="text-xs text-muted-foreground">{t("gate.manualNote")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t("gate.searchCheckins")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {checkins.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <DoorOpen className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">{t("gate.noCheckins")}</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>{t("gate.student")}</TableHead><TableHead>{t("students.admNo")}</TableHead><TableHead>{t("common.type")}</TableHead><TableHead>{t("gate.time")}</TableHead><TableHead>{t("fees.method")}</TableHead><TableHead>{t("common.status")}</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.studentName}</TableCell>
                  <TableCell>{c.admissionNumber}</TableCell>
                  <TableCell className="capitalize">{c.type}</TableCell>
                  <TableCell>{c.time}</TableCell>
                  <TableCell className="uppercase text-xs">{c.method}</TableCell>
                  <TableCell>{c.isLate ? <Badge variant="outline" className="text-xs bg-warning/10 text-warning">{t("attendance.late")}</Badge> : <Badge variant="outline" className="text-xs bg-success/10 text-success">{t("gate.onTime")}</Badge>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
