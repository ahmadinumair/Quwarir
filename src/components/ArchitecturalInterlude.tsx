import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { QuwarirMark } from "./QuwarirLogo";

gsap.registerPlugin(ScrollTrigger);

export function ArchitecturalInterlude() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLDivElement | null>(null);
  const leftTextRef = useRef<HTMLDivElement | null>(null);
  const rightTextRef = useRef<HTMLDivElement | null>(null);
  const ringsRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (leftTextRef.current) {
        gsap.fromTo(
          leftTextRef.current,
          { x: -32, opacity: 0.35, filter: "blur(4px)" },
          {
            x: 0,
            opacity: 1,
            filter: "blur(0px)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              end: "center 52%",
              scrub: 0.7,
            },
          }
        );
      }

      if (rightTextRef.current) {
        gsap.fromTo(
          rightTextRef.current,
          { x: 32, opacity: 0.35, filter: "blur(4px)" },
          {
            x: 0,
            opacity: 1,
            filter: "blur(0px)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              end: "center 52%",
              scrub: 0.7,
            },
          }
        );
      }

      if (sealRef.current) {
        gsap.fromTo(
          sealRef.current,
          { rotate: -20, scale: 0.94 },
          {
            rotate: 20,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );
      }

      if (ringsRef.current) {
        gsap.to(ringsRef.current, {
          rotate: 360,
          duration: 120,
          repeat: -1,
          ease: "none",
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      aria-label="QUWARIR Architectural Manifesto"
      className="relative bg-[#0B2B26] text-[#DAF1DE] py-20 lg:py-28 border-b border-[#8EB69B]/15 overflow-hidden"
    >
      {/* Continuous 4-Column Architectural Hairline Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-2 lg:grid-cols-4"
      >
        <div className="border-l border-[#8EB69B]/10 h-full" />
        <div className="border-l border-[#8EB69B]/10 h-full" />
        <div className="hidden lg:block border-l border-[#8EB69B]/10 h-full" />
        <div className="hidden lg:block border-l border-r border-[#8EB69B]/10 h-full" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center text-center">
          <p className="font-serif italic text-sm sm:text-base text-[#8EB69B] mb-10">
            (The Principle of Purposeful Capital)
          </p>

          {/* Split Monumental Statement + Clean Centered Hexagonal QUWARIR Emblem */}
          <div className="relative w-full py-6 lg:py-12 flex flex-col items-center justify-center">
            {/* Clean Concentric Geometric Frame & Centered Seal (no circling text) */}
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center mb-10 lg:mb-0 lg:absolute lg:inset-0 lg:m-auto pointer-events-none">
              <svg
                ref={ringsRef}
                viewBox="0 0 240 240"
                className="w-full h-full opacity-45"
                aria-hidden="true"
              >
                <circle
                  cx="120"
                  cy="120"
                  r="112"
                  fill="none"
                  stroke="#8EB69B"
                  strokeWidth="0.75"
                  strokeDasharray="3 8"
                />
                <circle
                  cx="120"
                  cy="120"
                  r="90"
                  fill="none"
                  stroke="#DAF1DE"
                  strokeWidth="0.6"
                  strokeOpacity="0.35"
                />
              </svg>

              {/* Inner Rotating Emerald Hexagonal Q Seal */}
              <div
                ref={sealRef}
                className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#163832] border border-[#8EB69B]/55 flex items-center justify-center shadow-xl"
              >
                <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full border border-[#DAF1DE]/25 flex items-center justify-center">
                  <QuwarirMark className="w-11 h-11" variant="mint-on-dark" />
                </div>
              </div>
            </div>

            {/* Split Converging Typography */}
            <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-y-4 lg:gap-x-60 items-center">
              <div ref={leftTextRef} className="lg:text-right">
                <p className="font-serif text-[clamp(1.85rem,3.2vw,3rem)] leading-[1.08] tracking-tight text-[#DAF1DE]">
                  CAPITAL IS NOT ONLY
                  <br />
                  WHAT MARKETS MEASURE.
                </p>
              </div>
              <div ref={rightTextRef} className="lg:text-left">
                <p className="font-serif text-[clamp(1.85rem,3.2vw,3rem)] leading-[1.08] tracking-tight text-[#8EB69B]">
                  IT IS THE INTEGRITY
                  <br />
                  THAT REMAINS.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 lg:mt-16 flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-[0.22em] text-[#8EB69B]">
            <span>Invest Globally</span>
            <span aria-hidden="true" className="text-[#DAF1DE]">·</span>
            <span>Invest Ethically</span>
          </div>
        </div>
      </div>
    </section>
  );
}
