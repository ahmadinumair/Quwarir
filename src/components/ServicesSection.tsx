import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";

type ScreeningStage = "qualitative" | "quantitative";

interface ServiceColumn {
  num: string;
  tag: string;
  title: string;
  summary: string;
  actionLabel: string;
  actionHref: string;
  patternType: "octagram" | "meridian" | "bars" | "compass";
}

const SERVICE_COLUMNS: ServiceColumn[] = [
  {
    num: "01",
    tag: "Core Discipline",
    title: "Shariah Stock Screening",
    summary:
      "Helping investors discover and evaluate stocks based on established Islamic financial screening methodologies.",
    actionLabel: "Methodology",
    actionHref: "#shariah-methodology-ref",
    patternType: "octagram",
  },
  {
    num: "02",
    tag: "Cross-Border Research",
    title: "Global Market Insights",
    summary:
      "Providing information, research, and insights about international financial markets across key regions.",
    actionLabel: "Markets",
    actionHref: "#markets",
    patternType: "meridian",
  },
  {
    num: "03",
    tag: "Fundamental Data",
    title: "Investment Analytics",
    summary:
      "Offering company profiles, financial information, stock performance data, and structured investment analysis.",
    actionLabel: "Research Desk",
    actionHref: "#ecosystem",
    patternType: "bars",
  },
  {
    num: "04",
    tag: "Literacy & Stewardship",
    title: "Islamic Financial Education",
    summary:
      "Providing educational resources to help investors understand Islamic finance and responsible investing.",
    actionLabel: "Ask Guide",
    actionHref: "#ecosystem",
    patternType: "compass",
  },
];

function ServiceMedallion({ type }: { type: ServiceColumn["patternType"] }) {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      className="w-28 h-28 transition-transform duration-300 group-hover:scale-105"
      aria-hidden="true"
    >
      {type === "octagram" && (
        <g stroke="#DAF1DE" strokeWidth="1.6">
          <circle cx="90" cy="90" r="64" stroke="#8EB69B" strokeOpacity="0.65" />
          <rect x="46" y="46" width="88" height="88" strokeOpacity="0.8" />
          <rect
            x="46"
            y="46"
            width="88"
            height="88"
            transform="rotate(45 90 90)"
            stroke="#DAF1DE"
            strokeOpacity="0.6"
          />
        </g>
      )}

      {type === "meridian" && (
        <g stroke="#DAF1DE" strokeWidth="1.6">
          <circle cx="90" cy="90" r="64" strokeOpacity="0.85" />
          <ellipse cx="90" cy="90" rx="34" ry="64" stroke="#8EB69B" strokeOpacity="0.8" />
          <ellipse cx="90" cy="90" rx="64" ry="26" strokeOpacity="0.55" />
          <line x1="22" y1="90" x2="158" y2="90" stroke="#8EB69B" strokeOpacity="0.6" />
        </g>
      )}

      {type === "bars" && (
        <g stroke="#DAF1DE" strokeWidth="1.6">
          <line x1="30" y1="140" x2="150" y2="140" stroke="#8EB69B" strokeOpacity="0.8" />
          <rect x="38" y="102" width="18" height="38" strokeOpacity="0.7" />
          <rect x="66" y="80" width="18" height="60" stroke="#8EB69B" strokeOpacity="0.9" />
          <rect x="94" y="60" width="18" height="80" strokeOpacity="0.85" />
          <rect x="122" y="40" width="18" height="100" stroke="#DAF1DE" />
        </g>
      )}

      {type === "compass" && (
        <g stroke="#DAF1DE" strokeWidth="1.6">
          <circle cx="90" cy="90" r="62" strokeDasharray="4 6" stroke="#8EB69B" />
          <circle cx="90" cy="90" r="38" strokeOpacity="0.6" />
          <polygon points="90,28 100,90 90,152 80,90" stroke="#DAF1DE" />
          <polygon points="28,90 90,80 152,90 90,100" stroke="#8EB69B" />
        </g>
      )}
    </svg>
  );
}

