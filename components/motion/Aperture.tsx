/** 7-blade aperture iris. `open` 0 → closed, 1 → fully open. Pure SVG, driven by a CSS variable. */
export function ApertureSVG({ className, open = 0 }: { className?: string; open?: number }) {
  const blades = Array.from({ length: 7 }, (_, i) => i);
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden>
      <defs>
        <clipPath id="ap-clip">
          <circle r="96" />
        </clipPath>
      </defs>
      <circle r="98" fill="none" stroke="currentColor" strokeOpacity=".35" strokeWidth="1" />
      <circle r="92" fill="none" stroke="currentColor" strokeOpacity=".15" strokeWidth="6" />
      <g clipPath="url(#ap-clip)">
        {blades.map((i) => (
          <g key={i} transform={`rotate(${(i * 360) / 7})`}>
            <g
              className="ap-blade"
              style={{
                transformOrigin: "0px -96px",
                transform: `rotate(${open * 38}deg)`,
                transition: "transform .9s cubic-bezier(.7,0,.2,1)",
              }}
            >
              <path d="M0,-96 L90,-40 L40,70 L-6,4 Z" fill="#161618" stroke="currentColor" strokeOpacity=".5" strokeWidth=".8" />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}
