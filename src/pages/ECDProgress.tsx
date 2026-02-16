import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Award, Star, Users } from "lucide-react";

const learningAreas = ["Literacy", "Numeracy", "Creative Arts", "Social Skills", "Physical Development", "Science & Discovery"];

export default function ECDProgress() {
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
          <h1 className="page-title">ECD Progress</h1>
          <p className="page-description">Developmental progress tracking for young learners</p>
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
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {learningAreas.map((area) => (
          <Card key={area}><CardContent className="p-4 text-center">
            <Star className="mx-auto mb-2 h-5 w-5 text-primary" />
            <p className="text-xs font-medium">{area}</p>
          </CardContent></Card>
        ))}
      </div>

      {!selectedClass ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <Award className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">Select a class to view progress reports</p>
        </CardContent></Card>
      ) : filteredStudents.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <Users className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No pupils in {selectedClass}</p>
        </CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((s: any) => (
            <Card key={s.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <h3 className="font-semibold">{s.fullName}</h3>
                <p className="text-sm text-muted-foreground mb-3">{s.admissionNumber}</p>
                <div className="space-y-1.5">
                  {learningAreas.slice(0, 3).map((area) => (
                    <div key={area} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{area}</span>
                      <Badge variant="outline" className="text-xs">Not Rated</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full text-xs">Rate Progress</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
