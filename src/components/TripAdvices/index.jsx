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


export default function TripFooterCard({ meta, stops }) {
  const ALL_TIPS = [
    { icon: "💴", category: "Money",       text: "Japan is still largely cash-based. Withdraw yen at 7-Eleven ATMs — they reliably accept foreign cards with no surprises." },
    { icon: "🚇", category: "Transit",     text: "Get an IC Suica card at any JR station. Tap in and out on every metro, bus, and even convenience stores — no need to buy individual tickets." },
    { icon: "📶", category: "Connectivity",text: "Collect your pre-ordered Pocket WiFi at the NRT arrival hall. Keeps all devices online and avoids roaming charges entirely." },
    { icon: "👟", category: "Packing",     text: "Wear slip-on shoes — you'll remove them constantly at temples, traditional restaurants, and ryokan. Pack light layers for shrine hikes." },
    { icon: "🍣", category: "Dining",      text: "Reservations are essential for omakase spots. Book Sushi Saito and Kikunoi months ahead. For ramen and conveyor sushi, just walk in." },
    { icon: "🗣", category: "Language",    text: "Download Google Translate with Japanese offline. Point your camera at menus for instant translation — a game changer at local spots." },
    { icon: "🚅", category: "Shinkansen",  text: "Buy Shinkansen tickets at the JR office with your passport. The IC Suica card does not work for bullet trains — you need a separate ticket." },
    { icon: "⛩",  category: "Etiquette",  text: "At temples and shrines: bow before entering, don't point at altars, and keep voices low. Photography is usually fine outdoors, restricted inside." },
    { icon: "🧳", category: "Luggage",     text: "Use takuhaibin (luggage forwarding) from your hotel to Kyoto — ¥2,000 per bag. Arrives next morning so you travel hands-free on the Shinkansen." },
    { icon: "🌦", category: "Weather",     text: "September in Tokyo is warm and humid (26–32°C). Carry a compact umbrella — afternoon rain showers are common. Kyoto is slightly cooler." },
  ];

  const [dismissed, setDismissed] = useState(new Set());
  const visible = ALL_TIPS.filter((tip) => !dismissed.has(tip.category));

  const categoryColors = {
    Money:        { bg: "#FAEEDA", text: "#633806" },
    Transit:      { bg: "#E6F1FB", text: "#0C447C" },
    Connectivity: { bg: "#EEEDFE", text: "#3C3489" },
    Packing:      { bg: "#EAF3DE", text: "#27500A" },
    Dining:       { bg: "#FAEEDA", text: "#633806" },
    Language:     { bg: "#E6F1FB", text: "#0C447C" },
    Shinkansen:   { bg: "#E6F1FB", text: "#0C447C" },
    Etiquette:    { bg: "#EAF3DE", text: "#27500A" },
    Luggage:      { bg: "#EEEDFE", text: "#3C3489" },
    Weather:      { bg: "#EAF3DE", text: "#27500A" },
  };

  return (
    <div style={{
      background: t.bgSecondary, border: `0.5px solid ${t.border}`,
      borderRadius: t.radiusMd, padding: "16px 20px", marginTop: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Travel advice</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginTop: 1 }}>
            {visible.length} of {ALL_TIPS.length} tips
          </div>
        </div>
        {dismissed.size > 0 && (
          <button
            onClick={() => setDismissed(new Set())}
            style={{
              fontSize: 12, padding: "4px 12px", borderRadius: 20, cursor: "pointer",
              border: `0.5px solid ${t.border}`, background: t.bg,
              color: t.textMuted, fontFamily: "inherit",
            }}
          >Restore all</button>
        )}
      </div>

      {visible.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "24px 0",
          fontSize: 13, color: t.textHint,
        }}>
          All tips dismissed —{" "}
          <button onClick={() => setDismissed(new Set())} style={{
            fontSize: 13, color: t.textMuted, background: "none",
            border: "none", cursor: "pointer", textDecoration: "underline",
            fontFamily: "inherit", padding: 0,
          }}>restore them</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {visible.map(({ icon, category, text }) => {
            const col = categoryColors[category] ?? { bg: t.bgSecondary, text: t.textMuted };
            return (
              <div key={category} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "10px 12px", borderRadius: t.radiusSm,
                background: t.bg, border: `0.5px solid ${t.border}`,
              }}>
                <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.3 }}>{icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    display: "inline-block", fontSize: 11, fontWeight: 500,
                    background: col.bg, color: col.text,
                    borderRadius: 20, padding: "1px 8px", marginBottom: 4,
                  }}>{category}</span>
                  <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.55 }}>{text}</div>
                </div>
                <button
                  onClick={() => setDismissed((prev) => new Set([...prev, category]))}
                  title="Dismiss tip"
                  aria-label="Dismiss tip"
                  style={{
                    flexShrink: 0, width: 22, height: 22, borderRadius: 6,
                    border: `0.5px solid ${t.border}`, background: "transparent",
                    cursor: "pointer", color: t.textHint,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontFamily: "inherit", marginTop: 1,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget).style.background = "#FCEBEB";
                    (e.currentTarget).style.color = "#A32D2D";
                    (e.currentTarget).style.borderColor = "#F7C1C1";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget).style.background = "transparent";
                    (e.currentTarget).style.color = t.textHint;
                    (e.currentTarget).style.borderColor = t.border;
                  }}
                >×</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}