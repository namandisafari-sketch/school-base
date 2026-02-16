import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SchoolProvider, useSchool } from "@/contexts/SchoolContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import Login from "./pages/Login";
import Setup from "./pages/Setup";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Classes from "./pages/Classes";
import Attendance from "./pages/Attendance";
import Fees from "./pages/Fees";
import Parents from "./pages/Parents";
import Staff from "./pages/Staff";
import Subjects from "./pages/Subjects";
import Exams from "./pages/Exams";
import ReportCards from "./pages/ReportCards";
import ECDProgress from "./pages/ECDProgress";
import Timetable from "./pages/Timetable";
import Payroll from "./pages/Payroll";
import Accounting from "./pages/Accounting";
import Gate from "./pages/Gate";
import Visitors from "./pages/Visitors";
import Discipline from "./pages/Discipline";
import Letters from "./pages/Letters";
import Requisitions from "./pages/Requisitions";
import TermCalendar from "./pages/TermCalendar";
import Assets from "./pages/Assets";
import Reports from "./pages/Reports";
import StudentCards from "./pages/StudentCards";
import SettingsPage from "./pages/Settings";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isSetupComplete } = useSchool();
  const { isAuthenticated, isAdmin } = useAuth();

  // Must log in first
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // Then setup if needed
  if (!isSetupComplete) {
    return (
      <Routes>
        <Route path="*" element={<Setup />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
      <Route path="/setup" element={<Setup />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/parents" element={<Parents />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/report-cards" element={<ReportCards />} />
        <Route path="/ecd-progress" element={<ECDProgress />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/accounting" element={<Accounting />} />
        <Route path="/gate" element={<Gate />} />
        <Route path="/visitors" element={<Visitors />} />
        <Route path="/discipline" element={<Discipline />} />
        <Route path="/letters" element={<Letters />} />
        <Route path="/requisitions" element={<Requisitions />} />
        <Route path="/calendar" element={<TermCalendar />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/student-cards" element={<StudentCards />} />
        {/* Admin-only routes */}
        <Route path="/settings" element={isAdmin ? <SettingsPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/users" element={isAdmin ? <UserManagement /> : <Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <SchoolProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </SchoolProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
