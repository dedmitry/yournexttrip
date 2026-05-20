import React, { useState } from "react";
import { useParams } from "react-router-dom";


import Header from "@components/PageHeader";
import Breadcrumb from "@components/PageBreadcrumb";
import Footer from "@components/PageFooter";

import { getTrip, saveTrip } from "@utils/storage";
import { t, STOP_TYPE_CONFIG } from "@lib/config";


// ─── Constants ────────────────────────────────────────────────────────────────

/*const STOP_CONFIG = {
  transport: { label: "Transport",  icon: "✈", dotColor: "#85B7EB", badgeBg: "#E6F1FB", badgeText: "#0C447C", iconBg: "#E6F1FB", iconColor: "#0C447C" },
  hotel:     { label: "Hotel",      icon: "⌂", dotColor: "#AFA9EC", badgeBg: "#EEEDFE", badgeText: "#3C3489", iconBg: "#EEEDFE", iconColor: "#3C3489" },
  place:     { label: "Place",      icon: "◎", dotColor: "#97C459", badgeBg: "#EAF3DE", badgeText: "#27500A", iconBg: "#EAF3DE", iconColor: "#27500A" },
  food:      { label: "Restaurant", icon: "⊕", dotColor: "#EF9F27", badgeBg: "#FAEEDA", badgeText: "#633806", iconBg: "#FAEEDA", iconColor: "#633806" },
};*/

const DAY_LABELS = {
  1: "Day 1 · Wed Sep 3 — Arrival & Shinjuku",
  2: "Day 2 · Thu Sep 4 — Asakusa, TeamLab & Shibuya",
  3: "Day 3 · Fri Sep 5 — Kyoto day trip",
  4: "Day 4 · Sat Sep 6 — Kyoto temples & return",
  5: "Day 5 · Sun Sep 7 — Markets, Akihabara & departure",
};

const INITIAL_META = {
  title: "Tokyo Explorer",
  flag: "🗼",
  region: "Asia · Japan",
  dates: "Sep 3 – 8, 2025",
  days: 5,
  cities: "Tokyo + Kyoto",
  travelers: 2,
  budget: "¥180,000 (~$1,200 USD) per person",
  wifiNote: "Pocket WiFi pre-ordered · pick up at NRT arrival hall",
  transitNote: "IC Suica card recommended for all metro and transit in Tokyo",
};

