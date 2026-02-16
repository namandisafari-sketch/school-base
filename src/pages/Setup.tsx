import { useState } from "react";
import { useSchool, SchoolType } from "@/contexts/SchoolContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Baby, School, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Setup() {
  const { updateSettings } = useSchool();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [schoolName, setSchoolName] = useState("");
  const [selectedType, setSelectedType] = useState<SchoolType | null>(null);
  const [motto, setMotto] = useState("");

  const schoolTypes: { type: SchoolType; label: string; description: string; icon: React.ElementType }[] = [
    { type: "kindergarten", label: t("setup.kindergarten"), description: t("setup.kindergartenDesc"), icon: Baby },
    { type: "primary", label: t("setup.primary"), description: t("setup.primaryDesc"), icon: School },
    { type: "secondary", label: t("setup.secondary"), description: t("setup.secondaryDesc"), icon: BookOpen },
  ];

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
        <div className="mb-8 flex flex-col items-center gap-3 animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{t("setup.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("setup.subtitle")}</p>
        </div>

        <div className="mb-8 flex items-center justify-center gap-2">
          {[0, 1, 2].map((s) => (
            <div key={s} className={`h-2 w-12 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        {step === 0 && (
          <div className="animate-fade-in rounded-xl border bg-card p-8 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold">{t("setup.whatName")}</h2>
            <p className="mb-6 text-sm text-muted-foreground">{t("setup.nameNote")}</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="schoolName">{t("setup.schoolName")}</Label>
                <Input id="schoolName" placeholder={t("setup.schoolNamePlaceholder")} value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="mt-1.5" autoFocus />
              </div>
              <div>
                <Label htmlFor="motto">{t("setup.motto")}</Label>
                <Input id="motto" placeholder={t("setup.mottoPlaceholder")} value={motto} onChange={(e) => setMotto(e.target.value)} className="mt-1.5" />
              </div>
            </div>
            <Button className="mt-6 w-full" disabled={!schoolName.trim()} onClick={() => setStep(1)}>
              {t("common.continue")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-in space-y-3">
            <h2 className="mb-1 text-center text-lg font-semibold">{t("setup.whatType")}</h2>
            <p className="mb-6 text-center text-sm text-muted-foreground">{t("setup.typeNote")}</p>
            <div className="grid gap-3">
              {schoolTypes.map((st) => (
                <button
                  key={st.type}
                  onClick={() => setSelectedType(st.type)}
                  className={`flex items-start gap-4 rounded-xl border p-5 text-left transition-all hover:shadow-md ${
                    selectedType === st.type ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "bg-card hover:border-primary/30"
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
              <Button variant="outline" onClick={() => setStep(0)} className="flex-1">{t("common.back")}</Button>
              <Button disabled={!selectedType} onClick={() => setStep(2)} className="flex-1">
                {t("common.continue")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in rounded-xl border bg-card p-8 shadow-sm text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <h2 className="mb-1 text-lg font-semibold">{t("setup.allSet")}</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              <strong>{schoolName}</strong> — {schoolTypes.find((st) => st.type === selectedType)?.label}
            </p>
            <p className="mb-6 text-sm text-muted-foreground">{t("setup.canChange")}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">{t("common.back")}</Button>
              <Button onClick={handleComplete} className="flex-1">
                {t("setup.launch")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
