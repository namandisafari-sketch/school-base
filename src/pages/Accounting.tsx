import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Percent, FileText, RefreshCw, Download, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Accounting() {
  const { t } = useLanguage();

  const financialStats = [
    { label: t("accounting.revenue"), value: "USh 0", sub: t("accounting.thisMonth"), icon: DollarSign, color: "text-primary" },
    { label: t("accounting.netProfit"), value: "USh 0", sub: "0.0%", icon: TrendingUp, color: "text-destructive" },
    { label: t("accounting.grossMargin"), value: "0.0%", sub: "Target: 40%+", icon: Percent, color: "text-warning" },
    { label: t("accounting.taxDue"), value: "USh 0", sub: "", icon: FileText, color: "text-info" },
  ];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><BarChart3 className="h-6 w-6" /> {t("accounting.title")}</h1>
          <p className="page-description">{t("accounting.description")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><RefreshCw className="mr-2 h-4 w-4" /> {t("common.refresh")}</Button>
          <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> {t("common.export")}</Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">{t("accounting.dashboard")}</TabsTrigger>
          <TabsTrigger value="ledger">{t("accounting.generalLedger")}</TabsTrigger>
          <TabsTrigger value="reports">{t("accounting.reports")}</TabsTrigger>
          <TabsTrigger value="settings">{t("accounting.settings")}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {financialStats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Tabs defaultValue="income">
            <TabsList>
              <TabsTrigger value="income">{t("accounting.incomeStatement")}</TabsTrigger>
              <TabsTrigger value="balance">{t("accounting.balanceSheet")}</TabsTrigger>
              <TabsTrigger value="tax">{t("accounting.taxSummary")}</TabsTrigger>
              <TabsTrigger value="payroll">{t("payroll.title")}</TabsTrigger>
            </TabsList>
            <TabsContent value="income" className="mt-4">
              <Card><CardContent className="py-12 text-center">
                <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm font-medium">{t("accounting.incomeStatement")}</p>
                <p className="text-xs text-muted-foreground mt-3">{t("accounting.noTransactions")}</p>
              </CardContent></Card>
            </TabsContent>
            <TabsContent value="balance" className="mt-4">
              <Card><CardContent className="py-12 text-center">
                <p className="text-sm text-muted-foreground">{t("accounting.noData")}</p>
              </CardContent></Card>
            </TabsContent>
            <TabsContent value="tax" className="mt-4">
              <Card><CardContent className="py-12 text-center">
                <p className="text-sm text-muted-foreground">{t("accounting.noData")}</p>
              </CardContent></Card>
            </TabsContent>
            <TabsContent value="payroll" className="mt-4">
              <Card><CardContent className="py-12 text-center">
                <p className="text-sm text-muted-foreground">{t("accounting.noData")}</p>
              </CardContent></Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="ledger" className="mt-4">
          <Card><CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">{t("accounting.noEntries")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("accounting.recordFirst")}</p>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <Card><CardContent className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">{t("accounting.reportsAppear")}</p>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card><CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-muted-foreground">{t("accounting.configNote")}</p>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
