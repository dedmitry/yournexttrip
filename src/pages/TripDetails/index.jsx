import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";


import Header from "@components/PageHeader";
import Breadcrumb from "@components/PageBreadcrumb";
import Footer from "@components/PageFooter";

import { getTrip, saveTrip } from "@utils/storage";
import { t, STOP_TYPE_CONFIG } from "@lib/config";


// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDayLabel(day, dateFrom) {
  try {
    const start = new Date(dateFrom);
    if (isNaN(start.getTime())) throw new Error();
    const d = new Date(start);
    d.setDate(start.getDate() + (day - 1));
    const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
    const month   = d.toLocaleDateString("en-US", { month: "short" });
    return `Day ${day} · ${weekday} ${month} ${d.getDate()}`;
  } catch {
    return `Day ${day}`;
  }
}

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
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="3" width="16" height="14" rx="3" stroke="currentColor" stroke-width="1.5"/>
  <path d="M4 10H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M8 17L6 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M16 17L18 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="8.5" cy="13.5" r="1.5" fill="currentColor"/>
  <circle cx="15.5" cy="13.5" r="1.5" fill="currentColor"/>
  <path d="M8 3V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M16 3V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>
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

function StopCard({ 
    stop, 
    isOpen, 
    isLast, 
    onToggle, 
    onSave, 
    onDelete, 
    onMoveUp, 
    onMoveDown 
}) {
    const cfg = STOP_TYPE_CONFIG[stop.type];
    //const [draft, setDraft] = useState(stop);
    //if (!isOpen && JSON.stringify(draft) !== JSON.stringify(stop)) setDraft(stop);

    //const handleToggle = () => { if (isOpen) setDraft(stop); onToggle(); };
    const handleToggle = onToggle;

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
            <div 
                className="stop-gutter" 
                style={{ width: 44, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 11 }}
            >
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
                <div 
                    onClick={handleToggle} 
                    style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 12px", cursor: "pointer", userSelect: "none",
                    }}
                >

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
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ fontSize: 12, color: t.textHint, whiteSpace: "nowrap" }}>
                                {stop.time}
                            </span>
                            <span 
                                className="stop-chevron" 
                                style={{
                                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                                    width: 16, height: 16, flexShrink: 0,
                                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s",
                                }}
                            >
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke={t.textHint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </div>
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
                </div>

                {/* Edit form */}
                {isOpen && (
                    <div style={{ borderTop: `0.5px solid ${t.border}`, padding: "12px 14px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 9 }}>
                            <Field label="Type">
                                <select value={stop.type} onChange={(e) => onSave({ ...stop, type: e.target.value })} style={inputStyle}>
                                    <option value="transport">Transport</option>
                                    <option value="hotel">Hotel</option>
                                    <option value="place">Place</option>
                                    <option value="food">Restaurant</option>
                                </select>
                            </Field>
                            <Field label="Time">
                                <input 
                                    type="time"
                                    value={stop.time} 
                                    onChange={(e) => onSave({ ...stop, time: e.target.value })} 
                                    style={inputStyle} placeholder="Sep 3 · 11:00" 
                                />
                            </Field>
                        </div>
                        <Field label="Name" style={{ marginBottom: 9 }}>
                            <input value={stop.name} onChange={(e) => onSave({ ...stop, name: e.target.value })} style={inputStyle} />
                        </Field>
                        <Field label="Address / details" style={{ marginBottom: 9 }}>
                            <input value={stop.detail} onChange={(e) => onSave({ ...stop, detail: e.target.value })} style={inputStyle} />
                        </Field>
                        <div style={{ marginBottom: 9 }}>
                            <label style={{ fontSize: 11, color: t.textMuted, marginBottom: 3, display: "block" }}>Link (maps / info)</label>
                            <div style={{ display: "flex", gap: 6 }}>
                            <input
                                value={stop.link}
                                onChange={(e) => onSave({ ...stop, link: e.target.value })}
                                style={{ ...inputStyle, flex: 1 }}
                                placeholder="https://…"
                            />
                            <a
                                href={stop.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open link"
                                style={{
                                display: "flex", alignItems: "center", justifyContent: "center",
                                width: 36, flexShrink: 0, borderRadius: t.radiusSm,
                                border: `0.5px solid ${stop.link ? t.borderMd : t.border}`,
                                background: stop.link ? t.text : t.bgSecondary,
                                color: stop.link ? t.bg : t.textHint,
                                fontSize: 13, textDecoration: "none",
                                pointerEvents: stop.link ? "auto" : "none",
                                transition: "background .15s, color .15s",
                                }}
                            >↗</a>
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 9 }}>
                            <Field label="Budget / cost">
                            <input value={stop.budget} onChange={(e) => onSave({ ...stop, budget: e.target.value })} style={inputStyle} placeholder="e.g. $45 or Free" />
                            </Field>
                            <Field label="Duration">
                            <input value={stop.duration} onChange={(e) => onSave({ ...stop, duration: e.target.value })} style={inputStyle} placeholder="e.g. 2h 30m" />
                            </Field>
                        </div>
                        <Field label="Notes">
                            <textarea value={stop.notes} onChange={(e) => onSave({ ...stop, notes: e.target.value })}
                            style={{ ...inputStyle, resize: "vertical", minHeight: 52 }} placeholder="Any extra info…" />
                        </Field>
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

function DayDivider({ day, isCurrent, dateFrom }) {
    const displayLabel = getDayLabel(day, dateFrom ?? "");

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
                    {isCurrent ? "▶" : "☀"} {displayLabel}
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

function TripPlanner({trip}) {
	const [meta, setMeta] = useState(trip.meta);
	const [stops, setStops] = useState(trip.stops);
	const [openId, setOpenId] = useState(null);
	const [nextId, setNextId] = useState(trip.stops.length + 1);

	const toggleOpen = (id) => setOpenId((prev) => (prev === id ? null : id));


    // Debounced save — waits 600ms after last change
    const saveTimeout = useRef(null);

    useEffect(() => {
        return () => clearTimeout(saveTimeout.current);
    }, []);


    const debouncedSave = useCallback((updatedStops, updatedMeta) => {
        clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => {
            saveTrip({ id: trip.id, meta: updatedMeta, stops: updatedStops });
        }, 600);
    }, [trip.id]);

    const updateMeta = (updatedMeta) => {
        setMeta(updatedMeta);
        debouncedSave(stops, updatedMeta);
    };

	const updateStop = (updated) => {
        setStops((prev) => {
            const next = prev.map((s) => (s.id === updated.id ? updated : s));
            debouncedSave(next, meta);
            return next;
        });
		//setStops((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
		//setOpenId(null);
	};


	const addStop = (type, targetDay) => {
		const day = targetDay ?? (stops.length > 0 ? stops[stops.length - 1].day : 1);
		const id = nextId;
		setNextId((n) => n + 1);
		const cfg = STOP_TYPE_CONFIG[type];
		const newStop = { id, day, type, name: `New ${cfg.label.toLowerCase()}`, detail: "", time: "", duration: "", travelNext: "", budget: "", link: "", notes: "" };
		/*setStops((prev) => {
		// Insert after the last stop of the target day
		const lastIdx = prev.map((s, i) => s.day === day ? i : -1).filter(i => i >= 0).pop();
		if (lastIdx === undefined) return [...prev, newStop];
		const arr = [...prev];
		arr.splice(lastIdx + 1, 0, newStop);
		return arr;
		});*/
        setStops((prev) => {
            const next = [...prev, newStop];
            saveTrip({ id: trip.id, meta, stops: next }); // immediate
            return next;
        });
		setOpenId(id);
	};

	const deleteStop = (id) => {
        setStops((prev) => {
            const next = prev.filter((s) => s.id !== id);
            saveTrip({ id: trip.id, meta, stops: next }); // immediate
            return next;
        });
		//setStops((prev) => prev.filter((s) => s.id !== id));
		if (openId === id) setOpenId(null);
	};

	const moveStop = (id, dir) => {
		setStops((prev) => {
		const idx = prev.findIndex((s) => s.id === id);
		const next = idx + dir;
		if (next < 0 || next >= prev.length) return prev;
		const arr = [...prev];
		[arr[idx], arr[next]] = [arr[next], arr[idx]];
        saveTrip({ id: tripId, meta, stops: arr });
		return arr;
		});
	};

	const updateTransit = (id, travelNext) =>
		setStops((prev) => prev.map((s) => (s.id === id ? { ...s, travelNext } : s)));




	const maxDay = stops.length > 0 
        ? Math.max(...stops.map((s) => s.day)) 
        : 1;
	const days = Array.from({ length: maxDay }, (_, i) => i + 1);
	const currentDay = 3;


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
			<TripHeaderCard 
                meta={meta} 
                stops={stops} 
                onTitleChange={(v) => setMeta({ ...meta, title: v })} 
            />

			{days.map((day) => {
				const dayStops = stops.filter((s) => s.day === day);
				return (
				<div key={day}>
					<DayDivider day={day} isCurrent={day === currentDay} dateFrom={meta.dateFrom} />

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
    const tripId = Number(id);


    const [loaded, setLoaded] = useState(false);
    const [trip, setTrip] = useState({});

    // Load from DB on mount
    useEffect(() => {
        if (!tripId) { setLoaded(true); return; }

        getTrip(tripId).then((trip) => {
            if (trip) {
                setTrip(trip);

                setMeta(trip.meta);
                setStops(trip.stops);
            }
            setLoaded(true);
        }).catch(() => setLoaded(true));
    }, [tripId]);


    // Check loading state
    if (!loaded) {
        return (
            <div style={{ padding: "80px 24px", textAlign: "center", color: "#888" }}>
                Loading trip…
            </div>
        );
    }

    // Trip not found
    if (!trip?.id) {
        return (
            <div style={{ padding: "80px 24px", textAlign: "center", color: "#888" }}>
                Trip not found
            </div>
        );
    }

    return (
		<div style={{ minHeight: "100vh", background: t.bg, fontFamily: "system-ui, -apple-system, sans-serif" }}>
			<style>{`@media (max-width: 600px) { .stop-gutter { display: none !important; } .stop-budget { display: none !important; } }`}</style>
			<Header />
			<Breadcrumb tripTitle={trip.meta?.title || ""} />
			<main>
				<TripPlanner trip={trip} />
			</main>
			<Footer />
		</div>
    );
}