import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  term: string;
}

const typeColors: Record<string, string> = {
  holiday: "bg-destructive/10 text-destructive",
  exam: "bg-warning/10 text-warning",
  meeting: "bg-info/10 text-info",
  sports: "bg-success/10 text-success",
  event: "bg-primary/10 text-primary",
};

export default function TermCalendar() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem("calendar_events");
    return saved ? JSON.parse(saved) : [];
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", type: "", term: "" });

  const handleAdd = () => {
    if (!form.title || !form.date) return;
    const event: CalendarEvent = { id: crypto.randomUUID(), ...form };
    const updated = [...events, event].sort((a, b) => a.date.localeCompare(b.date));
    setEvents(updated);
    localStorage.setItem("calendar_events", JSON.stringify(updated));
    setForm({ title: "", date: "", type: "", term: "" });
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    localStorage.setItem("calendar_events", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("calendar.title")}</h1>
          <p className="page-description">{t("calendar.description")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> {t("calendar.addEvent")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t("calendar.addEvent")}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div><Label>{t("calendar.eventTitle")} *</Label><Input className="mt-1.5" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("common.date")} *</Label><Input type="date" className="mt-1.5" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
                <div><Label>{t("common.type")}</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder={t("common.select")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="holiday">{t("calendar.holiday")}</SelectItem>
                      <SelectItem value="exam">{t("calendar.exam")}</SelectItem>
                      <SelectItem value="meeting">{t("calendar.meeting")}</SelectItem>
                      <SelectItem value="sports">{t("calendar.sports")}</SelectItem>
                      <SelectItem value="event">{t("calendar.event")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>{t("exams.term")}</Label><Input className="mt-1.5" value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} /></div>
            </div>
            <Button onClick={handleAdd} disabled={!form.title || !form.date} className="w-full">{t("calendar.addEvent")}</Button>
          </DialogContent>
        </Dialog>
      </div>

      {events.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <Calendar className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">{t("calendar.noEvents")}</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <Card key={event.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[50px]">
                    <p className="text-2xl font-bold text-primary">{new Date(event.date).getDate()}</p>
                    <p className="text-[10px] uppercase text-muted-foreground">{new Date(event.date).toLocaleString("default", { month: "short" })}</p>
                  </div>
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <div className="flex gap-2 mt-1">
                      {event.type && <Badge variant="outline" className={`text-xs ${typeColors[event.type] || ""}`}>{event.type}</Badge>}
                      {event.term && <Badge variant="outline" className="text-xs">{event.term}</Badge>}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(event.id)}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
