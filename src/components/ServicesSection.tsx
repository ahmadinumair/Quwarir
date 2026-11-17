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
  bgClass: string;
  patternType: "octagram" | "meridian" | "bars" | "compass";
}

const SERVICE_COLUMNS: ServiceColumn[] = [
  {
    num: "01",
    tag: "Core Discipline",
    title: "Shariah Stock Screening",
    summary:
      "Helping investors discover and evaluate stocks based on established Islamic financial screening methodologies.",
    actionLabel: "Methodology Below",
    actionHref: "#shariah-methodology-ref",
    bgClass: "from-[#103B2F] to-[#102D25]",
    patternType: "octagram",
  },
  {
    num: "02",
    tag: "Cross-Border Research",
    title: "Global Market Insights",
    summary:
      "Providing information, research, and insights about international financial markets across key regions.",
    actionLabel: "Explore Markets",
    actionHref: "#markets",
    bgClass: "from-[#174A3B] to-[#103B2F]",
    patternType: "meridian",
  },
  {
    num: "03",
    tag: "Fundamental Data",
    title: "Investment Analytics",
    summary:
      "Offering company profiles, financial information, stock performance data, and structured investment analysis.",
    actionLabel: "Open Research Desk",
    actionHref: "#ecosystem",
    bgClass: "from-[#2A4E43] to-[#102D25]",
    patternType: "bars",
  },
  {
    num: "04",
    tag: "Literacy & Stewardship",
    title: "Islamic Financial Education",
    summary:
      "Providing educational resources to help investors understand Islamic finance and responsible investing.",
    actionLabel: "Ask Educator",
    actionHref: "#ecosystem",
    bgClass: "from-[#102D25] to-[#0B201A]",
    patternType: "compass",
  },
];

