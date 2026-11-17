import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Play, Pause, Volume2, X, Loader2 } from "lucide-react";

const BRIEFING_SCRIPT =
  "QUWARIR connects global investment opportunities with Islamic financial principles—offering Shariah stock screening, cross-border market insights, investment analytics, and financial education.";

export function FloatingBriefingDock() {
  const prefersReducedMotion = useReducedMotion();
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let interval: number | undefined;
    if (playing) {
      interval = window.setInterval(() => {
        if (audioRef.current) {
          setElapsed(Math.floor(audioRef.current.currentTime));
        }
      }, 250);
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [playing]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleTogglePlay = async () => {
    if (playing && audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }

    if (audioRef.current && audioUrlRef.current) {
      await audioRef.current.play();
      setPlaying(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: BRIEFING_SCRIPT,
          style: "Composed, authoritative institutional financial presenter",
          voiceName: "Charon",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Audio briefing unavailable.");
      }

      const url = `data:${data.mimeType || "audio/wav"};base64,${data.audioBase64}`;
      audioUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setPlaying(false);
        setElapsed(0);
      };
      audio.onerror = () => {
        setPlaying(false);
        setError("Playback error.");
      };
      await audio.play();
      setPlaying(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audio failed.");
    } finally {
      setLoading(false);
    }
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Executive Audio Briefing Player"
        className="hidden lg:flex fixed bottom-6 left-6 z-40 w-56 flex-col rounded-2xl bg-[#0B2B26]/95 backdrop-blur-md text-[#DAF1DE] border border-[#8EB69B]/30 p-4 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="font-mono text-xs text-[#8EB69B] tabular-nums leading-none mb-1">
              {formatTime(elapsed)}
            </p>
            <p className="text-[11px] font-medium text-[#DAF1DE] leading-tight">
              QUWARIR Executive Brief
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              setDismissed(true);
            }}
            className="text-[#8EB69B]/70 hover:text-[#DAF1DE] transition-colors p-0.5"
            aria-label="Dismiss audio briefing dock"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Harmonic Waveform Visualizer */}
        <div
          aria-hidden="true"
          className="h-8 flex items-center justify-between gap-1 px-1 mb-3 border-y border-[#8EB69B]/20"
        >
          {[0.3, 0.7, 0.45, 0.9, 0.55, 1, 0.6, 0.85, 0.4, 0.75, 0.5, 0.35].map(
            (base, idx) => (
              <motion.span
                key={idx}
                animate={
                  playing && !prefersReducedMotion
                    ? { scaleY: [base * 0.4, base, base * 0.35, base * 0.9] }
                    : { scaleY: base * 0.45 }
                }
                transition={
                  playing && !prefersReducedMotion
                    ? {
                        duration: 0.7 + (idx % 4) * 0.12,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }
                    : { duration: 0.2 }
                }
                className="w-0.5 h-5 bg-[#8EB69B] origin-center"
              />
            )
          )}
        </div>

        {error ? (
          <p className="text-[10px] text-[#DAF1DE] mb-2">{error}</p>
        ) : null}

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-[#8EB69B]">
            <Volume2 className="w-3 h-3 text-[#DAF1DE]" />
            <span>Voice Brief</span>
          </span>

          <button
            type="button"
            onClick={handleTogglePlay}
            disabled={loading}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#DAF1DE] text-[#051F20] hover:bg-[#FFFFFF] transition-colors disabled:opacity-60"
            aria-label={playing ? "Pause executive briefing" : "Play executive briefing"}
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : playing ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
