type Language = "en" | "si";

interface TransformationSectionProps {
  language: Language;
}

const translations = {
  en: {
    heading: "We drive transformation through innovative technology and operational excellence, ensuring profitable and sustainable solutions for every farming community.",
  },
  si: {
    heading: "නවීන තාක්ෂණය, කාර්යක්ෂම මෙහෙයුම් සහ විශ්වාසනීය කෘෂි සහයෝගය හරහා තිරසාර ගොවි විසඳුම් අපි නිර්මාණය කරමු.",
  },
};

export default function TransformationSection({ language }: TransformationSectionProps) {
  const t = translations[language];

  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden w-full">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-center mb-12 sm:mb-20 leading-tight text-white">
          {t.heading}
        </h2>

        {/* Overlapping Image Cards */}
        <div className="relative h-64 sm:h-96 lg:h-[500px]">
          {/* Back Card - Hidden on very small screens */}
          <div className="hidden sm:block absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transform -rotate-6 scale-95">
            <img
              src="https://images.unsplash.com/photo-1500595046891-2ceb04172ae4?w=1200&h=600&fit=crop"
              alt="Farm field at sunset"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Middle Card - Hidden on very small screens */}
          <div className="hidden sm:block absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transform rotate-3 scale-95 sm:scale-97">
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=1200&h=600&fit=crop"
              alt="Agricultural technology in field"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Front Card */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1488459716781-6918f33fc177?w=1200&h=600&fit=crop"
              alt="Farm with cattle grazing"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
