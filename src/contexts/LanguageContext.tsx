import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Language, translations } from "@/lib/translations";

export type CurriculumType = "standard" | "arabic" | "both";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  curriculum: CurriculumType;
  setCurriculum: (type: CurriculumType) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("app_language") as Language) || "en";
  });
  const [curriculum, setCurriculumState] = useState<CurriculumType>(() => {
    return (localStorage.getItem("app_curriculum") as CurriculumType) || "standard";
  });

  const isRTL = language === "ar";

  useEffect(() => {
    localStorage.setItem("app_language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [language, isRTL]);

  useEffect(() => {
    localStorage.setItem("app_curriculum", curriculum);
  }, [curriculum]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const setCurriculum = useCallback((type: CurriculumType) => {
    setCurriculumState(type);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[language]?.[key] || translations.en[key] || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, curriculum, setCurriculum, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
