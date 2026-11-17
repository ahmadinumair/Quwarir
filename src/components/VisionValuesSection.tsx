import React from "react";

const MISSION_ITEMS = [
  "Simplify access to global Islamic investment opportunities.",
  "Provide transparent and reliable financial information.",
  "Promote responsible wealth management.",
  "Combine innovation with Islamic financial principles.",
  "Improve financial literacy worldwide.",
];

const CORE_VALUES = [
  {
    index: "01",
    title: "Integrity",
    description:
      "Maintaining honesty and transparency across every financial insight, screening framework, and corporate disclosure.",
  },
  {
    index: "02",
    title: "Trust",
    description:
      "Building long-term institutional relationships grounded in consistent methodology and clear communication.",
  },
  {
    index: "03",
    title: "Innovation",
    description:
      "Using modern financial technology to remove complexity and improve cross-border accessibility.",
  },
  {
    index: "04",
    title: "Ethical Investment",
    description:
      "Promoting responsible investment aligned with enduring Islamic financial principles.",
  },
];

export function VisionValuesSection() {
  return (
    <>
      {/* SECTION 06 — VISION AND MISSION */}
      <section
        id="vision"
        className="bg-[#235347] text-[#DAF1DE] py-24 lg:py-32 border-b border-[#8EB69B]/20"
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Vision Statement */}
            <div data-gsap-reveal="headline" className="lg:col-span-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#8EB69B]" aria-hidden="true" />
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#8EB69B]">
                  Our Vision
                </span>
              </div>

              <blockquote className="font-serif text-[clamp(2rem,3.6vw,3.15rem)] font-medium leading-[1.15] text-[#DAF1DE] text-balance">
                &ldquo;To become a trusted global financial technology company that empowers people
                to build wealth through ethical and Shariah-conscious investments.&rdquo;
              </blockquote>

              <p className="mt-8 text-xs uppercase tracking-[0.2em] text-[#8EB69B]">
                Invest Globally. Invest Ethically.
              </p>
            </div>

            {/* Mission Commitments */}
            <div data-gsap-reveal="container" className="lg:col-span-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#8EB69B]" aria-hidden="true" />
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#8EB69B]">
                  Our Mission
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

      {/* SECTION 07 — OUR VALUES (Frosted Dark-Emerald Glass Cards inspired by Image 3) */}
      <section
        id="values"
        className="relative bg-[#0B2B26] text-[#DAF1DE] py-24 lg:py-28 border-b border-[#8EB69B]/15 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] rounded-full bg-[#235347]/40 blur-3xl"
        />

        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
          <div data-gsap-reveal="headline" className="max-w-2xl mb-14">
            <div className="flex items-center gap-4 mb-5">
              <span className="w-8 h-px bg-[#8EB69B]" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#8EB69B]">
                Our Values
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2.25rem,4vw,3.35rem)] font-medium leading-[1.08] text-[#DAF1DE]">
              Foundations of Institutional Stewardship.
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
                  <span className="font-mono text-xs tracking-[0.2em] text-[#8EB69B] block mb-4 tabular-nums">
                    {val.index}
                  </span>
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
