import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CreditCard, ClipboardCheck, Download, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Reports() {
  const { t } = useLanguage();

  const reportCategories = [
    {
      title: t("reports.studentReports"),
      icon: Users,
      reports: [
        { name: t("reports.enrollmentSummary"), description: t("reports.enrollmentDesc") },
        { name: t("reports.studentRegister"), description: t("reports.registerDesc") },
        { name: t("reports.newAdmissions"), description: t("reports.admissionsDesc") },
        { name: t("reports.withdrawnStudents"), description: t("reports.withdrawnDesc") },
      ],
    },
    {
      title: t("reports.financialReports"),
      icon: CreditCard,
      reports: [
        { name: t("reports.feesCollection"), description: t("reports.feesDesc") },
        { name: t("reports.outstandingBalances"), description: t("reports.outstandingDesc") },
        { name: t("reports.revenueSummary"), description: t("reports.revenueDesc") },
        { name: t("reports.expenseReport"), description: t("reports.expenseDesc") },
      ],
    },
    {
      title: t("reports.attendanceReports"),
      icon: ClipboardCheck,
      reports: [
        { name: t("reports.dailyAttendance"), description: t("reports.dailyDesc") },
        { name: t("reports.monthlySummary"), description: t("reports.monthlyDesc") },
        { name: t("reports.absenteeList"), description: t("reports.absenteeDesc") },
        { name: t("reports.attendanceRate"), description: t("reports.rateDesc") },
      ],
    },
    {
      title: t("reports.academicReports"),
      icon: TrendingUp,
      reports: [
        { name: t("reports.examResults"), description: t("reports.examDesc") },
        { name: t("reports.classRankings"), description: t("reports.rankingsDesc") },
        { name: t("reports.subjectAnalysis"), description: t("reports.analysisDesc") },
        { name: t("reports.progressTracking"), description: t("reports.progressDesc") },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("reports.title")}</h1>
          <p className="page-description">{t("reports.description")}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {reportCategories.map((category) => (
          <Card key={category.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <category.icon className="h-4 w-4 text-muted-foreground" />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {category.reports.map((report) => (
                <div key={report.name} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{report.name}</p>
                    <p className="text-xs text-muted-foreground">{report.description}</p>
                  </div>
                  <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
