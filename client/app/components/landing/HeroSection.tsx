import Link from "next/link";

type Language = "en" | "si";

interface HeroSectionProps {
  language: Language;
}

const translations = {
  en: {
    heading: "Building The Future of Farm Management",
    subtitle: "AgriConnect helps farmers, officers, and communities grow through technology and sustainable solutions.",
    cta: "Get Started",
    growthLabel: "Growth Index",
    growthValue: "Farmer Growth",
    taskLabel: "Priority Tasks",
    taskValue: "Soil Test Reminder",
  },
  si: {
    heading: "ගොවි කළමනාකරණයේ අනාගතය ගොඩනඟමු",
    subtitle: "AgriConnect ගොවීන්ට, කෘෂි නිලධාරීන්ට සහ ප්‍රජාවට තාක්ෂණය හා තිරසාර විසඳුම් හරහා වර්ධනය වීමට උදව් කරයි.",
    cta: "ආරම්භ කරන්න",
    growthLabel: "ගොවි වර්ධනය",
    growthValue: "+42%",
    taskLabel: "ඉහළ ප්‍රමුඛතාව",
    taskValue: "මණ් පරීක්ෂණ",
  },
};

export default function HeroSection({ language }: HeroSectionProps) {
  const t = translations[language];

  return (
    <section className="relative pt-24 sm:pt-32 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 bg-white w-full overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-4 sm:mb-6 leading-tight">
            {t.heading}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
          <Link
            href="/account"
            className="inline-block px-8 sm:px-10 py-3 sm:py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            {t.cta}
          </Link>
        </div>

        {/* Hero Image Card */}
        <div className="relative mb-8 sm:mb-12">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-slate-100 h-64 sm:h-96 lg:h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=600&fit=crop"
              alt="Farm landscape with green fields"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Cards */}
          {/* Left Card */}
          <div className="absolute -bottom-8 sm:bottom-8 left-2 sm:left-8 bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-40 sm:w-56 transform -rotate-3 hover:rotate-0 transition-all hover:shadow-2xl">
            <div className="text-slate-500 text-xs sm:text-sm font-bold mb-2 uppercase tracking-wide">{t.growthLabel}</div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 mb-1">+42%</div>
            <div className="text-slate-600 text-xs sm:text-sm">{t.growthValue}</div>
          </div>

          {/* Right Card */}
          <div className="absolute -bottom-4 sm:bottom-16 right-2 sm:right-8 bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-40 sm:w-56 transform rotate-3 hover:rotate-0 transition-all hover:shadow-2xl">
            <div className="text-slate-500 text-xs sm:text-sm font-bold mb-2 uppercase tracking-wide">{t.taskLabel}</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mb-1">12</div>
            <div className="text-slate-600 text-xs sm:text-sm">{t.taskValue}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
