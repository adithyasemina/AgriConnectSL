type Language = "en" | "si";

interface TrustSectionProps {
  language: Language;
}

const translations = {
  en: {
    heading: "Built for trust, tested over time, embraced worldwide",
    paragraph: "Our platform is designed with farmers and agricultural officers at the center, built on years of research and real-world testing across diverse farming communities.",
    features: [
      { number: "01", title: "Smart Farmer Access", description: "Easy-to-use digital platform" },
      { number: "02", title: "Affordable Support", description: "Cost-effective solutions" },
      { number: "03", title: "Better Farm Management", description: "Improved productivity and yields" },
    ],
  },
  si: {
    heading: "විශ්වාසයට ගොඩනැගූ, කාලයත් සමඟ පරීක්ෂා කළ, ගොවීන් විසින් පිළිගත් වේදිකාවක්",
    paragraph: "AgriConnect ගොවි කටයුතු පහසු කිරීමට, නිවැරදි උපදෙස් ලබාදීමට සහ ගොවි ප්‍රජාව ශක්තිමත් කිරීමට නිර්මාණය කර ඇත.",
    features: [
      { number: "01", title: "බුද්ධිමත් ගොවි ප්‍රවේශය", description: "පහසු ඩිජිටල් වේදිකාව" },
      { number: "02", title: "පහසු සහයෝගය", description: "සාශ්‍රয়ී විසඳුම්" },
      { number: "03", title: "වඩා හොඳ ගොවි කළමනාකරණය", description: "වැඩි ඵලදායිතාව සහ ස්වාස්ථ්යය" },
    ],
  },
};

export default function TrustSection({ language }: TrustSectionProps) {
  const t = translations[language];

  return (
    <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white w-full">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-start lg:items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 sm:mb-6 leading-tight">
              {t.heading}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mb-8 sm:mb-12">
              {t.paragraph}
            </p>

            {/* Features */}
            <div className="space-y-6 sm:space-y-8">
              {t.features.map((feature) => (
                <div key={feature.number} className="flex gap-4 sm:gap-6 group">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 sm:h-14 w-12 sm:w-14 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-black shadow-md group-hover:shadow-lg transition-shadow">
                      {feature.number}
                    </div>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1 sm:mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl h-64 sm:h-96 lg:h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1500382017468-7049fae79e23?w=600&h=800&fit=crop"
              alt="Farmer in field with cattle"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
