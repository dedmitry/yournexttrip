import React from "react";


// ─── Design tokens ────────────────────────────────────────────────────────────

const t = {
  bg:           "var(--color-background-primary,    #ffffff)",
  bgSecondary:  "var(--color-background-secondary,  #f9f9f8)",
  bgTertiary:   "var(--color-background-tertiary,   #f3f3f1)",
  text:         "var(--color-text-primary,           #111111)",
  textMuted:    "var(--color-text-secondary,         #666666)",
  textHint:     "var(--color-text-tertiary,          #bbbbbb)",
  border:       "var(--color-border-tertiary,        #e5e5e3)",
  borderMd:     "var(--color-border-secondary,       #ccccca)",
  borderHeavy:  "var(--color-border-primary,         #999997)",
  accentGrad:   "linear-gradient(135deg, #FF3838 0%, #FFB347 100%)",
  radiusSm:     8,
  radiusMd:     12,
  radiusLg:     16,
};


export default function SiteFooter() {
  return (
    <footer style={{ borderTop: `0.5px solid ${t.border}`, background: t.bgTertiary, marginTop: 80 }}>
      <div style={{
        maxWidth: 1120, margin: "0 auto", padding: "20px 12px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, background: t.accentGrad, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, color: "#fff", fontWeight: 500,
          }}></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: t.text, letterSpacing: "-0.3px", lineHeight: 1.2 }}>
              YourNextTrip
            </span>
            <span style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.3 }}>
              Plan your perfect trip — every stop, every moment.
            </span>
          </div>
        </a>
        <span style={{ fontSize: 12, color: t.textHint }}>
          © 2025 YourNextTrip, Inc. All rights reserved.
        </span>
      </div>
    </footer>
  );
}