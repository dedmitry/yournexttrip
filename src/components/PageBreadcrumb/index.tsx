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


export default function Breadcrumb({ tripTitle }: { tripTitle: string }) {
  return (
    <div style={{
      background: t.bgSecondary,
      borderBottom: `0.5px solid ${t.border}`,
    }}>
      <div style={{
        maxWidth: 1120, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 44, gap: 12,
      }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: t.textMuted }}>
          <a href="#" style={{ color: t.textMuted, textDecoration: "none" }}>My trips</a>
          <span style={{ color: t.textHint }}>›</span>
          <span style={{ color: t.text, fontWeight: 500 }}>{tripTitle}</span>
        </div>

        {/* Toolbar actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {["Share", "PDF"].map((label) => (
            <button key={label} style={{
              fontSize: 12, padding: "4px 12px", borderRadius: 20,
              border: `0.5px solid ${t.border}`, background: t.bg,
              color: t.textMuted, cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 5,
            }}>{label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

//, "Duplicate"