const INITIAL_STOPS = [
  { id: 1,  day: 1, type: "transport", name: "Flight JFK → NRT",          detail: "Japan Airlines JL006 · Economy",     time: "Sep 3 · 11:00",    duration: "14h 5m",  travelNext: "50 min · Narita Express",  budget: "$1,200", link: "https://maps.app.goo.gl/JFK", notes: "Check-in 3h before. Gate 32B. Seats 34A & 34B." },
  { id: 2,  day: 1, type: "hotel",     name: "Shinjuku Granbell Hotel",    detail: "2-14-5 Kabukicho, Shinjuku-ku",     time: "Sep 3 · check-in", duration: "5 nights",travelNext: "5 min · walk",              budget: "$180/night", link: "https://maps.app.goo.gl/GranbellHotel", notes: "Early check-in requested. High-floor city view room." },
  { id: 3,  day: 1, type: "food",      name: "Ichiran Ramen",              detail: "3-34-11 Shinjuku, Tokyo",           time: "Sep 3 · 21:00",    duration: "45 min",  travelNext: "10 min · walk",             budget: "$12", link: "https://maps.app.goo.gl/IchiranShinjuku", notes: "Solo booth ramen — iconic first-night meal. No reservation needed." },
  { id: 4,  day: 1, type: "place",     name: "Kabukicho Neon Walk",        detail: "Kabukicho, Shinjuku",               time: "Sep 3 · 22:00",    duration: "1h",      travelNext: "",                          budget: "Free", link: "https://maps.app.goo.gl/Kabukicho", notes: "Electric nightlife streets. Safe area for tourists." },
  { id: 5,  day: 2, type: "place",     name: "Senso-ji Temple",            detail: "2-3-1 Asakusa, Taito-ku",           time: "Sep 4 · 07:30",    duration: "1h 30m",  travelNext: "3 min · walk",              budget: "Free", link: "https://maps.app.goo.gl/Sensoji", notes: "Go early to beat the crowds. Buy an omamori (lucky charm)." },
  { id: 6,  day: 2, type: "food",      name: "Asakusa Imahan",             detail: "1-3-12 Nishi-Asakusa, Taito",       time: "Sep 4 · 09:30",    duration: "1h",      travelNext: "25 min · metro",            budget: "$45", link: "https://maps.app.goo.gl/AsakusaImahan", notes: "Famous wagyu beef sukiyaki. Worth it for brunch." },
  { id: 7,  day: 2, type: "place",     name: "teamLab Borderless",         detail: "Azabudai Hills, Minato-ku",         time: "Sep 4 · 12:00",    duration: "2h 30m",  travelNext: "15 min · metro",            budget: "$32", link: "https://teamlabborderless.com", notes: "Pre-booked tickets required. No cameras inside." },
  { id: 8,  day: 2, type: "place",     name: "Shibuya Crossing",           detail: "Shibuya, Tokyo",                    time: "Sep 4 · 17:00",    duration: "1h",      travelNext: "8 min · walk",              budget: "Free", link: "https://maps.app.goo.gl/ShibuyaCrossing", notes: "Starbucks 2nd floor balcony for the best view." },
  { id: 9,  day: 2, type: "food",      name: "Sushi Saito",                detail: "1-9-15 Akasaka, Minato-ku",         time: "Sep 4 · 19:30",    duration: "1h 30m",  travelNext: "20 min · taxi",             budget: "$180", link: "https://maps.app.goo.gl/SushiSaito", notes: "Omakase reservation confirmed. No phones allowed inside." },
  { id: 10, day: 3, type: "transport", name: "Shinkansen to Kyoto",        detail: "Nozomi 11 · Reserved car 5",        time: "Sep 5 · 08:15",    duration: "2h 15m",  travelNext: "20 min · taxi",             budget: "$120", link: "https://shinkansen.co.jp", notes: "Buy tickets at Shinkansen office the day before." },
  { id: 11, day: 3, type: "place",     name: "Fushimi Inari Shrine",       detail: "68 Fukakusa Yabunouchicho, Fushimi",time: "Sep 5 · 11:30",    duration: "2h",      travelNext: "30 min · bus",              budget: "$5", link: "https://maps.app.goo.gl/FushimiInari", notes: "Hike all the way to the top for fewer crowds and great views." },
  { id: 12, day: 3, type: "place",     name: "Arashiyama Bamboo Grove",    detail: "Sagaogurayama, Ukyo-ku",            time: "Sep 5 · 15:00",    duration: "1h 30m",  travelNext: "10 min · rickshaw",         budget: "$45", link: "https://maps.app.goo.gl/Arashiyama", notes: "Hire a rickshaw for ¥5,000 to explore in style." },
  { id: 13, day: 3, type: "food",      name: "Kikunoi Honten",             detail: "459 Shimokawara-cho, Higashiyama",  time: "Sep 5 · 19:00",    duration: "2h",      travelNext: "15 min · taxi",             budget: "$220", link: "https://maps.app.goo.gl/Kikunoi", notes: "Traditional kaiseki dinner. 3-Michelin stars. Smart casual." },
  { id: 14, day: 4, type: "place",     name: "Kinkaku-ji Golden Pavilion", detail: "1 Kinkakujicho, Kita-ku, Kyoto",   time: "Sep 6 · 08:00",    duration: "1h",      travelNext: "20 min · bus",              budget: "$5", link: "https://maps.app.goo.gl/Kinkakuji", notes: "Arrive just before 9AM opening. Beautiful just after sunrise." },
  { id: 15, day: 4, type: "place",     name: "Nishiki Market",             detail: "Nakagyo-ku, Kyoto",                 time: "Sep 6 · 10:30",    duration: "1h 30m",  travelNext: "8 min · walk",              budget: "Free", link: "https://maps.app.goo.gl/NishikiMarket", notes: "Try yudofu, pickled vegetables, and fresh mochi." },
  { id: 16, day: 4, type: "food",      name: "Honke Owariya",              detail: "322 Niomon-cho, Kamigyo-ku",        time: "Sep 6 · 13:00",    duration: "1h",      travelNext: "2h 10m · Shinkansen",       budget: "$28", link: "https://maps.app.goo.gl/HonkeOwariya", notes: "Oldest soba restaurant in Kyoto (est. 1465). Order hourai soba." },
  { id: 17, day: 4, type: "transport", name: "Shinkansen back to Tokyo",   detail: "Hikari 522 · Reserved car 7",       time: "Sep 6 · 15:30",    duration: "2h 30m",  travelNext: "30 min · metro",            budget: "$95", link: "https://shinkansen.co.jp", notes: "" },
  { id: 18, day: 4, type: "food",      name: "Gonpachi Nishi-Azabu",       detail: "1-13-11 Nishi-Azabu, Minato-ku",   time: "Sep 6 · 20:00",    duration: "2h",      travelNext: "15 min · metro",            budget: "$60", link: "https://maps.app.goo.gl/Gonpachi", notes: "The restaurant that inspired Kill Bill Vol. 1. Great yakitori." },
  { id: 19, day: 5, type: "place",     name: "Tsukiji Outer Market",       detail: "4-16-2 Tsukiji, Chuo-ku",           time: "Sep 7 · 07:00",    duration: "1h 30m",  travelNext: "10 min · walk",             budget: "$25", link: "https://maps.app.goo.gl/Tsukiji", notes: "Best tuna sashimi breakfast. Go early before stalls sell out." },
  { id: 20, day: 5, type: "place",     name: "teamLab Planets",            detail: "6-1-16 Toyosu, Koto-ku",            time: "Sep 7 · 11:00",    duration: "2h",      travelNext: "25 min · metro",            budget: "$32", link: "https://teamlabplanets.dmm.com", notes: "Different from Borderless. Go barefoot — art you walk through." },
  { id: 21, day: 5, type: "place",     name: "Akihabara Electric Town",    detail: "Akihabara, Chiyoda-ku",             time: "Sep 7 · 14:30",    duration: "2h",      travelNext: "5 min · walk",              budget: "$80", link: "https://maps.app.goo.gl/Akihabara", notes: "Last chance for electronics, anime, and retro game shopping." },
  { id: 22, day: 5, type: "food",      name: "Narikura Tempura",           detail: "2-11-9 Sotokanda, Chiyoda-ku",      time: "Sep 7 · 18:00",    duration: "1h 30m",  travelNext: "40 min · Narita Express",   budget: "$150", link: "https://maps.app.goo.gl/Narikura", notes: "Best tempura omakase in Tokyo. 8-seat counter. Booking essential." },
  { id: 23, day: 5, type: "transport", name: "Flight NRT → JFK",           detail: "Japan Airlines JL005 · Economy",    time: "Sep 8 · 09:55",    duration: "13h 45m", travelNext: "",                          budget: "$1,100", link: "https://maps.app.goo.gl/NRT", notes: "Allow 3h for airport — Narita is large. Print boarding pass in hotel." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countByType(stops) {
    return stops.reduce(
        (acc, s) => ({ ...acc, [s.type]: acc[s.type] + 1 }),
        { transport: 0, hotel: 0, place: 0, food: 0 }
    );
}

function totalBudget(stops) {
    let sum = 0;
    let hasAny = false;
    stops.forEach((s) => {
        if (!s.budget) return;
        const lower = s.budget.toLowerCase();
        if (lower === "free") return;
        // Strip currency symbols, commas, and grab first number (handles "$1,200", "$180/night")
        const match = s.budget.replace(/,/g, "").match(/[\d.]+/);
        if (match) { sum += parseFloat(match[0]); hasAny = true; }
    });
    if (!hasAny) return "—";
    return sum >= 1000
        ? `$${(sum / 1000).toFixed(1)}k`
        : `$${Math.round(sum)}`;
}

const inputStyle = {
  width: "100%", fontSize: 13, padding: "6px 10px",
  border: `0.5px solid ${t.border}`, borderRadius: t.radiusSm,
  fontFamily: "inherit", background: t.bg, color: t.text, outline: "none",
};

const saveBtnStyle = {
  fontSize: 13, padding: "5px 14px", borderRadius: t.radiusSm,
  border: `0.5px solid ${t.borderHeavy}`, background: t.text, color: t.bg,
  cursor: "pointer", fontFamily: "inherit",
};

const cancelBtnStyle = {
  fontSize: 13, padding: "5px 12px", borderRadius: t.radiusSm,
  border: `0.5px solid ${t.border}`, background: "transparent",
  color: t.textMuted, cursor: "pointer", fontFamily: "inherit",
};

function Field({ label, children, style }) {
  return (
    <div style={style}>
      <label style={{ fontSize: 11, color: t.textMuted, marginBottom: 3, display: "block" }}>{label}</label>
      {children}
    </div>
  );
}

function Chip({ children, style }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: t.bg, border: `0.5px solid ${t.border}`,
      borderRadius: 20, padding: "4px 11px", fontSize: 12, color: t.textMuted, ...style,
    }}>{children}</span>
  );
}


