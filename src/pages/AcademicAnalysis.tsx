import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Trophy, TrendingUp, TrendingDown, Users, Printer, FileDown } from "lucide-react";
import { useSchool } from "@/contexts/SchoolContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { arabicCurriculumSubjects, standardSubjects } from "@/lib/translations";

interface StudentMark {
  studentId: string;
  fullName: string;
  admissionNumber: string;
  className: string;
  marks: Record<string, number>;
  total: number;
  average: number;
  position: number;
  grade: string;
  division: string;
}

function getGrade(avg: number): string {
  if (avg >= 80) return "D1";
  if (avg >= 70) return "D2";
  if (avg >= 60) return "C3";
  if (avg >= 55) return "C4";
  if (avg >= 50) return "C5";
  if (avg >= 45) return "C6";
  if (avg >= 40) return "P7";
  if (avg >= 35) return "P8";
  return "F9";
}

function getDivision(agg: number): string {
  if (agg <= 32) return "I";
  if (agg <= 45) return "II";
  if (agg <= 58) return "III";
  if (agg <= 72) return "IV";
  return "U";
}

export default function AcademicAnalysis() {
  const { settings } = useSchool();
  const { t, language, curriculum, isRTL } = useLanguage();
  const isAr = language === "ar";

  const [classes] = useState(() => {
    const saved = localStorage.getItem("classes");
    return saved ? JSON.parse(saved) : [];
  });
  const [students] = useState(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExam, setSelectedExam] = useState("midterm");

  const showArabic = curriculum === "arabic" || curriculum === "both";
  const showStandard = curriculum === "standard" || curriculum === "both";

  const subjects = [
    ...(showStandard ? standardSubjects : []),
    ...(showArabic ? arabicCurriculumSubjects : []),
  ];

  // Generate demo marks for students in selected class
  const scoreSheet = useMemo<StudentMark[]>(() => {
    const filtered = selectedClass
      ? students.filter((s: any) => s.className === selectedClass)
      : [];

    const withMarks = filtered.map((s: any) => {
      const marks: Record<string, number> = {};
      subjects.forEach(sub => {
        // Generate realistic-looking demo marks
        const seed = (s.id || s.fullName || "").length + sub.nameEn.length;
        marks[sub.nameEn] = Math.min(100, Math.max(15, Math.floor(45 + Math.sin(seed * 3.7) * 35 + Math.cos(seed * 2.1) * 15)));
      });
      const total = Object.values(marks).reduce((a, b) => a + b, 0);
      const average = subjects.length > 0 ? total / subjects.length : 0;
      const gradeNum = subjects.length > 0
        ? subjects.reduce((sum, sub) => {
            const m = marks[sub.nameEn] || 0;
            return sum + parseInt(getGrade(m).replace(/\D/g, ""));
          }, 0)
        : 0;

      return {
        studentId: s.id,
        fullName: s.fullName,
        admissionNumber: s.admissionNumber || "—",
        className: s.className,
        marks,
        total,
        average: Math.round(average * 10) / 10,
        position: 0,
        grade: getGrade(average),
        division: getDivision(gradeNum),
      };
    });

    // Sort by total descending and assign positions
    withMarks.sort((a, b) => b.total - a.total);
    withMarks.forEach((s, i) => { s.position = i + 1; });

    return withMarks;
  }, [selectedClass, students, subjects]);

  // Subject-level analysis
  const subjectAnalysis = useMemo(() => {
    return subjects.map(sub => {
      const allMarks = scoreSheet.map(s => s.marks[sub.nameEn] || 0);
      if (allMarks.length === 0) return { ...sub, avg: 0, highest: 0, lowest: 0, passRate: 0 };
      const avg = allMarks.reduce((a, b) => a + b, 0) / allMarks.length;
      const highest = Math.max(...allMarks);
      const lowest = Math.min(...allMarks);
      const passRate = (allMarks.filter(m => m >= 50).length / allMarks.length) * 100;
      return { ...sub, avg: Math.round(avg * 10) / 10, highest, lowest, passRate: Math.round(passRate) };
    });
  }, [scoreSheet, subjects]);

  const classAverage = scoreSheet.length > 0
    ? Math.round(scoreSheet.reduce((a, b) => a + b.average, 0) / scoreSheet.length * 10) / 10
    : 0;

  const handlePrintScoreSheet = () => {
    const w = window.open("", "_blank");
    if (!w) return;

    const subHeaders = subjects.map(s => `<th style="background:#1a7a5a!important;color:white!important;border:1px solid #1a7a5a;padding:4px 6px;font-size:8px;white-space:nowrap;">${s.nameEn}</th>`).join("");
    const rows = scoreSheet.map(s => {
      const markCells = subjects.map(sub => {
        const m = s.marks[sub.nameEn] || 0;
        const color = m >= 50 ? "#166534" : "#dc2626";
        return `<td style="border:1px solid #1a7a5a;padding:3px 6px;text-align:center;font-size:10px;color:${color};font-weight:${m>=50?"400":"700"}">${m}</td>`;
      }).join("");
      return `<tr>
        <td style="border:1px solid #1a7a5a;padding:3px 6px;text-align:center;font-size:10px;font-weight:700">${s.position}</td>
        <td style="border:1px solid #1a7a5a;padding:3px 6px;font-size:10px;font-weight:600;white-space:nowrap">${s.fullName}</td>
        <td style="border:1px solid #1a7a5a;padding:3px 6px;text-align:center;font-size:10px">${s.admissionNumber}</td>
        ${markCells}
        <td style="border:1px solid #1a7a5a;padding:3px 6px;text-align:center;font-size:10px;font-weight:700;background:#e8f5f0!important">${s.total}</td>
        <td style="border:1px solid #1a7a5a;padding:3px 6px;text-align:center;font-size:10px;font-weight:700">${s.average}</td>
        <td style="border:1px solid #1a7a5a;padding:3px 6px;text-align:center;font-size:10px;font-weight:700">${s.grade}</td>
        <td style="border:1px solid #1a7a5a;padding:3px 6px;text-align:center;font-size:10px;font-weight:700">${s.division}</td>
      </tr>`;
    }).join("");

    w.document.write(`<!DOCTYPE html><html><head><title>Score Sheet - ${selectedClass}</title>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family:'Segoe UI',system-ui,sans-serif; }
      @media print {
        * { -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; color-adjust:exact!important; }
      }
      @page { size:A4 landscape; margin:8mm; }
      table { width:100%; border-collapse:collapse; }
    </style></head><body style="padding:10px">
    <div style="text-align:center;margin-bottom:16px">
      <h2 style="color:#1a7a5a;font-size:16px;margin-bottom:4px">${settings.schoolName}</h2>
      <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px">Score Sheet — ${selectedClass} — ${selectedExam === "midterm" ? "Mid-Term" : selectedExam === "final" ? "End of Term" : "Mock"} ${new Date().getFullYear()}</p>
    </div>
    <table>
      <thead><tr>
        <th style="background:#1a7a5a!important;color:white!important;border:1px solid #1a7a5a;padding:4px 6px;font-size:9px">#</th>
        <th style="background:#1a7a5a!important;color:white!important;border:1px solid #1a7a5a;padding:4px 6px;font-size:9px;text-align:left">Name</th>
        <th style="background:#1a7a5a!important;color:white!important;border:1px solid #1a7a5a;padding:4px 6px;font-size:9px">Adm No</th>
        ${subHeaders}
        <th style="background:#1a7a5a!important;color:white!important;border:1px solid #1a7a5a;padding:4px 6px;font-size:9px">Total</th>
        <th style="background:#1a7a5a!important;color:white!important;border:1px solid #1a7a5a;padding:4px 6px;font-size:9px">Avg</th>
        <th style="background:#1a7a5a!important;color:white!important;border:1px solid #1a7a5a;padding:4px 6px;font-size:9px">Grade</th>
        <th style="background:#1a7a5a!important;color:white!important;border:1px solid #1a7a5a;padding:4px 6px;font-size:9px">Div</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="margin-top:16px;display:flex;justify-content:space-between;font-size:11px">
      <span><strong>Total Students:</strong> ${scoreSheet.length}</span>
      <span><strong>Class Average:</strong> ${classAverage}%</span>
      <span><strong>Date:</strong> ${new Date().toLocaleDateString()}</span>
    </div>
    </body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAr ? "التحليل الأكاديمي" : "Academic Analysis"}</h1>
          <p className="page-description">{isAr ? "كشوف الدرجات وترتيب الطلاب حسب الأداء" : "Score sheets and student rankings by performance"}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrintScoreSheet} disabled={scoreSheet.length === 0}>
            <Printer className="h-4 w-4 me-2" /> {isAr ? "طباعة كشف الدرجات" : "Print Score Sheet"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-48"><SelectValue placeholder={isAr ? "اختر الفصل" : "Select Class"} /></SelectTrigger>
          <SelectContent>
            {classes.map((c: any) => (
              <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedExam} onValueChange={setSelectedExam}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="midterm">{isAr ? "منتصف الفصل" : "Mid-Term Exam"}</SelectItem>
            <SelectItem value="final">{isAr ? "نهاية الفصل" : "End of Term Exam"}</SelectItem>
            <SelectItem value="mock">{isAr ? "اختبار تجريبي" : "Mock Exam"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!selectedClass ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">{isAr ? "اختر فصلاً لعرض التحليل" : "Select a class to view analysis"}</p>
          </CardContent>
        </Card>
      ) : scoreSheet.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">{isAr ? "لا يوجد طلاب في هذا الفصل" : `No students in ${selectedClass}`}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{scoreSheet.length}</p>
                    <p className="text-xs text-muted-foreground">{isAr ? "الطلاب" : "Students"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{classAverage}%</p>
                    <p className="text-xs text-muted-foreground">{isAr ? "متوسط الفصل" : "Class Average"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{scoreSheet[0]?.fullName?.split(" ")[0] || "—"}</p>
                    <p className="text-xs text-muted-foreground">{isAr ? "الأول" : "Top Student"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{scoreSheet.filter(s => s.average >= 50).length}</p>
                    <p className="text-xs text-muted-foreground">{isAr ? "ناجحون" : "Passed"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Score Sheet / Rankings Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="h-4 w-4 text-primary" />
                {isAr ? "كشف الدرجات والترتيب" : "Score Sheet & Rankings"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px] text-center">#</TableHead>
                      <TableHead>{isAr ? "الاسم" : "Name"}</TableHead>
                      <TableHead className="text-center">{isAr ? "رقم القيد" : "Adm No"}</TableHead>
                      {subjects.map(sub => (
                        <TableHead key={sub.nameEn} className="text-center text-xs whitespace-nowrap">{sub.nameEn}</TableHead>
                      ))}
                      <TableHead className="text-center font-bold">{isAr ? "المجموع" : "Total"}</TableHead>
                      <TableHead className="text-center font-bold">{isAr ? "المتوسط" : "Avg"}</TableHead>
                      <TableHead className="text-center">{isAr ? "الدرجة" : "Grade"}</TableHead>
                      <TableHead className="text-center">{isAr ? "الشعبة" : "Div"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scoreSheet.map((s) => (
                      <TableRow key={s.studentId} className={s.position <= 3 ? "bg-primary/5" : ""}>
                        <TableCell className="text-center font-bold">
                          {s.position <= 3 ? (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                              {s.position}
                            </span>
                          ) : s.position}
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">{s.fullName}</TableCell>
                        <TableCell className="text-center text-xs font-mono">{s.admissionNumber}</TableCell>
                        {subjects.map(sub => {
                          const m = s.marks[sub.nameEn] || 0;
                          return (
                            <TableCell key={sub.nameEn} className={`text-center text-sm ${m < 50 ? "text-destructive font-bold" : ""}`}>
                              {m}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center font-bold bg-primary/5">{s.total}</TableCell>
                        <TableCell className="text-center font-bold">{s.average}%</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-xs">{s.grade}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={s.division === "I" ? "default" : "outline"} className="text-xs">
                            {s.division}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Subject Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4 text-primary" />
                {isAr ? "تحليل المواد" : "Subject Analysis"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isAr ? "المادة" : "Subject"}</TableHead>
                    <TableHead className="text-center">{isAr ? "المتوسط" : "Average"}</TableHead>
                    <TableHead className="text-center">{isAr ? "الأعلى" : "Highest"}</TableHead>
                    <TableHead className="text-center">{isAr ? "الأدنى" : "Lowest"}</TableHead>
                    <TableHead className="text-center">{isAr ? "نسبة النجاح" : "Pass Rate"}</TableHead>
                    <TableHead>{isAr ? "الأداء" : "Performance"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjectAnalysis.map(sub => (
                    <TableRow key={sub.nameEn}>
                      <TableCell className="font-medium">{isAr ? sub.nameAr : sub.nameEn}</TableCell>
                      <TableCell className="text-center font-bold">{sub.avg}%</TableCell>
                      <TableCell className="text-center text-primary font-semibold">{sub.highest}</TableCell>
                      <TableCell className="text-center text-destructive font-semibold">{sub.lowest}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={sub.passRate >= 70 ? "default" : sub.passRate >= 50 ? "outline" : "destructive"} className="text-xs">
                          {sub.passRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${sub.avg}%` }}
                            />
                          </div>
                          {sub.avg >= 60 ? (
                            <TrendingUp className="h-3.5 w-3.5 text-primary" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
