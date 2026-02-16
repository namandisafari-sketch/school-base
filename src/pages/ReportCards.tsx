import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Award, Printer, FileDown, Users } from "lucide-react";

export default function ReportCards() {
  const [classes] = useState(() => {
    const saved = localStorage.getItem("classes");
    return saved ? JSON.parse(saved) : [];
  });
  const [students] = useState(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedClass, setSelectedClass] = useState("");

  const filteredStudents = selectedClass
    ? students.filter((s: any) => s.className === selectedClass)
    : [];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Report Cards</h1>
          <p className="page-description">Generate and print student report cards</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={filteredStudents.length === 0}><FileDown className="mr-2 h-4 w-4" /> Export PDF</Button>
          <Button size="sm" disabled={filteredStudents.length === 0}><Printer className="mr-2 h-4 w-4" /> Print All</Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Select class" /></SelectTrigger>
          <SelectContent>
            {classes.map((c: any) => (
              <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="outline" className="text-xs">Term 1, 2026</Badge>
      </div>

      {!selectedClass ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <Award className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">Select a class to generate report cards</p>
        </CardContent></Card>
      ) : filteredStudents.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <Users className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No students in {selectedClass}</p>
        </CardContent></Card>
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
                  <Button variant="outline" size="sm" className="flex-1 text-xs"><Award className="mr-1 h-3 w-3" /> View</Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs"><Printer className="mr-1 h-3 w-3" /> Print</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
