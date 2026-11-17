import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { IslamicStarLatticeBg, KhatamRosette } from "./IslamicOrnaments";

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
    tag: "Halal Discipline · الشريعة",
    title: "Shariah Stock Screening",
    summary:
      "Helping investors evaluate global equities against Islamic qualitative exclusions and quantitative financial thresholds.",
    actionLabel: "Methodology",
    actionHref: "#shariah-methodology-ref",
    patternType: "octagram",
  },
  {
    num: "02",
    tag: "Cross-Border · الأسواق",
    title: "Global Market Insights",
    summary:
      "Providing structured research and context across Saudi Exchange (Tadawul), US markets, and international exchanges.",
    actionLabel: "Markets",
    actionHref: "#markets",
    patternType: "meridian",
  },
  {
    num: "03",
    tag: "Bayan Data · التحليلات",
    title: "Investment Analytics",
    summary:
      "Offering company profiles, debt-ratio disclosures, and fundamental performance data free of ambiguity.",
    actionLabel: "Research Desk",
    actionHref: "#ecosystem",
    patternType: "bars",
  },
  {
    num: "04",
    tag: "Ilm & Stewardship · التعليم",
    title: "Islamic Financial Education",
    summary:
      "Providing educational resources on Fiqh al-Muamalat, Halal investing, and purification (Tathir) principles.",
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
        <g stroke="#DAF1DE" strokeWidth="1.45">
          {/* Classic Rub el Hizb Khatam geometry */}
          <circle cx="90" cy="90" r="68" stroke="#8EB69B" strokeOpacity="0.6" />
          <rect x="44" y="44" width="92" height="92" strokeOpacity="0.85" />
          <rect
            x="44"
            y="44"
            width="92"
            height="92"
            transform="rotate(45 90 90)"
            stroke="#DAF1DE"
            strokeOpacity="0.7"
          />
          <polygon
            points="90,56 114,66 124,90 114,114 90,124 66,114 56,90 66,66"
            stroke="#8EB69B"
            strokeOpacity="0.85"
          />
          <circle cx="90" cy="90" r="6" fill="#DAF1DE" fillOpacity="0.85" />
        </g>
      )}

      {type === "meridian" && (
        <g stroke="#DAF1DE" strokeWidth="1.45">
          {/* Classical Islamic Celestial Astrolabe */}
          <circle cx="90" cy="90" r="66" strokeOpacity="0.85" />
          <circle cx="90" cy="90" r="56" stroke="#8EB69B" strokeDasharray="3 5" strokeOpacity="0.75" />
          <ellipse cx="90" cy="90" rx="34" ry="66" stroke="#8EB69B" strokeOpacity="0.8" />
          <ellipse cx="90" cy="90" rx="66" ry="26" strokeOpacity="0.55" />
          <path d="M90 16 L90 24 M90 156 L90 164 M16 90 L24 90 M156 90 L164 90" stroke="#DAF1DE" />
          <circle cx="90" cy="20" r="4.5" stroke="#DAF1DE" />
          <circle cx="90" cy="90" r="4" fill="#8EB69B" />
        </g>
      )}

      {type === "bars" && (
        <g stroke="#DAF1DE" strokeWidth="1.45">
          {/* Stepped Islamic Pointed Mihrab Arch Pillars */}
          <line x1="26" y1="142" x2="154" y2="142" stroke="#8EB69B" strokeOpacity="0.8" />
          <path d="M36 142 V108 Q36 96 46 90 Q56 96 56 108 V142" strokeOpacity="0.75" />
          <path d="M64 142 V88 Q64 74 75 68 Q86 74 86 88 V142" stroke="#8EB69B" strokeOpacity="0.95" />
          <path d="M94 142 V70 Q94 56 105 50 Q116 56 116 70 V142" strokeOpacity="0.9" />
          <path d="M124 142 V54 Q124 38 135 32 Q146 38 146 54 V142" stroke="#DAF1DE" />
          <polygon points="135,24 138,28 135,32 132,28" fill="#DAF1DE" />
        </g>
      )}

      {type === "compass" && (
        <g stroke="#DAF1DE" strokeWidth="1.45">
          {/* 8-Fold Islamic Shamsa Sunburst Star */}
          <circle cx="90" cy="90" r="64" strokeDasharray="4 6" stroke="#8EB69B" />
          <polygon points="90,26 101,79 154,90 101,101 90,154 79,101 26,90 79,79" stroke="#DAF1DE" />
          <polygon
            points="90,42 98,82 138,90 98,98 90,138 82,98 42,90 82,82"
            transform="rotate(45 90 90)"
            stroke="#8EB69B"
          />
          <circle cx="90" cy="90" r="10" stroke="#DAF1DE" />
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
      className="relative bg-[#235347] text-[#DAF1DE] py-24 lg:py-32 border-b border-[#8EB69B]/20 overflow-hidden"
    >
      {/* Carved Islamic Girih lattice over the mid-forest band */}
      <IslamicStarLatticeBg opacity={0.065} strokeColor="#DAF1DE" />

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          data-gsap-reveal="headline"
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-14"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <KhatamRosette className="w-4 h-4 text-[#8EB69B]" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#8EB69B]">
                Core Disciplines
              </span>
              <span aria-hidden="true" className="text-[#8EB69B]/60">·</span>
              <span lang="ar" dir="rtl" className="text-sm text-[#DAF1DE]/80">
                الخدمات الأساسية
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2.75rem,5.5vw,4.75rem)] font-medium leading-none text-[#DAF1DE]">
              Our Services
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#DAF1DE]/85 max-w-md leading-relaxed">
              Four foundational pillars uniting Islamic jurisprudence (Fiqh al-Muamalat) with modern
              global investment intelligence.
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

        {/* 4 Circular-Halo Islamic Geometric Service Spotlights */}
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
                className="group cursor-pointer flex flex-col items-center text-center p-6 rounded-2xl transition-colors duration-200 hover:bg-[#163832]/55"
              >
                {/* Circular Medallion Backdrop */}
                <div
                  className={`relative w-44 h-44 rounded-full flex items-center justify-center mb-6 transition-all duration-200 ${
                    isSelected
                      ? "bg-[#8EB69B]/30 ring-1 ring-[#DAF1DE]/65"
                      : "bg-[#8EB69B]/18 group-hover:bg-[#8EB69B]/26"
                  }`}
                >
                  <span className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.2em] text-[#DAF1DE]/85 tabular-nums">
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
                <p className="text-sm text-[#DAF1DE]/85 leading-relaxed mb-5">
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
              <div className="flex items-center gap-2.5 mb-1.5">
                <KhatamRosette className="w-3.5 h-3.5 text-[#8EB69B]" />
                <p className="text-xs uppercase tracking-[0.2em] text-[#8EB69B]">
                  01. Shariah Stock Screening Reference · AAOIFI-Aligned Framework
                </p>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#DAF1DE]">
                Two-Stage Islamic Screening &amp; Tathir Methodology
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
                Halal Business Screening
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
                Riba &amp; Financial Ratios
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
                  <p className="font-medium text-[#DAF1DE] mb-1.5">Haram Sector Exclusion</p>
                  <p className="text-[#8EB69B] leading-relaxed">
                    Excludes primary revenue from conventional interest banking (Riba), speculative
                    wagering (Maysir), and prohibited goods under Islamic commercial ethics.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-[#DAF1DE] mb-1.5">Bayan &amp; Disclosure Clarity</p>
                  <p className="text-[#8EB69B] leading-relaxed">
                    Maps audited corporate segment filings so investors uphold clear contractual
                    transparency (free from Gharar).
                  </p>
                </div>
                <div>
                  <p className="font-medium text-[#DAF1DE] mb-1.5">Periodic Shariah Review</p>
                  <p className="text-[#8EB69B] leading-relaxed">
                    Maintains quarterly and annual financial statement re-evaluation as corporate
                    revenue lines evolve.
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
                    Conventional interest-bearing (Riba) debt relative to trailing market
                    capitalization benchmark.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-2xl text-[#DAF1DE] tabular-nums mb-1.5">&lt; 30%</p>
                  <p className="text-[#8EB69B] leading-relaxed">
                    Interest-bearing cash deposits and non-Shariah liquid securities ceiling.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-2xl text-[#DAF1DE] tabular-nums mb-1.5">&lt; 5%</p>
                  <p className="text-[#8EB69B] leading-relaxed">
                    Maximum incidental non-permissible revenue requiring charitable dividend
                    purification (Tathir).
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
