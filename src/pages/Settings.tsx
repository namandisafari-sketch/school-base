import { useSchool } from "@/contexts/SchoolContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, GraduationCap, Database, Printer } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { settings, updateSettings } = useSchool();
  const { toast } = useToast();
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [motto, setMotto] = useState(settings.motto || "");
  const [address, setAddress] = useState(settings.address || "");
  const [phone, setPhone] = useState(settings.phone || "");
  const [email, setEmail] = useState(settings.email || "");

  const handleSave = () => {
    updateSettings({ schoolName, motto, address, phone, email });
    toast({ title: "Settings saved", description: "Your school settings have been updated." });
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-description">Manage your school profile and preferences</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                School Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>School Name</Label>
                  <Input className="mt-1.5" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
                </div>
                <div>
                  <Label>School Type</Label>
                  <Input className="mt-1.5" value={settings.schoolType} disabled />
                </div>
              </div>
              <div>
                <Label>Motto</Label>
                <Input className="mt-1.5" value={motto} onChange={(e) => setMotto(e.target.value)} placeholder="School motto" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input className="mt-1.5" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+256..." />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="school@example.com" />
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <Input className="mt-1.5" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="School address" />
              </div>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Database className="h-4 w-4 text-muted-foreground" />
                Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">All data is stored locally on this device.</p>
              <Button variant="outline" size="sm" className="w-full">Export Backup</Button>
              <Button variant="outline" size="sm" className="w-full">Import Backup</Button>
              <Separator />
              <Button variant="destructive" size="sm" className="w-full">Reset All Data</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                System Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mode</span>
                <Badge variant="outline" className="text-xs">Offline</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">School Type</span>
                <span className="capitalize">{settings.schoolType}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
