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
        className="bg-[#103B2F] text-[#F4F0E5] py-24 lg:py-32 border-b border-[#C6A96B]/20"
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Vision Statement */}
            <div data-gsap-reveal="headline" className="lg:col-span-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#C6A96B]" aria-hidden="true" />
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#C6A96B]">
                  Our Vision
                </span>
              </div>

              <blockquote className="font-serif text-[clamp(2rem,3.6vw,3.15rem)] font-medium leading-[1.15] text-[#FFFFFF] text-balance">
                &ldquo;To become a trusted global financial technology company that empowers people
                to build wealth through ethical and Shariah-conscious investments.&rdquo;
              </blockquote>

              <p className="mt-8 text-xs uppercase tracking-[0.2em] text-[#C6A96B]">
                Invest Globally. Invest Ethically.
              </p>
            </div>

            {/* Mission Commitments */}
            <div data-gsap-reveal="container" className="lg:col-span-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#C6A96B]" aria-hidden="true" />
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#C6A96B]">
                  Our Mission
                </span>
              </div>

              <ol
                data-gsap-stagger-group
                className="divide-y divide-[#C6A96B]/25 border-t border-b border-[#C6A96B]/25"
              >
                {MISSION_ITEMS.map((item, idx) => (
                  <li
                    key={item}
                    data-gsap-stagger-item
                    className="py-5 flex items-baseline gap-6"
                  >
                    <span className="font-mono text-xs tracking-widest text-[#C6A96B] tabular-nums shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="text-base sm:text-lg text-[#F4F0E5]/95 leading-snug">
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
        className="bg-[#FFFFFF] text-[#102D25] py-24 lg:py-28 border-b border-[#102D25]/10"
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div data-gsap-reveal="headline" className="max-w-2xl mb-16">
            <div className="flex items-center gap-4 mb-5">
              <span className="w-8 h-px bg-[#C6A96B]" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#103B2F]">
                Our Values
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2.25rem,4vw,3.35rem)] font-medium leading-[1.08] text-[#102D25]">
              Foundations of Institutional Stewardship.
            </h2>
          </div>

          <div
            data-gsap-stagger-group
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-[#102D25]/15"
          >
            {CORE_VALUES.map((val) => (
              <div
                key={val.title}
                data-gsap-stagger-item
                className="pt-8 pb-6 sm:pr-8 lg:border-r lg:last:border-r-0 lg:px-8 lg:first:pl-0 border-b lg:border-b-0 border-[#102D25]/15"
              >
                <span className="font-mono text-xs tracking-[0.2em] text-[#C6A96B] block mb-4 tabular-nums">
                  {val.index}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#102D25] mb-3">
                  {val.title}
                </h3>
                <p className="text-sm sm:text-base text-[#102D25]/75 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
