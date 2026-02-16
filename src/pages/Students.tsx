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
  // Guardian
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianRelationship: string;
  guardianAddress: string;
  guardianOccupation: string;
  // Academic
  previousSchool: string;
  previousClass: string;
  reasonForLeaving: string;
  // Medical
  bloodGroup: string;
  allergies: string;
  medicalConditions: string;
  emergencyContact: string;
  emergencyPhone: string;
  // Documents
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
  const title = isKindergarten ? "ECD Pupils" : "Students";
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
          <p className="page-description">{students.length} {title.toLowerCase()} enrolled</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Upload className="mr-2 h-4 w-4" /> Import</Button>
          <Button size="sm" onClick={openEnrollDialog}>
            <UserPlus className="mr-2 h-4 w-4" /> Enroll {isKindergarten ? "Pupil" : "Student"}
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or admission no..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All Classes" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {uniqueClasses.map((cls) => <SelectItem key={cls} value={cls}>{cls}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {students.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No {title.toLowerCase()} enrolled yet</p>
            <p className="text-xs text-muted-foreground">Click "Enroll {isKindergarten ? "Pupil" : "Student"}" to get started</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Adm. No.</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Guardian</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                      <Badge variant="outline" className={statusColor(s.status)}>{s.status}</Badge>
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

      {/* ========== ENROLLMENT / EDIT DIALOG ========== */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              {editingId ? "Edit" : "Student Enrollment Form"}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full grid grid-cols-4 lg:grid-cols-7">
              <TabsTrigger value="basic" className="text-xs gap-1"><User className="h-3 w-3 hidden sm:block" /> Basic Info</TabsTrigger>
              <TabsTrigger value="guardian" className="text-xs">Guardian</TabsTrigger>
              <TabsTrigger value="academic" className="text-xs">Academic</TabsTrigger>
              <TabsTrigger value="medical" className="text-xs gap-1"><Heart className="h-3 w-3 hidden sm:block" /> Medical</TabsTrigger>
              <TabsTrigger value="documents" className="text-xs gap-1"><FileText className="h-3 w-3 hidden sm:block" /> Docs & IDs</TabsTrigger>
              <TabsTrigger value="fees" className="text-xs gap-1"><CreditCard className="h-3 w-3 hidden sm:block" /> Fees</TabsTrigger>
              <TabsTrigger value="requirements" className="text-xs gap-1"><ClipboardList className="h-3 w-3 hidden sm:block" /> Requirements</TabsTrigger>
            </TabsList>

            {/* BASIC INFO */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm font-medium"><User className="h-4 w-4 text-muted-foreground" /> Personal Information</div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Full Name *</Label><Input className="mt-1.5" value={form.fullName} onChange={(e) => updateForm({ fullName: e.target.value })} placeholder="Enter student's full name" /></div>
                <div><Label>Admission Number</Label><Input className="mt-1.5" value={form.admissionNumber} onChange={(e) => updateForm({ admissionNumber: e.target.value })} placeholder="Auto-generated if empty" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Date of Birth *</Label><Input type="date" className="mt-1.5" value={form.dob} onChange={(e) => updateForm({ dob: e.target.value })} /></div>
                <div><Label>Gender *</Label>
                  <Select value={form.gender} onValueChange={(v) => updateForm({ gender: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Nationality</Label><Input className="mt-1.5" value={form.nationality} onChange={(e) => updateForm({ nationality: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Place of Birth</Label><Input className="mt-1.5" value={form.placeOfBirth} onChange={(e) => updateForm({ placeOfBirth: e.target.value })} /></div>
                <div><Label>Home District</Label><Input className="mt-1.5" value={form.homeDistrict} onChange={(e) => updateForm({ homeDistrict: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Religion</Label>
                  <Select value={form.religion} onValueChange={(v) => updateForm({ religion: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select religion" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="christian">Christian</SelectItem>
                      <SelectItem value="muslim">Muslim</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Special Talent</Label><Input className="mt-1.5" value={form.specialTalent} onChange={(e) => updateForm({ specialTalent: e.target.value })} placeholder="e.g., Football, Music, Art" /></div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div><Label>Class</Label>
                  {classes.length > 0 ? (
                    <Select value={form.className} onValueChange={(v) => updateForm({ className: v })}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select class" /></SelectTrigger>
                      <SelectContent>
                        {classes.map((c: any) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input className="mt-1.5" value={form.className} onChange={(e) => updateForm({ className: e.target.value })} placeholder="e.g. P1, S2, Baby Class" />
                  )}
                </div>
              </div>
            </TabsContent>

            {/* GUARDIAN */}
            <TabsContent value="guardian" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm font-medium"><Users className="h-4 w-4 text-muted-foreground" /> Guardian / Parent Information</div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Guardian Name *</Label><Input className="mt-1.5" value={form.guardianName} onChange={(e) => updateForm({ guardianName: e.target.value })} placeholder="Full name" /></div>
                <div><Label>Relationship</Label>
                  <Select value={form.guardianRelationship} onValueChange={(v) => updateForm({ guardianRelationship: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                      <SelectItem value="uncle">Uncle</SelectItem>
                      <SelectItem value="aunt">Aunt</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Phone *</Label><Input className="mt-1.5" value={form.guardianPhone} onChange={(e) => updateForm({ guardianPhone: e.target.value })} placeholder="+256..." /></div>
                <div><Label>Email</Label><Input className="mt-1.5" value={form.guardianEmail} onChange={(e) => updateForm({ guardianEmail: e.target.value })} placeholder="email@example.com" /></div>
              </div>
              <div><Label>Occupation</Label><Input className="mt-1.5" value={form.guardianOccupation} onChange={(e) => updateForm({ guardianOccupation: e.target.value })} /></div>
              <div><Label>Residential Address</Label><Textarea className="mt-1.5" value={form.guardianAddress} onChange={(e) => updateForm({ guardianAddress: e.target.value })} placeholder="Home address" /></div>
            </TabsContent>

            {/* ACADEMIC RECORDS */}
            <TabsContent value="academic" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm font-medium"><FileText className="h-4 w-4 text-muted-foreground" /> Previous Academic Records</div>
              <Separator />
              <div><Label>Previous School</Label><Input className="mt-1.5" value={form.previousSchool} onChange={(e) => updateForm({ previousSchool: e.target.value })} placeholder="Name of previous school" /></div>
              <div><Label>Previous Class / Grade</Label><Input className="mt-1.5" value={form.previousClass} onChange={(e) => updateForm({ previousClass: e.target.value })} /></div>
              <div><Label>Reason for Leaving</Label><Textarea className="mt-1.5" value={form.reasonForLeaving} onChange={(e) => updateForm({ reasonForLeaving: e.target.value })} placeholder="Why the student left the previous school" /></div>
            </TabsContent>

            {/* MEDICAL */}
            <TabsContent value="medical" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm font-medium"><Heart className="h-4 w-4 text-muted-foreground" /> Medical Information</div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Blood Group</Label>
                  <Select value={form.bloodGroup} onValueChange={(v) => updateForm({ bloodGroup: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Allergies</Label><Input className="mt-1.5" value={form.allergies} onChange={(e) => updateForm({ allergies: e.target.value })} placeholder="e.g., Peanuts, Dust" /></div>
              </div>
              <div><Label>Medical Conditions</Label><Textarea className="mt-1.5" value={form.medicalConditions} onChange={(e) => updateForm({ medicalConditions: e.target.value })} placeholder="Any chronic or special conditions" /></div>
              <Separator />
              <div className="flex items-center gap-2 text-sm font-medium">Emergency Contact</div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Contact Name</Label><Input className="mt-1.5" value={form.emergencyContact} onChange={(e) => updateForm({ emergencyContact: e.target.value })} /></div>
                <div><Label>Contact Phone</Label><Input className="mt-1.5" value={form.emergencyPhone} onChange={(e) => updateForm({ emergencyPhone: e.target.value })} placeholder="+256..." /></div>
              </div>
            </TabsContent>

            {/* DOCUMENTS & IDs */}
            <TabsContent value="documents" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm font-medium"><FileText className="h-4 w-4 text-muted-foreground" /> Documents & IDs</div>
              <Separator />
              <p className="text-sm text-muted-foreground">Track which documents have been submitted:</p>
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

            {/* FEES */}
            <TabsContent value="fees" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm font-medium"><CreditCard className="h-4 w-4 text-muted-foreground" /> Fee Information</div>
              <Separator />
              <Card><CardContent className="py-8 text-center">
                <CreditCard className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Fee assignment will be linked after enrollment</p>
                <p className="text-xs text-muted-foreground mt-1">Fee structures are managed in the Fees module</p>
              </CardContent></Card>
            </TabsContent>

            {/* REQUIREMENTS */}
            <TabsContent value="requirements" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm font-medium"><ClipboardList className="h-4 w-4 text-muted-foreground" /> Term Requirements</div>
              <Separator />
              <Card><CardContent className="py-8 text-center">
                <ClipboardList className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Term requirements will appear here after enrollment</p>
                <p className="text-xs text-muted-foreground mt-1">Define requirements per class in Settings</p>
              </CardContent></Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.fullName}>
              <UserPlus className="mr-2 h-4 w-4" />
              {editingId ? "Save Changes" : `Enroll ${isKindergarten ? "Pupil" : "Student"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========== VIEW STUDENT DIALOG ========== */}
      <Dialog open={!!viewStudent} onOpenChange={() => setViewStudent(null)}>
        <DialogContent className="max-w-lg">
          {viewStudent && (
            <>
              <DialogHeader>
                <DialogTitle>{viewStudent.fullName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Admission No:</span> <span className="font-medium ml-1">{viewStudent.admissionNumber}</span></div>
                  <div><span className="text-muted-foreground">Class:</span> <span className="font-medium ml-1">{viewStudent.className || "—"}</span></div>
                  <div><span className="text-muted-foreground">Gender:</span> <span className="font-medium ml-1 capitalize">{viewStudent.gender || "—"}</span></div>
                  <div><span className="text-muted-foreground">DOB:</span> <span className="font-medium ml-1">{viewStudent.dob || "—"}</span></div>
                  <div><span className="text-muted-foreground">Nationality:</span> <span className="font-medium ml-1">{viewStudent.nationality || "—"}</span></div>
                  <div><span className="text-muted-foreground">Religion:</span> <span className="font-medium ml-1 capitalize">{viewStudent.religion || "—"}</span></div>
                  <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={`ml-1 text-xs ${statusColor(viewStudent.status)}`}>{viewStudent.status}</Badge></div>
                </div>
                {(viewStudent.guardianName || viewStudent.guardianPhone) && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">Guardian</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">Name:</span> <span className="ml-1">{viewStudent.guardianName || "—"}</span></div>
                        <div><span className="text-muted-foreground">Phone:</span> <span className="ml-1">{viewStudent.guardianPhone || "—"}</span></div>
                        <div><span className="text-muted-foreground">Relationship:</span> <span className="ml-1 capitalize">{viewStudent.guardianRelationship || "—"}</span></div>
                      </div>
                    </div>
                  </>
                )}
                {(viewStudent.bloodGroup || viewStudent.allergies || viewStudent.medicalConditions) && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">Medical</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">Blood Group:</span> <span className="ml-1">{viewStudent.bloodGroup || "—"}</span></div>
                        <div><span className="text-muted-foreground">Allergies:</span> <span className="ml-1">{viewStudent.allergies || "—"}</span></div>
                      </div>
                      {viewStudent.medicalConditions && <p className="text-sm mt-1"><span className="text-muted-foreground">Conditions:</span> {viewStudent.medicalConditions}</p>}
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
