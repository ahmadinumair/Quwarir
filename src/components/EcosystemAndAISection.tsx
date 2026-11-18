import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Volume2,
  Square,
  Loader2,
  Image as ImageIcon,
  MessageSquare,
  AudioLines,
  Download,
} from "lucide-react";
import { KhatamRosette } from "./IslamicOrnaments";
import { safeParseJson } from "../utils/safeFetchJson";

type WorkspaceTab = "chat" | "tts" | "image";
type ChatRole = "shariah_methodology" | "market_analyst" | "islamic_educator";
type ChatModel =
  | "gemini-4-hydrogen"
  | "gemini-3.1-flash-lite"
  | "gemini-4-argon"
  | "gemini-4-carbon";
type ImageSize = "1K" | "2K" | "4K";
type ImageRatio = "16:9" | "4:3" | "1:1" | "3:4";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  modelUsed?: string;
}

const ROLE_OPTIONS: Array<{ id: ChatRole; label: string; summary: string }> = [
  {
    id: "shariah_methodology",
    label: "Shariah Screening Guide",
    summary: "Qualitative business activity & quantitative debt/purification methodology.",
  },
  {
    id: "market_analyst",
    label: "Global Market Analyst",
    summary: "Macro context across Saudi Exchange (Tadawul), US markets & international hubs.",
  },
  {
    id: "islamic_educator",
    label: "Islamic Finance Educator",
    summary: "Foundational concepts: Riba, Gharar, Maysir, Sukuk & ethical stewardship.",
  },
];

