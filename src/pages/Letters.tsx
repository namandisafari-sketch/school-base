import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Mail, Printer } from "lucide-react";

interface Letter {
  id: string;
  type: string;
  recipient: string;
  subject: string;
  body: string;
  date: string;
}

export default function Letters() {
  const [letters, setLetters] = useState<Letter[]>(() => {
    const saved = localStorage.getItem("letters");
    return saved ? JSON.parse(saved) : [];
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ type: "", recipient: "", subject: "", body: "" });

  const handleAdd = () => {
    if (!form.type || !form.subject) return;
    const letter: Letter = { id: crypto.randomUUID(), ...form, date: new Date().toISOString().split("T")[0] };
    const updated = [letter, ...letters];
    setLetters(updated);
    localStorage.setItem("letters", JSON.stringify(updated));
    setForm({ type: "", recipient: "", subject: "", body: "" });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Letters</h1>
          <p className="page-description">Generate school letters and notices</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Create Letter</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Letter</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Letter Type *</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admission">Admission Letter</SelectItem>
                      <SelectItem value="fee_reminder">Fee Reminder</SelectItem>
                      <SelectItem value="suspension">Suspension Letter</SelectItem>
                      <SelectItem value="expulsion">Expulsion Letter</SelectItem>
                      <SelectItem value="general">General Notice</SelectItem>
                      <SelectItem value="recommendation">Recommendation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Recipient</Label><Input className="mt-1.5" value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} placeholder="Student/Parent name" /></div>
              </div>
              <div><Label>Subject *</Label><Input className="mt-1.5" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
              <div><Label>Body</Label><Textarea className="mt-1.5 min-h-[120px]" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
            </div>
            <Button onClick={handleAdd} disabled={!form.type || !form.subject} className="w-full">Create Letter</Button>
          </DialogContent>
        </Dialog>
      </div>

      {letters.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <Mail className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No letters created yet</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Type</TableHead><TableHead>Subject</TableHead><TableHead>Recipient</TableHead><TableHead>Date</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {letters.map((l) => (
                <TableRow key={l.id}>
                  <TableCell><Badge variant="outline" className="text-xs capitalize">{l.type.replace("_", " ")}</Badge></TableCell>
                  <TableCell className="font-medium">{l.subject}</TableCell>
                  <TableCell>{l.recipient || "—"}</TableCell>
                  <TableCell>{l.date}</TableCell>
                  <TableCell><Button variant="ghost" size="sm"><Printer className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
