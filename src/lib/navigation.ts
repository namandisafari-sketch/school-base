import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardCheck,
  DoorOpen,
  CreditCard,
  BookOpen,
  FileText,
  Calendar,
  Settings,
  UserCog,
  Wallet,
  AlertTriangle,
  Mail,
  ClipboardList,
  BarChart3,
  Clock,
  QrCode,
  Package,
  Award,
  IdCard,
  TrendingUp,
  Lock,
  type LucideIcon,
  Shield,
} from "lucide-react";
import { SchoolType } from "@/contexts/SchoolContext";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  schoolTypes: SchoolType[] | "all";
  group: string;
}

export const navigationItems: NavItem[] = [
  // Core
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, schoolTypes: "all", group: "Overview" },
  { title: "Students", url: "/students", icon: Users, schoolTypes: ["primary", "secondary"], group: "People" },
  { title: "ECD Pupils", url: "/students", icon: Users, schoolTypes: ["kindergarten"], group: "People" },
  { title: "Classes", url: "/classes", icon: GraduationCap, schoolTypes: "all", group: "People" },
  { title: "Parents", url: "/parents", icon: UserCog, schoolTypes: "all", group: "People" },
  { title: "Staff", url: "/staff", icon: UserCog, schoolTypes: "all", group: "People" },
  { title: "Student Cards", url: "/student-cards", icon: IdCard, schoolTypes: "all", group: "People" },
  // Academics
  { title: "Attendance", url: "/attendance", icon: ClipboardCheck, schoolTypes: "all", group: "Academics" },
  { title: "Subjects", url: "/subjects", icon: BookOpen, schoolTypes: ["primary", "secondary"], group: "Academics" },
  { title: "Exams", url: "/exams", icon: FileText, schoolTypes: ["primary", "secondary"], group: "Academics" },
  { title: "Report Cards", url: "/report-cards", icon: Award, schoolTypes: ["primary", "secondary"], group: "Academics" },
  { title: "ECD Progress", url: "/ecd-progress", icon: Award, schoolTypes: ["kindergarten"], group: "Academics" },
  { title: "Academic Analysis", url: "/academic-analysis", icon: TrendingUp, schoolTypes: ["primary", "secondary"], group: "Academics" },
  { title: "Timetable", url: "/timetable", icon: Clock, schoolTypes: "all", group: "Academics" },
  // Operations
  { title: "Fees", url: "/fees", icon: CreditCard, schoolTypes: "all", group: "Finance" },
  { title: "Payroll", url: "/payroll", icon: Wallet, schoolTypes: "all", group: "Finance" },
  { title: "Accounting", url: "/accounting", icon: BarChart3, schoolTypes: "all", group: "Finance" },
  // Safety
  { title: "Gate Check-in", url: "/gate", icon: DoorOpen, schoolTypes: "all", group: "Safety" },
  { title: "Visitors", url: "/visitors", icon: QrCode, schoolTypes: "all", group: "Safety" },
  { title: "Discipline", url: "/discipline", icon: AlertTriangle, schoolTypes: "all", group: "Safety" },
  // Admin
  { title: "Letters", url: "/letters", icon: Mail, schoolTypes: "all", group: "Admin" },
  { title: "Requisitions", url: "/requisitions", icon: ClipboardList, schoolTypes: "all", group: "Admin" },
  { title: "Term Calendar", url: "/calendar", icon: Calendar, schoolTypes: "all", group: "Admin" },
  { title: "Assets", url: "/assets", icon: Package, schoolTypes: "all", group: "Admin" },
  { title: "Reports", url: "/reports", icon: BarChart3, schoolTypes: "all", group: "Admin" },
  { title: "User Management", url: "/users", icon: Shield, schoolTypes: "all", group: "System" },
  { title: "Access Management", url: "/access-management", icon: Lock, schoolTypes: "all", group: "System" },
  { title: "Settings", url: "/settings", icon: Settings, schoolTypes: "all", group: "System" },
];

export function getFilteredNavItems(schoolType: SchoolType): NavItem[] {
  return navigationItems.filter(
    (item) => item.schoolTypes === "all" || item.schoolTypes.includes(schoolType)
  );
}

export function getNavGroups(schoolType: SchoolType) {
  const items = getFilteredNavItems(schoolType);
  const groups: Record<string, NavItem[]> = {};
  items.forEach((item) => {
    if (!groups[item.group]) groups[item.group] = [];
    groups[item.group].push(item);
  });
  return groups;
}
