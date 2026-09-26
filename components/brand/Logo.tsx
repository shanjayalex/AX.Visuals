"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/format";

/** The AX monogram, traced into SVG so it can draw on (strokes) and then fill. */
const SHAPES = [
  "580,268 287,718 400,718 578,440 665,572 728,492",
  "575,530 292,950 410,950 572,688 790,950 930,950",
  "825,510 945,510 598,950 535,882",
];

interface Props {
  className?: string;
  wordmark?: boolean;
  /** "mount": draw on when mounted · "hover": redraw on hover · "none": static */
  animate?: "mount" | "hover" | "none";
  delay?: number;
}

export function Logo({ className, wordmark = true, animate = "none", delay = 0 }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  const draw = (d = 0) => {
    const svg = ref.current;
    if (!svg) return;
    const strokes = svg.querySelectorAll(".ax-stroke");
    const fills = svg.querySelectorAll(".ax-fill");
    gsap.set(strokes, { strokeDashoffset: 1, opacity: 1 });
    gsap.set(fills, { opacity: 0 });
    const tl = gsap.timeline({ delay: d });
    tl.to(strokes, { strokeDashoffset: 0, duration: 1.1, stagger: 0.15, ease: "power2.inOut" })
      .to(fills, { opacity: 1, duration: 0.5, stagger: 0.08 }, "-=0.35")
      .to(strokes, { opacity: 0, duration: 0.3 }, "<");
  };

  useGSAP(
    () => {
      if (animate === "mount") draw(delay);
    },
    { scope: ref },
  );

  return (
    <svg
      ref={ref}
      viewBox={wordmark ? "250 255 760 870" : "280 262 670 700"}
      className={cn("block", className)}
      onMouseEnter={animate === "hover" ? () => draw(0) : undefined}
      role="img"
      aria-label="AX.Visuals"
    >
      {SHAPES.map((pts) => (
        <polygon key={pts} points={pts} className="ax-fill" fill="currentColor" />
      ))}
      {SHAPES.map((pts) => (
        <polygon
          key={"s" + pts}
          points={pts}
          className="ax-stroke"
          fill="none"
          stroke="currentColor"
          strokeWidth={6}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={0}
          opacity={0}
        />
      ))}
      {wordmark && (
        <text
          x="258"
          y="1105"
          textLength="742"
          lengthAdjust="spacing"
          fill="currentColor"
          className="ax-fill"
          style={{ fontFamily: "var(--font-manrope), sans-serif", fontWeight: 500, fontSize: 118 }}
        >
          VISUALS
        </text>
      )}
    </svg>
  );
}
