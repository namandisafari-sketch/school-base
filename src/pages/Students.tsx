import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  UserPlus, Search, Upload, Users, User, Heart, FileText, CreditCard, ClipboardList, Eye, Pencil, Trash2,
} from "lucide-react";
import { useSchool } from "@/contexts/SchoolContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Student {
  id: string;
  fullName: string;
  admissionNumber: string;
  dob: string;
  gender: string;
  nationality: string;
  placeOfBirth: string;
  homeDistrict: string;
  religion: string;
  specialTalent: string;
  className: string;
  status: "active" | "suspended" | "withdrawn";
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianRelationship: string;
  guardianAddress: string;
  guardianOccupation: string;
  previousSchool: string;
  previousClass: string;
  reasonForLeaving: string;
  bloodGroup: string;
  allergies: string;
  medicalConditions: string;
  emergencyContact: string;
  emergencyPhone: string;
  hasbirthCertificate: boolean;
  hasPassportPhoto: boolean;
  hasTransferLetter: boolean;
  hasReportCard: boolean;
}

const defaultForm: Omit<Student, "id" | "status"> = {
  fullName: "", admissionNumber: "", dob: "", gender: "", nationality: "Ugandan",
  placeOfBirth: "", homeDistrict: "", religion: "", specialTalent: "", className: "",
  guardianName: "", guardianPhone: "", guardianEmail: "", guardianRelationship: "",
  guardianAddress: "", guardianOccupation: "",
  previousSchool: "", previousClass: "", reasonForLeaving: "",
  bloodGroup: "", allergies: "", medicalConditions: "", emergencyContact: "", emergencyPhone: "",
  hasbirthCertificate: false, hasPassportPhoto: false, hasTransferLetter: false, hasReportCard: false,
};

