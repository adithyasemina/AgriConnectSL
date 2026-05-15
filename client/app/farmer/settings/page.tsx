"use client";

import { useState, useEffect } from "react";
import { getLanguage, setLanguage, t, Language } from "@/lib/i18n";
import { toast } from "react-hot-toast";
import { LuCheck } from "react-icons/lu";

export default function SettingsPage() {
  const [language, setSelectedLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSelectedLanguage(getLanguage());
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
    toast.success(t("languageUpdated", lang));
    window.location.reload();
  };

  if (!mounted) {
    return <div className="p-8">{t("loading")}</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-black text-slate-900 mb-8">
        {t("settingsTitle", language)}
      </h1>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            {t("language", language)}
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            {t("selectLanguage", language)}
          </p>

          <div className="space-y-3">
            {/* English Option */}
            <label className="flex items-center p-4 rounded-xl border-2 cursor-pointer transition hover:bg-slate-50"
              style={{
                borderColor: language === "en" ? "#2563eb" : "#e2e8f0",
                backgroundColor: language === "en" ? "#eff6ff" : "transparent",
              }}
            >
              <input
                type="radio"
                name="language"
                value="en"
                checked={language === "en"}
                onChange={() => handleLanguageChange("en")}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="ml-3 font-semibold text-slate-900">
                {t("english", language)}
              </span>
              {language === "en" && (
                <LuCheck className="ml-auto h-5 w-5 text-blue-600" />
              )}
            </label>

            {/* Sinhala Option */}
            <label className="flex items-center p-4 rounded-xl border-2 cursor-pointer transition hover:bg-slate-50"
              style={{
                borderColor: language === "si" ? "#2563eb" : "#e2e8f0",
                backgroundColor: language === "si" ? "#eff6ff" : "transparent",
              }}
            >
              <input
                type="radio"
                name="language"
                value="si"
                checked={language === "si"}
                onChange={() => handleLanguageChange("si")}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="ml-3 font-semibold text-slate-900">
                {t("sinhala", language)}
              </span>
              {language === "si" && (
                <LuCheck className="ml-auto h-5 w-5 text-blue-600" />
              )}
            </label>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-6">
        {language === "en"
          ? "Your language preference will be saved and applied across all pages."
          : "ඔබේ භාෂා අනුමතිය සුරකින ලබන අතර සිටින සහ වෙනත් සිටින ඉරට්ටුවල ගබඩා කරනු ලබයි."}
      </p>
    </div>
  );
}