// ════════════════════════════════════════════════════════════════════════════
//  TRIP HEADER CARD (internal)
// ════════════════════════════════════════════════════════════════════════════

function TripHeaderCard({ meta, stops, onTitleChange }) {
  const counts = countByType(stops);
  const budget = totalBudget(stops);
  return (
    <div style={{
      background: t.bgSecondary, border: `0.5px solid ${t.border}`,
      borderRadius: t.radiusMd, padding: "20px 20px 16px", marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", background: t.bg,
              border: `0.5px solid ${t.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, flexShrink: 0,
            }}>{meta.flag}</div>
            <span style={{ fontSize: 13, color: t.textMuted }}>{meta.region}</span>
          </div>
          <input
            value={meta.title}
            onChange={(e) => onTitleChange(e.target.value)}
            aria-label="Trip title"
            style={{
              fontSize: 22, fontWeight: 500, color: t.text,
              border: "none", background: "transparent", outline: "none",
              width: "100%", fontFamily: "inherit", padding: 0,
              lineHeight: 1.2, marginTop: 6, marginBottom: 8, display: "block",
            }}
          />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Chip>📅 {meta.dates}</Chip>
            <Chip>⏱ {meta.days} days</Chip>
            <Chip style={{ background: t.bg, borderColor: t.border, color: t.textMuted }}>
              {budget}
            </Chip>
            <Chip>📍 {meta.cities}</Chip>
            <Chip>👥 {meta.travelers} travelers</Chip>
          </div>
        </div>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8,
        borderTop: `0.5px solid ${t.border}`, paddingTop: 14,
      }}>
        {["transport", "hotel", "place", "food"].map((type) => {
          const cfg = STOP_TYPE_CONFIG[type];
          return (
            <div key={type} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: t.text }}>{counts[type]}</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>
                {cfg.icon} {cfg.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  STOP CARD
// ════════════════════════════════════════════════════════════════════════════

function StopCard({ stop, isOpen, isLast, onToggle, onSave, onDelete, onMoveUp, onMoveDown }) {
  const cfg = STOP_TYPE_CONFIG[stop.type];
  const [draft, setDraft] = useState(stop);
  if (!isOpen && JSON.stringify(draft) !== JSON.stringify(stop)) setDraft(stop);

  const handleToggle = () => { if (isOpen) setDraft(stop); onToggle(); };

  const iconBtn = (label, title, action, danger = false) => (
    <button
      key={title} onClick={action} title={title} aria-label={title}
      style={{
        width: 24, height: 24, borderRadius: 6,
        border: `0.5px solid ${t.border}`, background: "transparent",
        cursor: "pointer", color: t.textMuted,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = danger ? "#FCEBEB" : t.bgSecondary;
        el.style.color = danger ? "#A32D2D" : t.text;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = "transparent";
        el.style.color = t.textMuted;
      }}
    >{label}</button>
  );

  return (
    <div style={{ display: "flex", gap: 0, position: "relative" }}>
      {/* Gutter */}
      <div className="stop-gutter" style={{ width: 44, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 11 }}>
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: cfg.iconBg, color: cfg.iconColor,
          border: `1.5px solid ${cfg.dotColor}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, flexShrink: 0, zIndex: 1,
        }}>{cfg.icon}</div>
        {!isLast && <div style={{ width: 1, background: t.border, flex: 1, minHeight: 8 }} />}
      </div>

      {/* Card body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          background: t.bg,
          border: `0.5px solid ${isOpen ? t.borderHeavy : t.border}`,
          borderRadius: t.radiusMd, overflow: "hidden", transition: "border-color .15s",
        }}>
          {/* Row */}
          <div onClick={handleToggle} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 12px", cursor: "pointer", userSelect: "none",
          }}>

            {/* Left: badge / name / detail */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{
                display: "inline-flex", alignItems: "center",
                borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 500,
                background: cfg.badgeBg, color: cfg.badgeText, whiteSpace: "nowrap", marginBottom: 4,
              }}>{cfg.label}</span>
              <div style={{ fontSize: 14, fontWeight: 500, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{stop.name}</div>
              <div style={{ fontSize: 12, color: t.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 1 }}>{stop.detail}</div>
            </div>

            {/* Right: time / chips / actions */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: t.textHint, whiteSpace: "nowrap" }}>{stop.time}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {stop.duration && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, color: t.textMuted, background: t.bgSecondary, borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap" }}>⏱ {stop.duration}</span>
                )}
                {stop.budget && (
                  <span className="stop-budget" style={{ fontSize: 11, fontWeight: 500, color: "#27500A", background: "#EAF3DE", borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap" }}>{stop.budget}</span>
                )}
                {stop.link && (
                  <a href={stop.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} title="Open link" style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    border: `0.5px solid ${t.border}`, background: t.bgSecondary,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: t.textMuted, textDecoration: "none",
                  }}>↗</a>
                )}
              </div>
              <div style={{ display: "flex", gap: 3 }} onClick={(e) => e.stopPropagation()}>
                {iconBtn("↑", "Move up",   onMoveUp)}
                {iconBtn("↓", "Move down", onMoveDown)}
                {iconBtn("×", "Delete",    onDelete, true)}
              </div>
            </div>

            <span className="stop-chevron" style={{ fontSize: 13, color: t.textHint, marginLeft: 2, flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}>⌄</span>
          </div>

          {/* Edit form */}
          {isOpen && (
            <div style={{ borderTop: `0.5px solid ${t.border}`, padding: "12px 14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 9 }}>
                <Field label="Type">
                  <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} style={inputStyle}>
                    <option value="transport">Transport</option>
                    <option value="hotel">Hotel</option>
                    <option value="place">Place</option>
                    <option value="food">Restaurant</option>
                  </select>
                </Field>
                <Field label="Date / time">
                  <input value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} style={inputStyle} placeholder="Sep 3 · 11:00" />
                </Field>
              </div>
              <Field label="Name" style={{ marginBottom: 9 }}>
                <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Address / details" style={{ marginBottom: 9 }}>
                <input value={draft.detail} onChange={(e) => setDraft({ ...draft, detail: e.target.value })} style={inputStyle} />
              </Field>
              <div style={{ marginBottom: 9 }}>
                <label style={{ fontSize: 11, color: t.textMuted, marginBottom: 3, display: "block" }}>Link (maps / info)</label>
                <div style={{ display: "flex", gap: 6 }}>
                  <input
                    value={draft.link}
                    onChange={(e) => setDraft({ ...draft, link: e.target.value })}
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="https://…"
                  />
                  <a
                    href={draft.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open link"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: 36, flexShrink: 0, borderRadius: t.radiusSm,
                      border: `0.5px solid ${draft.link ? t.borderMd : t.border}`,
                      background: draft.link ? t.text : t.bgSecondary,
                      color: draft.link ? t.bg : t.textHint,
                      fontSize: 13, textDecoration: "none",
                      pointerEvents: draft.link ? "auto" : "none",
                      transition: "background .15s, color .15s",
                    }}
                  >↗</a>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 9 }}>
                <Field label="Budget / cost">
                  <input value={draft.budget} onChange={(e) => setDraft({ ...draft, budget: e.target.value })} style={inputStyle} placeholder="e.g. $45 or Free" />
                </Field>
                <Field label="Duration">
                  <input value={draft.duration} onChange={(e) => setDraft({ ...draft, duration: e.target.value })} style={inputStyle} placeholder="e.g. 2h 30m" />
                </Field>
              </div>
              <Field label="Notes">
                <textarea value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 52 }} placeholder="Any extra info…" />
              </Field>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
                <button onClick={handleToggle} style={cancelBtnStyle}>Cancel</button>
                <button onClick={() => onSave(draft)} style={saveBtnStyle}>Save changes</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  TRANSIT ROW
