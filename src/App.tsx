/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ReactNode, useRef } from "react";
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

interface ErrorBoundaryState {
  hasError: boolean;
}

class AppErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#051F20] text-[#DAF1DE] p-6 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="font-serif text-3xl font-medium">QUWARIR</h1>
            <p className="text-sm text-[#8EB69B] leading-relaxed">
              An unexpected display issue occurred. Please refresh the page to reload the
              application.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-[#DAF1DE] text-[#051F20] text-xs font-semibold uppercase tracking-wider hover:bg-[#FFFFFF] transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const mainRef = useRef<HTMLElement | null>(null);
  useEditorialScrollReveal(mainRef);

  return (
    <AppErrorBoundary>
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
    </AppErrorBoundary>
  );
}
