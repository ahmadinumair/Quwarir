import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type RegionKey = "saudi" | "us" | "global";

interface RegionProfile {
  key: RegionKey;
  label: string;
  exchange: string;
  headline: string;
  description: string;
  exampleLabel: string;
  exampleValue: string;
  note: string;
}

const REGIONS: Record<RegionKey, RegionProfile> = {
  saudi: {
    key: "saudi",
    label: "Saudi Arabia",
    exchange: "Saudi Exchange (Tadawul)",
    headline: "Regional Anchor & Capital Depth",
    description:
      "Connecting international ethical investors with the Middle East's largest capital market through structured corporate profiles, sector disclosures, and screening context.",
    exampleLabel: "Illustrative Market Institution",
    exampleValue: "Al Rajhi Bank",
    note: "Displayed strictly as a market example within the Saudi Exchange (Tadawul). Shariah compliance is never assumed automatically and requires independent screening and periodic verification.",
  },
  us: {
    key: "us",
    label: "United States",
    exchange: "US Equity Markets",
    headline: "Global Liquidity & Innovation Access",
    description:
      "Providing analytical coverage and Islamic screening criteria across major US-listed corporations spanning technology, healthcare, industrials, and consumer sectors.",
    exampleLabel: "Analytical Scope",
    exampleValue: "Large & Mid-Cap Equities",
    note: "Each security requires ongoing business activity assessment and quantitative debt-to-market-capitalization ratio evaluation.",
  },
  global: {
    key: "global",
    label: "Global Markets",
    exchange: "International Expansion",
    headline: "Borderless Ethical Capital",
    description:
      "Phased expansion roadmap designed to link investors across Europe, MENA, and Asia-Pacific exchanges under a unified framework of transparency and Shariah literacy.",
    exampleLabel: "Strategic Horizon",
    exampleValue: "MENA · Europe · Asia-Pacific",
    note: "Market coverage expands alongside verified regulatory data feeds and independent Shariah methodology governance.",
  },
};

export function MarketsSection() {
  const [activeRegion, setActiveRegion] = useState<RegionKey>("saudi");
  const [imgError, setImgError] = useState(false);

  const current = REGIONS[activeRegion];

  return (
    <section
      id="markets"
      className="bg-[#102D25] text-[#F4F0E5] py-24 lg:py-32 border-b border-[#C6A96B]/20"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          data-gsap-reveal="headline"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14"
        >
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-5">
              <span className="w-8 h-px bg-[#C6A96B]" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#C6A96B]">
                Global Markets
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.08] text-[#FFFFFF] text-balance">
              Connecting Investors to Global Opportunities.
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[#E8EBE7]/80 leading-relaxed">
              Structured research and screening perspective across core regional exchanges and
              international equity horizons.
            </p>
          </div>
        </div>

        {/* Cartographic Visual Frame */}
        <div
          data-gsap-reveal="image"
          className="relative aspect-[16/9] max-h-[520px] w-full bg-[#103B2F] border border-[#C6A96B]/30 overflow-hidden mb-12"
        >
          {!imgError ? (
            <img
              src="/src/assets/images/markets_global_network_1794885510879.jpg"
              alt="Minimalist cartographic gold line atlas on deep emerald surface illustrating global market connectivity"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-10 bg-gradient-to-br from-[#103B2F] to-[#102D25]">
              <p className="font-serif text-3xl text-[#C6A96B] text-center">
                Saudi Exchange (Tadawul) · US Capital Markets · Global Expansion
              </p>
            </div>
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#102D25] via-[#102D25]/45 to-transparent"
          />
          <div className="absolute bottom-5 left-6 right-6 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-[#F4F0E5]/90">
            <span>Cross-Border Market Intelligence</span>
            <span className="text-[#C6A96B]">Riyadh · New York · International</span>
          </div>
        </div>

        {/* Interactive Market Switcher + Detailed Focus */}
        <div
          data-gsap-reveal="container"
          data-gsap-delay="0.08"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
        >
          {/* Interactive Region Tabs */}
          <div className="lg:col-span-4 flex flex-col border-t border-[#C6A96B]/25">
            {(Object.keys(REGIONS) as RegionKey[]).map((key) => {
              const region = REGIONS[key];
              const active = activeRegion === key;
              return (
                <button
                  key={region.key}
                  type="button"
                  onClick={() => setActiveRegion(region.key)}
                  className={`relative w-full text-left py-6 px-5 border-b border-[#C6A96B]/25 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#C6A96B] ${
                    active
                      ? "bg-[#103B2F] text-[#FFFFFF]"
                      : "bg-transparent text-[#F4F0E5]/75 hover:bg-[#103B2F]/50 hover:text-[#FFFFFF]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="market-active-bar"
                      transition={{ type: "spring", stiffness: 360, damping: 32 }}
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#C6A96B]"
                    />
                  )}
                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#C6A96B] mb-1">
                    {region.exchange}
                  </p>
                  <p className="font-serif text-2xl font-medium">{region.label}</p>
                </button>
              );
            })}
          </div>

          {/* Active Region Panel */}
          <div className="lg:col-span-8 bg-[#103B2F]/60 border border-[#C6A96B]/25 p-8 sm:p-10 min-h-[340px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-4 pb-6 mb-6 border-b border-[#C6A96B]/20">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#C6A96B] mb-2">
                      {current.exchange}
                    </p>
                    <h3 className="font-serif text-3xl sm:text-4xl font-medium text-[#FFFFFF]">
                      {current.headline}
                    </h3>
                  </div>
                </div>

                <p className="text-base text-[#E8EBE7]/90 leading-relaxed mb-8">
                  {current.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-t border-b border-[#C6A96B]/20 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#C6A96B] mb-1">
                      {current.exampleLabel}
                    </p>
                    <p className="font-serif text-2xl text-[#FFFFFF]">{current.exampleValue}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#C6A96B] mb-1">
                      Verification Principle
                    </p>
                    <p className="text-sm text-[#E8EBE7]/85">
                      Independent Screening &amp; Periodic Review Required
                    </p>
                  </div>
                </div>

                {/* Shariah Verification Notice */}
                <p className="text-xs sm:text-sm text-[#E8EBE7]/75 leading-relaxed">
                  <span className="text-[#C6A96B] font-semibold">Shariah Verification Note: </span>
                  {current.note} Displaying any exchange or company name does not constitute an
                  automatic determination of Shariah compliance; compliance requires ongoing
                  independent screening and regular financial verification.
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