function ServiceArtwork({ type }: { type: ServiceColumn["patternType"] }) {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      className="w-full h-full opacity-80 transition-transform duration-500 group-hover:scale-105"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={`halftone-${type}`}
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="0.9" fill="#C6A96B" fillOpacity="0.28" />
        </pattern>
      </defs>
      <rect width="280" height="280" fill={`url(#halftone-${type})`} />

      {type === "octagram" && (
        <g stroke="#C6A96B" strokeWidth="1.2">
          <circle cx="140" cy="120" r="76" strokeOpacity="0.55" />
          <rect x="86" y="66" width="108" height="108" strokeOpacity="0.45" />
          <rect
            x="86"
            y="66"
            width="108"
            height="108"
            transform="rotate(45 140 120)"
            stroke="#F4F0E5"
            strokeOpacity="0.4"
          />
        </g>
      )}

      {type === "meridian" && (
        <g stroke="#C6A96B" strokeWidth="1.1">
          <circle cx="140" cy="120" r="80" strokeOpacity="0.55" />
          <ellipse cx="140" cy="120" rx="42" ry="80" strokeOpacity="0.45" />
          <ellipse cx="140" cy="120" rx="80" ry="34" stroke="#F4F0E5" strokeOpacity="0.35" />
          <line x1="50" y1="120" x2="230" y2="120" strokeOpacity="0.4" />
        </g>
      )}

      {type === "bars" && (
        <g stroke="#C6A96B" strokeWidth="1.2">
          <line x1="65" y1="185" x2="215" y2="185" strokeOpacity="0.5" />
          <rect x="75" y="135" width="22" height="50" strokeOpacity="0.6" />
          <rect x="110" y="105" width="22" height="80" stroke="#F4F0E5" strokeOpacity="0.5" />
          <rect x="145" y="80" width="22" height="105" strokeOpacity="0.7" />
          <rect x="180" y="60" width="22" height="125" stroke="#F4F0E5" strokeOpacity="0.65" />
        </g>
      )}

      {type === "compass" && (
        <g stroke="#C6A96B" strokeWidth="1.1">
          <circle cx="140" cy="120" r="78" strokeDasharray="4 6" strokeOpacity="0.55" />
          <circle cx="140" cy="120" r="48" strokeOpacity="0.45" />
          <polygon
            points="140,42 152,120 140,198 128,120"
            stroke="#F4F0E5"
            strokeOpacity="0.55"
          />
          <polygon
            points="62,120 140,108 218,120 140,132"
            strokeOpacity="0.55"
          />
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
      className="relative bg-[#F4F0E5] text-[#102D25] py-24 lg:py-32 border-b border-[#102D25]/10"
    >
      {/* Vertical Architectural Grid Columns (inspired by 00:07–00:08) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-2 lg:grid-cols-4"
      >
        <div className="border-l border-[#102D25]/8 h-full" />
        <div className="border-l border-[#102D25]/8 h-full" />
        <div className="hidden lg:block border-l border-[#102D25]/8 h-full" />
        <div className="hidden lg:block border-l border-r border-[#102D25]/8 h-full" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          data-gsap-reveal="headline"
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-5">
              <span className="w-8 h-px bg-[#C6A96B]" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#103B2F]">
                Our Services
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.08] text-[#102D25] text-balance">
              Precision Intelligence for Principled Capital.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#102D25]/75 max-w-md leading-relaxed">
            Four interconnected disciplines designed to bring analytical clarity, Shariah
            transparency, and financial literacy to international investing.
          </p>
        </div>

        {/* 4-Column Architectural Gallery Strip with Inset Corner Content Panels (inspired by 00:07–00:08) */}
        <div
          data-gsap-stagger-group
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 mb-14"
        >
          {SERVICE_COLUMNS.map((service, index) => {
            const isSelected = activeCard === index;
            return (
              <article
                key={service.num}
                data-gsap-stagger-item
                onMouseEnter={() => setActiveCard(index)}
                className="group relative flex flex-col justify-between min-h-[430px] border border-[#102D25]/15 bg-[#FFFFFF] overflow-hidden transition-transform duration-200 hover:-translate-y-1"
              >
                {/* Upper Geometric Graphic Field */}
                <div
                  className={`relative h-56 bg-gradient-to-br ${service.bgClass} overflow-hidden`}
                >
                  <ServiceArtwork type={service.patternType} />
                  <span className="absolute top-4 left-5 font-mono text-xs tracking-[0.2em] text-[#C6A96B] tabular-nums">
                    {service.num}
                  </span>
                  {isSelected && (
                    <motion.span
                      layoutId="service-column-highlight"
                      transition={{ type: "spring", stiffness: 360, damping: 32 }}
                      className="absolute top-0 inset-x-0 h-0.5 bg-[#C6A96B]"
                    />
                  )}
                </div>

                {/* Inset Corner Content Panel (overlapping cleanly into graphic lower-right) */}
                <div className="relative -mt-12 ml-6 bg-[#FFFFFF] border-t border-l border-[#102D25]/12 p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#103B2F] mb-2">
                      {service.tag}
                    </p>
                    <h3 className="font-serif text-2xl font-medium text-[#102D25] leading-snug mb-3">
                      {service.title}
                    </h3>
                    <p className="text-sm text-[#102D25]/75 leading-relaxed mb-6">
                      {service.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#102D25]/10 flex items-center justify-between">
                    <a
                      href={service.actionHref}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#103B2F] hover:text-[#C6A96B] transition-colors"
                    >
                      <span>{service.actionLabel}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Educational Screening Methodology Reference Panel */}
        <div
          id="shariah-methodology-ref"
          data-gsap-reveal="container"
          className="bg-[#103B2F] text-[#F4F0E5] border border-[#102D25] p-8 sm:p-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-white/15">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#C6A96B] mb-1">
                01. Shariah Stock Screening Reference
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#FFFFFF]">
                Two-Stage Islamic Screening Framework
              </h3>
            </div>

            <div className="inline-flex bg-[#102D25] p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setScreeningStage("qualitative")}
                className={`px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  screeningStage === "qualitative"
                    ? "bg-[#C6A96B] text-[#102D25]"
                    : "text-[#F4F0E5]/75 hover:text-[#F4F0E5]"
                }`}
              >
                Business Screening
              </button>
              <button
                type="button"
                onClick={() => setScreeningStage("quantitative")}
                className={`px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  screeningStage === "quantitative"
                    ? "bg-[#C6A96B] text-[#102D25]"
                    : "text-[#F4F0E5]/75 hover:text-[#F4F0E5]"
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
                  <p className="font-medium text-[#FFFFFF] mb-1.5">Core Activity Evaluation</p>
                  <p className="text-[#E8EBE7]/80 leading-relaxed">
                    Reviews primary revenue streams against non-permissible industries such as
                    conventional interest-based banking and prohibited sectors.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-[#FFFFFF] mb-1.5">Disclosure Transparency</p>
                  <p className="text-[#E8EBE7]/80 leading-relaxed">
                    Maps audited corporate segment filings so investors understand the source of
                    company earnings.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-[#FFFFFF] mb-1.5">Continuous Review Cadence</p>
                  <p className="text-[#E8EBE7]/80 leading-relaxed">
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
                  <p className="font-mono text-2xl text-[#C6A96B] tabular-nums mb-1.5">&lt; 30%</p>
                  <p className="text-[#E8EBE7]/85 leading-relaxed">
                    Conventional interest-bearing debt relative to trailing market capitalization
                    benchmark.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-2xl text-[#C6A96B] tabular-nums mb-1.5">&lt; 30%</p>
                  <p className="text-[#E8EBE7]/85 leading-relaxed">
                    Interest-bearing deposits and liquid securities threshold reference.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-2xl text-[#C6A96B] tabular-nums mb-1.5">&lt; 5%</p>
                  <p className="text-[#E8EBE7]/85 leading-relaxed">
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
