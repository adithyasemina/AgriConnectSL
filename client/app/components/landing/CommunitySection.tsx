type Language = "en" | "si";

interface CommunitySectionProps {
  language: Language;
}

const translations = {
  en: {
    heading: "Join Our Community and Be Part of Our Transformational Journey.",
    paragraph: "Connect with thousands of farmers, agricultural officers, and experts who are revolutionizing farming practices across Sri Lanka.",
    stats: "Active Community Members",
    button: "Join Community",
  },
  si: {
    heading: "අපගේ ප්‍රජාවට එක්වී කෘෂි පරිවර්තන ගමනේ කොටසක් වන්න.",
    paragraph: "ගොවීන්, නිලධාරීන් සහ කෘෂි සහය දක්වන පිරිස් එකට සම්බන්ධ කරන AgriConnect ප්‍රජාවට එක්වන්න.",
    stats: "ක්‍රියාකාරී ප්‍රජා සාමාජිකයින්",
    button: "ප්‍රජාවට එක්වන්න",
  },
};

export default function CommunitySection({ language }: CommunitySectionProps) {
  const t = translations[language];
  const avatarColors = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-red-500", "bg-pink-500"];

  return (
    <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white w-full">
      <div className="max-w-4xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 sm:mb-6">
          {t.heading}
        </h2>

        {/* Paragraph */}
        <p className="text-base sm:text-lg text-slate-600 mb-12 sm:mb-16 max-w-2xl mx-auto">
          {t.paragraph}
        </p>

        {/* Stats with Avatars */}
        <div className="flex flex-col items-center gap-8 sm:gap-12">
          {/* Avatar Circle Group */}
          <div className="relative w-40 sm:w-48 h-40 sm:h-48 flex items-center justify-center">
            {/* Big Stat Number */}
            <div className="text-center z-10 px-2">
              <div className="text-4xl sm:text-6xl lg:text-7xl font-black text-purple-600 leading-none">
                243,543+
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">{t.stats}</p>
            </div>

            {/* Avatar Circles */}
            <div className="absolute inset-0">
              {avatarColors.map((color, i) => {
                const angle = (i / avatarColors.length) * Math.PI * 2;
                const radius = window.innerWidth < 640 ? 50 : 70;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <div
                    key={i}
                    className={`absolute w-8 sm:w-12 h-8 sm:h-12 rounded-full ${color} flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0`}
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Button */}
          <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors text-sm sm:text-base">
            {t.button}
          </button>
        </div>
      </div>
    </section>
  );
}
