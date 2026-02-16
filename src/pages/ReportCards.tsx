import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Award, Printer, FileDown, Users, Eye } from "lucide-react";
import { useSchool } from "@/contexts/SchoolContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { arabicCurriculumSubjects, standardSubjects } from "@/lib/translations";

export default function ReportCards() {
  const { settings } = useSchool();
  const { t, language, curriculum, isRTL } = useLanguage();
  const printRef = useRef<HTMLDivElement>(null);

  const [classes] = useState(() => {
    const saved = localStorage.getItem("classes");
    return saved ? JSON.parse(saved) : [];
  });
  const [students] = useState(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedClass, setSelectedClass] = useState("");
  const [previewStudent, setPreviewStudent] = useState<any>(null);

  const filteredStudents = selectedClass
    ? students.filter((s: any) => s.className === selectedClass)
    : [];

  const currentYear = new Date().getFullYear();
  const showArabic = curriculum === "arabic" || curriculum === "both";
  const showStandard = curriculum === "standard" || curriculum === "both";

  const subjects = [
    ...(showStandard ? standardSubjects : []),
    ...(showArabic ? arabicCurriculumSubjects : []),
  ];
  const totalFullMarks = subjects.reduce((sum, s) => sum + s.fullMarks, 0);

  const handlePrint = () => {
    const el = printRef.current;
    if (!el) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html dir="${isRTL ? "rtl" : "ltr"}" lang="${language}">
      <head><title>${t("report.title")} - ${settings.schoolName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', 'Noto Sans Arabic', system-ui, sans-serif; direction: ${isRTL ? "rtl" : "ltr"}; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        @page { size: A4; margin: 10mm; }
        .report-card { max-width: 210mm; margin: 0 auto; border: 3px solid #1a7a5a; padding: 0; page-break-after: always; }
        .report-header { background: linear-gradient(135deg, #1a7a5a11, #1a7a5a05); border-bottom: 2px solid #1a7a5a; padding: 16px 20px; }
        .header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .school-name-en { font-size: 14px; font-weight: 700; color: #1a7a5a; }
        .school-name-ar { font-size: 18px; font-weight: 700; color: #1a7a5a; font-family: 'Noto Sans Arabic', sans-serif; direction: rtl; }
        .school-detail { font-size: 9px; color: #555; }
        .report-title { text-align: center; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #1a7a5a; border: 1px solid #1a7a5a; display: inline-block; padding: 4px 16px; }
        .student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; padding: 12px 20px; border-bottom: 2px solid #1a7a5a; font-size: 11px; }
        .info-row { display: flex; gap: 6px; align-items: baseline; }
        .info-label { font-weight: 600; color: #555; white-space: nowrap; }
        .info-label-ar { font-weight: 600; color: #555; font-family: 'Noto Sans Arabic', sans-serif; direction: rtl; white-space: nowrap; }
        .info-value { font-weight: 700; border-bottom: 1px dotted #999; flex: 1; min-width: 60px; }
        .marks-section { padding: 12px 20px; }
        table { width: 100%; border-collapse: collapse; font-size: 10px; }
        th, td { border: 1px solid #1a7a5a; padding: 5px 8px; text-align: center; }
        th { background: #1a7a5a; color: white; font-weight: 700; text-transform: uppercase; font-size: 9px; letter-spacing: 0.5px; }
        .subject-name { text-align: left; font-weight: 600; }
        .subject-name-ar { text-align: right; font-weight: 600; font-family: 'Noto Sans Arabic', sans-serif; }
        .total-row { background: #e8f5f0; font-weight: 700; }
        .remarks-section { padding: 12px 20px; border-top: 2px solid #1a7a5a; }
        .remark-line { font-size: 10px; margin-bottom: 8px; display: flex; gap: 4px; }
        .remark-label { font-weight: 700; white-space: nowrap; }
        .remark-dots { flex: 1; border-bottom: 1px dotted #999; min-height: 14px; }
        .footer-section { display: flex; justify-content: space-between; align-items: flex-end; padding: 12px 20px; border-top: 1px solid #ddd; }
        .stamp-box { border: 2px solid #1a7a5a; padding: 8px 16px; text-align: center; font-size: 10px; font-weight: 700; }
        .bilingual { display: flex; justify-content: space-between; }
        .monthly-table { margin-top: 12px; }
        .arabic-subjects-section th { font-family: 'Noto Sans Arabic', sans-serif; }
      </style></head><body>${el.innerHTML}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  };

  const ReportCardView = ({ student }: { student: any }) => (
    <div className="report-card" style={{ maxWidth: "210mm", margin: "0 auto", border: "3px solid hsl(160 84% 28%)", pageBreakAfter: "always" }}>
      {/* Header - Bilingual */}
      <div className="bg-primary/5 border-b-2 border-primary p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="text-start">
            <p className="text-sm font-bold text-primary">{settings.schoolName}</p>
            {settings.address && <p className="text-[9px] text-muted-foreground">{settings.address}</p>}
            {settings.phone && <p className="text-[9px] text-muted-foreground">TEL: {settings.phone}</p>}
            {settings.email && <p className="text-[9px] text-muted-foreground">Email: {settings.email}</p>}
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
            <Award className="h-7 w-7 text-primary" />
          </div>
          <div className="text-end" style={{ fontFamily: "'Noto Sans Arabic', sans-serif", direction: "rtl" }}>
            <p className="text-lg font-bold text-primary">{settings.schoolName}</p>
            {settings.address && <p className="text-[9px] text-muted-foreground">{settings.address}</p>}
            {settings.phone && <p className="text-[9px] text-muted-foreground">أرقام الهاتف: {settings.phone}</p>}
            {settings.email && <p className="text-[9px] text-muted-foreground">البريد الإلكتروني: {settings.email}</p>}
          </div>
        </div>
        <div className="text-center">
          <span className="inline-block border border-primary px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            {t("report.schoolProgressReport")} / تقرير التقدم الدراسي
          </span>
        </div>
      </div>

      {/* Student Info - Bilingual */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 border-b-2 border-primary px-5 py-3 text-[11px]">
        <div className="flex gap-1.5 items-baseline">
          <span className="font-semibold text-muted-foreground">{t("report.name")}:</span>
          <span className="font-bold border-b border-dotted border-muted-foreground/50 flex-1">{student.fullName}</span>
        </div>
        <div className="flex gap-1.5 items-baseline justify-end" style={{ direction: "rtl" }}>
          <span className="font-semibold text-muted-foreground">الاسم:</span>
          <span className="font-bold border-b border-dotted border-muted-foreground/50 flex-1">{student.fullName}</span>
        </div>
        <div className="flex gap-1.5 items-baseline">
          <span className="font-semibold text-muted-foreground">{t("report.admNo")}:</span>
          <span className="font-bold">{student.admissionNumber}</span>
          <span className="font-semibold text-muted-foreground ms-4">{t("report.class")}:</span>
          <span className="font-bold">{student.className}</span>
          <span className="font-semibold text-muted-foreground ms-4">{t("report.sex")}:</span>
          <span className="font-bold capitalize">{student.gender || "—"}</span>
        </div>
        <div className="flex gap-1.5 items-baseline justify-end" style={{ direction: "rtl" }}>
          <span className="font-semibold text-muted-foreground">رقم القيد:</span>
          <span className="font-bold">{student.admissionNumber}</span>
          <span className="font-semibold text-muted-foreground me-4">الصف:</span>
          <span className="font-bold">{student.className}</span>
          <span className="font-semibold text-muted-foreground me-4">الجنس:</span>
          <span className="font-bold capitalize">{student.gender || "—"}</span>
        </div>
        <div className="flex gap-1.5 items-baseline">
          <span className="font-semibold text-muted-foreground">{t("report.year")}:</span>
          <span className="font-bold">{currentYear}</span>
          <span className="font-semibold text-muted-foreground ms-4">{t("report.position")}:</span>
          <span className="font-bold">___</span>
          <span className="font-semibold text-muted-foreground ms-2">{t("report.outOf")}:</span>
          <span className="font-bold">___</span>
        </div>
        <div className="flex gap-1.5 items-baseline justify-end" style={{ direction: "rtl" }}>
          <span className="font-semibold text-muted-foreground">السنة الدراسية:</span>
          <span className="font-bold">{currentYear}</span>
          <span className="font-semibold text-muted-foreground me-4">الترتيب:</span>
          <span className="font-bold">___</span>
          <span className="font-semibold text-muted-foreground me-2">من أصل:</span>
          <span className="font-bold">___</span>
        </div>
      </div>

      {/* Marks Table - Bilingual columns */}
      <div className="px-5 py-3">
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr>
              <th className="border border-primary bg-primary text-primary-foreground p-1.5 text-start text-[9px] uppercase tracking-wide">
                {t("report.subject")}
              </th>
              <th className="border border-primary bg-primary text-primary-foreground p-1.5 text-[9px]">
                {t("report.fullMarks")}
              </th>
              <th className="border border-primary bg-primary text-primary-foreground p-1.5 text-[9px]">
                {t("report.marksGained")}
              </th>
              <th className="border border-primary bg-primary text-primary-foreground p-1.5 text-[9px]">
                {t("report.agg")}
              </th>
              <th className="border border-primary bg-primary text-primary-foreground p-1.5 text-[9px]">
                {t("report.teacherInitials")}
              </th>
              {/* Arabic side headers */}
              <th className="border border-primary bg-primary text-primary-foreground p-1.5 text-[9px]" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
                التوقيع
              </th>
              <th className="border border-primary bg-primary text-primary-foreground p-1.5 text-[9px]" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
                الدرجة المتحصلة
              </th>
              <th className="border border-primary bg-primary text-primary-foreground p-1.5 text-[9px]" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
                الدرجة الكبرى
              </th>
              <th className="border border-primary bg-primary text-primary-foreground p-1.5 text-end text-[9px]" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
                المواد الدراسية
              </th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub, i) => (
              <tr key={i} className="hover:bg-muted/30">
                <td className="border border-primary p-1.5 text-start font-semibold">{sub.nameEn}</td>
                <td className="border border-primary p-1.5 text-center">{sub.fullMarks}</td>
                <td className="border border-primary p-1.5 text-center"></td>
                <td className="border border-primary p-1.5 text-center"></td>
                <td className="border border-primary p-1.5 text-center"></td>
                <td className="border border-primary p-1.5 text-center"></td>
                <td className="border border-primary p-1.5 text-center"></td>
                <td className="border border-primary p-1.5 text-center">{sub.fullMarks}</td>
                <td className="border border-primary p-1.5 text-end font-semibold" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>{sub.nameAr}</td>
              </tr>
            ))}
            {/* Total Row */}
            <tr className="bg-primary/5 font-bold">
              <td className="border border-primary p-1.5 text-start uppercase">{t("report.total")}</td>
              <td className="border border-primary p-1.5 text-center">{totalFullMarks}</td>
              <td className="border border-primary p-1.5 text-center"></td>
              <td className="border border-primary p-1.5 text-center"></td>
              <td className="border border-primary p-1.5"></td>
              <td className="border border-primary p-1.5"></td>
              <td className="border border-primary p-1.5"></td>
              <td className="border border-primary p-1.5 text-center">{totalFullMarks}</td>
              <td className="border border-primary p-1.5 text-end" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>المجموع</td>
            </tr>
          </tbody>
        </table>

        {/* Monthly Assessment */}
        {showArabic && (
          <div className="mt-4">
            <h4 className="text-[10px] font-bold text-center uppercase tracking-wide mb-2">
              {t("report.monthlyAssessment")} / التقييم الشهري
            </h4>
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr>
                  <th className="border border-primary bg-primary text-primary-foreground p-1 text-[8px]">{t("report.month")}</th>
                  {subjects.map((sub, i) => (
                    <th key={i} className="border border-primary bg-primary text-primary-foreground p-1 text-[7px]">{sub.nameEn.substring(0, 4)}</th>
                  ))}
                  <th className="border border-primary bg-primary text-primary-foreground p-1 text-[8px]">{t("report.agg")}</th>
                  <th className="border border-primary bg-primary text-primary-foreground p-1 text-[8px]">{t("report.div")}</th>
                  <th className="border border-primary bg-primary text-primary-foreground p-1 text-[8px]">{t("report.remarks")}</th>
                  <th className="border border-primary bg-primary text-primary-foreground p-1 text-[8px]" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>الشهر</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2].map((row) => (
                  <tr key={row}>
                    <td className="border border-primary p-1"></td>
                    {subjects.map((_, i) => (
                      <td key={i} className="border border-primary p-1"></td>
                    ))}
                    <td className="border border-primary p-1"></td>
                    <td className="border border-primary p-1"></td>
                    <td className="border border-primary p-1"></td>
                    <td className="border border-primary p-1"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Remarks Section */}
      <div className="border-t-2 border-primary px-5 py-3 space-y-2.5">
        <div className="flex items-baseline gap-1 text-[10px]">
          <span className="font-bold whitespace-nowrap">{t("report.classTeacherRemarks")}:</span>
          <span className="flex-1 border-b border-dotted border-muted-foreground/50 min-h-[14px]"></span>
          <span className="font-bold whitespace-nowrap" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>ملاحظات المعلم / المعلمة:</span>
        </div>
        <div className="flex items-baseline gap-1 text-[10px]">
          <span className="font-bold whitespace-nowrap">{t("report.signature")}:</span>
          <span className="flex-1 border-b border-dotted border-muted-foreground/50 min-h-[14px]"></span>
          <span className="font-bold whitespace-nowrap" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>التوقيع:</span>
        </div>
        <div className="flex items-baseline gap-1 text-[10px]">
          <span className="font-bold whitespace-nowrap">{t("report.headteacherRemarks")}:</span>
          <span className="flex-1 border-b border-dotted border-muted-foreground/50 min-h-[14px]"></span>
          <span className="font-bold whitespace-nowrap" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>ملاحظات مديرة المدرسة:</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between border-t border-muted px-5 py-3">
        <div className="text-[10px] space-y-1">
          <div className="flex gap-1">
            <span className="font-bold">{t("report.nextTermBegins")}:</span>
            <span className="border-b border-dotted border-muted-foreground/50 min-w-[100px]"></span>
          </div>
          <div className="flex gap-1">
            <span className="font-bold">{t("report.name")}:</span>
            <span className="border-b border-dotted border-muted-foreground/50 min-w-[100px]"></span>
            <span className="font-bold ms-4">{t("report.signature")}:</span>
            <span className="border-b border-dotted border-muted-foreground/50 min-w-[80px]"></span>
          </div>
        </div>
        <div className="border-2 border-primary px-4 py-2 text-center">
          <p className="text-[10px] font-bold">{settings.schoolName}</p>
          <p className="text-[8px] text-muted-foreground mt-0.5">{t("report.headteacherOffice")}</p>
          {settings.address && <p className="text-[8px] text-muted-foreground">{settings.address}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("report.title")}</h1>
          <p className="page-description">{t("report.description")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={filteredStudents.length === 0}>
            <FileDown className="h-4 w-4 me-2" /> {t("common.export")} PDF
          </Button>
          <Button size="sm" onClick={handlePrint} disabled={!previewStudent && filteredStudents.length === 0}>
            <Printer className="h-4 w-4 me-2" /> {t("common.print")} {previewStudent ? "(1)" : `(${filteredStudents.length})`}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-48"><SelectValue placeholder={t("report.selectClass")} /></SelectTrigger>
          <SelectContent>
            {classes.map((c: any) => (
              <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="outline" className="text-xs">Term 1, {currentYear}</Badge>
        <Badge variant="outline" className="text-xs">
          {curriculum === "arabic" ? "Arabic Curriculum" : curriculum === "both" ? "Bilingual" : "Standard"}
        </Badge>
      </div>

      {!selectedClass ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <Award className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">{t("report.selectClassPrompt")}</p>
        </CardContent></Card>
      ) : filteredStudents.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <Users className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">{t("report.noStudents")} {selectedClass}</p>
        </CardContent></Card>
      ) : previewStudent ? (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Button variant="outline" size="sm" onClick={() => setPreviewStudent(null)}>← {language === "ar" ? "العودة للقائمة" : "Back to List"}</Button>
            <span className="text-sm font-semibold">{previewStudent.fullName}</span>
          </div>
          <div ref={printRef}>
            <ReportCardView student={previewStudent} />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((s: any) => (
            <Card key={s.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{s.fullName}</h3>
                    <p className="text-sm text-muted-foreground">{s.admissionNumber}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{s.className}</Badge>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setPreviewStudent(s)}>
                    <Eye className="h-3 w-3 me-1" /> {t("common.view")}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => { setPreviewStudent(s); setTimeout(handlePrint, 300); }}>
                    <Printer className="h-3 w-3 me-1" /> {t("common.print")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
