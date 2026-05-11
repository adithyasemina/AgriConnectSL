type Language = "en" | "si";

interface CaseStudySectionProps {
  language: Language;
}

const translations = {
  en: {
    label: "Case Study",
    heading: "Solutions for farm leadership from AgriConnect",
    paragraph: "Learn how AgriConnect helped a farming community increase productivity by 40% through smart farm management and digital tools.",
    button: "Read Case Study",
  },
  si: {
    label: "අධ්‍යයනය",
    heading: "AgriConnect සමඟ ගොවි නායකත්වයට බුද්ධිමත් විසඳුම්",
    paragraph: "ප්‍රාදේශීය ගොවි ප්‍රජාවන්ට තාක්ෂණය, උපදෙස් සහ විශ්වාසනීය දත්ත හරහා වඩා හොඳ තීරණ ගැනීමට අපි උදව් කරමු.",
    button: "කියවන්න",
  },
};

export default function CaseStudySection({ language }: CaseStudySectionProps) {
  const t = translations[language];

  return (
    <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white w-full">
      <div className="max-w-6xl mx-auto">
        {/* Case Study Container */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl h-64 sm:h-96 lg:h-[500px]">
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=600&fit=crop"
            alt="Farm landscape"
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* White Card Overlay - Left */}
          <div className="absolute inset-y-0 left-0 flex items-center p-3 sm:p-6 lg:p-8 w-full sm:w-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 w-full sm:max-w-sm shadow-xl">
              <div className="text-xs sm:text-sm font-black uppercase text-slate-500 tracking-wide mb-2 sm:mb-3">
                {t.label}
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 mb-3 sm:mb-4 leading-snug">
                {t.heading}
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-slate-600 mb-4 sm:mb-6 leading-relaxed">
                {t.paragraph}
              </p>
              <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors text-xs sm:text-sm">
                {t.button}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
