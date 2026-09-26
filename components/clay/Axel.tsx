"use client";

import { cn } from "@/lib/format";

/**
 * Stand-in for the claymation clips from Part B of the brief.
 * A hand-drawn SVG "plasticine" Axel animated at a stepped 12fps.
 * When the real clips exist, pass `src` (an MP4/WebM in /public/clay) and the video is used instead.
 */
export type AxelPose = "focus" | "thumbs" | "tangled";

export function AxelClay({ pose = "focus", src, className }: { pose?: AxelPose; src?: string; className?: string }) {
  if (src) {
    return (
      <video className={cn("size-full object-cover", className)} src={src} autoPlay muted loop playsInline aria-label="Axel the clay cinematographer" />
    );
  }
  return (
    <svg viewBox="0 0 400 300" className={cn("size-full", className)} role="img" aria-label="Axel, a clay cinematographer, at work on a miniature film set">
      <defs>
        <filter id="clay" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" result="d" />
          <feSpecularLighting in="n" surfaceScale="1.4" specularConstant=".35" specularExponent="18" lightingColor="#fff" result="s">
            <fePointLight x="80" y="-40" z="160" />
          </feSpecularLighting>
          <feComposite in="s" in2="d" operator="in" result="sp" />
          <feComposite in="d" in2="sp" operator="arithmetic" k2="1" k3=".5" />
        </filter>
        <radialGradient id="lamp" cx="85%" cy="20%" r="70%">
          <stop offset="0" stopColor="#ffcf8a" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffcf8a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <style>{`
        .st{animation-timing-function:steps(1,end)}
        @keyframes ax-ring{0%{transform:rotate(0)}8%{transform:rotate(12deg)}16%{transform:rotate(24deg)}25%{transform:rotate(30deg)}50%{transform:rotate(30deg)}58%{transform:rotate(18deg)}66%{transform:rotate(6deg)}75%,100%{transform:rotate(0)}}
        @keyframes ax-hand{0%,100%{transform:translate(0,0)}25%{transform:translate(1px,-2px)}50%{transform:translate(0,-1px)}75%{transform:translate(-1px,1px)}}
        @keyframes ax-head{0%,40%,100%{transform:rotate(0)}45%,85%{transform:rotate(-6deg)}}
        @keyframes ax-thumb{0%,20%{transform:translate(0,30px) rotate(20deg)}30%,100%{transform:translate(0,0) rotate(0)}}
        @keyframes ax-shrug{0%,50%,100%{transform:translateY(0)}60%,80%{transform:translateY(-6px)}}
        @keyframes ax-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
        .ring{transform-origin:258px 150px;animation:ax-ring 4s steps(48) infinite}
        .hand{animation:ax-hand 1s steps(12) infinite}
        .head{transform-origin:150px 150px;animation:ax-head 5s steps(60) infinite}
        .thumb{transform-origin:220px 190px;animation:ax-thumb 2.5s steps(30) infinite}
        .shrug{animation:ax-shrug 3s steps(36) infinite}
        .eye{transform-box:fill-box;transform-origin:center;animation:ax-blink 4s steps(48) infinite}
        @media (prefers-reduced-motion: reduce){.ring,.hand,.head,.thumb,.shrug,.eye{animation:none}}
      `}</style>

      {/* set */}
      <rect width="400" height="300" fill="#2a1d16" />
      <rect width="400" height="300" fill="url(#lamp)" />
      <path d="M0 225 H400 V300 H0Z" fill="#3a2f2a" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={i * 50} y1="225" x2={i * 50 - 30} y2="300" stroke="#2b221e" strokeWidth="3" />
      ))}
      {/* backdrop sweep */}
      <path d="M40 40 H250 V200 Q250 225 225 225 H40Z" fill="#d9cbb8" filter="url(#clay)" opacity=".9" />
      {/* softbox */}
      <g filter="url(#clay)">
        <rect x="318" y="55" width="54" height="42" rx="6" fill="#f4efe6" />
        <rect x="343" y="97" width="4" height="128" fill="#1d1d1f" />
        <path d="M333 225 L345 205 L357 225" stroke="#1d1d1f" strokeWidth="4" fill="none" />
      </g>

      {pose === "tangled" ? (
        <g filter="url(#clay)" className="shrug">
          {/* sitting Axel tangled in film */}
          <ellipse cx="190" cy="232" rx="62" ry="16" fill="#1b1b1d" />
          <path d="M140 230 Q150 170 190 165 Q230 170 240 230Z" fill="#6b7045" />
          <circle cx="190" cy="132" r="36" fill="#b9825e" />
          <path d="M152 118 Q190 80 228 118 Q222 104 190 100 Q160 102 152 118Z" fill="#1d1d1f" />
          <rect x="150" y="114" width="80" height="10" rx="5" fill="#1d1d1f" />
          <circle className="eye" cx="178" cy="134" r="5" fill="#fff" />
          <circle className="eye" cx="202" cy="134" r="5" fill="#fff" />
          <circle cx="179" cy="135" r="2" fill="#111" />
          <circle cx="201" cy="135" r="2" fill="#111" />
          <path d="M180 152 Q190 148 200 152" stroke="#5a3322" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M110 200 C160 150 240 260 280 190 S200 150 150 230 S260 250 300 210" stroke="#6a3b1f" strokeWidth="7" fill="none" opacity=".95" />
          <circle cx="300" cy="222" r="22" fill="#2b2b2e" stroke="#555" strokeWidth="3" />
        </g>
      ) : (
        <g filter="url(#clay)">
          {/* tripod + camera */}
          <path d="M270 170 L245 225 M270 170 L295 225 M270 170 L270 225" stroke="#1d1d1f" strokeWidth="6" strokeLinecap="round" />
          <rect x="232" y="132" width="70" height="40" rx="8" fill="#1f1f22" />
          <rect x="240" y="120" width="28" height="14" rx="4" fill="#1f1f22" />
          <g className="ring">
            <circle cx="258" cy="150" r="16" fill="#2c2c30" />
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} x="256" y="134" width="4" height="6" fill="#4a4a50" transform={`rotate(${i * 45} 258 150)`} />
            ))}
          </g>
          <circle cx="226" cy="150" r="11" fill="#6ab0ff" opacity=".7" />
          <circle cx="223" cy="146" r="3" fill="#fff" opacity=".9" />

          {/* Axel */}
          <g>
            <path d="M120 225 L125 190 L145 190 L148 225Z" fill="#232326" />
            <path d="M152 225 L155 190 L175 190 L178 225Z" fill="#232326" />
            <ellipse cx="132" cy="226" rx="16" ry="7" fill="#f3f1ec" />
            <ellipse cx="168" cy="226" rx="16" ry="7" fill="#f3f1ec" />
            <path d="M112 195 Q115 150 150 146 Q185 150 188 195Z" fill="#2a2a2d" />
            <path d="M118 195 Q120 158 136 152 L140 195Z M182 195 Q180 158 164 152 L160 195Z" fill="#6b7045" />
            <rect x="122" y="170" width="12" height="9" rx="2" fill="#5b603a" />
            <rect x="166" y="170" width="12" height="9" rx="2" fill="#5b603a" />
            <path d="M150 150 L150 178" stroke="#1d1d1f" strokeWidth="1.5" />
            <rect x="144" y="176" width="13" height="10" rx="3" fill="#e8a87c" />
          </g>
          <g className="head">
            <circle cx="150" cy="122" r="30" fill="#b9825e" />
            <ellipse cx="176" cy="126" rx="9" ry="7" fill="#a8704f" />
            <path d="M118 112 Q150 76 182 112 Q176 98 150 94 Q124 98 118 112Z" fill="#1d1d1f" />
            <path d="M116 110 Q112 118 104 116 Q108 108 118 106Z" fill="#1d1d1f" />
            <rect x="118" y="106" width="64" height="9" rx="4" fill="#1d1d1f" />
            <circle className="eye" cx="162" cy="122" r="5" fill="#fff" />
            <circle cx="164" cy="123" r="2.2" fill="#111" />
            <path d="M156 113 L170 111" stroke="#1d1d1f" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M160 140 Q168 138 173 141" stroke="#5a3322" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M134 132 Q150 150 172 138" stroke="#4a3328" strokeWidth="4" fill="none" opacity=".35" />
          </g>
          {pose === "thumbs" ? (
            <g className="thumb">
              <path d="M186 175 Q205 185 216 178" stroke="#2a2a2d" strokeWidth="14" strokeLinecap="round" fill="none" />
              <circle cx="222" cy="176" r="12" fill="#b9825e" />
              <rect x="218" y="150" width="9" height="22" rx="4.5" fill="#b9825e" />
            </g>
          ) : (
            <g className="hand">
              <path d="M184 170 Q210 165 236 158" stroke="#2a2a2d" strokeWidth="13" strokeLinecap="round" fill="none" />
              <ellipse cx="244" cy="156" rx="12" ry="10" fill="#b9825e" />
            </g>
          )}
        </g>
      )}
    </svg>
  );
}
