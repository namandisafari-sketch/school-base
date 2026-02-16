import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";

const feeStats = [
  { label: "Total Expected", value: "UGX 0", icon: DollarSign, color: "text-primary" },
  { label: "Collected", value: "UGX 0", icon: CreditCard, color: "text-success" },
  { label: "Outstanding", value: "UGX 0", icon: AlertTriangle, color: "text-warning" },
  { label: "Collection Rate", value: "0%", icon: TrendingUp, color: "text-info" },
];

export default function Fees() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fees Management</h1>
          <p className="page-description">Track fees, payments, and balances</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {feeStats.map((stat) => (
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

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <CreditCard className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No fee structures set up yet</p>
          <p className="text-xs text-muted-foreground mt-1">Configure fee structures in Settings to start tracking payments</p>
        </CardContent>
      </Card>
    </div>
  );
}
