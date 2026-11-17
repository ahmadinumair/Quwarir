import React, { useState } from "react";
import { QuwarirLockup } from "./QuwarirLogo";
import { ArrowRight, CheckCircle2, Globe, Mail, Building2 } from "lucide-react";

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
        className="relative bg-[#E8EBE7] text-[#102D25] py-24 lg:py-32 border-b border-[#102D25]/10 overflow-hidden"
      >
        {/* Interactive Architectural Tile Grid Showcase (inspired by reference video 00:11–00:19) */}
        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 mb-16">
          <div className="relative border border-[#102D25]/12 bg-[#F4F0E5]/70 overflow-hidden py-14 sm:py-20 px-6">
            {/* Interactive Grid Overlay */}
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
                    className={`border-r border-b border-[#102D25]/6 transition-colors duration-300 ${
                      isLit ? "bg-[#C6A96B]/20" : "bg-transparent"
                    }`}
                  />
                );
              })}
            </div>

            {/* Centered Floating Direct Email Card */}
            <div className="relative z-10 max-w-xl mx-auto text-center pointer-events-none">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#103B2F] mb-5">
                Direct Corporate Correspondence
              </p>
              <a
                href="mailto:inquiries@quwarir-fintech.example"
                className="pointer-events-auto group inline-flex items-center justify-between gap-6 w-full sm:w-auto min-w-[300px] sm:min-w-[440px] bg-[#FFFFFF] border border-[#102D25]/15 px-7 py-5 shadow-md hover:border-[#103B2F] hover:-translate-y-0.5 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#103B2F]"
              >
                <span className="font-mono text-xs sm:text-sm tracking-[0.14em] uppercase text-[#102D25]">
                  inquiries@quwarir-fintech.example
                </span>
                <ArrowRight className="w-4 h-4 text-[#103B2F] transition-transform duration-150 group-hover:translate-x-1 shrink-0" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Company Contact Information */}
            <div data-gsap-reveal="headline" className="lg:col-span-5 space-y-8">
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <span className="w-8 h-px bg-[#103B2F]" aria-hidden="true" />
                  <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#103B2F]">
                    Contact QUWARIR
                  </span>
                </div>
                <h2 className="font-serif text-[clamp(2.25rem,4vw,3.35rem)] font-medium leading-[1.08] text-[#102D25] mb-5">
                  Begin a Dialogue With Our Team.
                </h2>
                <p className="text-base text-[#102D25]/80 leading-relaxed">
                  Reach out for institutional inquiries, research collaboration, media requests, or
                  general corporate information about QUWARIR.
                </p>
              </div>

              <div className="divide-y divide-[#102D25]/15 border-t border-b border-[#102D25]/15">
                <div className="py-5 flex items-start gap-4">
                  <Mail className="w-4 h-4 text-[#103B2F] mt-1 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#103B2F] mb-1">
                      Corporate Email Placeholder
                    </p>
                    <a
                      href="mailto:inquiries@quwarir-fintech.example"
                      className="text-base font-medium text-[#102D25] hover:text-[#103B2F] underline underline-offset-4"
                    >
                      inquiries@quwarir-fintech.example
                    </a>
                  </div>
                </div>

                <div className="py-5 flex items-start gap-4">
                  <Building2 className="w-4 h-4 text-[#103B2F] mt-1 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#103B2F] mb-1">
                      Sector &amp; Focus
                    </p>
                    <p className="text-sm text-[#102D25]/80">
                      Financial Technology · Islamic Finance &amp; Global Investment Intelligence
                    </p>
                  </div>
                </div>

                <div className="py-5 flex items-start gap-4">
                  <Globe className="w-4 h-4 text-[#103B2F] mt-1 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#103B2F] mb-2">
                      Digital Channels
                    </p>
                    <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-[#102D25]">
                      <a
                        href="#contact"
                        onClick={(e) => {
                          e.preventDefault();
                          setTopic("Media & Communications");
                        }}
                        className="hover:text-[#103B2F] underline underline-offset-4"
                      >
                        LinkedIn
                      </a>
                      <a
                        href="#contact"
                        onClick={(e) => {
                          e.preventDefault();
                          setTopic("Media & Communications");
                        }}
                        className="hover:text-[#103B2F] underline underline-offset-4"
                      >
                        X (Twitter)
                      </a>
                      <a
                        href="#contact"
                        onClick={(e) => {
                          e.preventDefault();
                          setTopic("Educational Partnerships");
                        }}
                        className="hover:text-[#103B2F] underline underline-offset-4"
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
              className="lg:col-span-7 bg-[#FFFFFF] border border-[#102D25]/15 p-8 sm:p-10 lg:p-12"
            >
              {submittedRef ? (
                <div className="py-10 text-center space-y-4">
                  <CheckCircle2 className="w-10 h-10 text-[#103B2F] mx-auto" />
                  <h3 className="font-serif text-3xl font-medium text-[#102D25]">
                    Inquiry Recorded
                  </h3>
                  <p className="text-sm text-[#102D25]/80 max-w-md mx-auto leading-relaxed">
                    Thank you for contacting QUWARIR. Your corporate inquiry has been logged under
                    reference <span className="font-mono font-medium">{submittedRef}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmittedRef(null)}
                    className="mt-4 inline-flex items-center justify-center px-6 py-3 bg-[#103B2F] text-[#F4F0E5] text-xs font-semibold uppercase tracking-wider hover:bg-[#102D25] transition-colors"
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
                        className="block text-xs uppercase tracking-[0.16em] text-[#103B2F] font-semibold mb-2"
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
                        className="w-full bg-[#F4F0E5]/60 border border-[#102D25]/20 px-4 py-3 text-sm text-[#102D25] focus-visible:outline-2 focus-visible:outline-[#103B2F]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs uppercase tracking-[0.16em] text-[#103B2F] font-semibold mb-2"
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
                        className="w-full bg-[#F4F0E5]/60 border border-[#102D25]/20 px-4 py-3 text-sm text-[#102D25] focus-visible:outline-2 focus-visible:outline-[#103B2F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="contact-org"
                        className="block text-xs uppercase tracking-[0.16em] text-[#103B2F] font-semibold mb-2"
                      >
                        Organization (Optional)
                      </label>
                      <input
                        id="contact-org"
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Institution or private investor"
                        className="w-full bg-[#F4F0E5]/60 border border-[#102D25]/20 px-4 py-3 text-sm text-[#102D25] focus-visible:outline-2 focus-visible:outline-[#103B2F]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-topic"
                        className="block text-xs uppercase tracking-[0.16em] text-[#103B2F] font-semibold mb-2"
                      >
                        Inquiry Subject
                      </label>
                      <select
                        id="contact-topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full bg-[#F4F0E5]/60 border border-[#102D25]/20 px-4 py-3 text-sm text-[#102D25] focus-visible:outline-2 focus-visible:outline-[#103B2F]"
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
                      className="block text-xs uppercase tracking-[0.16em] text-[#103B2F] font-semibold mb-2"
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
                      className="w-full bg-[#F4F0E5]/60 border border-[#102D25]/20 p-4 text-sm text-[#102D25] focus-visible:outline-2 focus-visible:outline-[#103B2F]"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="text-xs font-medium text-[#103B2F]">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <span className="text-xs text-[#102D25]/65">
                      Informational corporate inquiry only. No financial transactions are processed.
                    </span>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#103B2F] text-[#F4F0E5] text-xs font-semibold uppercase tracking-wider hover:bg-[#102D25] transition-colors disabled:opacity-60 whitespace-nowrap shrink-0"
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
      <footer className="bg-[#102D25] text-[#F4F0E5] pt-20 pb-12">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#C6A96B]/20">
            {/* Brand Summary */}
            <div className="md:col-span-5 space-y-5">
              <QuwarirLockup variant="light" markSize="w-9 h-9" />
              <p className="text-xs uppercase tracking-[0.22em] text-[#C6A96B] pt-1">
                Invest Globally. Invest Ethically.
              </p>
              <p className="text-sm text-[#E8EBE7]/75 leading-relaxed max-w-md">
                QUWARIR is a financial technology company dedicated to making global
                Shariah-compliant investing more accessible, transparent, and convenient through
                reliable financial information and Islamic investment principles.
              </p>
            </div>

            {/* Navigation */}
            <div className="md:col-span-2 space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#C6A96B] font-semibold">
                Navigation
              </p>
              <ul className="space-y-2.5 text-sm text-[#E8EBE7]/80">
                <li>
                  <a href="#home" className="hover:text-[#C6A96B] transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-[#C6A96B] transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-[#C6A96B] transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#markets" className="hover:text-[#C6A96B] transition-colors">
                    Markets
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#C6A96B] transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="md:col-span-3 space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#C6A96B] font-semibold">
                Core Services
              </p>
              <ul className="space-y-2.5 text-sm text-[#E8EBE7]/80">
                <li>
                  <a href="#services" className="hover:text-[#C6A96B] transition-colors">
                    Shariah Stock Screening
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-[#C6A96B] transition-colors">
                    Global Market Insights
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-[#C6A96B] transition-colors">
                    Investment Analytics
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-[#C6A96B] transition-colors">
                    Islamic Financial Education
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-2 space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#C6A96B] font-semibold">
                Connect
              </p>
              <ul className="space-y-2.5 text-sm text-[#E8EBE7]/80">
                <li>
                  <a
                    href="mailto:inquiries@quwarir-fintech.example"
                    className="hover:text-[#C6A96B] transition-colors break-all"
                  >
                    inquiries@quwarir-fintech.example
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#C6A96B] transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#C6A96B] transition-colors">
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#C6A96B] transition-colors">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs text-[#E8EBE7]/60">
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