// ════════════════════════════════════════════════════════════════════════════

function TransitRow({ stop, onSave }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(stop.travelNext);
  const save = () => { onSave(value); setEditing(false); };

  return (
    <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
      <div style={{ width: 44, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 1, background: t.border, flex: 1 }} />
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: t.borderMd, flexShrink: 0 }} />
        <div style={{ width: 1, background: t.border, flex: 1 }} />
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "4px 0" }}>
        {editing ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input autoFocus value={value} onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && save()}
              placeholder="e.g. 20 min · metro"
              style={{ ...inputStyle, width: 160, padding: "3px 8px", fontSize: 12 }} />
            <button onClick={save} style={{ ...saveBtnStyle, padding: "3px 10px", fontSize: 12 }}>Save</button>
            <button onClick={() => setEditing(false)} style={{ ...cancelBtnStyle, padding: "3px 10px", fontSize: 12 }}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => { setValue(stop.travelNext); setEditing(true); }} style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 11, color: t.textMuted, background: t.bgSecondary,
            border: `0.5px solid ${t.border}`, borderRadius: 20,
            padding: "3px 10px", cursor: "pointer", fontFamily: "inherit",
          }}>
            {stop.travelNext
              ? <><span>→</span>{stop.travelNext}<span style={{ fontSize: 10, opacity: 0.5 }}>✏</span></>
              : <><span>+</span>Add travel time</>}
          </button>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  DAY DIVIDER
