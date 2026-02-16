import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SchoolProvider, useSchool } from "@/contexts/SchoolContext";
import { AppLayout } from "@/components/AppLayout";
import Setup from "./pages/Setup";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Classes from "./pages/Classes";
import Attendance from "./pages/Attendance";
import Fees from "./pages/Fees";
import SettingsPage from "./pages/Settings";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isSetupComplete } = useSchool();

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
      <Route path="/setup" element={<Setup />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/parents" element={<PlaceholderPage title="Parents" description="Parent registry and portal" />} />
        <Route path="/staff" element={<PlaceholderPage title="Staff" description="Employee management" />} />
        <Route path="/subjects" element={<PlaceholderPage title="Subjects" description="Subject registry and assignments" />} />
        <Route path="/exams" element={<PlaceholderPage title="Exams" description="Exam management and scheduling" />} />
        <Route path="/report-cards" element={<PlaceholderPage title="Report Cards" description="Generate and print report cards" />} />
        <Route path="/ecd-progress" element={<PlaceholderPage title="ECD Progress" description="Developmental progress tracking" />} />
        <Route path="/timetable" element={<PlaceholderPage title="Timetable" description="Class schedules and period management" />} />
        <Route path="/payroll" element={<PlaceholderPage title="Payroll" description="Salary and payroll processing" />} />
        <Route path="/accounting" element={<PlaceholderPage title="Accounting" description="Financial management and ledger" />} />
        <Route path="/gate" element={<PlaceholderPage title="Gate Check-in" description="QR scanning and arrival/departure tracking" />} />
        <Route path="/visitors" element={<PlaceholderPage title="Visitor Register" description="Log and track school visitors" />} />
        <Route path="/discipline" element={<PlaceholderPage title="Discipline Cases" description="Incident tracking and management" />} />
        <Route path="/letters" element={<PlaceholderPage title="Letters" description="Generate school letters and notices" />} />
        <Route path="/requisitions" element={<PlaceholderPage title="Requisitions" description="Supply requests and approvals" />} />
        <Route path="/calendar" element={<PlaceholderPage title="Term Calendar" description="Events, holidays, and term dates" />} />
        <Route path="/assets" element={<PlaceholderPage title="Assets" description="School asset registry and tracking" />} />
        <Route path="/reports" element={<PlaceholderPage title="Reports" description="Financial and academic reports" />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SchoolProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </SchoolProvider>
  </QueryClientProvider>
);

export default App;
