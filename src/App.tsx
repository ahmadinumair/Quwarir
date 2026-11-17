/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { MotionConfig } from "motion/react";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { ArchitecturalInterlude } from "./components/ArchitecturalInterlude";
import { AboutSection } from "./components/AboutSection";
import { ServicesSection } from "./components/ServicesSection";
import { ZakatAndProfitCalculator } from "./components/ZakatAndProfitCalculator";
import { MarketsSection } from "./components/MarketsSection";
import { EcosystemAndAISection } from "./components/EcosystemAndAISection";
import { VisionValuesSection } from "./components/VisionValuesSection";
import { ContactAndFooter } from "./components/ContactAndFooter";
import { FloatingBriefingDock } from "./components/FloatingBriefingDock";
import { useEditorialScrollReveal } from "./hooks/useEditorialScrollReveal";

export default function App() {
  const mainRef = useRef<HTMLElement | null>(null);
  useEditorialScrollReveal(mainRef);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#051F20] text-[#DAF1DE]">
        <Navbar />
        <main ref={mainRef} className="flex-1">
          <HeroSection />
          <ArchitecturalInterlude />
          <AboutSection />
          <ServicesSection />
          <ZakatAndProfitCalculator />
          <MarketsSection />
          <EcosystemAndAISection />
          <VisionValuesSection />
          <ContactAndFooter />
        </main>
        <FloatingBriefingDock />
      </div>
    </MotionConfig>
  );
}
