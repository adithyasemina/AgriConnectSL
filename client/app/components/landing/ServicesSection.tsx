type Language = "en" | "si";

interface ServicesSectionProps {
  language: Language;
}

const translations = {
  en: {
    heading: "Products & Services",
    subheading: "Solutions Your Farm Growth",
    services: [
      {
        number: "01",
        type: "Product",
        title: "Digital Infrastructure",
        description: "Cloud-based platform for farm data management and analytics",
      },
      {
        number: "02",
        type: "Service",
        title: "Livestock Consultation",
        description: "Expert guidance on animal health, breeding, and nutrition",
      },
      {
        number: "03",
        type: "Product",
        title: "Access to the Community",
        description: "Connect with other farmers and share best practices",
      },
      {
        number: "04",
        type: "Service",
        title: "Funding",
        description: "Access to agricultural loans and financial support programs",
      },
    ],
  },
  si: {
    heading: "නිෂ්පාදන සහ සේවා",
    subheading: "ගොවි වර්ධනය සඳහා විසඳුම්",
    services: [
      {
        number: "01",
        type: "නිෂ්පාදනය",
        title: "ඩිජිටල් යටිතල පහසුකම්",
        description: "ගොවි දත්ත කළමනාකරණ සහ විශ්ලේෂණ සඳහා ක්ලවුඩ් වේදිකාව",
      },
      {
        number: "02",
        type: "සේවාව",
        title: "පශු සම්පත් උපදෙස්",
        description: "පුරුෂ සෞඛ්‍යය, බිම් සහ පෝෂණ පිළිබඳ විශේෂඥ සලස්වා",
      },
      {
        number: "03",
        type: "නිෂ්පාදනය",
        title: "ප්‍රජාවට ප්‍රවේශය",
        description: "අනෙකුත් ගොවීන් සමඟ සම්බන්ධ විය සහ හොඳ පුරුස් කටයුතු බෙදා ගන්න",
      },
      {
        number: "04",
        type: "සේවාව",
        title: "මූල්‍ය සහය",
        description: "ගොවිතර ණය සහ මූල්‍ය සහය ක්‍රමවලට ප්‍රවේශය",
      },
    ],
  },
};

export default function ServicesSection({ language }: ServicesSectionProps) {
  const t = translations[language];

  return (
    <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-50 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 text-center mb-12 sm:mb-20">
          {t.heading}
          <br />
          <span className="text-slate-600 text-xl sm:text-3xl lg:text-4xl">{t.subheading}</span>
        </h2>

        {/* Three Column Layout - Stacks on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Left - Service List */}
          <div className="space-y-6 sm:space-y-8">
            {t.services.map((service) => (
              <div key={service.number} className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 pt-1">
                  <div className="text-xl sm:text-2xl font-black text-slate-400">{service.number}</div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    {service.type}
                  </p>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">{service.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Center - Image */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg h-64 sm:h-96 md:h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1516626583859-f74d440642a7?w=500&h=700&fit=crop"
              alt="Cow in barn"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right - Descriptions */}
          <div className="space-y-6 sm:space-y-8">
            {t.services.map((service) => (
              <div key={`desc-${service.number}`}>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
