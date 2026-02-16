import { useSchool } from "@/contexts/SchoolContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardCheck, CreditCard, AlertTriangle, TrendingUp, UserPlus, DollarSign, Clock } from "lucide-react";

const stats = [
  { label: "Total Students", value: "0", icon: Users, change: "Start enrolling" },
  { label: "Attendance Today", value: "—", icon: ClipboardCheck, change: "No data yet" },
  { label: "Fees Collected", value: "UGX 0", icon: CreditCard, change: "This term" },
  { label: "Outstanding Balance", value: "UGX 0", icon: AlertTriangle, change: "Total owed" },
];

const quickActions = [
  { label: "Enroll Student", icon: UserPlus, href: "/students" },
  { label: "Mark Attendance", icon: ClipboardCheck, href: "/attendance" },
  { label: "Record Payment", icon: DollarSign, href: "/fees" },
  { label: "View Reports", icon: TrendingUp, href: "/reports" },
];

export default function Dashboard() {
  const { settings } = useSchool();

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">
            Welcome to {settings.schoolName}. Here's your overview.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="stat-card animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <action.icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Clock className="mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm">No activity yet</p>
            <p className="text-xs">Start by enrolling students and setting up classes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
