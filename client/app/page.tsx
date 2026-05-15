"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import ChatbotWidget from "./components/ChatbotWidget";
import HeroSection from "./components/landing/HeroSection";
import TransformationSection from "./components/landing/TransformationSection";
import TrustSection from "./components/landing/TrustSection";
import ServicesSection from "./components/landing/ServicesSection";
import CaseStudySection from "./components/landing/CaseStudySection";
import CommunitySection from "./components/landing/CommunitySection";
import FinalCTASection from "./components/landing/FinalCTASection";
import FooterSection from "./components/landing/FooterSection";

type Language = "en" | "si";

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("en");

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white text-slate-950">
      <Navbar language={language} setLanguage={setLanguage} />
      <ChatbotWidget />
      <HeroSection language={language} />
      <TransformationSection language={language} />
      <TrustSection language={language} />
      <ServicesSection language={language} />
      <CaseStudySection language={language} />
      <CommunitySection language={language} />
      <FinalCTASection language={language} />
      <FooterSection language={language} />
    </main>
  );
}
