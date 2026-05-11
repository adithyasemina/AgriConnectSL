type Language = "en" | "si";

interface FinalCTASectionProps {
  language: Language;
}

const translations = {
  en: {
    heading: "Ready to Grow Your Livestock Business?",
    paragraph: "Get expert guidance and tools to optimize your farm operations, increase productivity, and build a sustainable future.",
    button: "Get Free Consultation",
  },
  si: {
    heading: "ඔබේ ගොවි ව්‍යාපාරය වර්ධනය කිරීමට සූදානම්ද?",
    paragraph: "තාක්ෂණය, නිවැරදි උපදෙස් සහ විශ්වාසනීය සහයෝගය සමඟ ඔබේ ගොවි ගමන ආරම්භ කරන්න.",
    button: "නොමිලේ උපදෙස් ලබාගන්න",
  },
};

export default function FinalCTASection({ language }: FinalCTASectionProps) {
  const t = translations[language];

  return (
    <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-50 w-full">
      <div className="max-w-4xl mx-auto">
        {/* Content */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 sm:mb-6">
            {t.heading}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            {t.paragraph}
          </p>
          <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors text-sm sm:text-base">
            {t.button}
          </button>
        </div>

        {/* Large Image */}
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl h-64 sm:h-96 lg:h-[500px]">
          <img
            src="https://images.unsplash.com/photo-1500382017468-7049fae79e23?w=1200&h=600&fit=crop"
            alt="Farm with mountains landscape"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
