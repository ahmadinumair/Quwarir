import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import { QuwarirLockup } from "./QuwarirLogo";

const NAV_LINKS = [
  { id: "home", label: "Home", href: "#home" },
  { id: "about", label: "About", href: "#about" },
  { id: "services", label: "Services", href: "#services" },
  { id: "markets", label: "Markets", href: "#markets" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(
      Boolean
    ) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const handleLinkClick = (id?: string) => {
    if (id) setActiveId(id);
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
        scrolled || mobileOpen
          ? "bg-[#051F20]/95 backdrop-blur-md border-b border-[#8EB69B]/20"
          : "bg-[#051F20]/75 backdrop-blur-sm border-b border-[#8EB69B]/10"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-16 md:h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#home"
          onClick={() => handleLinkClick("home")}
          className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#DAF1DE] rounded-sm shrink-0"
          aria-label="QUWARIR Home"
        >
          <QuwarirLockup variant="light" markSize="w-8 h-8" />
        </a>

        {/* Zone 2: 5 concise single-line text links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#8EB69B]"
        >
          {NAV_LINKS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => handleLinkClick(item.id)}
                className={`relative py-1.5 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#DAF1DE] ${
                  isActive ? "text-[#DAF1DE]" : "hover:text-[#DAF1DE]"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute left-0 right-0 -bottom-0.5 h-px bg-[#DAF1DE]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#ecosystem"
            className="hidden md:inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase text-[#051F20] bg-[#DAF1DE] hover:bg-[#FFFFFF] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8EB69B]"
          >
            Research Desk
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-[#DAF1DE] hover:text-[#8EB69B] transition-colors focus-visible:outline-2 focus-visible:outline-[#DAF1DE]"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Subtle Scroll Progress Hairline */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX, transformOrigin: "0% 50%" }}
        className="h-[1.5px] bg-[#8EB69B]/80 w-full"
      />

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0B2B26] border-t border-[#8EB69B]/20 px-6 py-6">
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => handleLinkClick(item.id)}
                className={`py-3 text-base font-medium border-b border-[#8EB69B]/15 transition-colors ${
                  activeId === item.id
                    ? "text-[#DAF1DE]"
                    : "text-[#8EB69B] hover:text-[#DAF1DE]"
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#ecosystem"
              onClick={() => handleLinkClick()}
              className="mt-4 inline-flex items-center justify-center px-5 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase text-[#051F20] bg-[#DAF1DE] hover:bg-[#FFFFFF] transition-colors"
            >
              Research Desk
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
