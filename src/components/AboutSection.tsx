import React, { useState } from "react";
import { IslamicArchFrame, KhatamRosette } from "./IslamicOrnaments";

const ABOUT_PILLARS = [
  {
    index: "01",
    arabicPrinciple: "الأمانة · Amanah",
    title: "Company Background",
    detail:
      "Founded as a modern financial technology institution, QUWARIR bridges institutional market intelligence with enduring Islamic finance scholarship and responsible stewardship.",
  },
  {
    index: "02",
    arabicPrinciple: "مقاصد الشريعة · Maqasid",
    title: "Purpose & Direction",
    detail:
      "We remove geographical and informational complexity so Muslim and ethical investors worldwide can explore international equity markets aligned with Halal boundaries.",
  },
  {
    index: "03",
    arabicPrinciple: "البيان · Bayan",
    title: "Commitment to Transparency",
    detail:
      "Every screening methodology, financial metric, and educational brief is structured around verifiable corporate disclosures—upholding clarity free from opaque speculation (Gharar).",
  },
  {
    index: "04",
    arabicPrinciple: "الاستدامة · Istidamah",
    title: "Long-Term Vision",
    detail:
      "Building enduring global financial infrastructure where principled Islamic capital allocation and modern analytics operate harmoniously across generations.",
  },
];

export function AboutSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="about"
      className="relative bg-[#051F20] text-[#DAF1DE] py-24 lg:py-32 border-b border-[#8EB69B]/15 overflow-hidden"
    >
      {/* Subtle radial atmospheric depth behind frosted cards */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full bg-[#235347]/35 blur-3xl"
      />

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div
          data-gsap-reveal="headline"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 lg:mb-20 items-end"
        >
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-5">
              <KhatamRosette className="w-4 h-4 text-[#8EB69B]" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#8EB69B]">
                About QUWARIR
              </span>
              <span aria-hidden="true" className="text-[#8EB69B]/60">·</span>
              <span lang="ar" dir="rtl" className="text-sm text-[#DAF1DE]/80">
                عن قوارير
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.08] text-[#DAF1DE] text-balance">
              Redefining the Future of Islamic Investing.
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-base sm:text-lg text-[#DAF1DE]/80 leading-relaxed">
              QUWARIR is a future-oriented financial technology company focused on connecting global
              investment opportunities with timeless Islamic financial principles.
            </p>
          </div>
        </div>

        {/* Asymmetrical Split: Pointed Islamic Arch Architectural Photo + Frosted Glassmorphic Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Pointed Islamic Arch Photography */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div
              data-gsap-reveal="image"
              className="h-full min-h-[420px] lg:min-h-[520px]"
            >
              <IslamicArchFrame className="w-full h-full">
                {!imgError ? (
                  <img
                    src="/src/assets/images/about_architecture_1794885510890.jpg"
                    alt="Modern Saudi Arabian financial district architecture framed in a pointed Islamic arch at golden hour"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-12 bg-[#163832] text-[#DAF1DE]">
                    <p className="font-serif text-3xl text-center">
                      Bridging Islamic Principles &amp; Global Capital Markets
                    </p>
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#051F20]/95 via-[#051F20]/50 to-transparent"
                />
                <div className="absolute bottom-6 left-7 right-7 flex items-center justify-between text-xs tracking-wider uppercase text-[#DAF1DE]">
                  <span>Islamic Financial Architecture</span>
                  <span className="text-[#8EB69B]">Riyadh · Global</span>
                </div>
              </IslamicArchFrame>
            </div>
          </div>

          {/* 2x2 Frosted Glassmorphic Pillar Grid with Khatam Corner Ornaments */}
          <div
            data-gsap-stagger-group
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {ABOUT_PILLARS.map((pillar) => (
              <div
                key={pillar.index}
                data-gsap-stagger-item
                className="relative rounded-2xl bg-[#163832]/55 backdrop-blur-md border border-[#8EB69B]/22 p-7 sm:p-8 flex flex-col justify-between hover:border-[#8EB69B]/45 transition-colors duration-200 overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="font-mono text-xs tracking-widest text-[#8EB69B] tabular-nums">
                      {pillar.index} · {pillar.arabicPrinciple}
                    </span>
                    <KhatamRosette className="w-4 h-4 text-[#8EB69B]/45 shrink-0" filledCenter={false} />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#DAF1DE] mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#DAF1DE]/80 leading-relaxed">
                    {pillar.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
