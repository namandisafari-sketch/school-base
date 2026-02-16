import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type SchoolType = "kindergarten" | "primary" | "secondary";

interface SchoolSettings {
  schoolName: string;
  schoolType: SchoolType;
  logo?: string;
  motto?: string;
  address?: string;
  phone?: string;
  email?: string;
  isSetupComplete: boolean;
}

interface SchoolContextType {
  settings: SchoolSettings;
  updateSettings: (updates: Partial<SchoolSettings>) => void;
  isSetupComplete: boolean;
}

const defaultSettings: SchoolSettings = {
  schoolName: "",
  schoolType: "primary",
  isSetupComplete: false,
};

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem("school_settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("school_settings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<SchoolSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return (
    <SchoolContext.Provider
      value={{ settings, updateSettings, isSetupComplete: settings.isSetupComplete }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) throw new Error("useSchool must be used within SchoolProvider");
  return context;
};
