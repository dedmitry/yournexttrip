import React from "react";


// ─── Design tokens ────────────────────────────────────────────────────────────

const t = {
  bg:          "var(--color-background-primary,   #ffffff)",
  bgSecondary: "var(--color-background-secondary, #f9f9f8)",
  bgTertiary:  "var(--color-background-tertiary,  #f3f3f1)",
  text:        "var(--color-text-primary,          #111111)",
  textMuted:   "var(--color-text-secondary,        #666666)",
  textHint:    "var(--color-text-tertiary,         #bbbbbb)",
  border:      "var(--color-border-tertiary,       #e5e5e3)",
  borderMd:    "var(--color-border-secondary,      #ccccca)",
  borderHeavy: "var(--color-border-primary,        #999997)",
  accentGrad:  "linear-gradient(135deg, #FF3838 0%, #FFB347 100%)",
  radiusSm:    8,
  radiusMd:    12,
  radiusLg:    16,
};


export default function EmptyState({ onNew }) {
    return (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", maxWidth: 380 }}>
                <p style={{
                fontSize: 17, color: t.textMuted, lineHeight: 1.7,
                marginBottom: 28,
                }}>
                Your next great adventure is waiting. ✨<br />
                Every journey starts with a single plan — make yours
                unforgettable, one stop at a time.
                </p>

                <button
                onClick={onNew}
                style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    fontSize: 16, padding: "13px 28px", borderRadius: 24,
                    border: "none", background: t.accentGrad,
                    color: t.bg, cursor: "pointer", fontFamily: "inherit",
                    fontWeight: 500,
                }}
                >+ Plan a new trip</button>
            </div>
        </div>
    );
}