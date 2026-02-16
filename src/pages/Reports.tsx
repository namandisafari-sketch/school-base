import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, CreditCard, ClipboardCheck, Download, FileText, TrendingUp, DollarSign } from "lucide-react";

const reportCategories = [
  {
    title: "Student Reports",
    icon: Users,
    reports: [
      { name: "Enrollment Summary", description: "Total students by class, gender, and status" },
      { name: "Student Register", description: "Complete list of all enrolled students" },
      { name: "New Admissions", description: "Students enrolled this term" },
      { name: "Withdrawn Students", description: "Students who left the school" },
    ],
  },
  {
    title: "Financial Reports",
    icon: CreditCard,
    reports: [
      { name: "Fees Collection", description: "Payments received this term/month" },
      { name: "Outstanding Balances", description: "Students with pending fee balances" },
      { name: "Revenue Summary", description: "Total income by category" },
      { name: "Expense Report", description: "Expenditure breakdown by category" },
    ],
  },
  {
    title: "Attendance Reports",
    icon: ClipboardCheck,
    reports: [
      { name: "Daily Attendance", description: "Attendance summary for today" },
      { name: "Monthly Summary", description: "Attendance trends by class" },
      { name: "Absentee List", description: "Chronically absent students" },
      { name: "Attendance Rate", description: "Overall attendance percentage" },
    ],
  },
  {
    title: "Academic Reports",
    icon: TrendingUp,
    reports: [
      { name: "Exam Results", description: "Performance summary by class/subject" },
      { name: "Class Rankings", description: "Student positions within each class" },
      { name: "Subject Analysis", description: "Pass/fail rates per subject" },
      { name: "Progress Tracking", description: "Student improvement over terms" },
    ],
  },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-description">Financial, academic, and operational reports</p>
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
