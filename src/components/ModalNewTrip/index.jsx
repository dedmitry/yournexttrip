import React, { useState } from "react";

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
  accentGrad:  "linear-gradient(135deg, #FF3838 0%, #FFB347 100%)",
  radiusSm:    8,
  radiusMd:    12,
  radiusLg:    16,
};

// ─── Shared form helpers ──────────────────────────────────────────────────────

function FormField({ label, children, style }) {
  return (
    <div style={style}>
      <label style={{ fontSize: 11, color: t.textMuted, display: "block", marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", fontSize: 13, padding: "8px 10px",
  border: `0.5px solid ${t.border}`, borderRadius: t.radiusSm,
  fontFamily: "inherit", background: t.bg, color: t.text,
  outline: "none", boxSizing: "border-box",
};

// ─── NewTripModal ─────────────────────────────────────────────────────────────

export default function NewTripModal({ onClose, onCreate }) {
  const [title, setTitle]         = useState("");
  const [dest, setDest]           = useState("");
  const [dateFrom, setDateFrom]   = useState("");
  const [dateTo, setDateTo]       = useState("");
  const [travelers, setTravelers] = useState("2");
  const [submitted, setSubmitted] = useState(false);

  const valid = title.trim().length > 0;

  const days = dateFrom && dateTo
    ? Math.max(1, Math.round((new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / 86400000) + 1)
    : null;

  const handleCreate = () => {
    if (!valid) return;
    setSubmitted(true);
    onCreate({
      id: Date.now(),
      title: title.trim(),
      flag: "✈",
      destination: dest || "—",
      region: "—",
      //dates: dates || "—", 
      days: parseInt(days) || 0,
      travelers: parseInt(travelers) || 1,
      stops: 0,
      budget: "—",
      status: "planning",
      coverColor: "#EEEDFE",
    });
    onClose();
    setTimeout(onClose, 1400);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        backdropFilter: "blur(2px)",
        animation: "fadeIn .15s ease",
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes pop     { 0% { transform: scale(.95) } 60% { transform: scale(1.04) } 100% { transform: scale(1) } }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.5; }
        input[type="date"]::-webkit-calendar-picker-indicator:hover { opacity: 1; }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: t.bg, borderRadius: t.radiusLg,
          border: `0.5px solid ${t.border}`,
          width: "100%", maxWidth: 480,
          boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
          animation: "slideUp .2s ease",
          overflow: "hidden",
        }}
      >
        {/* Header strip */}
        <div style={{ padding: "20px 24px 16px", borderBottom: `0.5px solid ${t.border}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 600, color: t.text, marginBottom: 2 }}>
                Plan a new trip
              </div>
              <div style={{ fontSize: 12, color: t.textMuted }}>
                Fill in the basics — you can add stops later
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 28, height: 28, borderRadius: "50%",
              background: t.bgSecondary, border: `0.5px solid ${t.border}`,
              color: t.textMuted, cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>×</button>
          </div>
        </div>

        {submitted ? (
          <div style={{ padding: "40px 24px", textAlign: "center", animation: "pop .35s ease" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: t.text, marginBottom: 6 }}>
              "{title}" is ready!
            </div>
            <div style={{ fontSize: 13, color: t.textMuted }}>Time to start adding stops…</div>
          </div>
        ) : (
          <div style={{ padding: "20px 24px 24px" }}>

            {/* Title */}
            <FormField label={<>Trip title <span style={{ color: "#E63946" }}>*</span></>} style={{ marginBottom: 14 }}>
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Tokyo Explorer"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                style={{ ...inputStyle, fontSize: 14, borderColor: title.trim() ? t.borderMd : t.border }}
              />
            </FormField>

            {/* Destination */}
            <FormField label="Destination" style={{ marginBottom: 14 }}>
              <input value={dest} onChange={(e) => setDest(e.target.value)}
                placeholder="e.g. Tokyo & Kyoto, Japan" style={inputStyle} />
            </FormField>

            {/* Date range */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Dates</div>
              <div style={{
                display: "flex", alignItems: "center",
                border: `0.5px solid ${t.border}`, borderRadius: t.radiusSm,
                background: t.bg, overflow: "hidden",
              }}>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    if (dateTo && e.target.value > dateTo) setDateTo("");
                  }}
                  style={{
                    flex: 1, fontSize: 13, padding: "8px 10px",
                    border: "none", outline: "none",
                    background: "transparent", color: dateFrom ? t.text : t.textHint,
                    fontFamily: "inherit", minWidth: 0,
                  }}
                />
                <div style={{
                  padding: "0 8px", fontSize: 13, color: t.textHint,
                  borderLeft: `0.5px solid ${t.border}`,
                  borderRight: `0.5px solid ${t.border}`,
                  display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
                  height: 38,
                }}>
                  →
                  {days !== null && (
                    <span style={{
                      fontSize: 11, fontWeight: 500,
                      background: t.bgSecondary, borderRadius: 20,
                      padding: "1px 7px", color: t.textMuted,
                    }}>{days}d</span>
                  )}
                </div>
                <input
                  type="date"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(e) => setDateTo(e.target.value)}
                  style={{
                    flex: 1, fontSize: 13, padding: "8px 10px",
                    border: "none", outline: "none",
                    background: "transparent", color: dateTo ? t.text : t.textHint,
                    fontFamily: "inherit", minWidth: 0,
                  }}
                />
              </div>
            </div>

            {/* Travelers */}
            <FormField label="Travelers" style={{ marginBottom: 20 }}>
              <div style={{
                display: "flex", alignItems: "center",
                border: `0.5px solid ${t.border}`, borderRadius: t.radiusSm,
                overflow: "hidden", width: 120,
              }}>
                <button onClick={() => setTravelers(String(Math.max(1, Number(travelers) - 1)))}
                  style={{ width: 36, height: 38, flexShrink: 0, background: t.bgSecondary, border: "none", cursor: "pointer", fontSize: 18, color: t.textMuted }}>−</button>
                <span style={{ flex: 1, textAlign: "center", fontSize: 14, color: t.text, fontWeight: 500 }}>{travelers}</span>
                <button onClick={() => setTravelers(String(Number(travelers) + 1))}
                  style={{ width: 36, height: 38, flexShrink: 0, background: t.bgSecondary, border: "none", cursor: "pointer", fontSize: 18, color: t.textMuted }}>+</button>
              </div>
            </FormField>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={onClose} style={{
                fontSize: 13, padding: "8px 18px", borderRadius: 20,
                border: `0.5px solid ${t.border}`, background: "transparent",
                color: t.textMuted, cursor: "pointer", fontFamily: "inherit",
              }}>Cancel</button>
              <button onClick={handleCreate} disabled={!valid} style={{
                fontSize: 13, padding: "8px 20px", borderRadius: 20,
                border: valid ? "0.5px solid #FF3838" : `0.5px solid ${t.border}`,
                background: valid ? t.accentGrad : t.bgSecondary,
                color: valid ? "#fff" : t.textHint,
                cursor: valid ? "pointer" : "default",
                fontFamily: "inherit", fontWeight: 500,
                transition: "opacity .15s",
              }}>Create trip →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}