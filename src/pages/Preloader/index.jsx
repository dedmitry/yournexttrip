import React, { useEffect, useState } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────

const t = {
  bg:         "#ffffff",
  text:       "#111111",
  textMuted:  "#666666",
  textHint:   "#bbbbbb",
  accentGrad: "linear-gradient(135deg, #FF3838 0%, #FFB347 100%)",
};

// ─── Preloader ────────────────────────────────────────────────────────────────

export default function Preloader({ onComplete }) {
    const [phase, setPhase] = useState("loading");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading progress
        const steps = [15, 35, 58, 72, 89, 100];
        let i = 0;
        const tick = setInterval(() => {
        if (i < steps.length) {
            setProgress(steps[i]);
            i++;
        } else {
            clearInterval(tick);
            setTimeout(() => {
            setPhase("done");
            setTimeout(() => {
                setPhase("out");
                setTimeout(() => onComplete?.(), 500);
            }, 700);
            }, 300);
        }
        }, 340);
        return () => clearInterval(tick);
    }, []);

    return (
        <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: t.bg,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        opacity: phase === "out" ? 0 : 1,
        transition: phase === "out" ? "opacity .5s ease" : "none",
        pointerEvents: phase === "out" ? "none" : "auto",
        }}>
        <style>{`
            @keyframes pulse {
            0%, 100% { opacity: 1 }
            50%       { opacity: .5 }
            }
            @keyframes spinArc {
            to { transform: rotate(360deg) }
            }
            @keyframes popIn {
            0%   { transform: scale(.7); opacity: 0 }
            70%  { transform: scale(1.08) }
            100% { transform: scale(1);   opacity: 1 }
            }
            @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(8px) }
            to   { opacity: 1; transform: translateY(0) }
            }
        `}</style>

        {/* Logo mark */}
        <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: t.accentGrad,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 30, color: "#fff", fontWeight: 600,
            marginBottom: 20,
            animation: phase === "done" ? "popIn .4s ease both" : "none",
        }}>Y</div>

        {/* Wordmark */}
        <div style={{
            fontSize: 20, fontWeight: 500, color: t.text,
            letterSpacing: "-0.4px", marginBottom: 6,
            animation: "fadeSlideUp .4s ease .1s both",
        }}>YourNextTrip</div>

        {/* Tagline */}
        <div style={{
            fontSize: 13, color: t.textMuted, marginBottom: 40,
            animation: "fadeSlideUp .4s ease .2s both",
        }}>
            {phase === "done" ? "All set. Let's go ✈" : "Getting everything ready…"}
        </div>

        {/* Progress bar */}
        <div style={{
            width: 200, height: 3, borderRadius: 99,
            background: "#f0f0ef", overflow: "hidden",
            animation: "fadeSlideUp .4s ease .25s both",
        }}>
            <div style={{
            height: "100%", borderRadius: 99,
            background: t.accentGrad,
            width: `${progress}%`,
            transition: "width .35s cubic-bezier(.4,0,.2,1)",
            }} />
        </div>

        {/* Percentage */}
        <div style={{
            fontSize: 11, color: t.textHint, marginTop: 10,
            fontVariantNumeric: "tabular-nums",
            animation: "fadeSlideUp .4s ease .3s both",
        }}>{progress}%</div>
        </div>
    );
}