export function ServicesSection() {
  const [screeningStage, setScreeningStage] = useState<ScreeningStage>("qualitative");
  const [activeCard, setActiveCard] = useState<number>(0);

  return (
    <section
      id="services"
      className="relative bg-[#235347] text-[#DAF1DE] py-24 lg:py-32 border-b border-[#8EB69B]/20"
    >
      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header inspired by Image 3's "Store" band */}
        <div
          data-gsap-reveal="headline"
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-14"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="w-8 h-px bg-[#8EB69B]" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#8EB69B]">
                Core Disciplines
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2.75rem,5.5vw,4.75rem)] font-medium leading-none text-[#DAF1DE]">
              Our Services
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#DAF1DE]/80 max-w-md leading-relaxed">
              Explore our four core disciplines connecting Islamic financial principles with global
              investment research.
            </p>
          </div>

          <a
            href="#ecosystem"
            className="inline-flex items-center gap-2.5 self-start lg:self-auto px-7 py-3.5 rounded-xl border border-[#DAF1DE]/55 text-[#DAF1DE] text-sm font-semibold hover:bg-[#DAF1DE] hover:text-[#051F20] transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            <span>Open Research Desk</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* 4 Circular-Halo Service Spotlights (directly inspired by Image 3's 4 circular spotlights) */}
        <div
          data-gsap-stagger-group
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-7 mb-16"
        >
          {SERVICE_COLUMNS.map((service, index) => {
            const isSelected = activeCard === index;
            return (
              <article
                key={service.num}
                data-gsap-stagger-item
                onMouseEnter={() => setActiveCard(index)}
                onClick={() => setActiveCard(index)}
                className="group cursor-pointer flex flex-col items-center text-center p-6 rounded-2xl transition-colors duration-200 hover:bg-[#163832]/45"
              >
                {/* Circular Medallion Backdrop */}
                <div
                  className={`relative w-44 h-44 rounded-full flex items-center justify-center mb-6 transition-all duration-200 ${
                    isSelected
                      ? "bg-[#8EB69B]/30 ring-1 ring-[#DAF1DE]/60"
                      : "bg-[#8EB69B]/18 group-hover:bg-[#8EB69B]/26"
                  }`}
                >
                  <span className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.2em] text-[#DAF1DE]/80 tabular-nums">
                    {service.num}
                  </span>
                  <ServiceMedallion type={service.patternType} />
                </div>

                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8EB69B] mb-2">
                  {service.tag}
                </p>
                <h3 className="font-serif text-2xl font-medium text-[#DAF1DE] leading-snug mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-[#DAF1DE]/80 leading-relaxed mb-5">
                  {service.summary}
                </p>

                <a
                  href={service.actionHref}
                  className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#DAF1DE] hover:text-[#8EB69B] transition-colors"
                >
                  <span>{service.actionLabel}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </article>
            );
          })}
        </div>

        {/* Educational Screening Methodology Reference Panel */}
        <div
          id="shariah-methodology-ref"
          data-gsap-reveal="container"
          className="rounded-2xl bg-[#0B2B26] text-[#DAF1DE] border border-[#8EB69B]/25 p-8 sm:p-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[#8EB69B]/20">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#8EB69B] mb-1">
                01. Shariah Stock Screening Reference
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#DAF1DE]">
                Two-Stage Islamic Screening Framework
              </h3>
            </div>

            <div className="inline-flex rounded-xl bg-[#051F20] p-1 border border-[#8EB69B]/20">
              <button
                type="button"
                onClick={() => setScreeningStage("qualitative")}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  screeningStage === "qualitative"
                    ? "bg-[#DAF1DE] text-[#051F20]"
                    : "text-[#8EB69B] hover:text-[#DAF1DE]"
                }`}
              >
                Business Screening
              </button>
              <button
                type="button"
                onClick={() => setScreeningStage("quantitative")}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  screeningStage === "quantitative"
                    ? "bg-[#DAF1DE] text-[#051F20]"
                    : "text-[#8EB69B] hover:text-[#DAF1DE]"
                }`}
              >
                Financial Ratios
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {screeningStage === "qualitative" ? (
              <motion.div
                key="qualitative"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm"
              >
                <div>
                  <p className="font-medium text-[#DAF1DE] mb-1.5">Core Activity Evaluation</p>
                  <p className="text-[#8EB69B] leading-relaxed">
                    Reviews primary revenue streams against non-permissible industries such as
                    conventional interest-based banking and prohibited sectors.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-[#DAF1DE] mb-1.5">Disclosure Transparency</p>
                  <p className="text-[#8EB69B] leading-relaxed">
                    Maps audited corporate segment filings so investors understand the source of
                    company earnings.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-[#DAF1DE] mb-1.5">Continuous Review Cadence</p>
                  <p className="text-[#8EB69B] leading-relaxed">
                    Requires quarterly and annual financial statement re-evaluation as business
                    operations evolve over time.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="quantitative"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm"
              >
                <div>
                  <p className="font-mono text-2xl text-[#DAF1DE] tabular-nums mb-1.5">&lt; 30%</p>
                  <p className="text-[#8EB69B] leading-relaxed">
                    Conventional interest-bearing debt relative to trailing market capitalization
                    benchmark.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-2xl text-[#DAF1DE] tabular-nums mb-1.5">&lt; 30%</p>
                  <p className="text-[#8EB69B] leading-relaxed">
                    Interest-bearing deposits and liquid securities threshold reference.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-2xl text-[#DAF1DE] tabular-nums mb-1.5">&lt; 5%</p>
                  <p className="text-[#8EB69B] leading-relaxed">
                    Maximum incidental non-permissible revenue subject to purification calculation.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
