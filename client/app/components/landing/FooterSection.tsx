import Link from "next/link";

type Language = "en" | "si";

interface FooterSectionProps {
  language: Language;
}

const translations = {
  en: {
    description: "Connects farmers, officers, and suppliers through innovative technology for sustainable agricultural growth.",
    company: "Company",
    headOffice: "Head Office",
    followUs: "Follow Us",
    home: "Home",
    contact: "Contact",
    articles: "Articles",
    country: "Sri Lanka",
    copyright: "© 2026 AgriConnect. All rights reserved.",
  },
  si: {
    description: "AgriConnect ගොවීන්, නිලධාරීන් සහ කෘෂි ප්‍රජාව සම්බන්ධ කරයි.",
    company: "සමාගම",
    headOffice: "ප්‍රධාන කාර්යාලය",
    followUs: "අපෙන් අනුගමනය කරන්න",
    home: "මුල් පිටුව",
    contact: "සම්බන්ධ වන්න",
    articles: "ලිපි",
    country: "ශ්‍රී ලංකා",
    copyright: "© 2026 AgriConnect. සියලුම හිමිකම් ඇවිරිණි.",
  },
};

export default function FooterSection({ language }: FooterSectionProps) {
  const t = translations[language];

  return (
    <footer className="bg-slate-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Left - Main Text */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4">AgriConnect</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              {t.description}
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-300 mb-4 sm:mb-6">
              {t.company}
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition-colors text-xs sm:text-sm">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition-colors text-xs sm:text-sm">
                  {t.contact}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition-colors text-xs sm:text-sm">
                  {t.articles}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-300 mb-4 sm:mb-6">
              {t.headOffice}
            </h4>
            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-400">
              <li>{t.country}</li>
              <li>
                <a
                  href="mailto:support@agriconnect.com"
                  className="hover:text-white transition-colors"
                >
                  support@agriconnect.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Icons */}
          <div>
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-300 mb-4 sm:mb-6">
              {t.followUs}
            </h4>
            <div className="flex gap-3 sm:gap-4">
              <a href="#" className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-colors text-xs font-bold">
                f
              </a>
              <a href="#" className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-colors text-xs font-bold">
                tw
              </a>
              <a href="#" className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-colors text-xs font-bold">
                in
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-6 sm:pt-8">
          <p className="text-center text-xs sm:text-sm text-slate-400">
            {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
