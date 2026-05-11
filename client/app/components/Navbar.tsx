"use client";

import Link from "next/link";

type Language = "en" | "si";

interface NavbarProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

export default function Navbar({ language, setLanguage }: NavbarProps) {
  const navLinks = [
    { en: "Home", si: "මුල් පිටුව", href: "/" },
    { en: "Contact", si: "සම්බන්ධ වන්න", href: "#" },
    { en: "Articles", si: "ලිපි", href: "#" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-100 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl sm:text-2xl font-black text-slate-900 whitespace-nowrap">
              AgriConnect
            </Link>
          </div>

          {/* Center Navigation - Rounded Pill - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-full px-2 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 lg:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap"
              >
                {language === "en" ? link.en : link.si}
              </Link>
            ))}
          </div>

          {/* Language Toggle - Right */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap ${
                language === "en"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("si")}
              className={`px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap ${
                language === "si"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              සිංහල
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 flex flex-wrap gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              {language === "en" ? link.en : link.si}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