export default function Students() {
  const { settings } = useSchool();
  const { t } = useLanguage();
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [];
  });
  const [classes] = useState(() => {
    const saved = localStorage.getItem("classes");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState("basic");
  const [form, setForm] = useState<Omit<Student, "id" | "status">>(defaultForm);

  const isKindergarten = settings.schoolType === "kindergarten";
  const title = isKindergarten ? t("students.ecdTitle") : t("students.title");
  const uniqueClasses = [...new Set(students.map((s) => s.className).filter(Boolean))];

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === "all" || s.className === classFilter;
    return matchesSearch && matchesClass;
  });

  const generateAdmNo = () => {
    const prefix = settings.schoolName ? settings.schoolName.substring(0, 3).toUpperCase() : "ADM";
    const year = new Date().getFullYear();
    const num = String(students.length + 1).padStart(3, "0");
    return `${prefix}/${year}/${num}`;
  };

  const openEnrollDialog = () => {
    setForm({ ...defaultForm, admissionNumber: generateAdmNo() });
    setEditingId(null);
    setTab("basic");
    setDialogOpen(true);
  };

  const openEditDialog = (student: Student) => {
    const { id, status, ...rest } = student;
    setForm(rest);
    setEditingId(id);
    setTab("basic");
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.fullName) return;
    if (editingId) {
      const updated = students.map((s) =>
        s.id === editingId ? { ...s, ...form } : s
      );
      setStudents(updated);
      localStorage.setItem("students", JSON.stringify(updated));
    } else {
      const admNo = form.admissionNumber || generateAdmNo();
      const newStudent: Student = { id: crypto.randomUUID(), ...form, admissionNumber: admNo, status: "active" };
      const updated = [...students, newStudent];
      setStudents(updated);
      localStorage.setItem("students", JSON.stringify(updated));
    }
    setForm(defaultForm);
    setDialogOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    localStorage.setItem("students", JSON.stringify(updated));
  };

  const statusColor = (s: string) => {
    if (s === "active") return "bg-success/10 text-success border-success/20";
    if (s === "suspended") return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  const updateForm = (updates: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...updates }));

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-description">{students.length} {t("students.enrolled")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Upload className="mr-2 h-4 w-4" /> {t("common.import")}</Button>
          <Button size="sm" onClick={openEnrollDialog}>
            <UserPlus className="mr-2 h-4 w-4" /> {t("students.enroll")} {isKindergarten ? t("students.pupil") : t("students.student")}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t("students.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder={t("common.allClasses")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.allClasses")}</SelectItem>
            {uniqueClasses.map((cls) => <SelectItem key={cls} value={cls}>{cls}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {students.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">{t("students.noStudents")}</p>
            <p className="text-xs text-muted-foreground">{t("students.clickEnroll")}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("common.name")}</TableHead>
                  <TableHead>{t("students.admNo")}</TableHead>
                  <TableHead>{t("common.gender")}</TableHead>
                  <TableHead>{t("common.class")}</TableHead>
                  <TableHead>{t("students.guardian")}</TableHead>
                  <TableHead>{t("common.status")}</TableHead>
                  <TableHead className="text-right">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.fullName}</TableCell>
                    <TableCell>{s.admissionNumber}</TableCell>
                    <TableCell className="capitalize">{s.gender || "—"}</TableCell>
                    <TableCell>{s.className || "—"}</TableCell>
                    <TableCell>
                      <div>{s.guardianName || "—"}</div>
                      {s.guardianPhone && <div className="text-xs text-muted-foreground">{s.guardianPhone}</div>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColor(s.status)}>{t(`students.${s.status}`)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setViewStudent(s)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(s)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* ENROLLMENT / EDIT DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              {editingId ? t("common.edit") : t("students.enrollmentForm")}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full grid grid-cols-4 lg:grid-cols-7">
              <TabsTrigger value="basic" className="text-xs gap-1"><User className="h-3 w-3 hidden sm:block" /> {t("students.basicInfo")}</TabsTrigger>
              <TabsTrigger value="guardian" className="text-xs">{t("students.guardian")}</TabsTrigger>
              <TabsTrigger value="academic" className="text-xs">{t("students.academicRecords")}</TabsTrigger>
              <TabsTrigger value="medical" className="text-xs gap-1"><Heart className="h-3 w-3 hidden sm:block" /> {t("students.medical")}</TabsTrigger>
              <TabsTrigger value="documents" className="text-xs gap-1"><FileText className="h-3 w-3 hidden sm:block" /> {t("students.documents")}</TabsTrigger>
              <TabsTrigger value="fees" className="text-xs gap-1"><CreditCard className="h-3 w-3 hidden sm:block" /> {t("students.fees")}</TabsTrigger>
              <TabsTrigger value="requirements" className="text-xs gap-1"><ClipboardList className="h-3 w-3 hidden sm:block" /> {t("students.requirements")}</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm font-medium"><User className="h-4 w-4 text-muted-foreground" /> {t("students.personalInfo")}</div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("students.fullName")} *</Label><Input className="mt-1.5" value={form.fullName} onChange={(e) => updateForm({ fullName: e.target.value })} /></div>
                <div><Label>{t("students.admissionNumber")}</Label><Input className="mt-1.5" value={form.admissionNumber} onChange={(e) => updateForm({ admissionNumber: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>{t("students.dob")} *</Label><Input type="date" className="mt-1.5" value={form.dob} onChange={(e) => updateForm({ dob: e.target.value })} /></div>
                <div><Label>{t("common.gender")} *</Label>
                  <Select value={form.gender} onValueChange={(v) => updateForm({ gender: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder={t("common.select")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t("students.male")}</SelectItem>
                      <SelectItem value="female">{t("students.female")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>{t("students.nationality")}</Label><Input className="mt-1.5" value={form.nationality} onChange={(e) => updateForm({ nationality: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("students.placeOfBirth")}</Label><Input className="mt-1.5" value={form.placeOfBirth} onChange={(e) => updateForm({ placeOfBirth: e.target.value })} /></div>
                <div><Label>{t("students.homeDistrict")}</Label><Input className="mt-1.5" value={form.homeDistrict} onChange={(e) => updateForm({ homeDistrict: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("students.religion")}</Label>
                  <Select value={form.religion} onValueChange={(v) => updateForm({ religion: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder={t("common.select")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="christian">{t("students.christian")}</SelectItem>
                      <SelectItem value="muslim">{t("students.muslim")}</SelectItem>
                      <SelectItem value="other">{t("students.other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>{t("students.specialTalent")}</Label><Input className="mt-1.5" value={form.specialTalent} onChange={(e) => updateForm({ specialTalent: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div><Label>{t("common.class")}</Label>
                  {classes.length > 0 ? (
                    <Select value={form.className} onValueChange={(v) => updateForm({ className: v })}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder={t("common.selectClass")} /></SelectTrigger>
                      <SelectContent>
                        {classes.map((c: any) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input className="mt-1.5" value={form.className} onChange={(e) => updateForm({ className: e.target.value })} />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guardian" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm font-medium"><Users className="h-4 w-4 text-muted-foreground" /> {t("students.guardianInfo")}</div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("students.guardianName")} *</Label><Input className="mt-1.5" value={form.guardianName} onChange={(e) => updateForm({ guardianName: e.target.value })} /></div>
                <div><Label>{t("students.relationship")}</Label>
                  <Select value={form.guardianRelationship} onValueChange={(v) => updateForm({ guardianRelationship: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder={t("common.select")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">{t("students.father")}</SelectItem>
                      <SelectItem value="mother">{t("students.mother")}</SelectItem>
                      <SelectItem value="guardian">{t("students.guardian")}</SelectItem>
                      <SelectItem value="uncle">{t("students.uncle")}</SelectItem>
                      <SelectItem value="aunt">{t("students.aunt")}</SelectItem>
                      <SelectItem value="other">{t("students.other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("common.phone")} *</Label><Input className="mt-1.5" value={form.guardianPhone} onChange={(e) => updateForm({ guardianPhone: e.target.value })} /></div>
                <div><Label>{t("common.email")}</Label><Input className="mt-1.5" value={form.guardianEmail} onChange={(e) => updateForm({ guardianEmail: e.target.value })} /></div>
              </div>
              <div><Label>{t("students.occupation")}</Label><Input className="mt-1.5" value={form.guardianOccupation} onChange={(e) => updateForm({ guardianOccupation: e.target.value })} /></div>
              <div><Label>{t("students.address")}</Label><Textarea className="mt-1.5" value={form.guardianAddress} onChange={(e) => updateForm({ guardianAddress: e.target.value })} /></div>
            </TabsContent>

            <TabsContent value="academic" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm font-medium"><FileText className="h-4 w-4 text-muted-foreground" /> {t("students.academicRecords")}</div>
              <Separator />
              <div><Label>{t("students.previousSchool")}</Label><Input className="mt-1.5" value={form.previousSchool} onChange={(e) => updateForm({ previousSchool: e.target.value })} /></div>
              <div><Label>{t("students.previousClass")}</Label><Input className="mt-1.5" value={form.previousClass} onChange={(e) => updateForm({ previousClass: e.target.value })} /></div>
              <div><Label>{t("students.reasonForLeaving")}</Label><Textarea className="mt-1.5" value={form.reasonForLeaving} onChange={(e) => updateForm({ reasonForLeaving: e.target.value })} /></div>
            </TabsContent>

            <TabsContent value="medical" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm font-medium"><Heart className="h-4 w-4 text-muted-foreground" /> {t("students.medicalInfo")}</div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("students.bloodGroup")}</Label>
                  <Select value={form.bloodGroup} onValueChange={(v) => updateForm({ bloodGroup: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder={t("common.select")} /></SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>{t("students.allergies")}</Label><Input className="mt-1.5" value={form.allergies} onChange={(e) => updateForm({ allergies: e.target.value })} /></div>
              </div>
              <div><Label>{t("students.medicalConditions")}</Label><Textarea className="mt-1.5" value={form.medicalConditions} onChange={(e) => updateForm({ medicalConditions: e.target.value })} /></div>
              <Separator />
              <div className="flex items-center gap-2 text-sm font-medium">{t("students.emergencyContact")}</div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("students.emergencyContact")}</Label><Input className="mt-1.5" value={form.emergencyContact} onChange={(e) => updateForm({ emergencyContact: e.target.value })} /></div>
                <div><Label>{t("students.emergencyPhone")}</Label><Input className="mt-1.5" value={form.emergencyPhone} onChange={(e) => updateForm({ emergencyPhone: e.target.value })} /></div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm font-medium"><FileText className="h-4 w-4 text-muted-foreground" /> {t("students.documents")}</div>
              <Separator />
              <div className="space-y-3">
                {[
                  { key: "hasbirthCertificate", label: "Birth Certificate" },
                  { key: "hasPassportPhoto", label: "Passport Photos (2)" },
                  { key: "hasTransferLetter", label: "Transfer Letter" },
                  { key: "hasReportCard", label: "Previous Report Card" },
                ].map((doc) => (
                  <label key={doc.key} className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={(form as any)[doc.key] || false}
                      onChange={(e) => updateForm({ [doc.key]: e.target.checked } as any)}
                      className="h-4 w-4 rounded border-input accent-primary"
                    />
                    <span className="text-sm">{doc.label}</span>
                    <Badge variant="outline" className={`ml-auto text-xs ${(form as any)[doc.key] ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {(form as any)[doc.key] ? "Submitted" : "Pending"}
                    </Badge>
                  </label>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="fees" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm font-medium"><CreditCard className="h-4 w-4 text-muted-foreground" /> {t("students.fees")}</div>
              <Separator />
              <Card><CardContent className="py-8 text-center">
                <CreditCard className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Fee assignment will be linked after enrollment</p>
              </CardContent></Card>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm font-medium"><ClipboardList className="h-4 w-4 text-muted-foreground" /> {t("students.requirements")}</div>
              <Separator />
              <Card><CardContent className="py-8 text-center">
                <ClipboardList className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Term requirements will appear here after enrollment</p>
              </CardContent></Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleSave} disabled={!form.fullName}>
              <UserPlus className="mr-2 h-4 w-4" />
              {editingId ? t("common.save") : `${t("students.enroll")} ${isKindergarten ? t("students.pupil") : t("students.student")}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW STUDENT DIALOG */}
      <Dialog open={!!viewStudent} onOpenChange={() => setViewStudent(null)}>
        <DialogContent className="max-w-lg">
          {viewStudent && (
            <>
              <DialogHeader>
                <DialogTitle>{viewStudent.fullName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">{t("students.admNo")}:</span> <span className="font-medium ml-1">{viewStudent.admissionNumber}</span></div>
                  <div><span className="text-muted-foreground">{t("common.class")}:</span> <span className="font-medium ml-1">{viewStudent.className || "—"}</span></div>
                  <div><span className="text-muted-foreground">{t("common.gender")}:</span> <span className="font-medium ml-1 capitalize">{viewStudent.gender || "—"}</span></div>
                  <div><span className="text-muted-foreground">{t("students.dob")}:</span> <span className="font-medium ml-1">{viewStudent.dob || "—"}</span></div>
                  <div><span className="text-muted-foreground">{t("students.nationality")}:</span> <span className="font-medium ml-1">{viewStudent.nationality || "—"}</span></div>
                  <div><span className="text-muted-foreground">{t("students.religion")}:</span> <span className="font-medium ml-1 capitalize">{viewStudent.religion || "—"}</span></div>
                  <div><span className="text-muted-foreground">{t("common.status")}:</span> <Badge variant="outline" className={`ml-1 text-xs ${statusColor(viewStudent.status)}`}>{t(`students.${viewStudent.status}`)}</Badge></div>
                </div>
                {(viewStudent.guardianName || viewStudent.guardianPhone) && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">{t("students.guardian")}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">{t("common.name")}:</span> <span className="ml-1">{viewStudent.guardianName || "—"}</span></div>
                        <div><span className="text-muted-foreground">{t("common.phone")}:</span> <span className="ml-1">{viewStudent.guardianPhone || "—"}</span></div>
                        <div><span className="text-muted-foreground">{t("students.relationship")}:</span> <span className="ml-1 capitalize">{viewStudent.guardianRelationship || "—"}</span></div>
                      </div>
                    </div>
                  </>
                )}
                {(viewStudent.bloodGroup || viewStudent.allergies || viewStudent.medicalConditions) && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">{t("students.medical")}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">{t("students.bloodGroup")}:</span> <span className="ml-1">{viewStudent.bloodGroup || "—"}</span></div>
                        <div><span className="text-muted-foreground">{t("students.allergies")}:</span> <span className="ml-1">{viewStudent.allergies || "—"}</span></div>
                      </div>
                      {viewStudent.medicalConditions && <p className="text-sm mt-1"><span className="text-muted-foreground">{t("students.medicalConditions")}:</span> {viewStudent.medicalConditions}</p>}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