// ════════════════════════════════════════════════════════════════════════════

function DayDivider({ day, isCurrent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0 10px" }}>
      <div style={{ flex: 1, height: isCurrent ? 1 : 0.5, background: isCurrent ? "#378ADD" : t.border }} />
      <span style={{
        fontSize: 11, fontWeight: isCurrent ? 500 : 400,
        whiteSpace: "nowrap", borderRadius: 20, padding: "4px 12px",
        background: isCurrent ? "#378ADD" : t.bgSecondary,
        color: isCurrent ? "#ffffff" : t.textMuted,
        border: isCurrent ? "none" : `0.5px solid ${t.border}`,
        display: "inline-flex", alignItems: "center", gap: 6,
      }}>
        {isCurrent ? "▶" : "☀"} {DAY_LABELS[day] ?? `Day ${day}`}
        {isCurrent && (
          <span style={{
            fontSize: 10, background: "rgba(255,255,255,0.25)",
            borderRadius: 20, padding: "1px 7px", marginLeft: 2,
          }}>Today</span>
        )}
      </span>
      <div style={{ flex: 1, height: isCurrent ? 1 : 0.5, background: isCurrent ? "#378ADD" : t.border }} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  ADD BAR
// ════════════════════════════════════════════════════════════════════════════

function AddBar({ onAdd, targetDay, compact }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      marginTop: compact ? 6 : 12,
      padding: compact ? "6px 10px" : "9px 12px",
      background: t.bgSecondary,
      border: `0.5px dashed ${t.borderMd}`, borderRadius: t.radiusMd,
    }}>
      <span style={{ fontSize: compact ? 12 : 13, color: t.textMuted, flexShrink: 0 }}>
        {compact ? `+ Day ${targetDay}` : "Add stop"}
      </span>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["transport", "hotel", "place", "food"].map((type) => {
          const cfg = STOP_TYPE_CONFIG[type];
          return (
            <button key={type} onClick={() => onAdd(type, targetDay)} style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: compact ? 11 : 12, padding: compact ? "3px 9px" : "4px 11px", borderRadius: 20,
              border: `0.5px solid ${t.border}`, background: t.bg,
              color: t.textMuted, cursor: "pointer", fontFamily: "inherit",
            }}>{cfg.icon} {cfg.label}</button>
          );
        })}
      </div>
    </div>
  );
}



