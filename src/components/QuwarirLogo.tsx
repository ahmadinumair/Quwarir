import React from "react";

interface QuwarirMarkProps {
  className?: string;
  variant?: "gold-on-dark" | "emerald-on-light";
}

export function QuwarirMark({
  className = "w-9 h-9",
  variant = "gold-on-dark",
}: QuwarirMarkProps) {
  const outerStroke = variant === "gold-on-dark" ? "#C6A96B" : "#103B2F";
  const innerStroke = variant === "gold-on-dark" ? "#F4F0E5" : "#C6A96B";
  const tailStroke = variant === "gold-on-dark" ? "#C6A96B" : "#103B2F";

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Primary architectural circular ring of the Q */}
      <circle
        cx="30"
        cy="30"
        r="19"
        stroke={outerStroke}
        strokeWidth="3.2"
      />
      {/* Subtle 8-fold Islamic geometric octagram inlay */}
      <polygon
        points="30,15.5 40.25,19.75 44.5,30 40.25,40.25 30,44.5 19.75,40.25 15.5,30 19.75,19.75"
        stroke={innerStroke}
        strokeWidth="1.4"
        strokeOpacity="0.7"
      />
      <rect
        x="21.5"
        y="21.5"
        width="17"
        height="17"
        stroke={innerStroke}
        strokeWidth="1.2"
        strokeOpacity="0.45"
        transform="rotate(45 30 30)"
      />
      {/* Precision meridian tail forming the Q lettermark */}
      <path
        d="M36.5 36.5L51 51"
        stroke={tailStroke}
        strokeWidth="3.6"
        strokeLinecap="round"
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
  const textColor = variant === "light" ? "text-[#F4F0E5]" : "text-[#102D25]";
  const markVariant = variant === "light" ? "gold-on-dark" : "emerald-on-light";

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
