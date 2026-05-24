import React, { useState } from "react";

import FormField from "@/components/FormField";

import { TripStop, initialTripStop, TripMeta, StopId, StopType } from "@/types/trip";

import { formatBudget } from "@/utils/tripSummary";

import { t, inputStyle, saveBtnStyle, cancelBtnStyle } from "@/lib/styles";
import { STOP_TYPE_CONFIG } from "@/lib/config";


// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDayLabel(day: number, dateFrom: string | Date) {
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
} : {
    stop: TripStop;

    isOpen: boolean;
    isLast: boolean;

    onToggle: () => void;
    onSave: (updated: TripStop) => void;

    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}) {
    const cfg = STOP_TYPE_CONFIG[stop.type];

    //const [draft, setDraft] = useState(stop);
    //if (!isOpen && JSON.stringify(draft) !== JSON.stringify(stop)) setDraft(stop);

    //const handleToggle = () => { if (isOpen) setDraft(stop); onToggle(); };
    const handleToggle = onToggle;

    const iconBtn = (
        label: React.ReactNode,
        title: string,
        action: () => void,
        danger = false
    ) => (
        <button
            key={title} onClick={action} title={title} aria-label={title}
            style={{
                width: 24, height: 24, borderRadius: 6,
                border: `1px solid ${t.border}`, background: "transparent",
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
            <style>{`@media (max-width: 600px) { .stop-gutter { display: none !important; } .stop-budget { display: none !important; } }`}</style>
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
                    border: `1px solid ${isOpen ? t.borderHeavy : t.border}`,
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
                        <div style={{ fontSize: 12, color: t.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 1 }}>{stop.details}</div>
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
                            {stop.duration !== '' && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, color: t.textMuted, background: t.bgSecondary, borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap" }}>⏱ {stop.duration}</span>
                            )}
                            {stop.budget !== '' && (
                            <span className="stop-budget" style={{ fontSize: 11, fontWeight: 500, color: "#27500A", background: "#EAF3DE", borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap" }}>{formatBudget(stop.budget)}</span>
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
                    <div style={{ borderTop: `1px solid ${t.border}`, padding: "12px 14px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 9 }}>
                            <FormField label="Type">
                                <select 
                                    value={stop.type} 
                                    onChange={(e) => onSave({
                                        ...stop,
                                        type: e.target.value as StopType,
                                    })} 
                                    style={{...inputStyle, height: "33.5px"}}
                                >
                                    <option value="transit">Transit</option>
                                    <option value="stay">Stay</option>
                                    <option value="place">Place</option>
                                    <option value="food">Food</option>
                                </select>
                            </FormField>
                            <FormField label="Time">
                                <input 
                                    type="time"
                                    value={stop.time} 
                                    onChange={(e) => onSave({ ...stop, time: e.target.value })} 
                                    style={{...inputStyle, padding: "5px 10px"}} placeholder="Sep 3 · 11:00" 
                                />
                            </FormField>
                        </div>
                        <FormField label="Name" style={{ marginBottom: 9 }}>
                            <input value={stop.name} onChange={(e) => onSave({ ...stop, name: e.target.value })} style={inputStyle} />
                        </FormField>
                        <FormField label="Address / details" style={{ marginBottom: 9 }}>
                            <input value={stop.details} onChange={(e) => onSave({ ...stop, details: e.target.value })} style={inputStyle} />
                        </FormField>
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
                            <FormField label="Budget / cost">
                            <input 
                                value={stop.budget} 
                                onChange={(e) => onSave({ ...stop, budget: e.target.value })} 
                                style={inputStyle} 
                                placeholder="e.g. $45 or Free" 
                            />
                            </FormField>
                            <FormField label="Duration">
                            <input 
                                value={stop.duration} 
                                onChange={(e) => onSave({ ...stop, duration: e.target.value })} 
                                style={inputStyle} 
                                placeholder="e.g. 2h 30m" 
                                />
                            </FormField>
                        </div>
                        <FormField label="Notes">
                            <textarea value={stop.notes} onChange={(e) => onSave({ ...stop, notes: e.target.value })}
                            style={{ ...inputStyle, resize: "vertical", minHeight: 52 }} placeholder="Any extra info…" />
                        </FormField>
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

function TransitRow({ 
    stop, 
    onSave 
}: {
    stop: TripStop;
    onSave: (value: string) => void;
}) {
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

function DayDivider({ 
    day, 
    isCurrent, 
    dateFrom 
} : {
    day: number;
    isCurrent: boolean;
    dateFrom: string | Date;
}) {
    const displayLabel = getDayLabel(day, dateFrom ?? "");

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0 10px" }}>
            <div style={{ flex: 1, height: isCurrent ? 1 : 0.5, background: isCurrent ? "#378ADD" : t.border }} />
                <span style={{
                    fontSize: 11, fontWeight: isCurrent ? 500 : 400,
                    whiteSpace: "nowrap", borderRadius: 20, padding: "4px 12px",
                    background: isCurrent ? "#378ADD" : t.bgSecondary,
                    color: isCurrent ? "#ffffff" : t.textMuted,
                    border: isCurrent ? "none" : `1px solid ${t.border}`, 
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
            <div style={{ flex: 1, height: isCurrent ? 1 : 1, background: isCurrent ? "#378ADD" : t.border }} />
        </div>
    );
}

// ════════════════════════════════════════════════════════════════════════════
//  ADD BAR
// ════════════════════════════════════════════════════════════════════════════

function AddBar({ 
    onAdd, 
    targetDay, 
    compact 
} : { 
    onAdd: (type: StopType, targetDay?: number) => void; 
    targetDay: number; 
    compact: boolean 
}) {

    const types = Object.keys(STOP_TYPE_CONFIG) as StopType[];
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 8,
            marginTop: compact ? 6 : 12,
            padding: compact ? "6px 10px" : "9px 12px",
            background: t.bgSecondary,
            border: `1px dashed ${t.borderMd}`, borderRadius: t.radiusMd,
        }}>
            <span style={{ fontSize: compact ? 12 : 13, color: t.textMuted, flexShrink: 0 }}>
                {compact ? `+ Day ${targetDay}` : "Add stop"}
            </span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {types.map((type) => {
                const cfg = STOP_TYPE_CONFIG[type];
                return (
                    <button 
                        key={type} 
                        onClick={() => onAdd(type, targetDay)} 
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            fontFamily: "inherit", fontSize: compact ? 11 : 12,
                            border: `0.5px solid ${t.border}`, borderRadius: 20, 
                            background: t.bg, color: t.textMuted, 
                            cursor: "pointer", padding: compact ? "3px 9px" : "4px 11px", 
                        }}
                    >
                        {cfg.label === 'Transits' &&
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-route-icon lucide-route"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
                        }
                        {cfg.label === 'Stays' &&
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hotel-icon lucide-hotel"><path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/></svg>
                        }
                        {cfg.label === 'Places' &&
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                        }
                        {cfg.label === 'Food' &&
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils-icon lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
                        }
                         {cfg.label}</button> 
                );
                })}
            </div>
        </div>
    );
}



// ════════════════════════════════════════════════════════════════════════════
//  TRIP PLANNER (internal logic)
// ════════════════════════════════════════════════════════════════════════════

export default function TripPlanner({
    meta,
    stops,

    updateStops,
}: {
    meta: TripMeta;
    stops: TripStop[];

    updateStops: (updatedStops: TripStop[]) => void;
}) {
	const [openId, setOpenId] = useState<StopId | null>(null);
	const [nextId, setNextId] = useState(stops.length + 1);

    const toggleOpen = (id: StopId) => {
        setOpenId(prev => (prev === id ? null : id));
    };


    const updateStop = (updated: TripStop) => {
        const next = stops.map((s) => (s.id === updated.id ? updated : s));
        updateStops(next);
	};


	const addStop = (type: keyof typeof STOP_TYPE_CONFIG, targetDay?: number) => {
		const day = targetDay ?? (stops.length > 0 ? stops[stops.length - 1].day : 1);
		setNextId((n) => n + 1);

		const cfg = STOP_TYPE_CONFIG[type];
		const newStop: TripStop = {
            ...initialTripStop, 
            id: nextId, 
            day, 
            type,
            name: `New ${cfg.label.toLowerCase()}`, 
        };

        const next = [...stops, newStop];
        updateStops(next);

		setOpenId(newStop.id);
	};

	const deleteStop = (id: number) => {
        updateStops(stops.filter((s) => s.id !== id));
		if (openId === id) setOpenId(null);
	};

	const moveStop = (id: number, dir: number) => {
        const idx = stops.findIndex((s) => s.id === id);
        const next = idx + dir;

        if (idx === -1 || next < 0 || next >= stops.length) return;

        const arr = [...stops];
        [arr[idx], arr[next]] = [arr[next], arr[idx]];

        updateStops(arr);
	};

    const updateTransit = (id: StopId, travelNext: string) => {
        updateStops(
            stops.map(s =>
                s.id === id ? { ...s, travelNext } : s
            )
        );
    };


	const maxDay = stops.length > 0 
        ? Math.max(...stops.map((s) => s.day)) 
        : 1;
	const days = Array.from({ length: maxDay }, (_, i) => i + 1);
	const currentDay = 3;


	const addDay = () => {
		const newDay = maxDay + 1;
		setNextId((n) => n + 1);
		
        const newStop: TripStop = {
            ...initialTripStop,
            id: nextId, 
            day: newDay, 
        };

        updateStops([...stops, newStop]);
		setOpenId(newStop.id);
	};

	return (
        <>
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
                                stop={stop} 
                                isOpen={openId === stop.id} 
                                isLast={isLastInTrip}
                                onToggle={() => toggleOpen(stop.id)} 
                                onSave={updateStop}
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
		</>
	);
}