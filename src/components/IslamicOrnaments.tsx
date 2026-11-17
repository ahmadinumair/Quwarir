import React, { useId } from "react";

interface LatticeProps {
  className?: string;
  opacity?: number;
  strokeColor?: string;
}

/**
 * Seamless 8-pointed Islamic Khatam / Girih geometric star tessellation background.
 * Renders crisp architectural linework without heavy fills or clutter.
 */
export function IslamicStarLatticeBg({
  className = "",
  opacity = 0.08,
  strokeColor = "#8EB69B",
}: LatticeProps) {
  const rawId = useId();
  const patternId = `islamic-girih-${rawId.replace(/:/g, "")}`;

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      style={{ opacity }}
    >
      <defs>
        <pattern
          id={patternId}
          width="120"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          {/* Outer octagon cross-grid */}
          <path
            d="M0 30 L30 0 L90 0 L120 30 L120 90 L90 120 L30 120 L0 90 Z"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.8"
          />
          {/* Classic Rub el Hizb (8-pointed star formed by two rotated squares) */}
          <rect
            x="32"
            y="32"
            width="56"
            height="56"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.9"
          />
          <rect
            x="32"
            y="32"
            width="56"
            height="56"
            transform="rotate(45 60 60)"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.9"
          />
          {/* Inner octagonal rosette */}
          <polygon
            points="60,44 71,49 76,60 71,71 60,76 49,71 44,60 49,49"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.65"
          />
          {/* Corner diamond tessellation connectors */}
          <path
            d="M0 0 L18 18 M120 0 L102 18 M0 120 L18 102 M120 120 L102 102"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.7"
          />
          <circle cx="60" cy="60" r="2.2" fill={strokeColor} fillOpacity="0.65" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

/**
 * Compact 8-pointed Rub el Hizb geometric emblem for kickers, headers, and card corners.
 */
export function KhatamRosette({
  className = "w-4 h-4",
  strokeColor = "currentColor",
  filledCenter = true,
}: {
  className?: string;
  strokeColor?: string;
  filledCenter?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="7"
        y="7"
        width="18"
        height="18"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      <rect
        x="7"
        y="7"
        width="18"
        height="18"
        transform="rotate(45 16 16)"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      {filledCenter && <circle cx="16" cy="16" r="2.2" fill={strokeColor} />}
    </svg>
  );
}

/**
 * Repeating architectural Mashrabiya hairline frieze border used along section edges.
 */
export function MashrabiyaBandBorder({
  className = "",
  strokeColor = "#8EB69B",
}: {
  className?: string;
  strokeColor?: string;
}) {
  const rawId = useId();
  const patternId = `mashrabiya-frieze-${rawId.replace(/:/g, "")}`;

  return (
    <div aria-hidden="true" className={`w-full h-5 overflow-hidden opacity-45 ${className}`}>
      <svg className="w-full h-full">
        <defs>
          <pattern id={patternId} width="40" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M0 10 L10 2 L20 10 L10 18 Z M20 10 L30 2 L40 10 L30 18 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth="0.9"
            />
            <circle cx="10" cy="10" r="1.2" fill={strokeColor} />
            <circle cx="30" cy="10" r="1.2" fill={strokeColor} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

/**
 * Pointed Islamic Arch (Mihrab / Andalusian Ogee Arch) inner double-line frame overlay.
 * Renders crisp architectural arch border lines inside an arched container.
 */
export function PointedArchOverlay({
  strokeColor = "#8EB69B",
}: {
  strokeColor?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full"
    >
      {/* Outer pointed arch trace */}
      <path
        d="M 14 486 L 14 210 C 14 118, 94 48, 200 16 C 306 48, 386 118, 386 210 L 386 486 Z"
        stroke={strokeColor}
        strokeOpacity="0.45"
        strokeWidth="1.2"
      />
      {/* Inner recessed pointed arch trace */}
      <path
        d="M 24 476 L 24 214 C 24 128, 98 62, 200 32 C 302 62, 376 128, 376 214 L 376 476 Z"
        stroke={strokeColor}
        strokeOpacity="0.22"
        strokeWidth="0.9"
        strokeDasharray="4 4"
      />
      {/* Apex geometric finial */}
      <polygon
        points="200,4 206,12 200,20 194,12"
        stroke={strokeColor}
        strokeOpacity="0.7"
        strokeWidth="1"
        fill="#051F20"
      />
    </svg>
  );
}

/**
 * Responsive Pointed Islamic Arch container using objectBoundingBox SVG clipPath
 * so the arch silhouette scales smoothly across viewports without distortion.
 */
export function IslamicArchFrame({
  children,
  className = "",
  strokeColor = "#8EB69B",
}: {
  children: React.ReactNode;
  className?: string;
  strokeColor?: string;
}) {
  const rawId = useId();
  const clipId = `mihrab-clip-${rawId.replace(/:/g, "")}`;

  return (
    <div className={`relative ${className}`}>
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d="M 0,1 L 0,0.42 C 0,0.22 0.21,0.08 0.5,0.005 C 0.79,0.08 1,0.22 1,0.42 L 1,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Subtle stepped outer arch halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 opacity-60"
      >
        <svg viewBox="0 0 400 500" preserveAspectRatio="none" fill="none" className="w-full h-full">
          <path
            d="M 4 496 L 4 210 C 4 110, 88 40, 200 6 C 312 40, 396 110, 396 210 L 396 496 Z"
            stroke={strokeColor}
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <polygon
            points="200,0 205,6 200,12 195,6"
            fill={strokeColor}
            fillOpacity="0.7"
          />
        </svg>
      </div>

      {/* Main clipped arch frame */}
      <div
        style={{ clipPath: `url(#${clipId})` }}
        className="relative w-full h-full rounded-b-2xl overflow-hidden bg-[#051F20]"
      >
        {children}
        <PointedArchOverlay strokeColor={strokeColor} />
      </div>
    </div>
  );
}
