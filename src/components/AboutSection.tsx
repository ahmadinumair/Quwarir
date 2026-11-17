import React, { useState } from "react";

const ABOUT_PILLARS = [
  {
    index: "01",
    title: "Company Background",
    detail:
      "Founded as a modern financial technology institution, QUWARIR bridges institutional market intelligence with enduring Islamic finance scholarship.",
  },
  {
    index: "02",
    title: "Purpose & Direction",
    detail:
      "We remove geographical and informational complexity so Muslim and ethical investors worldwide can explore international equity markets with confidence.",
  },
  {
    index: "03",
    title: "Commitment to Transparency",
    detail:
      "Every screening methodology, financial metric, and educational brief is structured around verifiable corporate disclosures rather than opaque claims.",
  },
  {
    index: "04",
    title: "Long-Term Vision",
    detail:
      "Building enduring global financial infrastructure where principled capital allocation and modern analytics operate side by side.",
  },
];

export function AboutSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="about"
      className="relative bg-[#051F20] text-[#DAF1DE] py-24 lg:py-32 border-b border-[#8EB69B]/15 overflow-hidden"
    >
      {/* Subtle radial atmospheric depth behind frosted cards (no watermark text) */}
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
            <div className="flex items-center gap-4 mb-5">
              <span className="w-8 h-px bg-[#8EB69B]" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#8EB69B]">
                About QUWARIR
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.08] text-[#DAF1DE] text-balance">
              Redefining the Future of Islamic Investing.
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-base sm:text-lg text-[#DAF1DE]/80 leading-relaxed">
              QUWARIR is a future-oriented financial technology company focused on connecting global
              investment opportunities with Islamic financial principles.
            </p>
          </div>
        </div>

        {/* Asymmetrical Split: Architectural Photo + Frosted Glassmorphic Cards (Image 3 aesthetic) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Architectural Photography */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div
              data-gsap-reveal="image"
              className="relative h-full min-h-[380px] lg:min-h-[500px] rounded-2xl bg-[#0B2B26] overflow-hidden border border-[#8EB69B]/25"
            >
              {!imgError ? (
                <img
                  src="/src/assets/images/about_architecture_1794885510890.jpg"
                  alt="Modern Saudi Arabian financial district architecture at golden hour"
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
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#051F20]/90 to-transparent"
              />
              <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-xs tracking-wider uppercase text-[#DAF1DE]">
                <span>Institutional Architecture</span>
                <span className="text-[#8EB69B]">Riyadh · Global</span>
              </div>
            </div>
          </div>

          {/* 2x2 Frosted Glassmorphic Pillar Grid */}
          <div
            data-gsap-stagger-group
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {ABOUT_PILLARS.map((pillar) => (
              <div
                key={pillar.index}
                data-gsap-stagger-item
                className="rounded-2xl bg-[#163832]/55 backdrop-blur-md border border-[#8EB69B]/20 p-7 sm:p-8 flex flex-col justify-between hover:border-[#8EB69B]/45 transition-colors duration-200"
              >
                <div>
                  <span className="font-mono text-xs tracking-widest text-[#8EB69B] block mb-4 tabular-nums">
                    {pillar.index}
                  </span>
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
