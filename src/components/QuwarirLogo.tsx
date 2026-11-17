import React from "react";

interface QuwarirMarkProps {
  className?: string;
  variant?: "mint-on-dark" | "forest-on-light" | "gold-on-dark" | "emerald-on-light";
}

/**
 * Hexagonal Geometric Q Logo matching the user's attached Geometric_Teal_Q_Logo_b9bd1742.png:
 * Pointed-top regular hexagon shell with crisp angled negative-space channel and diagonal tail.
 */
export function QuwarirMark({
  className = "w-9 h-9",
  variant = "mint-on-dark",
}: QuwarirMarkProps) {
  const fill =
    variant === "mint-on-dark" || variant === "gold-on-dark"
      ? "#DAF1DE"
      : "#0B2B26";

  return (
    <svg
      viewBox="0 0 100 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer Hexagonal Q Shell with bottom-right diagonal gap */}
      <path
        d="M50 4L88 26V72.5L74.5 64.7V33.8L50 19.6L25.5 33.8V66.2L50 80.4L61.2 73.9L73.6 81.1L50 94.8L12 72.8V26L50 4Z"
        fill={fill}
      />
      {/* Precision Diagonal Q Tail */}
      <path
        d="M44.5 62.5L56.8 55.4L88 73.5V88.2L44.5 62.5Z"
        fill={fill}
      />
    </svg>
  );
}

interface QuwarirLockupProps {
  variant?: "light" | "dark";
  markSize?: string;
}

export function QuwarirLockup({
  variant = "light",
  markSize = "w-8 h-8",
}: QuwarirLockupProps) {
  const textColor = variant === "light" ? "text-[#DAF1DE]" : "text-[#0B2B26]";
  const markVariant = variant === "light" ? "mint-on-dark" : "forest-on-light";

  return (
    <span className="inline-flex items-center gap-3 whitespace-nowrap shrink-0">
      <QuwarirMark className={markSize} variant={markVariant} />
      <span
        className={`font-serif text-xl sm:text-2xl font-semibold tracking-[0.22em] uppercase ${textColor}`}
      >
        QUWARIR
      </span>
    </span>
  );
}
