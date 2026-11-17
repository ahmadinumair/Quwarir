import React, { useState, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, Volume2, Square, Loader2 } from "lucide-react";
import {
  IslamicStarLatticeBg,
  KhatamRosette,
  IslamicArchFrame,
} from "./IslamicOrnaments";

const HERO_BRIEFING_SCRIPT =
  "Assalamu Alaikum and welcome to QUWARIR. Wealth with purpose—a new perspective on global investing. QUWARIR connects modern financial technology with timeless Islamic investment principles to make international markets more accessible, transparent, and ethical.";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const [imgError, setImgError] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, { stiffness: 110, damping: 24, mass: 0.8 });
  const smoothY = useSpring(pointerY, { stiffness: 110, damping: 24, mass: 0.8 });

  const imageX = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);
  const imageY = useTransform(smoothY, [-0.5, 0.5], [-14, 14]);
  const ringX = useTransform(smoothX, [-0.5, 0.5], [10, -10]);
  const ringY = useTransform(smoothY, [-0.5, 0.5], [10, -10]);

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
      className="relative bg-gradient-to-b from-[#051F20] via-[#0B2B26] to-[#0B2B26] text-[#DAF1DE] pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden border-b border-[#8EB69B]/15"
    >
      {/* Subtle carved Islamic Girih 8-pointed star lattice */}
      <IslamicStarLatticeBg opacity={0.07} strokeColor="#8EB69B" />

      {/* Atmospheric emerald radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[520px] rounded-full bg-[#235347]/45 blur-3xl"
      />

      {/* Rotating Islamic Astrolabe & Rub el Hizb sacred geometry behind central arch */}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 800 800"
        fill="none"
        style={prefersReducedMotion ? undefined : { x: ringX, y: ringY }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] opacity-25"
      >
        <motion.g
          animate={prefersReducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "400px 400px" }}
        >
          <circle
            cx="400"
            cy="400"
            r="340"
            stroke="#8EB69B"
            strokeWidth="0.75"
            strokeDasharray="5 12"
          />
          <rect
            x="160"
            y="160"
            width="480"
            height="480"
            stroke="#8EB69B"
            strokeWidth="0.6"
            strokeOpacity="0.45"
          />
          <rect
            x="160"
            y="160"
            width="480"
            height="480"
            transform="rotate(45 400 400)"
            stroke="#DAF1DE"
            strokeWidth="0.6"
            strokeOpacity="0.35"
          />
        </motion.g>
        <motion.circle
          cx="400"
          cy="400"
          r="250"
          stroke="#DAF1DE"
          strokeWidth="0.6"
          strokeOpacity="0.35"
          animate={prefersReducedMotion ? undefined : { rotate: -360 }}
          transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "400px 400px" }}
        />
      </motion.svg>

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Top Monumental Display Typography */}
        <div className="text-center max-w-5xl mx-auto mb-10 lg:mb-14">
          <motion.div
            initial={fadeInitial}
            animate={fadeAnimate}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 mb-5"
          >
            <KhatamRosette className="w-3.5 h-3.5 text-[#8EB69B]" />
            <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#8EB69B]">
              Global Islamic Finance
            </span>
            <span aria-hidden="true" className="text-[#8EB69B]/60">·</span>
            <span lang="ar" dir="rtl" className="text-sm font-medium text-[#DAF1DE]/85">
              المالية الإسلامية العالمية
            </span>
            <KhatamRosette className="w-3.5 h-3.5 text-[#8EB69B]" />
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              initial={maskedInitial}
              animate={maskedAnimate}
              transition={{ duration: 0.72, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.15rem,7.2vw,6.25rem)] font-medium leading-[0.98] tracking-tight text-[#DAF1DE] text-balance"
            >
              Wealth With Purpose.
            </motion.h1>
          </div>
        </div>

        {/* 3-Zone Composition: Left CTAs — Center Pointed Islamic Arch Visual — Right Editorial Copy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* LEFT: Stacked Rounded CTAs */}
          <motion.div
            initial={fadeInitial}
            animate={fadeAnimate}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 flex flex-col gap-3.5 order-2 lg:order-1"
          >
            <a
              href="#about"
              className="inline-flex items-center justify-between gap-3 px-6 py-3.5 rounded-xl bg-[#DAF1DE] text-[#051F20] text-sm font-semibold hover:bg-[#FFFFFF] hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8EB69B]"
            >
              <span>Discover QUWARIR</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#vision"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-[#DAF1DE]/55 text-[#DAF1DE] text-sm font-semibold hover:bg-[#163832] hover:border-[#DAF1DE] transition-colors duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DAF1DE]"
            >
              Explore Our Vision
            </a>

            <button
              type="button"
              onClick={handleToggleAudioBriefing}
              disabled={audioLoading}
              className="mt-1 inline-flex items-center justify-center lg:justify-start gap-2.5 px-2 py-2 text-xs font-medium tracking-wider uppercase text-[#8EB69B] hover:text-[#DAF1DE] transition-colors duration-150 whitespace-nowrap disabled:opacity-60"
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
                    className="w-0.5 h-full bg-[#DAF1DE] origin-bottom"
                  />
                  <motion.span
                    animate={{ scaleY: [0.85, 0.3, 0.95] }}
                    transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.12 }}
                    className="w-0.5 h-full bg-[#DAF1DE] origin-bottom"
                  />
                  <motion.span
                    animate={{ scaleY: [0.4, 0.9, 0.3] }}
                    transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut", delay: 0.24 }}
                    className="w-0.5 h-full bg-[#DAF1DE] origin-bottom"
                  />
                </span>
              )}
            </button>

            {audioError && (
              <p role="alert" className="text-xs text-[#8EB69B]">
                {audioError}
              </p>
            )}
          </motion.div>

          {/* CENTER: Pointed Islamic Mihrab Arch Framing Sculptural Globe */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center order-1 lg:order-2"
          >
            <div data-gsap-parallax="-18" className="w-full max-w-[400px] aspect-[4/5]">
              <IslamicArchFrame className="w-full h-full shadow-2xl">
                {!imgError ? (
                  <motion.img
                    src="/src/assets/images/hero_quwarir_globe_1794885509484.jpg"
                    alt="Architectural globe resting on deep emerald marble inside a pointed Islamic arch symbolizing QUWARIR global Islamic financial connectivity"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    style={
                      prefersReducedMotion
                        ? undefined
                        : { x: imageX, y: imageY, scale: 1.06 }
                    }
                    className="w-full h-full object-cover object-center will-change-transform"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-10 bg-gradient-to-b from-[#163832] to-[#051F20] text-center">
                    <p className="font-serif text-2xl text-[#DAF1DE]">
                      Invest Globally. Invest Ethically.
                    </p>
                  </div>
                )}

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#051F20]/95 via-[#051F20]/55 to-transparent"
                />
                <div className="absolute bottom-6 left-7 right-7 flex items-end justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#8EB69B] mb-1">
                      Maqasid · Global Investment
                    </p>
                    <p className="font-serif text-lg text-[#DAF1DE]">
                      Invest Globally. Invest Ethically.
                    </p>
                  </div>
                </div>
              </IslamicArchFrame>
            </div>
          </motion.div>

          {/* RIGHT: Editorial Intro & Islamic Principles Highlights */}
          <motion.div
            initial={fadeInitial}
            animate={fadeAnimate}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 space-y-6 order-3"
          >
            <p className="font-serif italic text-2xl sm:text-3xl text-[#8EB69B] leading-snug">
              A New Perspective on Global Investing.
            </p>
            <p className="text-sm sm:text-base text-[#DAF1DE]/85 leading-relaxed">
              Guided by the principles of <span className="text-[#DAF1DE]">Amanah</span> (stewardship)
              and <span className="text-[#DAF1DE]">Shariah</span> governance, QUWARIR connects modern
              financial technology with ethical global market access free of{" "}
              <span className="italic">Riba</span> and excessive uncertainty.
            </p>

            <div className="pt-5 border-t border-[#8EB69B]/25 grid grid-cols-3 gap-4 text-xs">
              <div>
                <p className="font-mono text-[#8EB69B] mb-1 tabular-nums">01</p>
                <p className="font-semibold text-[#DAF1DE]">Shariah Governed</p>
              </div>
              <div>
                <p className="font-mono text-[#8EB69B] mb-1 tabular-nums">02</p>
                <p className="font-semibold text-[#DAF1DE]">Halal Screening</p>
              </div>
              <div>
                <p className="font-mono text-[#8EB69B] mb-1 tabular-nums">03</p>
                <p className="font-semibold text-[#DAF1DE]">Global Access</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
