import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign, CreditCard, AlertTriangle, Search, Plus, Pencil, Trash2,
  ArrowLeftRight, Clock, FileText, Users, TrendingUp, Camera, CheckCircle, ShieldAlert,
} from "lucide-react";

// ─── Types ───
interface FeeStructure {
  id: string; name: string; level: string; category: string; amount: number; isActive: boolean;
}
interface Payment {
  id: string; studentName: string; admissionNumber: string; amount: number;
  method: string; reference: string; date: string; receiptNo: string;
}
interface StudentBalance {
  studentName: string; admissionNumber: string; total: number; paid: number; balance: number;
}
interface BursarRule {
  id: string; name: string; type: string; condition: string; className: string; isActive: boolean;
}

// ─── Helpers ───
const fmt = (n: number) => `USh ${n.toLocaleString()}`;

export default function Fees() {
  // Shared data
  const [students] = useState(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [];
  });

  // Fee structures
  const [structures, setStructures] = useState<FeeStructure[]>(() => {
    const saved = localStorage.getItem("fee_structures");
    return saved ? JSON.parse(saved) : [];
  });
  const [structureDialog, setStructureDialog] = useState(false);
  const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(null);
  const [sForm, setSForm] = useState({ name: "", level: "All", category: "Tuition", amount: "" });

  // Payments
  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem("fee_payments");
    return saved ? JSON.parse(saved) : [];
  });
  const [paySearch, setPaySearch] = useState("");
  const [payMethodFilter, setPayMethodFilter] = useState("all");

  // Collect payment
  const [scanInput, setScanInput] = useState("");
  const [foundStudent, setFoundStudent] = useState<any>(null);
  const [collectForm, setCollectForm] = useState({ amount: "", method: "cash", reference: "" });

  // Bursar rules
  const [rules, setRules] = useState<BursarRule[]>(() => {
    const saved = localStorage.getItem("bursar_rules");
    return saved ? JSON.parse(saved) : [];
  });
  const [ruleDialog, setRuleDialog] = useState(false);
  const [rForm, setRForm] = useState({ name: "", type: "balance", condition: "", className: "" });

  // ─── Computed ───
  const totalCollected = payments.reduce((s, p) => s + p.amount, 0);
  const totalStructureAmount = structures.filter((s) => s.isActive).reduce((s, f) => s + f.amount, 0);
  const totalExpected = students.length * totalStructureAmount;
  const outstanding = totalExpected - totalCollected;

  // Student balances
  const balances: StudentBalance[] = students.map((s: any) => {
    const paid = payments.filter((p) => p.admissionNumber === s.admissionNumber).reduce((sum: number, p: Payment) => sum + p.amount, 0);
    return { studentName: s.fullName, admissionNumber: s.admissionNumber, total: totalStructureAmount, paid, balance: totalStructureAmount - paid };
  });

  // ─── Handlers ───
  const handleScanStudent = () => {
    const student = students.find((s: any) => s.admissionNumber === scanInput);
    setFoundStudent(student || null);
  };

  const handleCollectPayment = () => {
    if (!foundStudent || !collectForm.amount) return;
    const payment: Payment = {
      id: crypto.randomUUID(),
      studentName: foundStudent.fullName,
      admissionNumber: foundStudent.admissionNumber,
      amount: parseFloat(collectForm.amount),
      method: collectForm.method,
      reference: collectForm.reference,
      date: new Date().toISOString().split("T")[0],
      receiptNo: `RCP-${String(payments.length + 1).padStart(4, "0")}`,
    };
    const updated = [payment, ...payments];
    setPayments(updated);
    localStorage.setItem("fee_payments", JSON.stringify(updated));
    setCollectForm({ amount: "", method: "cash", reference: "" });
    setFoundStudent(null);
    setScanInput("");
  };

  const handleSaveStructure = () => {
    if (!sForm.name || !sForm.amount) return;
    if (editingStructure) {
      const updated = structures.map((s) =>
        s.id === editingStructure.id ? { ...s, name: sForm.name, level: sForm.level, category: sForm.category, amount: parseFloat(sForm.amount) } : s
      );
      setStructures(updated);
      localStorage.setItem("fee_structures", JSON.stringify(updated));
    } else {
      const newS: FeeStructure = { id: crypto.randomUUID(), name: sForm.name, level: sForm.level, category: sForm.category, amount: parseFloat(sForm.amount), isActive: true };
      const updated = [...structures, newS];
      setStructures(updated);
      localStorage.setItem("fee_structures", JSON.stringify(updated));
    }
    setSForm({ name: "", level: "All", category: "Tuition", amount: "" });
    setEditingStructure(null);
    setStructureDialog(false);
  };

  const deleteStructure = (id: string) => {
    const updated = structures.filter((s) => s.id !== id);
    setStructures(updated);
    localStorage.setItem("fee_structures", JSON.stringify(updated));
  };

  const editStructure = (s: FeeStructure) => {
    setSForm({ name: s.name, level: s.level, category: s.category, amount: String(s.amount) });
    setEditingStructure(s);
    setStructureDialog(true);
  };

  const handleSaveRule = () => {
    if (!rForm.name) return;
    const rule: BursarRule = { id: crypto.randomUUID(), ...rForm, isActive: true };
    const updated = [...rules, rule];
    setRules(updated);
    localStorage.setItem("bursar_rules", JSON.stringify(updated));
    setRForm({ name: "", type: "balance", condition: "", className: "" });
    setRuleDialog(false);
  };

  const toggleRule = (id: string) => {
    const updated = rules.map((r) => r.id === id ? { ...r, isActive: !r.isActive } : r);
    setRules(updated);
    localStorage.setItem("bursar_rules", JSON.stringify(updated));
  };

  const deleteRule = (id: string) => {
    const updated = rules.filter((r) => r.id !== id);
    setRules(updated);
    localStorage.setItem("bursar_rules", JSON.stringify(updated));
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch = p.studentName.toLowerCase().includes(paySearch.toLowerCase()) || p.admissionNumber.includes(paySearch) || p.receiptNo.includes(paySearch);
    const matchesMethod = payMethodFilter === "all" || p.method === payMethodFilter;
    return matchesSearch && matchesMethod;
  });

  const todayPayments = payments.filter((p) => p.date === new Date().toISOString().split("T")[0]);
  const todayTotal = todayPayments.reduce((s, p) => s + p.amount, 0);
  const uniquePayers = new Set(payments.map((p) => p.admissionNumber)).size;
  const avgPayment = payments.length > 0 ? Math.round(totalCollected / payments.length) : 0;

  const balanceStatus = (b: StudentBalance) => {
    if (b.balance <= 0) return { label: "paid", color: "bg-success/10 text-success border-success/20" };
    if (b.paid > 0) return { label: "partial", color: "bg-warning/10 text-warning border-warning/20" };
    return { label: "pending", color: "bg-destructive/10 text-destructive border-destructive/20" };
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fee Management</h1>
          <p className="page-description">Manage fee structures and student payments</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Collected</p>
              <p className="mt-1 text-2xl font-bold text-success">{fmt(totalCollected)}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground"><DollarSign className="h-5 w-5" /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Outstanding</p>
              <p className="mt-1 text-2xl font-bold text-warning">{fmt(Math.max(outstanding, 0))}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground"><CreditCard className="h-5 w-5" /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Fee Structures</p>
              <p className="mt-1 text-2xl font-bold">{structures.length}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground"><FileText className="h-5 w-5" /></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="collect">
        <TabsList>
          <TabsTrigger value="collect" className="gap-1.5"><ArrowLeftRight className="h-3.5 w-3.5" /> Collect Payment</TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5"><Clock className="h-3.5 w-3.5" /> History</TabsTrigger>
          <TabsTrigger value="structures">Fee Structures</TabsTrigger>
          <TabsTrigger value="balances">Student Balances</TabsTrigger>
          <TabsTrigger value="rules" className="gap-1.5"><ShieldAlert className="h-3.5 w-3.5" /> Bursar Rules</TabsTrigger>
        </TabsList>

        {/* ══════ COLLECT PAYMENT ══════ */}
        <TabsContent value="collect" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2"><Search className="h-5 w-5" /> Scan Student ID</h3>
                <p className="text-sm text-muted-foreground">Scan or type admission number to process payment</p>
              </div>
              <div>
                <Label>Scan or Enter Student Code</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleScanStudent()}
                    placeholder="Scan barcode or type ADM/25/0001..."
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon"><Camera className="h-4 w-4" /></Button>
                  <Button onClick={handleScanStudent}><Search className="h-4 w-4" /></Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Click the input field, then scan with your barcode scanner</p>
              </div>

              {foundStudent && (
                <>
                  <Separator />
                  <div className="rounded-lg border p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{foundStudent.fullName}</p>
                        <p className="text-sm text-muted-foreground">{foundStudent.admissionNumber} • {foundStudent.className || "No class"}</p>
                      </div>
                      <Badge variant="outline" className="bg-success/10 text-success">Found</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Amount (USh) *</Label>
                        <Input className="mt-1.5" type="number" value={collectForm.amount} onChange={(e) => setCollectForm({ ...collectForm, amount: e.target.value })} placeholder="e.g. 500000" />
                      </div>
                      <div>
                        <Label>Method</Label>
                        <Select value={collectForm.method} onValueChange={(v) => setCollectForm({ ...collectForm, method: v })}>
                          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="mobile_money">Mobile Money</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="cheque">Cheque</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Reference</Label>
                        <Input className="mt-1.5" value={collectForm.reference} onChange={(e) => setCollectForm({ ...collectForm, reference: e.target.value })} placeholder="Transaction ID" />
                      </div>
                    </div>
                    <Button onClick={handleCollectPayment} disabled={!collectForm.amount} className="w-full">
                      <DollarSign className="mr-2 h-4 w-4" /> Record Payment
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ══════ HISTORY ══════ */}
        <TabsContent value="history" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: "Total Collected", value: fmt(totalCollected), sub: `${payments.length} payments`, icon: TrendingUp, color: "text-success" },
              { label: "Today", value: fmt(todayTotal), sub: `${todayPayments.length} payments`, icon: Clock, color: "text-info" },
              { label: "Students Paid", value: String(uniquePayers), sub: "Unique students", icon: Users, color: "text-primary" },
              { label: "Avg Payment", value: fmt(avgPayment), sub: "", icon: CreditCard, color: "text-muted-foreground" },
            ].map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`mt-1 text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    {stat.sub && <p className="text-xs text-muted-foreground">{stat.sub}</p>}
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground"><stat.icon className="h-4 w-4" /></div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by student, admission number, or receipt..." value={paySearch} onChange={(e) => setPaySearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={payMethodFilter} onValueChange={setPayMethodFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="All Methods" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {payments.length === 0 ? (
            <Card><CardContent className="flex flex-col items-center justify-center py-16">
              <Clock className="mb-3 h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No payment records yet</p>
            </CardContent></Card>
          ) : (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold flex items-center gap-2 mb-4"><FileText className="h-4 w-4" /> Payment Records <Badge variant="secondary" className="text-xs">{filteredPayments.length}</Badge></h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredPayments.map((p) => (
                    <div key={p.id} className="rounded-lg border p-3 transition-shadow hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{p.studentName}</p>
                          <p className="text-xs text-muted-foreground">{p.admissionNumber}</p>
                        </div>
                        <p className="text-sm font-bold text-success">{fmt(p.amount)}</p>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge className="text-[10px] capitalize">{p.method.replace("_", " ")}</Badge>
                        <span className="text-[10px] text-muted-foreground">{p.date}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto">{p.receiptNo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ══════ FEE STRUCTURES ══════ */}
        <TabsContent value="structures" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Fee Structures</h3>
                  <p className="text-sm text-muted-foreground">Define fee types and amounts by level</p>
                </div>
                <Dialog open={structureDialog} onOpenChange={(o) => { setStructureDialog(o); if (!o) setEditingStructure(null); }}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => { setSForm({ name: "", level: "All", category: "Tuition", amount: "" }); setEditingStructure(null); }}>
                      <Plus className="mr-2 h-4 w-4" /> Add Fee
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>{editingStructure ? "Edit" : "Add"} Fee Structure</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                      <div><Label>Fee Name *</Label><Input className="mt-1.5" value={sForm.name} onChange={(e) => setSForm({ ...sForm, name: e.target.value })} placeholder="e.g. Tuition Fee" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><Label>Level</Label>
                          <Select value={sForm.level} onValueChange={(v) => setSForm({ ...sForm, level: v })}>
                            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">All</SelectItem>
                              <SelectItem value="Primary">Primary</SelectItem>
                              <SelectItem value="Secondary">Secondary</SelectItem>
                              <SelectItem value="ECD">ECD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div><Label>Category</Label>
                          <Select value={sForm.category} onValueChange={(v) => setSForm({ ...sForm, category: v })}>
                            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Tuition">Tuition</SelectItem>
                              <SelectItem value="Boarding">Boarding</SelectItem>
                              <SelectItem value="Transport">Transport</SelectItem>
                              <SelectItem value="Meals">Meals</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div><Label>Amount (USh) *</Label><Input className="mt-1.5" type="number" value={sForm.amount} onChange={(e) => setSForm({ ...sForm, amount: e.target.value })} /></div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setStructureDialog(false)}>Cancel</Button>
                      <Button onClick={handleSaveStructure} disabled={!sForm.name || !sForm.amount}>{editingStructure ? "Save Changes" : "Add Fee"}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {structures.length === 0 ? (
                <div className="flex flex-col items-center py-12">
                  <FileText className="mb-3 h-10 w-10 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No fee structures defined yet</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {structures.map((s) => (
                    <div key={s.id} className="rounded-lg border p-4 transition-shadow hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.level} • {s.category}</p>
                        </div>
                        <Badge variant="outline" className={s.isActive ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground"}>
                          {s.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="mt-3 text-xl font-bold">{fmt(s.amount)}</p>
                      <div className="mt-3 flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => editStructure(s)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteStructure(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ══════ STUDENT BALANCES ══════ */}
        <TabsContent value="balances" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Student Balances</h3>
                <p className="text-sm text-muted-foreground">View and manage student fee balances</p>
              </div>

              {balances.length === 0 ? (
                <div className="flex flex-col items-center py-12">
                  <Users className="mb-3 h-10 w-10 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No students enrolled yet</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {balances.map((b) => {
                    const status = balanceStatus(b);
                    return (
                      <div key={b.admissionNumber} className="rounded-lg border p-4 transition-shadow hover:shadow-md">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{b.studentName}</p>
                            <p className="text-xs text-muted-foreground">{b.admissionNumber}</p>
                          </div>
                          <Badge variant="outline" className={`text-xs ${status.color}`}>{status.label}</Badge>
                        </div>
                        <div className="mt-3 space-y-1 text-sm">
                          <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span>{fmt(b.total)}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Paid</span><span className="text-success">{fmt(b.paid)}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Balance</span><span className={b.balance > 0 ? "text-warning font-medium" : "text-success"}>{fmt(b.balance)}</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ══════ BURSAR RULES ══════ */}
        <TabsContent value="rules" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-warning" /> Bursar Red List Rules</h3>
                  <p className="text-sm text-muted-foreground">Define rules to automatically block students at the gate</p>
                </div>
                <Dialog open={ruleDialog} onOpenChange={setRuleDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Rule</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add Bursar Rule</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                      <div><Label>Rule Name *</Label><Input className="mt-1.5" value={rForm.name} onChange={(e) => setRForm({ ...rForm, name: e.target.value })} placeholder="e.g. High Fees" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><Label>Type</Label>
                          <Select value={rForm.type} onValueChange={(v) => setRForm({ ...rForm, type: v })}>
                            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="balance">Balance Threshold</SelectItem>
                              <SelectItem value="percentage">Percentage Unpaid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div><Label>Class (optional)</Label><Input className="mt-1.5" value={rForm.className} onChange={(e) => setRForm({ ...rForm, className: e.target.value })} placeholder="e.g. Senior 1A" /></div>
                      </div>
                      <div><Label>Condition *</Label><Input className="mt-1.5" value={rForm.condition} onChange={(e) => setRForm({ ...rForm, condition: e.target.value })} placeholder="e.g. Balance >= USh 50,000" /></div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setRuleDialog(false)}>Cancel</Button>
                      <Button onClick={handleSaveRule} disabled={!rForm.name || !rForm.condition}>Add Rule</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {rules.length === 0 ? (
                <div className="flex flex-col items-center py-12">
                  <ShieldAlert className="mb-3 h-10 w-10 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No bursar rules defined yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Rule</TableHead><TableHead>Type</TableHead><TableHead>Condition</TableHead><TableHead>Class</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {rules.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs capitalize bg-warning/10 text-warning">{r.type === "balance" ? "Balance Threshold" : "Percentage"}</Badge></TableCell>
                        <TableCell>{r.condition}</TableCell>
                        <TableCell>{r.className || "All"}</TableCell>
                        <TableCell><Switch checked={r.isActive} onCheckedChange={() => toggleRule(r.id)} /></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteRule(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><ShieldAlert className="h-5 w-5 text-warning" /> Override Requests</h3>
              <p className="text-sm text-muted-foreground mb-4">Students blocked by bursar rules requesting entry</p>
              <div className="flex flex-col items-center py-8">
                <CheckCircle className="mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No pending override requests</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
