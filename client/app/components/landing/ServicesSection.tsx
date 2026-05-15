import { LuChartBar, LuBrainCircuit, LuUsers, LuTrendingUp } from "react-icons/lu";

type Language = "en" | "si";

interface ServicesSectionProps {
  language: Language;
}

const translations = {
  en: {
    heading: "Key Features",
    subheading: "Powerful Tools for Modern Farming",
    features: [
      {
        icon: LuChartBar,
        title: "Disease Detection",
        description: "Advanced AI-powered analysis to identify crop diseases early and prevent losses",
      },
      {
        icon: LuBrainCircuit,
        title: "Soil Test Reports",
        description: "Comprehensive soil analysis with recommendations for optimal crop yield",
      },
      {
        icon: LuUsers,
        title: "Officer Communication",
        description: "Direct connection with agricultural officers for expert guidance and support",
      },
      {
        icon: LuTrendingUp,
        title: "Smart Recommendations",
        description: "Data-driven insights and best practices tailored to your farming needs",
      },
      {
        icon: LuUsers,
        title: "Community Network",
        description: "Connect with other farmers, share experiences and learn from best practices",
      },
      {
        icon: LuTrendingUp,
        title: "Real-time Alerts",
        description: "Instant notifications for weather, pest alerts, and market opportunities",
      },
    ],
  },
  si: {
    heading: "ප්‍රධාන විශේෂතා",
    subheading: "නවීන ගොවිතරයේ සඳහා බලවත් මෙවලම්",
    features: [
      {
        icon: LuChartBar,
        title: "රෝග සනාក්‍යා",
        description: "බෝග රෝගවලට ඉගිනුම් ඇල්ගොරිතම ලබා දීමෙන් පුර්ව අනාවරණය",
      },
      {
        icon: LuBrainCircuit,
        title: "පෙතෙහි පරීක්‍ෂණ වාර්තා",
        description: "අවසාන ඉඩම විශ්ලේෂණ සහ අස්ඉටි අස්ඉටි බෙදාගැනීම",
      },
      {
        icon: LuUsers,
        title: "නිලධාරී සන්නිවේදනය",
        description: "කෘෂි නිලධාරීන් සමඟ සම්බන්ධතා සහ ස්වාධීන ස්වරූපිතයි",
      },
      {
        icon: LuTrendingUp,
        title: "දක්ෂ නිර්දෝශක",
        description: "ඔබගේ ගොවිතර අවශ්‍යතා සඳහා සම්පූර්ණ තොරතුරු සහ සිද්ධි",
      },
      {
        icon: LuUsers,
        title: "ප්‍රජා ජාල",
        description: "අනෙකුත් ගොවීන්ට සම්බන්ධ වී අතුරුවිකාස වෙතින් ඉගෙන ගන්න",
      },
      {
        icon: LuTrendingUp,
        title: "වාස්තවික-කාල සිඩි",
        description: "කාලගුණ, පණුවෙ ඇඟවීම සහ වෙළඳපල ඉඩ නිසි දැනුම්",
      },
    ],
  },
};

export default function ServicesSection({ language }: ServicesSectionProps) {
  const t = translations[language];

  return (
    <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white w-full">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-3">
            {t.heading}
          </h2>
          <p className="text-lg sm:text-xl text-slate-600">{t.subheading}</p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {t.features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <IconComponent className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
