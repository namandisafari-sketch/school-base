import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, LogIn, UserPlus, AlertCircle } from "lucide-react";

export default function Login() {
  const { login, register, hasUsers } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  // If no users exist, force registration mode
  const showRegister = isRegister || !hasUsers;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (showRegister) {
      if (!fullName.trim() || !username.trim() || !password) {
        setError(isAr ? "يرجى ملء جميع الحقول" : "Please fill in all fields");
        return;
      }
      const result = register(username, password, fullName);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Registration failed");
      }
    } else {
      if (!username.trim() || !password) {
        setError(isAr ? "يرجى ملء جميع الحقول" : "Please fill in all fields");
        return;
      }
      const result = login(username, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isAr ? "إدارة المدرسة" : "School Manager"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {!hasUsers
              ? (isAr ? "أنشئ حساب المسؤول الأول للبدء" : "Create the first admin account to get started")
              : showRegister
                ? (isAr ? "إنشاء حساب جديد" : "Create a new account")
                : (isAr ? "سجل الدخول للمتابعة" : "Sign in to continue")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="animate-fade-in rounded-xl border bg-card p-8 shadow-sm space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {showRegister && (
            <div>
              <Label htmlFor="fullName">{isAr ? "الاسم الكامل" : "Full Name"}</Label>
              <Input
                id="fullName"
                placeholder={isAr ? "مثل: أحمد محمد" : "e.g. John Doe"}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1.5"
                autoFocus
              />
            </div>
          )}

          <div>
            <Label htmlFor="username">{isAr ? "اسم المستخدم" : "Username"}</Label>
            <Input
              id="username"
              placeholder={isAr ? "اسم المستخدم" : "Username"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1.5"
              autoFocus={!showRegister}
            />
          </div>

          <div>
            <Label htmlFor="password">{isAr ? "كلمة المرور" : "Password"}</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <Button type="submit" className="w-full">
            {showRegister ? (
              <>
                <UserPlus className="me-2 h-4 w-4" />
                {!hasUsers
                  ? (isAr ? "إنشاء حساب المسؤول" : "Create Admin Account")
                  : (isAr ? "إنشاء حساب" : "Create Account")}
              </>
            ) : (
              <>
                <LogIn className="me-2 h-4 w-4" />
                {isAr ? "تسجيل الدخول" : "Sign In"}
              </>
            )}
          </Button>

          {hasUsers && (
            <p className="text-center text-sm text-muted-foreground">
              {showRegister ? (
                <>
                  {isAr ? "لديك حساب؟" : "Already have an account?"}{" "}
                  <button type="button" onClick={() => setIsRegister(false)} className="text-primary hover:underline font-medium">
                    {isAr ? "تسجيل الدخول" : "Sign In"}
                  </button>
                </>
              ) : (
                <>
                  {isAr ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
                  <button type="button" onClick={() => setIsRegister(true)} className="text-primary hover:underline font-medium">
                    {isAr ? "إنشاء حساب" : "Register"}
                  </button>
                </>
              )}
            </p>
          )}

          {!hasUsers && (
            <p className="text-center text-xs text-muted-foreground">
              {isAr
                ? "⚡ أول مستخدم يسجل يصبح المسؤول تلقائياً"
                : "⚡ The first user to register automatically becomes the admin"}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
