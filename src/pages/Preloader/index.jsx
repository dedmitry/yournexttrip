import React, { useEffect, useState } from "react";

// ─── Design tokens (match the site header) ───────────────────────────────────

const t = {
  bg:        "#ffffff",
  text:      "#111827",
  textMuted: "#4A5568",
  textHint:  "#9AA3B2",
  track:     "#E1E5EC",
  font:      '"Schibsted Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif',
  // Dawn sky logo gradient
  logoGrad:  "linear-gradient(135deg, #7B6CF6 0%, #FF7E8A 50%, #FFC46B 100%)",
};

// Logo is 44px with 10px corners in the header; scaled to 64px here
const LOGO_SIZE = 64;
const LOGO_RADIUS = Math.round((10 / 44) * LOGO_SIZE); // ≈ 15px

// ─── Preloader ────────────────────────────────────────────────────────────────

export default function Preloader({ onComplete }) {
  const [phase, setPhase] = useState("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const steps = [15, 35, 58, 72, 89, 100];
    let i = 0;
    const timers = [];
    const tick = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
      } else {
        clearInterval(tick);
        timers.push(setTimeout(() => {
          setPhase("done");
          timers.push(setTimeout(() => {
            setPhase("out");
            timers.push(setTimeout(() => onComplete?.(), 500));
          }, 700));
        }, 300));
      }
    }, 340);
    return () => {
      clearInterval(tick);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: t.bg,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: t.font,
        opacity: phase === "out" ? 0 : 1,
        transition: phase === "out" ? "opacity .5s ease" : "none",
        pointerEvents: phase === "out" ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes popIn {
          0%   { transform: scale(.7); opacity: 0 }
          70%  { transform: scale(1.08) }
          100% { transform: scale(1);   opacity: 1 }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px) }
          to   { opacity: 1; transform: translateY(0) }
        }
        @media (prefers-reduced-motion: reduce) {
          .pl-anim { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* Logo mark — Dawn sky */}
      <div
        aria-hidden="true"
        className="pl-anim"
        style={{
          width: LOGO_SIZE, height: LOGO_SIZE, borderRadius: LOGO_RADIUS,
          background: t.logoGrad,
          marginBottom: 20,
          animation: phase === "done" ? "popIn .4s ease both" : "none",
        }}
      />

      {/* Wordmark */}
      <div
        className="pl-anim"
        style={{
          fontSize: 22, fontWeight: 800, lineHeight: "28px",
          color: t.text, letterSpacing: "-0.01em", marginBottom: 6,
          animation: "fadeSlideUp .4s ease .1s both",
        }}
      >
        YourNextTrip
      </div>

      {/* Tagline */}
      <div
        className="pl-anim"
        style={{
          fontSize: 14, lineHeight: "20px", color: t.textMuted, marginBottom: 40,
          animation: "fadeSlideUp .4s ease .2s both",
        }}
      >
        {phase === "done" ? "All set. Let's go ✈" : "Getting everything ready…"}
      </div>

      {/* Progress bar */}
      <div
        className="pl-anim"
        role="progressbar"
        aria-label="Loading"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        style={{
          width: 200, height: 4, borderRadius: 99,
          background: t.track, overflow: "hidden",
          animation: "fadeSlideUp .4s ease .25s both",
        }}
      >
        <div
          className="pl-anim"
          style={{
            height: "100%", borderRadius: 99,
            // Size the gradient to the full track so colors stay fixed as it fills
            backgroundImage: "linear-gradient(90deg, #7B6CF6 0%, #FF7E8A 50%, #FFC46B 100%)",
            backgroundSize: "200px 100%",
            width: `${progress}%`,
            transition: "width .35s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </div>

      {/* Percentage */}
      <div
        className="pl-anim"
        style={{
          fontSize: 12, color: t.textHint, marginTop: 10,
          fontVariantNumeric: "tabular-nums",
          animation: "fadeSlideUp .4s ease .3s both",
        }}
      >
        {progress}%
      </div>
    </div>
  );
}