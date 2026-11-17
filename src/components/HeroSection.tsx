import React, { useState, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, Volume2, Square, Loader2 } from "lucide-react";

const HERO_BRIEFING_SCRIPT =
  "Welcome to QUWARIR. Wealth with purpose—a new perspective on global investing. QUWARIR connects modern financial technology with timeless Islamic investment principles to make international markets more accessible, transparent, and ethical.";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const [imgError, setImgError] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Normalized pointer offsets (-0.5 to 0.5) for subtle editorial parallax
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, { stiffness: 110, damping: 24, mass: 0.8 });
  const smoothY = useSpring(pointerY, { stiffness: 110, damping: 24, mass: 0.8 });

  // Multi-plane depth translations (compositor-only x/y)
  const imageX = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);
  const imageY = useTransform(smoothY, [-0.5, 0.5], [-14, 14]);
  const ringX = useTransform(smoothX, [-0.5, 0.5], [10, -10]);
  const ringY = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const captionX = useTransform(smoothX, [-0.5, 0.5], [-5, 5]);
  const captionY = useTransform(smoothY, [-0.5, 0.5], [-4, 4]);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || e.pointerType === "touch") return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(nx);
    pointerY.set(ny);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const handleToggleAudioBriefing = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    setAudioLoading(true);
    setAudioError(null);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: HERO_BRIEFING_SCRIPT,
          style: "Warm, composed, authoritative institutional finance executive",
          voiceName: "Charon",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to synthesize audio briefing.");
      }
      const audioUrl = `data:${data.mimeType || "audio/wav"};base64,${data.audioBase64}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        setAudioError("Audio playback could not be initialized.");
      };
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      setAudioError(err instanceof Error ? err.message : "Audio briefing unavailable.");
    } finally {
      setAudioLoading(false);
    }
  };

  const maskedInitial = prefersReducedMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: "100%" };
  const maskedAnimate = { opacity: 1, y: 0 };

  const fadeInitial = prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 };
  const fadeAnimate = { opacity: 1, y: 0 };

  return (
    <section
      ref={sectionRef}
      id="home"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative bg-gradient-to-br from-[#103B2F] via-[#103B2F] to-[#102D25] text-[#F4F0E5] pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden"
    >
      {/* Subtle architectural hairline frame grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(198,169,107,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(198,169,107,0.08) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />

      {/* Ambient Geometric Meridian Curves (SVG) with subtle counter-parallax */}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 1200 720"
        fill="none"
        style={prefersReducedMotion ? undefined : { x: ringX, y: ringY }}
        className="pointer-events-none absolute -right-24 top-10 w-[860px] h-[540px] opacity-25"
      >
        <motion.circle
          cx="760"
          cy="340"
          r="280"
          stroke="#C6A96B"
          strokeWidth="0.75"
          strokeDasharray="6 10"
          animate={prefersReducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "760px 340px" }}
        />
        <motion.circle
          cx="760"
          cy="340"
          r="210"
          stroke="#F4F0E5"
          strokeWidth="0.5"
          strokeOpacity="0.4"
          animate={prefersReducedMotion ? undefined : { rotate: -360 }}
          transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "760px 340px" }}
        />
      </motion.svg>

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-stretch">
          {/* LEFT COLUMN — Asymmetrical Editorial Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-between py-2 lg:py-6">
            <div>
              {/* Introductory Label (unboxed, zero pills) */}
              <motion.div
                initial={fadeInitial}
                animate={fadeAnimate}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-4 mb-8"
              >
                <span className="w-10 h-px bg-[#C6A96B]" aria-hidden="true" />
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#C6A96B]">
                  Global Islamic Finance
                </span>
              </motion.div>

              {/* Masked Editorial Headline Reveal */}
              <div className="overflow-hidden mb-6">
                <motion.h1
                  initial={maskedInitial}
                  animate={maskedAnimate}
                  transition={{ duration: 0.72, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif text-[clamp(3rem,6vw,5.25rem)] font-medium leading-[1.02] tracking-tight text-[#FFFFFF] text-balance"
                >
                  Wealth With Purpose.
                </motion.h1>
              </div>

              {/* Supporting Headline */}
              <div className="overflow-hidden mb-6">
                <motion.p
                  initial={maskedInitial}
                  animate={maskedAnimate}
                  transition={{ duration: 0.68, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif italic text-2xl sm:text-3xl text-[#C6A96B] leading-snug max-w-xl"
                >
                  A New Perspective on Global Investing.
                </motion.p>
              </div>

              {/* Company Introduction */}
              <motion.p
                initial={fadeInitial}
                animate={fadeAnimate}
                transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="text-base sm:text-lg text-[#E8EBE7]/90 leading-relaxed max-w-xl mb-10"
              >
                Discover a new perspective on global investing. QUWARIR connects financial
                technology with Islamic investment principles to make global opportunities more
                accessible.
              </motion.p>

              {/* CTA Row */}
              <motion.div
                initial={fadeInitial}
                animate={fadeAnimate}
                transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-4 mb-12"
              >
                <a
                  href="#about"
                  className="inline-flex items-center gap-3 px-7 py-4 bg-[#C6A96B] text-[#102D25] text-sm font-semibold tracking-wider uppercase hover:bg-[#d6bc82] hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4F0E5]"
                >
                  <span>Discover QUWARIR</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#vision"
                  className="inline-flex items-center gap-3 px-7 py-4 border border-[#C6A96B]/60 text-[#F4F0E5] text-sm font-semibold tracking-wider uppercase hover:bg-[#C6A96B]/10 hover:border-[#C6A96B] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6A96B]"
                >
                  Explore Our Vision
                </a>

                <button
                  type="button"
                  onClick={handleToggleAudioBriefing}
                  disabled={audioLoading}
                  className="inline-flex items-center gap-2.5 px-4 py-4 text-xs font-medium tracking-wider uppercase text-[#C6A96B] hover:text-[#F4F0E5] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#C6A96B] disabled:opacity-60"
                  aria-label={isPlaying ? "Stop executive audio briefing" : "Listen to executive audio briefing"}
                >
                  {audioLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPlaying ? (
                    <Square className="w-4 h-4 fill-current" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                  <span>{audioLoading ? "Preparing Audio" : isPlaying ? "Stop Briefing" : "Audio Briefing"}</span>
                  {isPlaying && !prefersReducedMotion && (
                    <span className="inline-flex items-end gap-0.5 h-3 ml-1" aria-hidden="true">
                      <motion.span
                        animate={{ scaleY: [0.35, 1, 0.45] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                        className="w-0.5 h-full bg-[#C6A96B] origin-bottom"
                      />
                      <motion.span
                        animate={{ scaleY: [0.85, 0.3, 0.95] }}
                        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.12 }}
                        className="w-0.5 h-full bg-[#C6A96B] origin-bottom"
                      />
                      <motion.span
                        animate={{ scaleY: [0.4, 0.9, 0.3] }}
                        transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut", delay: 0.24 }}
                        className="w-0.5 h-full bg-[#C6A96B] origin-bottom"
                      />
                    </span>
                  )}
                </button>
              </motion.div>

              {audioError && (
                <p role="alert" className="text-xs text-[#F4F0E5]/80 mb-6">
                  {audioError}
                </p>
              )}
            </div>

            {/* Company Highlights Row */}
            <motion.div
              initial={fadeInitial}
              animate={fadeAnimate}
              transition={{ duration: 0.6, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="pt-8 border-t border-[#C6A96B]/25 grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-[#C6A96B] mb-1 tabular-nums">
                  01
                </p>
                <p className="text-sm font-semibold tracking-wider uppercase text-[#FFFFFF]">
                  Global Markets
                </p>
              </div>
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-[#C6A96B] mb-1 tabular-nums">
                  02
                </p>
                <p className="text-sm font-semibold tracking-wider uppercase text-[#FFFFFF]">
                  Shariah Principles
                </p>
              </div>
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-[#C6A96B] mb-1 tabular-nums">
                  03
                </p>
                <p className="text-sm font-semibold tracking-wider uppercase text-[#FFFFFF]">
                  Financial Technology
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN — Dominant Visual Panel + Oversized Vertical Typography */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex items-stretch gap-4 lg:gap-6"
          >
            <div
              data-gsap-parallax="-18"
              className="relative flex-1 min-h-[420px] lg:min-h-[580px] bg-[#102D25] border border-[#C6A96B]/30 overflow-hidden"
            >
              {!imgError ? (
                <motion.img
                  src="/src/assets/images/hero_quwarir_globe_1794885509484.jpg"
                  alt="Brushed champagne gold celestial globe resting on deep emerald marble symbolizing QUWARIR global Islamic financial connectivity"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  style={
                    prefersReducedMotion
                      ? undefined
                      : { x: imageX, y: imageY, scale: 1.05 }
                  }
                  className="w-full h-full object-cover object-center will-change-transform"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-10 bg-gradient-to-b from-[#103B2F] to-[#102D25] text-center">
                  <div className="w-28 h-28 rounded-full border border-[#C6A96B]/50 flex items-center justify-center mb-6">
                    <div className="w-16 h-16 rotate-45 border border-[#F4F0E5]/40" />
                  </div>
                  <p className="font-serif text-2xl text-[#F4F0E5]">
                    Invest Globally. Invest Ethically.
                  </p>
                </div>
              )}

              {/* Measured bottom contrast scrim */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#102D25]/90 via-[#102D25]/45 to-transparent"
              />

              <motion.div
                style={prefersReducedMotion ? undefined : { x: captionX, y: captionY }}
                className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#C6A96B] mb-1">
                    Brand Ethos
                  </p>
                  <p className="font-serif text-lg text-[#F4F0E5]">
                    Invest Globally. Invest Ethically.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Oversized Vertical Typography */}
            <div
              data-gsap-parallax="18"
              className="hidden sm:flex flex-col items-center justify-between py-2 select-none shrink-0"
            >
              <span className="w-px h-14 bg-[#C6A96B]/50" aria-hidden="true" />
              <p className="vertical-editorial-text font-serif text-2xl xl:text-3xl tracking-[0.32em] uppercase text-[#C6A96B]/75">
                GLOBAL INVESTMENT
              </p>
              <span className="w-px h-14 bg-[#C6A96B]/50" aria-hidden="true" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
