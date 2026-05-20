import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Footer from "@components/PageFooter";

import { initDB } from "@utils/storage";


// ─── Design tokens ────────────────────────────────────────────────────────────

const GRAD = "linear-gradient(135deg, #FF3838 0%, #FFB347 100%)";
const GRAD_TEXT = "linear-gradient(135deg, #FF3838 0%, #FF8C00 60%, #FFB347 100%)";

const t = {
  bg:         "var(--color-background-primary,   #ffffff)",
  bgSecondary:"var(--color-background-secondary, #f9f9f8)",
  bgTertiary: "var(--color-background-tertiary,  #f3f3f1)",
  text:       "var(--color-text-primary,          #111111)",
  textMuted:  "var(--color-text-secondary,        #666666)",
  textHint:   "var(--color-text-tertiary,         #bbbbbb)",
  border:     "var(--color-border-tertiary,       #e5e5e3)",
  borderMd:   "var(--color-border-secondary,      #ccccca)",
  radiusSm:   8,
  radiusMd:   12,
  radiusLg:   16,
};

// ─── Feature data ─────────────────────────────────────────────────────────────




// ─── Helpers ──────────────────────────────────────────────────────────────────

function useVisible(threshold = 0.15) {
  const [ref, setRef] = useState(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref]);
  return [setRef, visible];
}

// ─── SiteHeader ───────────────────────────────────────────────────────────────

function SiteHeader({ onCTA }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header 
    
    style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? t.bg : "transparent",
      borderBottom: scrolled ? `0.5px solid ${t.border}` : "none",
      transition: "background .2s, border-color .2s",
    }}>
      <div style={{
        maxWidth: 1120, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 60,
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: GRAD,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, color: "#fff", fontWeight: 700,
          }}></div>
          <span style={{ fontSize: 15, fontWeight: 600, color: t.text, letterSpacing: "-0.3px" }}>
            YourNextTrip
          </span>
        </Link>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={onCTA} style={{
            fontSize: 13, padding: "7px 16px", borderRadius: 20,
            border: "none", background: GRAD,
            color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
          }}>Start for free</button>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ onCTA }) {
  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "120px 24px 80px", textAlign: "center",
      background: `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,56,56,0.07) 0%, transparent 70%), ${t.bg}`,
    }}>
      <div style={{ maxWidth: 760 }}>

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: t.bgSecondary, border: `0.5px solid ${t.border}`,
          borderRadius: 20, padding: "5px 14px", marginBottom: 32,
          fontSize: 12, color: t.textMuted,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4CAF50", display: "inline-block" }} />
          Free to start · No credit card needed
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: "clamp(42px, 8vw, 72px)", fontWeight: 700, lineHeight: 1.08,
          letterSpacing: "-2.5px", color: t.text, margin: "0 0 24px",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}>
          Your next trip,{" "}
          <span style={{
            background: GRAD_TEXT,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            planned perfectly.
          </span>
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: 18, color: t.textMuted, lineHeight: 1.7,
          maxWidth: 520, margin: "0 auto 40px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}>
          Build beautiful day-by-day itineraries — every stop, every meal,
          every transfer — in one place. Share in a tap.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onCTA} style={{
            fontSize: 15, padding: "13px 28px", borderRadius: 28,
            border: "none", background: GRAD, color: "#fff",
            cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
            boxShadow: "0 4px 20px rgba(255,56,56,0.28)",
          }}>Plan my trip →</button>
          <button
          onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
          style={{
            fontSize: 15, padding: "13px 28px", borderRadius: 28,
            border: `0.5px solid ${t.borderMd}`, background: "transparent",
            color: t.text, cursor: "pointer", fontFamily: "inherit",
          }}>See an example</button>
        </div>

        {/* Trust line */}
        <p style={{ fontSize: 13, color: t.textHint, marginTop: 24 }}>
          Trusted by 12,000+ travellers · 4.9 ★ rating
        </p>
      </div>
    </section>
  );
}

// ─── Feature SVG icons ────────────────────────────────────────────────────────