// ════════════════════════════════════════════════════════════════════════════
//  TRIP PLANNER (internal logic)
// ════════════════════════════════════════════════════════════════════════════

function TripPlanner() {
	const [meta, setMeta] = useState(INITIAL_META);
	const [stops, setStops] = useState(INITIAL_STOPS);
	const [openId, setOpenId] = useState(null);
	const [nextId, setNextId] = useState(INITIAL_STOPS.length + 1);

	const toggleOpen = (id) => setOpenId((prev) => (prev === id ? null : id));

	const updateStop = (updated) => {
		setStops((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
		setOpenId(null);
	};

	const deleteStop = (id) => {
		setStops((prev) => prev.filter((s) => s.id !== id));
		if (openId === id) setOpenId(null);
	};

	const moveStop = (id, dir) => {
		setStops((prev) => {
		const idx = prev.findIndex((s) => s.id === id);
		const next = idx + dir;
		if (next < 0 || next >= prev.length) return prev;
		const arr = [...prev];
		[arr[idx], arr[next]] = [arr[next], arr[idx]];
		return arr;
		});
	};

	const updateTransit = (id, travelNext) =>
		setStops((prev) => prev.map((s) => (s.id === id ? { ...s, travelNext } : s)));

	const addStop = (type, targetDay) => {
		const day = targetDay ?? (stops.length > 0 ? stops[stops.length - 1].day : 1);
		const id = nextId;
		setNextId((n) => n + 1);
		const cfg = STOP_TYPE_CONFIG[type];
		const newStop = { id, day, type, name: `New ${cfg.label.toLowerCase()}`, detail: "", time: "", duration: "", travelNext: "", budget: "", link: "", notes: "" };
		setStops((prev) => {
		// Insert after the last stop of the target day
		const lastIdx = prev.map((s, i) => s.day === day ? i : -1).filter(i => i >= 0).pop();
		if (lastIdx === undefined) return [...prev, newStop];
		const arr = [...prev];
		arr.splice(lastIdx + 1, 0, newStop);
		return arr;
		});
		setOpenId(id);
	};

	const days = [...new Set(stops.map((s) => s.day))].sort();
	const currentDay = 3;
	const maxDay = days.length > 0 ? Math.max(...days) : 0;

	const addDay = () => {
		const newDay = maxDay + 1;
		const id = nextId;
		setNextId((n) => n + 1);
		setStops((prev) => [
		...prev,
		{ id, day: newDay, type: "place", name: "New stop", detail: "", time: "", duration: "", travelNext: "", budget: "", link: "", notes: "" },
		]);
		setOpenId(id);
	};

	return (
		<div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 12px 40px" }}>
			<TripHeaderCard meta={meta} stops={stops} onTitleChange={(v) => setMeta({ ...meta, title: v })} />

			{days.map((day) => {
				const dayStops = stops.filter((s) => s.day === day);
				return (
				<div key={day}>
					<DayDivider day={day} isCurrent={day === currentDay} />
					{dayStops.map((stop) => {
					const globalIdx = stops.findIndex((s) => s.id === stop.id);
					const isLastInTrip = globalIdx === stops.length - 1;
					return (
						<div key={stop.id}>
						<StopCard
							stop={stop} isOpen={openId === stop.id} isLast={isLastInTrip}
							onToggle={() => toggleOpen(stop.id)} onSave={updateStop}
							onDelete={() => deleteStop(stop.id)}
							onMoveUp={() => moveStop(stop.id, -1)}
							onMoveDown={() => moveStop(stop.id, 1)}
						/>
						{!isLastInTrip && (
							<TransitRow stop={stop} onSave={(v) => updateTransit(stop.id, v)} />
						)}
						</div>
					);
					})}
					<AddBar onAdd={addStop} targetDay={day} compact />
				</div>
				);
			})}

			<AddBar onAdd={addStop} />

			{/* Add day */}
			<button
				onClick={addDay}
				style={{
				display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
				width: "100%", marginTop: 8, padding: "9px 12px",
				background: "transparent", border: `0.5px dashed ${t.borderMd}`,
				borderRadius: t.radiusMd, cursor: "pointer", fontFamily: "inherit",
				fontSize: 13, color: t.textMuted,
				transition: "background .12s, color .12s",
				}}
				onMouseEnter={(e) => {
				(e.currentTarget).style.background = t.bgSecondary;
				(e.currentTarget).style.color = t.text;
				}}
				onMouseLeave={(e) => {
				(e.currentTarget).style.background = "transparent";
				(e.currentTarget).style.color = t.textMuted;
				}}
			>
				+ Add day {maxDay + 1}
			</button>
		</div>
	);
}

// ════════════════════════════════════════════════════════════════════════════
//  PAGE ROOT  ← default export
// ════════════════════════════════════════════════════════════════════════════

export default function TripDetail() {
    const { id } = useParams();
    //const tripId = Number(id);

    const [stops, setStops] = useState(INITIAL_STOPS);
    const [meta] = useState(INITIAL_META);

      // Load from DB on mount
    useEffect(() => {
        if (!tripId) { setLoaded(true); return; }

        getTrip(tripId).then((trip) => {
        if (trip) {
            setMeta(trip.meta);
            setStops(trip.stops);
        }
        setLoaded(true);
        }).catch(() => setLoaded(true));
    }, [tripId]);

    return (
		<div style={{ minHeight: "100vh", background: t.bg, fontFamily: "system-ui, -apple-system, sans-serif" }}>
			<style>{`@media (max-width: 600px) { .stop-chevron { display: none !important; } .stop-gutter { display: none !important; } .stop-budget { display: none !important; } }`}</style>
			<Header />
			<Breadcrumb tripTitle={meta.title} />
			<main>
				<TripPlanner />
			</main>
			<Footer />
		</div>
    );
}