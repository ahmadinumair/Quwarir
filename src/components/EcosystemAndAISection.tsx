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
  "Minimalist deep emerald and brushed champagne gold architectural pavilion representing global Islamic financial connectivity",
  "Modern Riyadh financial towers reflected in calm water at twilight, warm champagne gold sunlight",
  "Geometric brass astrolabe and architectural compass resting on dark forest green stone",
];

export function EcosystemAndAISection() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("chat");

  // Multi-turn Chat State
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

  // TTS Studio State
  const [ttsText, setTtsText] = useState(TTS_PRESETS[0].text);
  const [ttsVoice, setTtsVoice] = useState("Charon");
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const inlineAudioRef = useRef<HTMLAudioElement | null>(null);

  // Image Studio State (gemini-3-pro-image-preview with 1K / 2K / 4K)
  const [imgPrompt, setImgPrompt] = useState(IMAGE_PRESETS[0]);
  const [imageSize, setImageSize] = useState<ImageSize>("1K");
  const [aspectRatio, setAspectRatio] = useState<ImageRatio>("16:9");
  const [imgLoading, setImgLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generatedCaption, setGeneratedCaption] = useState<string | null>(null);
  const [imgGenError, setImgGenError] = useState<string | null>(null);

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

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to reach the QUWARIR Research Assistant.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: "model",
          text: data.reply,
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
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Audio synthesis failed.");
      }
      const url = `data:${data.mimeType || "audio/wav"};base64,${data.audioBase64}`;
      if (inlineAudioRef.current) {
        inlineAudioRef.current.pause();
      }
      const audio = new Audio(url);
      inlineAudioRef.current = audio;
      audio.onended = () => setSpeakingMessageId(null);
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
      const data = await res.json();
      if (!res.ok) {
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
      const data = await res.json();
      if (!res.ok) {
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
      className="bg-[#F4F0E5] text-[#102D25] py-24 lg:py-32 border-b border-[#102D25]/10"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div
          data-gsap-reveal="headline"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16"
        >
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-5">
              <span className="w-8 h-px bg-[#103B2F]" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#103B2F]">
                Technology &amp; Ecosystem
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.08] text-[#102D25] text-balance">
              Technology That Connects Financial Opportunities.
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[#102D25]/80 leading-relaxed">
              Designing modular financial architecture that bridges international market
              infrastructure, multi-currency access concepts, and intelligent research workflows.
            </p>
          </div>
        </div>

        {/* Prospective Ecosystem Architecture (No false official partnership claims) */}
        <div
          data-gsap-stagger-group
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          <div
            data-gsap-stagger-item
            className="bg-[#FFFFFF] border border-[#102D25]/15 p-8 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#103B2F]">
                  Prospective Ecosystem Layer
                </span>
                <span className="text-xs text-[#102D25]/60">Brokerage Connectivity</span>
              </div>
              <h3 className="font-serif text-3xl font-medium text-[#102D25] mb-3">
                Interactive Brokers (IBKR)
              </h3>
              <p className="text-sm sm:text-base text-[#102D25]/80 leading-relaxed mb-6">
                Potential brokerage ecosystem integration envisioned to support eligible
                international investors seeking structured cross-border equity access alongside
                QUWARIR&apos;s screening intelligence.
              </p>
            </div>
            <p className="pt-5 border-t border-[#102D25]/12 text-xs text-[#102D25]/65 leading-relaxed">
              Future architecture concept. QUWARIR does not claim an existing official partnership
              or live brokerage execution on this site.
            </p>
          </div>

          <div
            data-gsap-stagger-item
            className="bg-[#FFFFFF] border border-[#102D25]/15 p-8 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#103B2F]">
                  Prospective Ecosystem Layer
                </span>
                <span className="text-xs text-[#102D25]/60">Cross-Border Transfers</span>
              </div>
              <h3 className="font-serif text-3xl font-medium text-[#102D25] mb-3">Wise</h3>
              <p className="text-sm sm:text-base text-[#102D25]/80 leading-relaxed mb-6">
                Potential international money transfer and multi-currency conversion workflow,
                subject to user eligibility, regional licensing, and applicable financial conditions.
              </p>
            </div>
            <p className="pt-5 border-t border-[#102D25]/12 text-xs text-[#102D25]/65 leading-relaxed">
              Future architecture concept. QUWARIR does not claim an existing official partnership
              or payment gateway integration on this site.
            </p>
          </div>
        </div>

        {/* Interactive QUWARIR Research & Media Desk */}
        <div
          data-gsap-reveal="container"
          className="bg-[#102D25] text-[#F4F0E5] border border-[#C6A96B]/30"
        >
          {/* Toolbar Header */}
          <div className="p-6 sm:p-8 border-b border-[#C6A96B]/20 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#C6A96B] mb-1">
                Interactive Intelligence Suite
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#FFFFFF]">
                QUWARIR Research &amp; Media Desk
              </h3>
            </div>

            {/* Segmented Mode Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#103B2F] p-1.5 border border-[#C6A96B]/25">
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
                    className={`relative inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? "text-[#102D25]"
                        : "text-[#F4F0E5]/80 hover:text-[#FFFFFF]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="desk-active-tab"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 bg-[#C6A96B]"
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
              {/* Role & Model Configuration Sidebar */}
              <div className="lg:col-span-4 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#C6A96B]/20 space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#C6A96B] mb-3">
                    Advisor Role
                  </p>
                  <div className="space-y-2">
                    {ROLE_OPTIONS.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setChatRole(role.id)}
                        className={`w-full text-left p-3.5 border transition-colors ${
                          chatRole === role.id
                            ? "bg-[#103B2F] border-[#C6A96B] text-[#FFFFFF]"
                            : "bg-transparent border-white/10 text-[#E8EBE7]/75 hover:border-white/25"
                        }`}
                      >
                        <p className="text-sm font-semibold mb-1">{role.label}</p>
                        <p className="text-xs text-[#E8EBE7]/70 leading-relaxed">{role.summary}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="quwarir-model-select"
                    className="block text-xs uppercase tracking-[0.18em] text-[#C6A96B] mb-2"
                  >
                    Reasoning Profile
                  </label>
                  <select
                    id="quwarir-model-select"
                    value={chatModel}
                    onChange={(e) => setChatModel(e.target.value as ChatModel)}
                    className="w-full bg-[#103B2F] border border-[#C6A96B]/30 px-3.5 py-2.5 text-sm text-[#F4F0E5] focus-visible:outline-2 focus-visible:outline-[#C6A96B]"
                  >
                    {MODEL_OPTIONS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label} ({m.hint})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#C6A96B] mb-2.5">
                    Suggested Prompts
                  </p>
                  <div className="space-y-2">
                    {STARTER_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleSendChat(q)}
                        disabled={chatLoading}
                        className="w-full text-left text-xs text-[#E8EBE7]/85 hover:text-[#C6A96B] py-1.5 border-b border-white/10 transition-colors disabled:opacity-50"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scrollable Conversation Thread */}
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
                        className={`max-w-[85%] p-5 ${
                          msg.role === "user"
                            ? "bg-[#C6A96B] text-[#102D25]"
                            : "bg-[#103B2F] border border-[#C6A96B]/25 text-[#F4F0E5]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 mb-2 text-[11px] uppercase tracking-[0.15em] opacity-75">
                          <span>{msg.role === "user" ? "You" : "QUWARIR Assistant"}</span>
                          {msg.role === "model" && (
                            <button
                              type="button"
                              onClick={() => handleSpeakText(msg.text, msg.id)}
                              className="inline-flex items-center gap-1 text-[#C6A96B] hover:text-[#FFFFFF] transition-colors"
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
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C6A96B]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Formulating response...</span>
                    </div>
                  )}
                </div>

                {chatError && (
                  <div
                    role="alert"
                    className="mx-6 mb-3 px-4 py-2.5 bg-[#103B2F] border border-[#C6A96B]/60 text-xs text-[#F4F0E5]"
                  >
                    {chatError}
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChat();
                  }}
                  className="p-4 sm:p-6 border-t border-[#C6A96B]/20 flex items-center gap-3 bg-[#102D25]"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about Shariah screening, global markets, or Islamic finance..."
                    className="flex-1 bg-[#103B2F] border border-[#C6A96B]/30 px-4 py-3 text-sm text-[#FFFFFF] placeholder:text-[#E8EBE7]/50 focus-visible:outline-2 focus-visible:outline-[#C6A96B]"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#C6A96B] text-[#102D25] text-xs font-semibold uppercase tracking-wider hover:bg-[#d6bc82] transition-colors disabled:opacity-50 whitespace-nowrap shrink-0"
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
                      className="text-xs uppercase tracking-[0.18em] text-[#C6A96B]"
                    >
                      Briefing Script
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TTS_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setTtsText(preset.text)}
                          className="px-3 py-1.5 text-xs bg-[#103B2F] border border-[#C6A96B]/30 text-[#F4F0E5] hover:border-[#C6A96B] transition-colors whitespace-nowrap shrink-0"
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
                    className="w-full bg-[#103B2F] border border-[#C6A96B]/30 p-4 text-sm text-[#FFFFFF] leading-relaxed focus-visible:outline-2 focus-visible:outline-[#C6A96B]"
                  />
                </div>

                <div className="lg:col-span-4 flex flex-col justify-between space-y-6 bg-[#103B2F]/60 border border-[#C6A96B]/20 p-6">
                  <div>
                    <label
                      htmlFor="tts-voice-select"
                      className="block text-xs uppercase tracking-[0.18em] text-[#C6A96B] mb-2"
                    >
                      Voice Persona
                    </label>
                    <select
                      id="tts-voice-select"
                      value={ttsVoice}
                      onChange={(e) => setTtsVoice(e.target.value)}
                      className="w-full bg-[#102D25] border border-[#C6A96B]/30 px-3.5 py-2.5 text-sm text-[#F4F0E5] focus-visible:outline-2 focus-visible:outline-[#C6A96B]"
                    >
                      <option value="Charon">Charon — Composed Executive</option>
                      <option value="Kore">Kore — Clear Editorial</option>
                      <option value="Fenrir">Fenrir — Deep Institutional</option>
                      <option value="Zephyr">Zephyr — Warm Conversational</option>
                      <option value="Puck">Puck — Crisp Presenter</option>
                    </select>
                    <p className="mt-3 text-xs text-[#E8EBE7]/70 leading-relaxed">
                      Synthesizes high-fidelity 24kHz WAV audio using Gemini 3.8 Flash TTS for
                      accessible investor briefings.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={ttsLoading || !ttsText.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C6A96B] text-[#102D25] text-xs font-semibold uppercase tracking-wider hover:bg-[#d6bc82] transition-colors disabled:opacity-50"
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
                  className="p-4 bg-[#103B2F] border border-[#C6A96B]/60 text-xs text-[#F4F0E5]"
                >
                  {ttsError}
                </div>
              )}

              {ttsAudioUrl && (
                <div className="p-5 bg-[#103B2F] border border-[#C6A96B]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-xs uppercase tracking-[0.18em] text-[#C6A96B]">
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
                      className="block text-xs uppercase tracking-[0.18em] text-[#C6A96B] mb-2"
                    >
                      Editorial Visual Concept
                    </label>
                    <textarea
                      id="image-concept-prompt"
                      rows={4}
                      value={imgPrompt}
                      onChange={(e) => setImgPrompt(e.target.value)}
                      placeholder="Describe an architectural or editorial Islamic finance visual concept..."
                      className="w-full bg-[#103B2F] border border-[#C6A96B]/30 p-4 text-sm text-[#FFFFFF] leading-relaxed focus-visible:outline-2 focus-visible:outline-[#C6A96B]"
                    />
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {IMAGE_PRESETS.map((preset, i) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setImgPrompt(preset)}
                          className="text-xs text-[#C6A96B] hover:text-[#FFFFFF] underline underline-offset-4 transition-colors"
                        >
                          Concept {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Size Affordance: 1K, 2K, 4K */}
                  <div>
                    <span className="block text-xs uppercase tracking-[0.18em] text-[#C6A96B] mb-2.5">
                      Output Resolution
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {(["1K", "2K", "4K"] as ImageSize[]).map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setImageSize(size)}
                          className={`py-2.5 text-xs font-mono font-semibold border transition-colors ${
                            imageSize === size
                              ? "bg-[#C6A96B] border-[#C6A96B] text-[#102D25]"
                              : "bg-[#103B2F] border-[#C6A96B]/30 text-[#F4F0E5] hover:border-[#C6A96B]"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Aspect Ratio Selector */}
                  <div>
                    <span className="block text-xs uppercase tracking-[0.18em] text-[#C6A96B] mb-2.5">
                      Aspect Ratio
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {(["16:9", "4:3", "1:1", "3:4"] as ImageRatio[]).map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setAspectRatio(ratio)}
                          className={`py-2 text-xs font-mono border transition-colors ${
                            aspectRatio === ratio
                              ? "bg-[#C6A96B] border-[#C6A96B] text-[#102D25] font-semibold"
                              : "bg-[#103B2F] border-[#C6A96B]/30 text-[#F4F0E5] hover:border-[#C6A96B]"
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
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C6A96B] text-[#102D25] text-xs font-semibold uppercase tracking-wider hover:bg-[#d6bc82] transition-colors disabled:opacity-50"
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

                {/* Output Canvas */}
                <div className="lg:col-span-7 bg-[#103B2F]/50 border border-[#C6A96B]/25 p-6 flex flex-col justify-center items-center min-h-[340px]">
                  {imgGenError ? (
                    <div role="alert" className="max-w-md text-center space-y-2">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#C6A96B]">
                        Visual Studio Notice
                      </p>
                      <p className="text-sm text-[#F4F0E5]/90 leading-relaxed">{imgGenError}</p>
                    </div>
                  ) : generatedImageUrl ? (
                    <div className="w-full space-y-4">
                      <img
                        src={generatedImageUrl}
                        alt={imgPrompt}
                        referrerPolicy="no-referrer"
                        className="w-full max-h-[420px] object-contain border border-[#C6A96B]/30"
                      />
                      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#E8EBE7]/80">
                        <span>
                          Resolution: {imageSize} · Aspect: {aspectRatio}
                        </span>
                        <a
                          href={generatedImageUrl}
                          download={`quwarir-concept-${imageSize.toLowerCase()}.png`}
                          className="inline-flex items-center gap-1.5 text-[#C6A96B] hover:text-[#FFFFFF] transition-colors uppercase tracking-wider font-semibold"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      </div>
                      {generatedCaption && (
                        <p className="text-xs text-[#E8EBE7]/75 leading-relaxed">
                          {generatedCaption}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center max-w-sm space-y-2">
                      <p className="font-serif text-2xl text-[#F4F0E5]">
                        Editorial Brand Canvas
                      </p>
                      <p className="text-xs text-[#E8EBE7]/70 leading-relaxed">
                        Choose a target resolution (1K, 2K, or 4K) and aspect ratio to render bespoke
                        QUWARIR architectural imagery via Gemini 3 Pro Image Preview.
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
