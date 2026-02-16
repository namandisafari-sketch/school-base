import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Clock } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const defaultPeriods = ["8:00-8:40", "8:40-9:20", "9:20-10:00", "10:30-11:10", "11:10-11:50", "11:50-12:30", "14:00-14:40", "14:40-15:20"];

interface TimetableEntry {
  id: string;
  day: string;
  period: string;
  subject: string;
  teacher: string;
  className: string;
}

export default function Timetable() {
  const [classes] = useState(() => {
    const saved = localStorage.getItem("classes");
    return saved ? JSON.parse(saved) : [];
  });
  const [entries, setEntries] = useState<TimetableEntry[]>(() => {
    const saved = localStorage.getItem("timetable");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedClass, setSelectedClass] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ day: "", period: "", subject: "", teacher: "" });

  const handleAdd = () => {
    if (!form.day || !form.period || !form.subject) return;
    const entry: TimetableEntry = { id: crypto.randomUUID(), ...form, className: selectedClass };
    const updated = [...entries, entry];
    setEntries(updated);
    localStorage.setItem("timetable", JSON.stringify(updated));
    setForm({ day: "", period: "", subject: "", teacher: "" });
    setDialogOpen(false);
  };

  const getEntry = (day: string, period: string) =>
    entries.find((e) => e.day === day && e.period === period && e.className === selectedClass);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Timetable</h1>
          <p className="page-description">Class schedules and period management</p>
        </div>
        {selectedClass && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Period</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Timetable Entry</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Day *</Label>
                    <Select value={form.day} onValueChange={(v) => setForm({ ...form, day: v })}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{days.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Period *</Label>
                    <Select value={form.period} onValueChange={(v) => setForm({ ...form, period: v })}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{defaultPeriods.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Subject *</Label><Input className="mt-1.5" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
                <div><Label>Teacher</Label><Input className="mt-1.5" value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} /></div>
              </div>
              <Button onClick={handleAdd} disabled={!form.day || !form.period || !form.subject} className="w-full">Add Entry</Button>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Select value={selectedClass} onValueChange={setSelectedClass}>
        <SelectTrigger className="w-48"><SelectValue placeholder="Select class" /></SelectTrigger>
        <SelectContent>
          {classes.map((c: any) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
        </SelectContent>
      </Select>

      {!selectedClass ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <Clock className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">Select a class to view its timetable</p>
        </CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left text-muted-foreground font-medium">Time</th>
                  {days.map((d) => <th key={d} className="p-3 text-left text-muted-foreground font-medium">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {defaultPeriods.map((period) => (
                  <tr key={period} className="border-b last:border-0">
                    <td className="p-3 text-xs font-medium text-muted-foreground whitespace-nowrap">{period}</td>
                    {days.map((day) => {
                      const entry = getEntry(day, period);
                      return (
                        <td key={day} className="p-2">
                          {entry ? (
                            <div className="rounded-md bg-primary/10 p-2">
                              <p className="text-xs font-medium text-primary">{entry.subject}</p>
                              {entry.teacher && <p className="text-[10px] text-muted-foreground">{entry.teacher}</p>}
                            </div>
                          ) : (
                            <div className="h-10 rounded-md border border-dashed border-muted-foreground/20" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
