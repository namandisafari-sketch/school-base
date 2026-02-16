import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, Search, CreditCard, Users, Filter, GraduationCap, IdCard } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useSchool } from "@/contexts/SchoolContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Student {
  id: string;
  fullName: string;
  admissionNumber: string;
  gender: string;
  className: string;
  status: string;
  guardianName: string;
  guardianPhone: string;
}

export default function StudentCards() {
  const { settings } = useSchool();
  const { t } = useLanguage();
  const printRef = useRef<HTMLDivElement>(null);
  const [students] = useState<Student[]>(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [];
  });
  const [classes] = useState(() => {
    const saved = localStorage.getItem("classes");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(students.map((s) => s.id)));
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [showPreview, setShowPreview] = useState(false);

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === "all" || s.className === classFilter;
    return matchesSearch && matchesClass;
  });

  const selectedStudents = students.filter((s) => selectedIds.has(s.id));
  const uniqueClasses = [...new Set(students.map((s) => s.className).filter(Boolean))];

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((s) => s.id)));
    }
  };

  const selectByClass = (className: string) => {
    const classStudents = students.filter((s) => s.className === className);
    const next = new Set(selectedIds);
    const allSelected = classStudents.every((s) => next.has(s.id));
    classStudents.forEach((s) => {
      if (allSelected) next.delete(s.id);
      else next.add(s.id);
    });
    setSelectedIds(next);
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student ID Cards - ${settings.schoolName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', system-ui, sans-serif; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            .cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 16px; }
            .id-card { border: 2px solid #1a7a5a; border-radius: 12px; overflow: hidden; page-break-inside: avoid; }
            .card-header { background: linear-gradient(135deg, #1a7a5a, #15634a); color: white; padding: 12px 16px; display: flex; align-items: center; gap: 10px; }
            .card-header .school-icon { width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; }
            .card-header .school-info h3 { font-size: 14px; font-weight: 700; }
            .card-header .school-info p { font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.85; }
            .card-body { padding: 14px 16px; display: flex; gap: 12px; background: white; }
            .photo-placeholder { width: 64px; height: 72px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 10px; flex-shrink: 0; }
            .student-details { flex: 1; min-width: 0; }
            .detail-row { display: flex; margin-bottom: 4px; }
            .detail-label { font-size: 8px; text-transform: uppercase; color: #888; letter-spacing: 0.5px; width: 52px; flex-shrink: 0; }
            .detail-value { font-size: 10px; font-weight: 600; color: #222; }
            .qr-section { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
            .qr-label { font-size: 7px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
            .card-footer { background: #f8f8f8; padding: 6px 16px; display: flex; justify-content: flex-end; border-top: 1px solid #eee; }
            .validity { font-size: 9px; font-weight: 600; color: #1a7a5a; background: #e8f5f0; padding: 2px 8px; border-radius: 4px; }
            .barcode-card { border: 1px solid #ddd; border-radius: 12px; padding: 20px; text-align: center; background: white; page-break-inside: avoid; }
            .barcode-card h4 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
            .barcode-card .subtitle { font-size: 8px; color: #888; margin-bottom: 16px; }
            .barcode-card .barcode-id { font-size: 10px; font-weight: 600; color: #333; margin-top: 8px; }
            .barcode-card .notice { margin-top: 16px; }
            .barcode-card .notice-title { font-size: 9px; font-weight: 700; color: #c00; text-transform: uppercase; }
            .barcode-card .notice-text { font-size: 8px; color: #666; line-height: 1.4; }
            @page { size: A4; margin: 10mm; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  const currentYear = new Date().getFullYear();
  const validityText = `VALID ${currentYear}-${currentYear + 1}`;
  const schoolInitial = settings.schoolName ? settings.schoolName.charAt(0).toUpperCase() : "S";

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("studentCards.title")}</h1>
          <p className="page-description">{t("studentCards.description")}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            disabled={selectedStudents.length === 0}
          >
            {showPreview ? t("studentCards.showList") : t("studentCards.previewCards")}
          </Button>
          <Button size="sm" onClick={handlePrint} disabled={selectedStudents.length === 0}>
            <Printer className="mr-2 h-4 w-4" /> {t("common.print")} ({selectedStudents.length})
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: t("common.total"), value: students.length, icon: Users, color: "text-primary" },
          { label: t("studentCards.selected"), value: selectedStudents.length, icon: CreditCard, color: "text-success" },
          { label: t("studentCards.filtered"), value: filtered.length, icon: Filter, color: "text-info" },
          { label: t("classes.title"), value: uniqueClasses.length, icon: GraduationCap, color: "text-accent" },
        ].map((stat) => (
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

      {uniqueClasses.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-3">{t("studentCards.quickSelect")}</p>
            <div className="flex flex-wrap gap-2">
              {uniqueClasses.map((cls) => {
                const count = students.filter((s) => s.className === cls).length;
                return (
                  <Button key={cls} variant="outline" size="sm" className="text-xs" onClick={() => selectByClass(cls)}>
                    {cls} ({count})
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {showPreview ? (
        <>
          <div ref={printRef}>
            <h2 className="text-lg font-semibold mb-4">{t("studentCards.cardPreview")}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {selectedStudents.map((student) => (
                <div key={student.id} className="space-y-4">
                  <Card className="overflow-hidden border-2 border-primary">
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/20 text-primary-foreground font-bold text-sm">
                        {schoolInitial}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-primary-foreground">{settings.schoolName}</h3>
                        <p className="text-[9px] uppercase tracking-[1.5px] text-primary-foreground/80">{t("studentCards.title")}</p>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="h-[72px] w-16 shrink-0 rounded-md border bg-muted flex items-center justify-center">
                          <span className="text-[10px] text-muted-foreground">PHOTO</span>
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex">
                            <span className="text-[8px] uppercase text-muted-foreground w-14 shrink-0">{t("students.fullName")}</span>
                            <span className="text-[10px] font-semibold truncate">{student.fullName}</span>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex">
                              <span className="text-[8px] uppercase text-muted-foreground w-14 shrink-0">{t("students.admNo")}</span>
                              <span className="text-[10px] font-semibold">{student.admissionNumber}</span>
                            </div>
                            <div className="flex">
                              <span className="text-[8px] uppercase text-muted-foreground w-10 shrink-0">{t("common.class")}</span>
                              <span className="text-[10px] font-semibold">{student.className}</span>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex">
                              <span className="text-[8px] uppercase text-muted-foreground w-14 shrink-0">{t("students.dob")}</span>
                              <span className="text-[10px] font-semibold">—</span>
                            </div>
                            <div className="flex">
                              <span className="text-[8px] uppercase text-muted-foreground w-14 shrink-0">{t("common.gender")}</span>
                              <span className="text-[10px] font-semibold capitalize">{student.gender || "—"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center shrink-0">
                          <QRCodeSVG value={`STUDENT:${student.admissionNumber}:${student.fullName}`} size={56} level="M" />
                          <span className="text-[7px] uppercase text-muted-foreground mt-1 tracking-wide">Scan for Check-in</span>
                        </div>
                      </div>
                    </CardContent>
                    <div className="bg-muted/50 border-t px-3 py-1.5 flex justify-end">
                      <Badge variant="outline" className="text-[9px] font-semibold text-primary bg-primary/10 border-primary/20">
                        {validityText}
                      </Badge>
                    </div>
                  </Card>

                  <Card className="border">
                    <CardContent className="py-5 text-center space-y-3">
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wide">Fee Payment Barcode</h4>
                        <p className="text-[8px] text-muted-foreground">Scan this barcode at the bursar's office to process fee payments</p>
                      </div>
                      <div className="flex justify-center">
                        <QRCodeSVG value={`FEE:${student.admissionNumber}`} size={96} level="H" />
                      </div>
                      <p className="text-[10px] font-semibold">{student.admissionNumber}</p>
                      <div className="pt-2 border-t space-y-0.5">
                        <p className="text-[9px] font-bold text-destructive uppercase">Important Notice:</p>
                        <p className="text-[8px] text-muted-foreground leading-relaxed">
                          This card is property of {settings.schoolName}.<br />
                          If found, please return to the school office.
                          {settings.phone && <><br />Contact: {settings.phone}</>}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {students.length > selectedStudents.length && (
              <p className="text-center text-sm text-muted-foreground mt-6">
                + {students.length - selectedStudents.length} {t("studentCards.moreCards")}
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t("studentCards.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder={t("common.allClasses")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.allClasses")}</SelectItem>
                {uniqueClasses.map((cls) => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {students.length === 0 ? (
            <Card><CardContent className="flex flex-col items-center justify-center py-16">
              <IdCard className="mb-3 h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">{t("studentCards.noStudents")}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("studentCards.enrollFirst")}</p>
            </CardContent></Card>
          ) : (
            <Card><CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={filtered.length > 0 && filtered.every((s) => selectedIds.has(s.id))}
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    <TableHead>{t("common.name")}</TableHead>
                    <TableHead>{t("students.admNo")}</TableHead>
                    <TableHead>{t("common.class")}</TableHead>
                    <TableHead>{t("common.gender")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.id} className="cursor-pointer" onClick={() => toggleSelect(s.id)}>
                      <TableCell>
                        <Checkbox checked={selectedIds.has(s.id)} onCheckedChange={() => toggleSelect(s.id)} />
                      </TableCell>
                      <TableCell className="font-medium">{s.fullName}</TableCell>
                      <TableCell>{s.admissionNumber}</TableCell>
                      <TableCell>{s.className}</TableCell>
                      <TableCell className="capitalize">{s.gender || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent></Card>
          )}
        </>
      )}
    </div>
  );
}
