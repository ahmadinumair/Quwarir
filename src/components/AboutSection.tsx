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
    <section id="about" className="bg-[#F4F0E5] text-[#102D25] py-24 lg:py-32 border-b border-[#102D25]/10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div
          data-gsap-reveal="headline"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 lg:mb-20 items-end"
        >
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-5">
              <span className="w-8 h-px bg-[#103B2F]" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#103B2F]">
                About QUWARIR
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.08] text-[#102D25] text-balance">
              Redefining the Future of Islamic Investing.
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-base sm:text-lg text-[#102D25]/80 leading-relaxed">
              QUWARIR is a future-oriented financial technology company focused on connecting global
              investment opportunities with Islamic financial principles.
            </p>
          </div>
        </div>

        {/* Asymmetrical Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          {/* Architectural Photography */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div
              data-gsap-reveal="image"
              className="relative h-full min-h-[360px] lg:min-h-[480px] bg-[#103B2F] overflow-hidden border border-[#102D25]/15"
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
                <div className="w-full h-full flex items-center justify-center p-12 bg-[#103B2F] text-[#F4F0E5]">
                  <p className="font-serif text-3xl text-center">
                    Bridging Islamic Principles &amp; Global Capital Markets
                  </p>
                </div>
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#102D25]/80 to-transparent"
              />
              <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-xs tracking-wider uppercase text-[#F4F0E5]">
                <span>Institutional Architecture</span>
                <span className="text-[#C6A96B]">Riyadh · Global</span>
              </div>
            </div>
          </div>

          {/* Editorial Pillars */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div
              data-gsap-stagger-group
              className="divide-y divide-[#102D25]/15 border-t border-b border-[#102D25]/15"
            >
              {ABOUT_PILLARS.map((pillar) => (
                <div
                  key={pillar.index}
                  data-gsap-stagger-item
                  className="py-7 first:pt-6 last:pb-6 grid grid-cols-12 gap-4 items-start"
                >
                  <div className="col-span-2 sm:col-span-2 font-mono text-xs tracking-widest text-[#103B2F] pt-1 tabular-nums">
                    {pillar.index}
                  </div>
                  <div className="col-span-10 sm:col-span-10">
                    <h3 className="font-serif text-2xl font-medium text-[#102D25] mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#102D25]/75 leading-relaxed">
                      {pillar.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
