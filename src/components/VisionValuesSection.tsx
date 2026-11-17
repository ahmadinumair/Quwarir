import React from "react";
import {
  KhatamRosette,
  MashrabiyaBandBorder,
  IslamicStarLatticeBg,
} from "./IslamicOrnaments";

const MISSION_ITEMS = [
  "Simplify access to global Shariah-compliant investment opportunities.",
  "Provide transparent (Bayan) and reliable financial disclosures.",
  "Promote responsible wealth stewardship grounded in Amanah.",
  "Combine financial innovation with enduring Islamic investment principles.",
  "Improve global literacy in Fiqh al-Muamalat and ethical investing.",
];

const CORE_VALUES = [
  {
    index: "01",
    arabicTerm: "الأمانة · Amanah",
    title: "Integrity",
    description:
      "Maintaining honesty and trustworthiness across every financial insight, screening framework, and corporate disclosure.",
  },
  {
    index: "02",
    arabicTerm: "الصدق والبيان · Sidq",
    title: "Trust",
    description:
      "Building long-term institutional relationships grounded in consistent Shariah methodology and clear communication.",
  },
  {
    index: "03",
    arabicTerm: "الإحسان · Ihsan",
    title: "Innovation",
    description:
      "Pursuing excellence through modern financial technology to remove complexity and improve cross-border accessibility.",
  },
  {
    index: "04",
    arabicTerm: "مقاصد الشريعة · Maqasid",
    title: "Ethical Investment",
    description:
      "Promoting purposeful wealth stewardship aligned with timeless Islamic financial ethics and Halal integrity.",
  },
];

export function VisionValuesSection() {
  return (
    <>
      {/* SECTION 06 — VISION AND MISSION */}
      <section
        id="vision"
        className="relative bg-[#235347] text-[#DAF1DE] py-24 lg:py-32 border-b border-[#8EB69B]/20 overflow-hidden"
      >
        {/* Subtle 16-fold Islamic Shamsa Mandala Geometry */}
        <svg
          aria-hidden="true"
          viewBox="0 0 400 400"
          fill="none"
          className="pointer-events-none absolute -left-24 top-1/2 -translate-y-1/2 w-[520px] h-[520px] opacity-15"
        >
          <circle cx="200" cy="200" r="188" stroke="#DAF1DE" strokeWidth="0.9" strokeDasharray="4 8" />
          <circle cx="200" cy="200" r="142" stroke="#8EB69B" strokeWidth="0.9" />
          <rect x="70" y="70" width="260" height="260" stroke="#DAF1DE" strokeWidth="0.8" />
          <rect
            x="70"
            y="70"
            width="260"
            height="260"
            transform="rotate(45 200 200)"
            stroke="#DAF1DE"
            strokeWidth="0.8"
          />
          <rect
            x="92"
            y="92"
            width="216"
            height="216"
            transform="rotate(22.5 200 200)"
            stroke="#8EB69B"
            strokeWidth="0.7"
          />
          <rect
            x="92"
            y="92"
            width="216"
            height="216"
            transform="rotate(67.5 200 200)"
            stroke="#8EB69B"
            strokeWidth="0.7"
          />
        </svg>

        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Vision Statement */}
            <div data-gsap-reveal="headline" className="lg:col-span-6">
              <div className="flex items-center gap-3 mb-6">
                <KhatamRosette className="w-4 h-4 text-[#8EB69B]" />
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#8EB69B]">
                  Our Vision
                </span>
                <span aria-hidden="true" className="text-[#8EB69B]/60">·</span>
                <span lang="ar" dir="rtl" className="text-sm text-[#DAF1DE]/80">
                  رؤيتنا
                </span>
              </div>

              <blockquote className="font-serif text-[clamp(2rem,3.6vw,3.15rem)] font-medium leading-[1.15] text-[#DAF1DE] text-balance">
                &ldquo;To become a trusted global financial technology company that empowers people
                to build wealth through ethical and Shariah-conscious investments.&rdquo;
              </blockquote>

              <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#8EB69B]">
                <KhatamRosette className="w-3.5 h-3.5 text-[#DAF1DE]" />
                <span>Invest Globally. Invest Ethically.</span>
              </div>
            </div>

            {/* Mission Commitments */}
            <div data-gsap-reveal="container" className="lg:col-span-6">
              <div className="flex items-center gap-3 mb-6">
                <KhatamRosette className="w-4 h-4 text-[#8EB69B]" />
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#8EB69B]">
                  Our Mission
                </span>
                <span aria-hidden="true" className="text-[#8EB69B]/60">·</span>
                <span lang="ar" dir="rtl" className="text-sm text-[#DAF1DE]/80">
                  رسالتنا
                </span>
              </div>

              <ol
                data-gsap-stagger-group
                className="divide-y divide-[#8EB69B]/25 border-t border-b border-[#8EB69B]/25"
              >
                {MISSION_ITEMS.map((item, idx) => (
                  <li
                    key={item}
                    data-gsap-stagger-item
                    className="py-5 flex items-baseline gap-6"
                  >
                    <span className="font-mono text-xs tracking-widest text-[#8EB69B] tabular-nums shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="text-base sm:text-lg text-[#DAF1DE] leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 07 — OUR VALUES */}
      <section
        id="values"
        className="relative bg-[#0B2B26] text-[#DAF1DE] pb-24 lg:pb-28 border-b border-[#8EB69B]/15 overflow-hidden"
      >
        <MashrabiyaBandBorder className="mb-20" strokeColor="#8EB69B" />
        <IslamicStarLatticeBg opacity={0.045} strokeColor="#8EB69B" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] rounded-full bg-[#235347]/40 blur-3xl"
        />

        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
          <div data-gsap-reveal="headline" className="max-w-2xl mb-14">
            <div className="flex items-center gap-3 mb-5">
              <KhatamRosette className="w-4 h-4 text-[#8EB69B]" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#8EB69B]">
                Our Values
              </span>
              <span aria-hidden="true" className="text-[#8EB69B]/60">·</span>
              <span lang="ar" dir="rtl" className="text-sm text-[#DAF1DE]/80">
                قيمنا الإسلامية
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2.25rem,4vw,3.35rem)] font-medium leading-[1.08] text-[#DAF1DE]">
              Foundations of Islamic Institutional Stewardship.
            </h2>
          </div>

          <div
            data-gsap-stagger-group
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {CORE_VALUES.map((val) => (
              <div
                key={val.title}
                data-gsap-stagger-item
                className="rounded-2xl bg-[#163832]/55 backdrop-blur-md border border-[#8EB69B]/22 p-7 sm:p-8 flex flex-col justify-between hover:border-[#8EB69B]/45 transition-colors duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="font-mono text-xs tracking-[0.16em] text-[#8EB69B] tabular-nums">
                      {val.index}
                    </span>
                    <KhatamRosette className="w-4 h-4 text-[#8EB69B]/55" filledCenter={false} />
                  </div>
                  <p className="text-xs font-medium text-[#8EB69B] mb-2">
                    {val.arabicTerm}
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#DAF1DE] mb-3">
                    {val.title}
                  </h3>
                  <p className="text-sm text-[#DAF1DE]/80 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