const FEATURE_ICONS = {
  "01": (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="7" r="2" stroke="#FF3838" strokeWidth="1.5"/>
      <line x1="10" y1="7" x2="24" y2="7" stroke="#FF3838" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="6" cy="14" r="2" stroke="#FF7A00" strokeWidth="1.5"/>
      <line x1="10" y1="14" x2="24" y2="14" stroke="#FF7A00" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="6" cy="21" r="2" stroke="#FFB347" strokeWidth="1.5"/>
      <line x1="10" y1="21" x2="24" y2="21" stroke="#FFB347" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="6" y1="9" x2="6" y2="12" stroke="#FF3838" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1.5 2"/>
      <line x1="6" y1="16" x2="6" y2="19" stroke="#FF7A00" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1.5 2"/>
    </svg>
  ),
  "02": (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="22" height="20" rx="3" stroke="#FF3838" strokeWidth="1.5"/>
      <line x1="3" y1="11" x2="25" y2="11" stroke="#FF3838" strokeWidth="1.5"/>
      <line x1="9" y1="3" x2="9" y2="7" stroke="#FF3838" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="19" y1="3" x2="19" y2="7" stroke="#FF3838" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="7" y="14" width="4" height="4" rx="1" fill="#FFB347" stroke="none"/>
      <rect x="13" y="14" width="4" height="4" rx="1" fill="#FF7A00" stroke="none" opacity="0.6"/>
      <rect x="19" y="14" width="4" height="4" rx="1" fill="#FFB347" stroke="none" opacity="0.4"/>
      <rect x="7" y="20" width="4" height="3" rx="1" fill="#FFB347" stroke="none" opacity="0.4"/>
      <rect x="13" y="20" width="4" height="3" rx="1" fill="#FF3838" stroke="none" opacity="0.5"/>
    </svg>
  ),
  "03": (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="11" stroke="#FF3838" strokeWidth="1.5"/>
      <path d="M14 7v2M14 19v2" stroke="#FF3838" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 10.5c0-1.1.9-2 2-2h2a2 2 0 0 1 0 4h-2a2 2 0 0 0 0 4h2a2 2 0 0 0 2-2" stroke="#FF3838" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 17.5c0 1.1.9 2 2 2" stroke="#FFB347" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "04": (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 3C10.1 3 7 6.1 7 10c0 5.25 7 13 7 13s7-7.75 7-13c0-3.9-3.1-7-7-7z" stroke="#FF3838" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="14" cy="10" r="2.5" stroke="#FF3838" strokeWidth="1.5"/>
      <line x1="18" y1="20" x2="24" y2="20" stroke="#FFB347" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18" y1="23" x2="22" y2="23" stroke="#FFB347" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <line x1="18" y1="17" x2="26" y2="17" stroke="#FF7A00" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    </svg>
  ),
  "05": (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4a7 7 0 0 1 4 12.7V19h-8v-2.3A7 7 0 0 1 14 4z" stroke="#FF3838" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="11" y1="21" x2="17" y2="21" stroke="#FF3838" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="12" y1="23.5" x2="16" y2="23.5" stroke="#FFB347" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="9" x2="14" y2="15" stroke="#FFB347" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="14" cy="8" r="1" fill="#FFB347"/>
    </svg>
  ),
  "06": (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="21" cy="7" r="3" stroke="#FF3838" strokeWidth="1.5"/>
      <circle cx="7" cy="14" r="3" stroke="#FF3838" strokeWidth="1.5"/>
      <circle cx="21" cy="21" r="3" stroke="#FFB347" strokeWidth="1.5"/>
      <line x1="9.6" y1="12.7" x2="18.4" y2="8.3" stroke="#FF7A00" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9.6" y1="15.3" x2="18.4" y2="19.7" stroke="#FFB347" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURE_LIST = [
  { n: "01", title: "Every stop, organised",   desc: "Transport, hotels, places, restaurants — one clean timeline with durations and travel times between every point." },
  { n: "02", title: "Day-by-day structure",     desc: "Build your trip day by day. Add, reorder, and edit stops freely. See the full journey at a glance." },
  { n: "03", title: "Live budget tracking",     desc: "Set a cost per stop. Your total updates in real time — no spreadsheet, no surprises at checkout." },
  { n: "04", title: "Maps, bookings & notes",   desc: "Attach Google Maps links, booking URLs, and personal notes directly to each stop." },
  { n: "05", title: "Smart travel tips",        desc: "Destination tips you can read and dismiss. Etiquette, transit, weather — whatever your trip needs." },
  { n: "06", title: "Instant sharing",          desc: "Export as PDF or share a live link in one tap. Your crew always has the latest plan." },
];

function Features() {
  const [setRef, visible] = useVisible(0.05);

  return (
    <section ref={setRef} style={{
      padding: "100px 24px",
      background: t.bgSecondary,
      borderTop: `0.5px solid ${t.border}`,
    }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          textAlign: "center", marginBottom: 72,
          opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)",
          transition: "opacity .5s ease, transform .5s ease",
        }}>
          <h2 style={{
            fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800,
            color: "#111", letterSpacing: "-2px", lineHeight: 1.08,
            margin: "0 0 16px",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}>Everything a trip needs.</h2>
          <p style={{
            fontSize: 17, color: "#666", lineHeight: 1.7,
            maxWidth: 440, margin: "0 auto",
          }}>One place for every part of your journey — no spreadsheets, no chaos.</p>
        </div>

        {/* 2-column card grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 420px), 1fr))",
          gap: 12,
        }}>
          {FEATURE_LIST.map((f, i) => (
            <div key={f.n} style={{
              background: "#fff",
              border: `0.5px solid ${t.border}`,
              borderRadius: 16,
              padding: "28px 24px 24px",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(20px)",
              transition: `opacity .5s ease ${i * 60}ms, transform .5s ease ${i * 60}ms`,
            }}>
              {/* Icon + number row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: t.bgSecondary, border: `0.5px solid ${t.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>{FEATURE_ICONS[f.n]}</div>
                <div style={{
                  fontSize: 12, fontWeight: 800, letterSpacing: "0.5px",
                  background: GRAD_TEXT,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>{f.n}</div>
              </div>

              {/* Title */}
              <div style={{
                fontSize: 20, fontWeight: 700, color: "#111",
                letterSpacing: "-0.5px", lineHeight: 1.3,
                marginBottom: 12,
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}>{f.title}</div>

              {/* Description */}
              <div style={{ fontSize: 15, color: "#555", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}


// ─── How it works ─────────────────────────────────────────────────────────────

const DAY1_STOPS = [
  { id: 1, type: "transport", name: "Flight JFK → NRT",       detail: "Japan Airlines JL006 · Economy",  time: "Sep 3 · 11:00",    duration: "14h 5m",  budget: "$1,200",     link: true,  travelNext: "50 min · Narita Express" },
  { id: 2, type: "hotel",     name: "Shinjuku Granbell Hotel", detail: "2-14-5 Kabukicho, Shinjuku-ku",  time: "Sep 3 · check-in", duration: "5 nights",budget: "$180/night", link: true,  travelNext: "5 min · walk" },
  { id: 3, type: "food",      name: "Ichiran Ramen",           detail: "3-34-11 Shinjuku, Tokyo",        time: "Sep 3 · 21:00",    duration: "45 min",  budget: "$12",        link: true,  travelNext: "10 min · walk" },
  { id: 4, type: "place",     name: "Kabukicho Neon Walk",     detail: "Kabukicho, Shinjuku",            time: "Sep 3 · 22:00",    duration: "1h",      budget: "Free",       link: false, travelNext: "" },
];

const SCFG = {
  transport: { label: "Transport",  icon: "✈", iconBg: "#E6F1FB", iconColor: "#0C447C", dotColor: "#85B7EB", badgeBg: "#E6F1FB", badgeText: "#0C447C" },
  hotel:     { label: "Hotel",      icon: "⌂", iconBg: "#EEEDFE", iconColor: "#3C3489", dotColor: "#AFA9EC", badgeBg: "#EEEDFE", badgeText: "#3C3489" },
  food:      { label: "Restaurant", icon: "⊕", iconBg: "#FAEEDA", iconColor: "#633806", dotColor: "#EF9F27", badgeBg: "#FAEEDA", badgeText: "#633806" },
  place:     { label: "Place",      icon: "◎", iconBg: "#EAF3DE", iconColor: "#27500A", dotColor: "#97C459", badgeBg: "#EAF3DE", badgeText: "#27500A" },
};

function IaBtn({ label }) {
  return (
    <button title={label} aria-label={label} style={{
      width: 24, height: 24, borderRadius: 6,
      border: "0.5px solid #e5e5e3", background: "transparent",
      cursor: "pointer", color: "#bbb",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
    }}>{label}</button>
  );
}

function PreviewStopCard({ stop, isLast }) {
  const cfg = SCFG[stop.type];
  return (
    <div style={{ display: "flex", gap: 0 }}>
      {/* Gutter */}
      <div className="stop-gutter" style={{ width: 44, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 11 }}>
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: cfg.iconBg, color: cfg.iconColor,
          border: `1.5px solid ${cfg.dotColor}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, flexShrink: 0, zIndex: 1,
        }}>{cfg.icon}</div>
        {!isLast && <div style={{ width: 1, background: "#e5e5e3", flex: 1, minHeight: 8 }} />}
      </div>

      {/* Card */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ background: "#fff", border: "0.5px solid #e5e5e3", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px" }}>

            {/* Left: badge / name / detail */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", borderRadius: 20,
                padding: "2px 9px", fontSize: 11, fontWeight: 500,
                background: cfg.badgeBg, color: cfg.badgeText, whiteSpace: "nowrap", marginBottom: 4,
              }}>{cfg.label}</span>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{stop.name}</div>
              <div style={{ fontSize: 12, color: "#888", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 1 }}>{stop.detail}</div>
            </div>

            {/* Right: time / chips / actions */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: "#bbb", whiteSpace: "nowrap" }}>{stop.time}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {stop.duration && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, color: "#666", background: "#f5f5f4", borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap" }}>⏱ {stop.duration}</span>
                )}
                {stop.budget && (
                  <span className="stop-budget" style={{ fontSize: 11, fontWeight: 500, color: "#27500A", background: "#EAF3DE", borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap" }}>{stop.budget}</span>
                )}
                {stop.link && (
                  <span style={{ width: 22, height: 22, borderRadius: 6, border: "0.5px solid #e5e5e3", background: "#f9f9f8", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#888" }}>↗</span>
                )}
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                <IaBtn label="↑" /><IaBtn label="↓" /><IaBtn label="×" />
              </div>
            </div>

            <span className="stop-chevron" style={{ fontSize: 13, color: "#ccc", marginLeft: 2, flexShrink: 0 }}>⌄</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewTransit({ text }) {
  return (
    <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
      <div style={{ width: 44, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 1, background: "#e5e5e3", flex: 1 }} />
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#ccc", flexShrink: 0 }} />
        <div style={{ width: 1, background: "#e5e5e3", flex: 1 }} />
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "4px 0" }}>
        <span style={{ fontSize: 11, color: "#888", background: "#f5f5f4", border: "0.5px solid #e5e5e3", borderRadius: 20, padding: "3px 10px", display: "inline-flex", alignItems: "center", gap: 4 }}>
          → {text}
        </span>
      </div>
    </div>
  );
}

function TripDayPreview() {
  return (
    <div style={{ padding: "16px 0px 12px" }}>
      {/* Day divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1, height: 1, background: "#378ADD" }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", background: "#378ADD", borderRadius: 20, padding: "4px 12px", display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
          ▶ Day 1 · Wed Sep 3 — Arrival &amp; Shinjuku
          <span style={{ fontSize: 10, background: "rgba(255,255,255,0.25)", borderRadius: 20, padding: "1px 6px" }}>Today</span>
        </span>
        <div style={{ flex: 1, height: 1, background: "#378ADD" }} />
      </div>

      {DAY1_STOPS.map((stop, i) => {
        const isLast = i === DAY1_STOPS.length - 1;
        return (
          <div key={stop.id}>
            <PreviewStopCard stop={stop} isLast={isLast} />
            {!isLast && stop.travelNext && <PreviewTransit text={stop.travelNext} />}
          </div>
        );
      })}

      {/* + Add stop to Day 1 */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginTop: 8,
        padding: "7px 10px",
        background: "#f9f9f8",
        border: "0.5px dashed #ccccca", borderRadius: 10,
      }}>
        <span style={{ fontSize: 12, color: "#888", flexShrink: 0 }}>+ Day 1</span>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {(["✈ Transport", "⌂ Hotel", "◎ Place", "⊕ Restaurant"]).map((label) => (
            <span key={label} style={{
              fontSize: 11, padding: "3px 9px", borderRadius: 20,
              border: "0.5px solid #e5e5e3", background: "#fff",
              color: "#888",
            }}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const [setRef, visible] = useVisible(0.08);
  return (
    <section id="how-it-works" ref={setRef} style={{ padding: "100px 24px", background: t.bg }}>
      <style>{`@media (max-width: 600px) { .stop-gutter { display: none !important; } .stop-chevron { display: none !important; } .stop-budget { display: none !important; } }`}</style>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Centred heading + description */}
        <div style={{
          textAlign: "center", marginBottom: 48,
          opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)",
          transition: "opacity .5s ease, transform .5s ease",
        }}>
          <h2 style={{
            fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800,
            color: "#111", letterSpacing: "-1.8px", lineHeight: 1.1,
            margin: "0 0 16px",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}>Up and running<br />in minutes.</h2>
          <p style={{
            fontSize: 17, color: "#666", lineHeight: 1.7,
            maxWidth: 420, margin: "0 auto",
          }}>
            Add every stop, set budgets, attach links — your full day planned in one clean view.
          </p>
        </div>

        {/* Day 1 preview — no border */}
        <div style={{
          opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)",
          transition: "opacity .55s ease .1s, transform .55s ease .1s",
        }}>
          <div style={{ fontSize: 11, color: "#999", marginBottom: 8, fontWeight: 500, textAlign: "center" }}>
            Tokyo Explorer · Day 1 preview
          </div>
          <TripDayPreview />
        </div>

      </div>
    </section>
  );
}


// ─── CTA banner ───────────────────────────────────────────────────────────────

function CTABanner({ onCTA }) {
  const [setRef, visible] = useVisible(0.2);
  return (
    <section ref={setRef} style={{ padding: "60px 24px 80px" }}>
      <div style={{
        maxWidth: 720, margin: "0 auto", textAlign: "center",
        background: GRAD, borderRadius: 24, padding: "56px 40px",
        opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.97)",
        transition: "opacity .5s ease, transform .5s ease",
      }}>
        <h2 style={{
          fontSize: 36, fontWeight: 700, color: "#fff",
          letterSpacing: "-1px", marginBottom: 14,
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}>Your next adventure starts here.</h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 32, lineHeight: 1.6 }}>
          Free forever for personal use. No credit card needed.
        </p>
        <button onClick={onCTA} style={{
          fontSize: 15, padding: "13px 32px", 
          borderRadius: 28, border: "none", background: "#fff", 
          color: "#FF3838",
          cursor: "pointer", fontFamily: "inherit", fontWeight: 700,
        }}>Plan my first trip →</button>
      </div>
    </section>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────

export default function Landing({ onStart }) {

    const handleStart = async () => {
      await initDB();   // creates DB + sets localStorage flag
      onStart();        // tells Main to switch to "app"
    };

    return (
        <div style={{
            minHeight: "100vh", background: t.bg,
            fontFamily: "system-ui, -apple-system, sans-serif",
        }}>
            <SiteHeader onCTA={handleStart} />
            <Hero onCTA={handleStart} />
            <Features />
            <HowItWorks />
            <CTABanner onCTA={handleStart} />
            <Footer />
        </div>
    );
}