import React, { useState } from "react";
import { QuwarirLockup } from "./QuwarirLogo";
import { ArrowRight, CheckCircle2, Globe, Mail, Building2 } from "lucide-react";
import { KhatamRosette, MashrabiyaBandBorder } from "./IslamicOrnaments";

const GRID_TILE_COUNT = 36;

export function ContactAndFooter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [topic, setTopic] = useState("Corporate & Institutional Inquiry");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please complete your name, email address, and inquiry message.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, organization, topic, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to submit inquiry.");
      }
      setSubmittedRef(data.referenceId);
      setName("");
      setEmail("");
      setOrganization("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* SECTION 08 — CONTACT */}
      <section
        id="contact"
        className="relative bg-[#163832] text-[#DAF1DE] py-24 lg:py-32 border-b border-[#8EB69B]/20 overflow-hidden"
      >
        {/* Interactive Mashrabiya Geometric Tile Grid Showcase */}
        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 mb-16">
          <div className="relative rounded-2xl border border-[#8EB69B]/25 bg-[#0B2B26]/80 overflow-hidden py-14 sm:py-20 px-6">
            <div
              onMouseLeave={() => setHoveredTile(null)}
              className="absolute inset-0 grid grid-cols-6 sm:grid-cols-12 grid-rows-3"
              aria-hidden="true"
            >
              {Array.from({ length: GRID_TILE_COUNT }).map((_, i) => {
                const isLit =
                  hoveredTile === i ||
                  (hoveredTile !== null && Math.abs(hoveredTile - i) === 1);
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setHoveredTile(i)}
                    className={`relative flex items-center justify-center border-r border-b border-[#8EB69B]/12 transition-colors duration-300 ${
                      isLit ? "bg-[#8EB69B]/20" : "bg-transparent"
                    }`}
                  >
                    <KhatamRosette
                      className={`w-6 h-6 transition-opacity duration-300 ${
                        isLit ? "text-[#DAF1DE] opacity-55" : "text-[#8EB69B] opacity-15"
                      }`}
                      filledCenter={false}
                    />
                  </div>
                );
              })}
            </div>

            <div className="relative z-10 max-w-xl mx-auto text-center pointer-events-none">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#8EB69B] mb-5">
                Direct Corporate Correspondence · التواصل المؤسسي
              </p>
              <a
                href="mailto:inquiries@quwarir-fintech.example"
                className="pointer-events-auto group inline-flex items-center justify-between gap-6 w-full sm:w-auto min-w-[300px] sm:min-w-[440px] rounded-xl bg-[#DAF1DE] text-[#051F20] px-7 py-5 shadow-xl hover:bg-[#FFFFFF] hover:-translate-y-0.5 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#8EB69B]"
              >
                <span className="font-mono text-xs sm:text-sm tracking-[0.14em] uppercase font-semibold">
                  inquiries@quwarir-fintech.example
                </span>
                <ArrowRight className="w-4 h-4 text-[#051F20] transition-transform duration-150 group-hover:translate-x-1 shrink-0" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Company Contact Information */}
            <div data-gsap-reveal="headline" className="lg:col-span-5 space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <KhatamRosette className="w-4 h-4 text-[#8EB69B]" />
                  <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#8EB69B]">
                    Contact QUWARIR
                  </span>
                </div>
                <h2 className="font-serif text-[clamp(2.25rem,4vw,3.35rem)] font-medium leading-[1.08] text-[#DAF1DE] mb-5">
                  Begin a Dialogue With Our Team.
                </h2>
                <p className="text-base text-[#DAF1DE]/80 leading-relaxed">
                  Assalamu Alaikum. Reach out for institutional inquiries, Shariah research
                  collaboration, media requests, or general corporate information about QUWARIR.
                </p>
              </div>

              <div className="divide-y divide-[#8EB69B]/20 border-t border-b border-[#8EB69B]/20">
                <div className="py-5 flex items-start gap-4">
                  <Mail className="w-4 h-4 text-[#8EB69B] mt-1 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#8EB69B] mb-1">
                      Corporate Email Placeholder
                    </p>
                    <a
                      href="mailto:inquiries@quwarir-fintech.example"
                      className="text-base font-medium text-[#DAF1DE] hover:text-[#8EB69B] underline underline-offset-4"
                    >
                      inquiries@quwarir-fintech.example
                    </a>
                  </div>
                </div>

                <div className="py-5 flex items-start gap-4">
                  <Building2 className="w-4 h-4 text-[#8EB69B] mt-1 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#8EB69B] mb-1">
                      Sector &amp; Focus
                    </p>
                    <p className="text-sm text-[#DAF1DE]/85">
                      Financial Technology · Islamic Finance &amp; Global Investment Intelligence
                    </p>
                  </div>
                </div>

                <div className="py-5 flex items-start gap-4">
                  <Globe className="w-4 h-4 text-[#8EB69B] mt-1 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#8EB69B] mb-2">
                      Digital Channels
                    </p>
                    <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-[#DAF1DE]">
                      <a
                        href="#contact"
                        onClick={(e) => {
                          e.preventDefault();
                          setTopic("Media & Communications");
                        }}
                        className="hover:text-[#8EB69B] underline underline-offset-4"
                      >
                        LinkedIn
                      </a>
                      <a
                        href="#contact"
                        onClick={(e) => {
                          e.preventDefault();
                          setTopic("Media & Communications");
                        }}
                        className="hover:text-[#8EB69B] underline underline-offset-4"
                      >
                        X (Twitter)
                      </a>
                      <a
                        href="#contact"
                        onClick={(e) => {
                          e.preventDefault();
                          setTopic("Educational Partnerships");
                        }}
                        className="hover:text-[#8EB69B] underline underline-offset-4"
                      >
                        Instagram
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Interface */}
            <div
              data-gsap-reveal="container"
              data-gsap-delay="0.08"
              className="lg:col-span-7 rounded-2xl bg-[#0B2B26] border border-[#8EB69B]/25 p-8 sm:p-10 lg:p-12"
            >
              {submittedRef ? (
                <div className="py-10 text-center space-y-4">
                  <CheckCircle2 className="w-10 h-10 text-[#DAF1DE] mx-auto" />
                  <h3 className="font-serif text-3xl font-medium text-[#DAF1DE]">
                    Inquiry Recorded
                  </h3>
                  <p className="text-sm text-[#8EB69B] max-w-md mx-auto leading-relaxed">
                    Thank you for contacting QUWARIR. Your corporate inquiry has been logged under
                    reference <span className="font-mono font-medium text-[#DAF1DE]">{submittedRef}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmittedRef(null)}
                    className="mt-4 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#DAF1DE] text-[#051F20] text-xs font-semibold uppercase tracking-wider hover:bg-[#FFFFFF] transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs uppercase tracking-[0.16em] text-[#8EB69B] font-semibold mb-2"
                      >
                        Full Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full rounded-xl bg-[#051F20] border border-[#8EB69B]/25 px-4 py-3 text-sm text-[#DAF1DE] placeholder:text-[#8EB69B]/55 focus-visible:outline-2 focus-visible:outline-[#DAF1DE]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs uppercase tracking-[0.16em] text-[#8EB69B] font-semibold mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@organization.com"
                        className="w-full rounded-xl bg-[#051F20] border border-[#8EB69B]/25 px-4 py-3 text-sm text-[#DAF1DE] placeholder:text-[#8EB69B]/55 focus-visible:outline-2 focus-visible:outline-[#DAF1DE]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="contact-org"
                        className="block text-xs uppercase tracking-[0.16em] text-[#8EB69B] font-semibold mb-2"
                      >
                        Organization (Optional)
                      </label>
                      <input
                        id="contact-org"
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Institution or private investor"
                        className="w-full rounded-xl bg-[#051F20] border border-[#8EB69B]/25 px-4 py-3 text-sm text-[#DAF1DE] placeholder:text-[#8EB69B]/55 focus-visible:outline-2 focus-visible:outline-[#DAF1DE]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-topic"
                        className="block text-xs uppercase tracking-[0.16em] text-[#8EB69B] font-semibold mb-2"
                      >
                        Inquiry Subject
                      </label>
                      <select
                        id="contact-topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full rounded-xl bg-[#051F20] border border-[#8EB69B]/25 px-4 py-3 text-sm text-[#DAF1DE] focus-visible:outline-2 focus-visible:outline-[#DAF1DE]"
                      >
                        <option>Corporate &amp; Institutional Inquiry</option>
                        <option>Shariah Methodology &amp; Research</option>
                        <option>Educational Partnerships</option>
                        <option>Media &amp; Communications</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs uppercase tracking-[0.16em] text-[#8EB69B] font-semibold mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your inquiry details..."
                      className="w-full rounded-xl bg-[#051F20] border border-[#8EB69B]/25 p-4 text-sm text-[#DAF1DE] placeholder:text-[#8EB69B]/55 focus-visible:outline-2 focus-visible:outline-[#DAF1DE]"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="text-xs font-medium text-[#DAF1DE]">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <span className="text-xs text-[#8EB69B]">
                      Informational corporate inquiry only. No financial transactions are processed.
                    </span>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-[#DAF1DE] text-[#051F20] text-xs font-semibold uppercase tracking-wider hover:bg-[#FFFFFF] transition-colors disabled:opacity-60 whitespace-nowrap shrink-0"
                    >
                      <span>{submitting ? "Submitting..." : "Submit Inquiry"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 09 — FOOTER */}
      <footer className="bg-[#051F20] text-[#DAF1DE] pb-12">
        <MashrabiyaBandBorder className="mb-16" strokeColor="#8EB69B" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#8EB69B]/20">
            {/* Brand Summary */}
            <div className="md:col-span-5 space-y-5">
              <QuwarirLockup variant="light" markSize="w-9 h-9" />
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <p className="text-xs uppercase tracking-[0.22em] text-[#8EB69B]">
                  Invest Globally. Invest Ethically.
                </p>
                <span aria-hidden="true" className="text-[#8EB69B]/50">·</span>
                <p lang="ar" dir="rtl" className="text-sm text-[#DAF1DE]/80">
                  استثمر عالمياً، استثمر بأخلاقية
                </p>
              </div>
              <p className="text-sm text-[#DAF1DE]/75 leading-relaxed max-w-md">
                QUWARIR is a financial technology company dedicated to making global
                Shariah-compliant investing more accessible, transparent, and convenient through
                reliable financial information and Islamic investment principles.
              </p>
            </div>

            {/* Navigation */}
            <div className="md:col-span-2 space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8EB69B] font-semibold">
                Navigation
              </p>
              <ul className="space-y-2.5 text-sm text-[#DAF1DE]/80">
                <li>
                  <a href="#home" className="hover:text-[#8EB69B] transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-[#8EB69B] transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-[#8EB69B] transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#markets" className="hover:text-[#8EB69B] transition-colors">
                    Markets
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#8EB69B] transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="md:col-span-3 space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8EB69B] font-semibold">
                Core Services
              </p>
              <ul className="space-y-2.5 text-sm text-[#DAF1DE]/80">
                <li>
                  <a href="#services" className="hover:text-[#8EB69B] transition-colors">
                    Shariah Stock Screening
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-[#8EB69B] transition-colors">
                    Global Market Insights
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-[#8EB69B] transition-colors">
                    Investment Analytics
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-[#8EB69B] transition-colors">
                    Islamic Financial Education
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-2 space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8EB69B] font-semibold">
                Connect
              </p>
              <ul className="space-y-2.5 text-sm text-[#DAF1DE]/80">
                <li>
                  <a
                    href="mailto:inquiries@quwarir-fintech.example"
                    className="hover:text-[#8EB69B] transition-colors break-all"
                  >
                    inquiries@quwarir-fintech.example
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#8EB69B] transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#8EB69B] transition-colors">
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#8EB69B] transition-colors">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs text-[#8EB69B]/80">
            <p>© 2026 QUWARIR. All rights reserved.</p>
            <p className="max-w-2xl leading-relaxed">
              Corporate Profile Website Only: Content is provided strictly for informational and
              educational purposes and does not constitute investment advice, brokerage services,
              or an offer to buy or sell financial instruments.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