const MODEL_OPTIONS: Array<{ id: ChatModel; label: string; hint: string }> = [
  { id: "gemini-4-hydrogen", label: "Gemini 4 Hydrogen", hint: "General" },
  { id: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite", hint: "Fast" },
  { id: "gemini-4-argon", label: "Gemini 4 Argon", hint: "Complex" },
  { id: "gemini-4-carbon", label: "Gemini 4 Carbon", hint: "Deep Reasoning" },
];

const STARTER_QUESTIONS = [
  "How does two-stage Shariah stock screening evaluate debt and revenue?",
  "What distinguishes the Saudi Exchange (Tadawul) for global ethical investors?",
  "Why is dividend purification important in Islamic equity investing?",
];

const TTS_PRESETS = [
  {
    label: "Corporate Vision",
    text: "QUWARIR envisions a future where geographical boundaries and technological complexity no longer prevent people from exploring responsible global investment opportunities aligned with Islamic principles.",
  },
  {
    label: "Shariah Screening Principle",
    text: "Evaluating global equities through an Islamic lens requires both qualitative business screening and ongoing quantitative balance-sheet verification, ensuring long-term transparency and integrity.",
  },
  {
    label: "Global Markets Strategy",
    text: "From the Saudi Exchange in Riyadh to international equity markets in the United States and beyond, QUWARIR bridges regional understanding with disciplined cross-border analytics.",
  },
];

const IMAGE_PRESETS = [
  "Minimalist deep emerald and sage-mint architectural pavilion representing global Islamic financial connectivity",
  "Modern Riyadh financial towers reflected in calm water at twilight, deep emerald glass and subtle mist",
  "Hexagonal architectural compass resting on dark forest green stone, minimalist editorial studio photography",
];

export function EcosystemAndAISection() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("chat");

  const [chatRole, setChatRole] = useState<ChatRole>("shariah_methodology");
  const [chatModel, setChatModel] = useState<ChatModel>("gemini-4-hydrogen");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "model",
      text: "Welcome to the QUWARIR Research Desk. Select an advisor focus above and ask about Shariah stock screening methodologies, global market structure, or Islamic financial principles.",
      modelUsed: "gemini-4-hydrogen",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  const [ttsText, setTtsText] = useState(TTS_PRESETS[0].text);
  const [ttsVoice, setTtsVoice] = useState("Charon");
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const inlineAudioRef = useRef<HTMLAudioElement | null>(null);

  const [imgPrompt, setImgPrompt] = useState(IMAGE_PRESETS[0]);
  const [imageSize, setImageSize] = useState<ImageSize>("1K");
  const [aspectRatio, setAspectRatio] = useState<ImageRatio>("16:9");
  const [imgLoading, setImgLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generatedCaption, setGeneratedCaption] = useState<string | null>(null);
  const [imgGenError, setImgGenError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (inlineAudioRef.current) {
        inlineAudioRef.current.pause();
        inlineAudioRef.current.src = "";
        inlineAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, chatLoading]);

  const handleSendChat = async (overrideText?: string) => {
    const content = (overrideText ?? chatInput).trim();
    if (!content || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: content,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    if (!overrideText) setChatInput("");
    setChatLoading(true);
    setChatError(null);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== "welcome-1")
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: historyPayload,
          role: chatRole,
          model: chatModel,
        }),
      });

      const data = await safeParseJson<{ reply?: string; model?: string }>(res);
      if (!res.ok || !data.reply) {
        throw new Error(data.error || "Unable to reach the QUWARIR Research Assistant.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: "model",
          text: data.reply as string,
          modelUsed: data.model,
        },
      ]);
    } catch (err) {
      setChatError(err instanceof Error ? err.message : "Failed to get response.");
    } finally {
      setChatLoading(false);
    }
  };

  const handleSpeakText = async (text: string, msgId?: string) => {
    if (msgId && speakingMessageId === msgId && inlineAudioRef.current) {
      inlineAudioRef.current.pause();
      inlineAudioRef.current.currentTime = 0;
      setSpeakingMessageId(null);
      return;
    }

    if (msgId) setSpeakingMessageId(msgId);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          style: "Clear, measured institutional analyst voice",
          voiceName: ttsVoice,
        }),
      });
      const data = await safeParseJson<{ audioBase64?: string; mimeType?: string }>(res);
      if (!res.ok || !data.audioBase64) {
        throw new Error(data.error || "Audio synthesis failed.");
      }
      const url = `data:${data.mimeType || "audio/wav"};base64,${data.audioBase64}`;
      if (inlineAudioRef.current) {
        inlineAudioRef.current.pause();
      }
      const audio = new Audio(url);
      inlineAudioRef.current = audio;
      audio.onended = () => setSpeakingMessageId(null);
      audio.onerror = () => setSpeakingMessageId(null);
      await audio.play();
    } catch (err) {
      setSpeakingMessageId(null);
      setChatError(err instanceof Error ? err.message : "Speech synthesis error.");
    }
  };

  const handleSynthesizeBriefing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ttsText.trim() || ttsLoading) return;
    setTtsLoading(true);
    setTtsError(null);
    setTtsAudioUrl(null);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: ttsText,
          style: "Composed, authoritative institutional financial presenter",
          voiceName: ttsVoice,
        }),
      });
      const data = await safeParseJson<{ audioBase64?: string; mimeType?: string }>(res);
      if (!res.ok || !data.audioBase64) {
        throw new Error(data.error || "Unable to synthesize speech.");
      }
      setTtsAudioUrl(`data:${data.mimeType || "audio/wav"};base64,${data.audioBase64}`);
    } catch (err) {
      setTtsError(err instanceof Error ? err.message : "TTS synthesis error.");
    } finally {
      setTtsLoading(false);
    }
  };

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imgPrompt.trim() || imgLoading) return;
    setImgLoading(true);
    setImgGenError(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imgPrompt,
          imageSize,
          aspectRatio,
        }),
      });
      const data = await safeParseJson<{ imageDataUrl?: string; caption?: string }>(res);
      if (!res.ok || !data.imageDataUrl) {
        throw new Error(data.error || "Image generation failed.");
      }
      setGeneratedImageUrl(data.imageDataUrl);
      setGeneratedCaption(data.caption || null);
    } catch (err) {
      setImgGenError(err instanceof Error ? err.message : "Visual generation failed.");
    } finally {
      setImgLoading(false);
    }
  };

  return (
    <section
      id="ecosystem"
      className="bg-[#163832] text-[#DAF1DE] py-24 lg:py-32 border-b border-[#8EB69B]/20"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div
          data-gsap-reveal="headline"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16"
        >
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-5">
              <KhatamRosette className="w-4 h-4 text-[#8EB69B]" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#8EB69B]">
                Technology &amp; Ecosystem
              </span>
              <span aria-hidden="true" className="text-[#8EB69B]/60">·</span>
              <span lang="ar" dir="rtl" className="text-sm text-[#DAF1DE]/80">
                التقنية والمنظومة
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.08] text-[#DAF1DE] text-balance">
              Technology That Connects Financial Opportunities.
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[#DAF1DE]/80 leading-relaxed">
              Designing modular financial architecture that bridges international market
              infrastructure, multi-currency access concepts, and intelligent research workflows.
            </p>
          </div>
        </div>

        {/* Prospective Ecosystem Architecture */}
        <div
          data-gsap-stagger-group
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          <div
            data-gsap-stagger-item
            className="rounded-2xl bg-[#0B2B26]/85 backdrop-blur-md border border-[#8EB69B]/20 p-8 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#8EB69B]">
                  Prospective Ecosystem Layer
                </span>
                <span className="text-xs text-[#8EB69B]/80">Brokerage Connectivity</span>
              </div>
              <h3 className="font-serif text-3xl font-medium text-[#DAF1DE] mb-3">
                Interactive Brokers (IBKR)
              </h3>
              <p className="text-sm sm:text-base text-[#DAF1DE]/80 leading-relaxed mb-6">
                Potential brokerage ecosystem integration envisioned to support eligible
                international investors seeking structured cross-border equity access alongside
                QUWARIR&apos;s screening intelligence.
              </p>
            </div>
            <p className="pt-5 border-t border-[#8EB69B]/15 text-xs text-[#8EB69B] leading-relaxed">
              Future architecture concept. QUWARIR does not claim an existing official partnership
              or live brokerage execution on this site.
            </p>
          </div>

          <div
            data-gsap-stagger-item
            className="rounded-2xl bg-[#0B2B26]/85 backdrop-blur-md border border-[#8EB69B]/20 p-8 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#8EB69B]">
                  Prospective Ecosystem Layer
                </span>
                <span className="text-xs text-[#8EB69B]/80">Cross-Border Transfers</span>
              </div>
              <h3 className="font-serif text-3xl font-medium text-[#DAF1DE] mb-3">Wise</h3>
              <p className="text-sm sm:text-base text-[#DAF1DE]/80 leading-relaxed mb-6">
                Potential international money transfer and multi-currency conversion workflow,
                subject to user eligibility, regional licensing, and applicable financial conditions.
              </p>
            </div>
            <p className="pt-5 border-t border-[#8EB69B]/15 text-xs text-[#8EB69B] leading-relaxed">
              Future architecture concept. QUWARIR does not claim an existing official partnership
              or payment gateway integration on this site.
            </p>
          </div>
        </div>

        {/* Interactive QUWARIR Research & Media Desk */}
        <div
          data-gsap-reveal="container"
          className="rounded-2xl bg-[#051F20] text-[#DAF1DE] border border-[#8EB69B]/25 overflow-hidden"
        >
          {/* Toolbar Header */}
          <div className="p-6 sm:p-8 border-b border-[#8EB69B]/20 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#8EB69B] mb-1">
                Interactive Intelligence Suite
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#DAF1DE]">
                QUWARIR Research &amp; Media Desk
              </h3>
            </div>

            {/* Segmented Mode Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-[#0B2B26] p-1.5 border border-[#8EB69B]/20">
              {(
                [
                  { id: "chat", label: "Research Assistant", Icon: MessageSquare },
                  { id: "tts", label: "Audio Briefing", Icon: AudioLines },
                  { id: "image", label: "Visual Studio", Icon: ImageIcon },
                ] as const
              ).map(({ id, label, Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? "text-[#051F20]"
                        : "text-[#8EB69B] hover:text-[#DAF1DE]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="desk-active-tab"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-lg bg-[#DAF1DE]"
                      />
                    )}
                    <Icon className="relative z-10 w-3.5 h-3.5" />
                    <span className="relative z-10">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* TAB 1: Multi-Turn Gemini Chat */}
            {activeTab === "chat" && (
              <motion.div
                key="tab-chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12"
              >
                <div className="lg:col-span-4 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#8EB69B]/20 space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#8EB69B] mb-3">
                      Advisor Role
                    </p>
                    <div className="space-y-2">
                      {ROLE_OPTIONS.map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setChatRole(role.id)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-colors ${
                            chatRole === role.id
                              ? "bg-[#163832] border-[#8EB69B] text-[#DAF1DE]"
                              : "bg-transparent border-[#8EB69B]/15 text-[#8EB69B] hover:border-[#8EB69B]/40"
                          }`}
                        >
                          <p className="text-sm font-semibold mb-1 text-[#DAF1DE]">{role.label}</p>
                          <p className="text-xs text-[#8EB69B] leading-relaxed">{role.summary}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="quwarir-model-select"
                      className="block text-xs uppercase tracking-[0.18em] text-[#8EB69B] mb-2"
                    >
                      Reasoning Profile
                    </label>
                    <select
                      id="quwarir-model-select"
                      value={chatModel}
                      onChange={(e) => setChatModel(e.target.value as ChatModel)}
                      className="w-full rounded-xl bg-[#0B2B26] border border-[#8EB69B]/30 px-3.5 py-2.5 text-sm text-[#DAF1DE] focus-visible:outline-2 focus-visible:outline-[#DAF1DE]"
                    >
                      {MODEL_OPTIONS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label} ({m.hint})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#8EB69B] mb-2.5">
                      Suggested Prompts
                    </p>
                    <div className="space-y-2">
                      {STARTER_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => handleSendChat(q)}
                          disabled={chatLoading}
                          className="w-full text-left text-xs text-[#DAF1DE]/80 hover:text-[#8EB69B] py-1.5 border-b border-[#8EB69B]/15 transition-colors disabled:opacity-50"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 flex flex-col h-[520px]">
                  <div
                    ref={chatScrollRef}
                    className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6"
                    aria-live="polite"
                  >
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          msg.role === "user" ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-5 ${
                            msg.role === "user"
                              ? "bg-[#DAF1DE] text-[#051F20]"
                              : "bg-[#0B2B26] border border-[#8EB69B]/25 text-[#DAF1DE]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4 mb-2 text-[11px] uppercase tracking-[0.15em] opacity-75">
                            <span>{msg.role === "user" ? "You" : "QUWARIR Assistant"}</span>
                            {msg.role === "model" && (
                              <button
                                type="button"
                                onClick={() => handleSpeakText(msg.text, msg.id)}
                                className="inline-flex items-center gap-1 text-[#8EB69B] hover:text-[#DAF1DE] transition-colors"
                                aria-label="Listen to assistant response"
                              >
                                {speakingMessageId === msg.id ? (
                                  <>
                                    <Square className="w-3 h-3 fill-current" />
                                    <span>Stop</span>
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="w-3.5 h-3.5" />
                                    <span>Listen</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    ))}

                    {chatLoading && (
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8EB69B]">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Formulating response...</span>
                      </div>
                    )}
                  </div>

                  {chatError && (
                    <div
                      role="alert"
                      className="mx-6 mb-3 px-4 py-2.5 rounded-xl bg-[#163832] border border-[#8EB69B]/50 text-xs text-[#DAF1DE]"
                    >
                      {chatError}
                    </div>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendChat();
                    }}
                    className="p-4 sm:p-6 border-t border-[#8EB69B]/20 flex items-center gap-3 bg-[#051F20]"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about Shariah screening, global markets, or Islamic finance..."
                      className="flex-1 rounded-xl bg-[#0B2B26] border border-[#8EB69B]/30 px-4 py-3 text-sm text-[#DAF1DE] placeholder:text-[#8EB69B]/60 focus-visible:outline-2 focus-visible:outline-[#DAF1DE]"
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !chatInput.trim()}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#DAF1DE] text-[#051F20] text-xs font-semibold uppercase tracking-wider hover:bg-[#FFFFFF] transition-colors disabled:opacity-50 whitespace-nowrap shrink-0"
                    >
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* TAB 2: Executive Audio Briefing (gemini-3.8-flash-tts) */}
            {activeTab === "tts" && (
              <motion.form
                key="tab-tts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                onSubmit={handleSynthesizeBriefing}
                className="p-6 sm:p-10 space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <label
                        htmlFor="tts-briefing-text"
                        className="text-xs uppercase tracking-[0.18em] text-[#8EB69B]"
                      >
                        Briefing Script
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {TTS_PRESETS.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setTtsText(preset.text)}
                            className="px-3 py-1.5 rounded-lg text-xs bg-[#0B2B26] border border-[#8EB69B]/25 text-[#DAF1DE] hover:border-[#DAF1DE] transition-colors whitespace-nowrap shrink-0"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      id="tts-briefing-text"
                      rows={5}
                      value={ttsText}
                      onChange={(e) => setTtsText(e.target.value)}
                      placeholder="Enter institutional commentary or educational script to convert to speech..."
                      className="w-full rounded-xl bg-[#0B2B26] border border-[#8EB69B]/30 p-4 text-sm text-[#DAF1DE] leading-relaxed focus-visible:outline-2 focus-visible:outline-[#DAF1DE]"
                    />
                  </div>

                  <div className="lg:col-span-4 flex flex-col justify-between space-y-6 rounded-2xl bg-[#0B2B26] border border-[#8EB69B]/20 p-6">
                    <div>
                      <label
                        htmlFor="tts-voice-select"
                        className="block text-xs uppercase tracking-[0.18em] text-[#8EB69B] mb-2"
                      >
                        Voice Persona
                      </label>
                      <select
                        id="tts-voice-select"
                        value={ttsVoice}
                        onChange={(e) => setTtsVoice(e.target.value)}
                        className="w-full rounded-xl bg-[#051F20] border border-[#8EB69B]/30 px-3.5 py-2.5 text-sm text-[#DAF1DE] focus-visible:outline-2 focus-visible:outline-[#DAF1DE]"
                      >
                        <option value="Charon">Charon — Composed Executive</option>
                        <option value="Kore">Kore — Clear Editorial</option>
                        <option value="Fenrir">Fenrir — Deep Institutional</option>
                        <option value="Zephyr">Zephyr — Warm Conversational</option>
                        <option value="Puck">Puck — Crisp Presenter</option>
                      </select>
                      <p className="mt-3 text-xs text-[#8EB69B] leading-relaxed">
                        Synthesizes high-fidelity 24kHz WAV audio using Gemini 3.8 Flash TTS for
                        accessible investor briefings.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={ttsLoading || !ttsText.trim()}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#DAF1DE] text-[#051F20] text-xs font-semibold uppercase tracking-wider hover:bg-[#FFFFFF] transition-colors disabled:opacity-50"
                    >
                      {ttsLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Synthesizing Audio...</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>Generate Audio Briefing</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {ttsError && (
                  <div
                    role="alert"
                    className="p-4 rounded-xl bg-[#163832] border border-[#8EB69B]/50 text-xs text-[#DAF1DE]"
                  >
                    {ttsError}
                  </div>
                )}

                {ttsAudioUrl && (
                  <div className="p-5 rounded-xl bg-[#0B2B26] border border-[#8EB69B]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-xs uppercase tracking-[0.18em] text-[#8EB69B]">
                      Ready for Playback
                    </span>
                    <audio controls src={ttsAudioUrl} className="w-full sm:max-w-md" />
                  </div>
                )}
              </motion.form>
            )}

            {/* TAB 3: High-Quality Image Studio (gemini-3-pro-image-preview with 1K / 2K / 4K) */}
            {activeTab === "image" && (
              <motion.form
                key="tab-image"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                onSubmit={handleGenerateImage}
                className="p-6 sm:p-10 space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-5 space-y-6">
                    <div>
                      <label
                        htmlFor="image-concept-prompt"
                        className="block text-xs uppercase tracking-[0.18em] text-[#8EB69B] mb-2"
                      >
                        Editorial Visual Concept
                      </label>
                      <textarea
                        id="image-concept-prompt"
                        rows={4}
                        value={imgPrompt}
                        onChange={(e) => setImgPrompt(e.target.value)}
                        placeholder="Describe an architectural or editorial Islamic finance visual concept..."
                        className="w-full rounded-xl bg-[#0B2B26] border border-[#8EB69B]/30 p-4 text-sm text-[#DAF1DE] leading-relaxed focus-visible:outline-2 focus-visible:outline-[#DAF1DE]"
                      />
                      <div className="mt-2.5 flex flex-wrap gap-3">
                        {IMAGE_PRESETS.map((preset, i) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setImgPrompt(preset)}
                            className="text-xs text-[#8EB69B] hover:text-[#DAF1DE] underline underline-offset-4 transition-colors"
                          >
                            Concept {i + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs uppercase tracking-[0.18em] text-[#8EB69B] mb-2.5">
                        Output Resolution
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {(["1K", "2K", "4K"] as ImageSize[]).map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setImageSize(size)}
                            className={`py-2.5 rounded-xl text-xs font-mono font-semibold border transition-colors ${
                              imageSize === size
                                ? "bg-[#DAF1DE] border-[#DAF1DE] text-[#051F20]"
                                : "bg-[#0B2B26] border-[#8EB69B]/25 text-[#DAF1DE] hover:border-[#DAF1DE]"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs uppercase tracking-[0.18em] text-[#8EB69B] mb-2.5">
                        Aspect Ratio
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {(["16:9", "4:3", "1:1", "3:4"] as ImageRatio[]).map((ratio) => (
                          <button
                            key={ratio}
                            type="button"
                            onClick={() => setAspectRatio(ratio)}
                            className={`py-2 rounded-xl text-xs font-mono border transition-colors ${
                              aspectRatio === ratio
                                ? "bg-[#DAF1DE] border-[#DAF1DE] text-[#051F20] font-semibold"
                                : "bg-[#0B2B26] border-[#8EB69B]/25 text-[#DAF1DE] hover:border-[#DAF1DE]"
                            }`}
                          >
                            {ratio}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={imgLoading || !imgPrompt.trim()}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#DAF1DE] text-[#051F20] text-xs font-semibold uppercase tracking-wider hover:bg-[#FFFFFF] transition-colors disabled:opacity-50"
                    >
                      {imgLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Rendering {imageSize} Concept...</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-4 h-4" />
                          <span>Generate {imageSize} Visual</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="lg:col-span-7 rounded-2xl bg-[#0B2B26]/70 border border-[#8EB69B]/20 p-6 flex flex-col justify-center items-center min-h-[340px]">
                    {imgGenError ? (
                      <div role="alert" className="max-w-md text-center space-y-2">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#8EB69B]">
                          Visual Studio Notice
                        </p>
                        <p className="text-sm text-[#DAF1DE]/90 leading-relaxed">{imgGenError}</p>
                      </div>
                    ) : generatedImageUrl ? (
                      <div className="w-full space-y-4">
                        <img
                          src={generatedImageUrl}
                          alt={imgPrompt}
                          referrerPolicy="no-referrer"
                          className="w-full max-h-[420px] rounded-xl object-contain border border-[#8EB69B]/30"
                        />
                        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#8EB69B]">
                          <span>
                            Resolution: {imageSize} · Aspect: {aspectRatio}
                          </span>
                          <a
                            href={generatedImageUrl}
                            download={`quwarir-concept-${imageSize.toLowerCase()}.png`}
                            className="inline-flex items-center gap-1.5 text-[#DAF1DE] hover:text-[#8EB69B] transition-colors uppercase tracking-wider font-semibold"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                        {generatedCaption && (
                          <p className="text-xs text-[#8EB69B] leading-relaxed">
                            {generatedCaption}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center max-w-sm space-y-2">
                        <p className="font-serif text-2xl text-[#DAF1DE]">
                          Editorial Brand Canvas
                        </p>
                        <p className="text-xs text-[#8EB69B] leading-relaxed">
                          Choose a target resolution (1K, 2K, or 4K) and aspect ratio to render
                          bespoke QUWARIR architectural imagery via Gemini 3 Pro Image Preview.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
