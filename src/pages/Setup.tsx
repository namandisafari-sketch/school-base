import { useState } from "react";
import { useSchool, SchoolType } from "@/contexts/SchoolContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Baby, School, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";

const schoolTypes: { type: SchoolType; label: string; description: string; icon: React.ElementType }[] = [
  { type: "kindergarten", label: "Kindergarten / ECD", description: "Early Childhood Development centres with learning areas, progress reports, and developmental tracking.", icon: Baby },
  { type: "primary", label: "Primary School", description: "Full primary school with subjects, exams, grading, report cards, and academic analytics.", icon: School },
  { type: "secondary", label: "Secondary School", description: "Secondary school with A-Level support, UNEB registration, mock exams, and advanced grading.", icon: BookOpen },
];

export default function Setup() {
  const { updateSettings } = useSchool();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [schoolName, setSchoolName] = useState("");
  const [selectedType, setSelectedType] = useState<SchoolType | null>(null);
  const [motto, setMotto] = useState("");

  const handleComplete = () => {
    if (!schoolName || !selectedType) return;
    updateSettings({
      schoolName,
      schoolType: selectedType,
      motto,
      isSetupComplete: true,
    });
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">School Manager</h1>
          <p className="text-sm text-muted-foreground">Offline-first school management — no internet required</p>
        </div>

        {/* Steps */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`h-2 w-12 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step 0: School Name */}
        {step === 0 && (
          <div className="animate-fade-in rounded-xl border bg-card p-8 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold">What's your school called?</h2>
            <p className="mb-6 text-sm text-muted-foreground">This will appear on all reports, receipts, and documents.</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  placeholder="e.g. Sunrise Academy"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="mt-1.5"
                  autoFocus
                />
              </div>
              <div>
                <Label htmlFor="motto">School Motto (optional)</Label>
                <Input
                  id="motto"
                  placeholder="e.g. Excellence in Education"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
            <Button
              className="mt-6 w-full"
              disabled={!schoolName.trim()}
              onClick={() => setStep(1)}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 1: School Type */}
        {step === 1 && (
          <div className="animate-fade-in space-y-3">
            <h2 className="mb-1 text-center text-lg font-semibold">What type of school?</h2>
            <p className="mb-6 text-center text-sm text-muted-foreground">This determines which modules and features are shown.</p>
            <div className="grid gap-3">
              {schoolTypes.map((st) => (
                <button
                  key={st.type}
                  onClick={() => setSelectedType(st.type)}
                  className={`flex items-start gap-4 rounded-xl border p-5 text-left transition-all hover:shadow-md ${
                    selectedType === st.type
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "bg-card hover:border-primary/30"
                  }`}
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                    selectedType === st.type ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    <st.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{st.label}</span>
                      {selectedType === st.type && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{st.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-3">
              <Button variant="outline" onClick={() => setStep(0)} className="flex-1">
                Back
              </Button>
              <Button disabled={!selectedType} onClick={() => setStep(2)} className="flex-1">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && (
          <div className="animate-fade-in rounded-xl border bg-card p-8 shadow-sm text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <h2 className="mb-1 text-lg font-semibold">All set!</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              <strong>{schoolName}</strong> — {schoolTypes.find((t) => t.type === selectedType)?.label}
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              You can change these settings anytime. Let's get started!
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleComplete} className="flex-1">
                Launch School Manager <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
