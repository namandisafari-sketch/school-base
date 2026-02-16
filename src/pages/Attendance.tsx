import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Calendar, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Attendance() {
  const { t } = useLanguage();
  const [classes] = useState(() => {
    const saved = localStorage.getItem("classes");
    return saved ? JSON.parse(saved) : [];
  });
  const [students] = useState(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedClass, setSelectedClass] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const filteredStudents = selectedClass
    ? students.filter((s: any) => s.className === selectedClass)
    : [];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("attendance.title")}</h1>
          <p className="page-description">{t("attendance.markDaily")} — {today}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t("common.selectClass")} />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c: any) => (
              <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="outline" className="text-xs">
          <Calendar className="mr-1.5 h-3 w-3" /> {today}
        </Badge>
      </div>

      {!selectedClass ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ClipboardCheck className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">{t("attendance.selectClass")}</p>
            {classes.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">{t("attendance.createFirst")}</p>
            )}
          </CardContent>
        </Card>
      ) : filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">{t("attendance.noStudents")} {selectedClass}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("attendance.enrollFirst")}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {selectedClass} — {filteredStudents.length} {t("attendance.students")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredStudents.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{s.fullName}</p>
                    <p className="text-xs text-muted-foreground">{s.admissionNumber}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {[t("attendance.present"), t("attendance.absent"), t("attendance.late")].map((status) => (
                      <Button key={status} variant="outline" size="sm" className="text-xs h-7">
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
