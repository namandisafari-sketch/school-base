import { useSchool } from "@/contexts/SchoolContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, GraduationCap, Database, Globe } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Language } from "@/lib/translations";
import type { CurriculumType } from "@/contexts/LanguageContext";

export default function SettingsPage() {
  const { settings, updateSettings } = useSchool();
  const { t, language, setLanguage, curriculum, setCurriculum } = useLanguage();
  const { toast } = useToast();
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [motto, setMotto] = useState(settings.motto || "");
  const [address, setAddress] = useState(settings.address || "");
  const [phone, setPhone] = useState(settings.phone || "");
  const [email, setEmail] = useState(settings.email || "");

  const handleSave = () => {
    updateSettings({ schoolName, motto, address, phone, email });
    toast({ title: language === "ar" ? "تم الحفظ" : "Settings saved", description: language === "ar" ? "تم تحديث إعدادات المدرسة." : "Your school settings have been updated." });
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("settings.title")}</h1>
          <p className="page-description">{t("settings.description")}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Language & Curriculum Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4 text-muted-foreground" />
                {t("settings.language")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{t("settings.languageDesc")}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t("settings.interfaceLang")}</Label>
                  <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية (Arabic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t("settings.curriculum")}</Label>
                  <Select value={curriculum} onValueChange={(v) => setCurriculum(v as CurriculumType)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">{t("settings.standardCurriculum")}</SelectItem>
                      <SelectItem value="arabic">{t("settings.arabicCurriculum")}</SelectItem>
                      <SelectItem value="both">{t("settings.bothCurriculum")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                {t("settings.schoolProfile")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t("settings.schoolName")}</Label>
                  <Input className="mt-1.5" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
                </div>
                <div>
                  <Label>{t("settings.schoolType")}</Label>
                  <Input className="mt-1.5" value={settings.schoolType} disabled />
                </div>
              </div>
              <div>
                <Label>{t("settings.motto")}</Label>
                <Input className="mt-1.5" value={motto} onChange={(e) => setMotto(e.target.value)} placeholder={language === "ar" ? "شعار المدرسة" : "School motto"} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t("settings.phone")}</Label>
                  <Input className="mt-1.5" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+256..." />
                </div>
                <div>
                  <Label>{t("settings.email")}</Label>
                  <Input className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="school@example.com" />
                </div>
              </div>
              <div>
                <Label>{t("settings.address")}</Label>
                <Input className="mt-1.5" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={language === "ar" ? "عنوان المدرسة" : "School address"} />
              </div>
              <Button onClick={handleSave}>{t("common.save")}</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Database className="h-4 w-4 text-muted-foreground" />
                {t("settings.data")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{t("settings.dataDesc")}</p>
              <Button variant="outline" size="sm" className="w-full">{t("settings.exportBackup")}</Button>
              <Button variant="outline" size="sm" className="w-full">{t("settings.importBackup")}</Button>
              <Separator />
              <Button variant="destructive" size="sm" className="w-full">{t("settings.resetData")}</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                {t("settings.systemInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("settings.version")}</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("settings.mode")}</span>
                <Badge variant="outline" className="text-xs">{language === "ar" ? "غير متصل" : "Offline"}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("settings.schoolType")}</span>
                <span className="capitalize">{settings.schoolType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("settings.interfaceLang")}</span>
                <span>{language === "ar" ? "العربية" : "English"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
