import React, { ReactNode, useState } from "react";

import { Trip } from "@types/trip";

import { calculateTripDays } from "@/utils/tripSummary";

import { STATUS_CONFIG } from "@/lib/config";
import { t } from "@/lib/styles";

type StatusKey = keyof typeof STATUS_CONFIG;


function FormField({ 
    label, 
    children, 
    style 
} : {
    label: ReactNode;
    children: ReactNode;
    style?: React.CSSProperties;
}) {
    return (
        <div style={style}>
            <label style={{ fontSize: 11, color: t.textMuted, display: "block", marginBottom: 4 }}>{label}</label>
            {children}
        </div>
    );
}

// ─── NewTripModal ─────────────────────────────────────────────────────────────

export default function NewTripModal({ 
    onClose, 
    onCreate 
}: {
    onClose: () => void;
    onCreate: (trip: Trip) => void;
}) {
    const [title, setTitle] = useState<string>("");
    //const [dest, setDest] = useState<string>("");
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");
    const [travelers, setTravelers] = useState<string>("2");
    const [status, setStatus] = useState<StatusKey>("planning");
    const [submitted, setSubmitted] = useState<boolean>(false);


    const valid = title.trim().length > 0;

    const days = calculateTripDays(dateFrom, dateTo);

    const handleCreate = (): void => {
        if (!valid) return;

        setSubmitted(true);

        const trip: Trip = {
            id: Date.now(),
            meta: {
                title: title.trim(),
                //flag: "✈",
                //destination: dest || "—",
                //region: "—",
                dateFrom: dateFrom || "—",
                dateTo: dateTo || "—",
                travelers: Number(travelers) || 1,
                rating: null,
                status,
            },
            stops: [],
            checklist: [],
            notes: [],
        };

        onCreate(trip);
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
            <div style={{ padding: "20px 24px 16px", borderBottom: `0.5px solid ${t.borderMd}` }}>
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
                        background: t.bgSecondary, border: `0.5px solid ${t.borderMd}`,
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
                <FormField 
                    label={<>Trip title <span style={{ color: "#E63946" }}>*</span></>} 
                    style={{ marginBottom: 14 }}
                >
                    <input
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Tokyo Explorer"
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        style={{ width: "100%", fontSize: 13, padding: "8px 10px",
                            border: `0.5px solid ${t.borderMd}`, borderRadius: t.radiusSm,
                            fontFamily: "inherit", background: t.bg, color: t.text,
                            outline: "none", boxSizing: "border-box", 
                            borderColor: title.trim() ? t.borderMd : t.borderMd 
                        }}
                    />
                </FormField>

                {/* Date range */}
                <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Dates</div>
                    <div style={{
                        display: "flex", alignItems: "center",
                        border: `0.5px solid ${t.borderMd}`, borderRadius: t.radiusSm,
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
                            borderLeft: `0.5px solid ${t.borderMd}`,
                            borderRight: `0.5px solid ${t.borderMd}`,
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

                {/* Travelers + Status row */}
                <div style={{ display: "flex", gap: 14, marginBottom: 20, alignItems: "flex-end" }}>
                    <FormField label="Travelers">
                        <div style={{
                            display: "flex", alignItems: "center",
                            border: `0.5px solid ${t.borderMd}`, borderRadius: t.radiusSm,
                            overflow: "hidden", width: 120,
                        }}>
                            <button onClick={() => setTravelers(String(Math.max(1, Number(travelers) - 1)))}
                            style={{ width: 36, height: 36, flexShrink: 0, background: t.bgSecondary, border: "none", cursor: "pointer", fontSize: 18, color: t.textMuted }}>−</button>
                            <span style={{ flex: 1, textAlign: "center", fontSize: 14, color: t.text, fontWeight: 500 }}>{travelers}</span>
                            <button onClick={() => setTravelers(String(Number(travelers) + 1))}
                            style={{ width: 36, height: 36, flexShrink: 0, background: t.bgSecondary, border: "none", cursor: "pointer", fontSize: 18, color: t.textMuted }}>+</button>
                        </div>
                    </FormField>

                    <FormField label="Status" style={{ flex: 1 }}>
                        <div style={{ position: "relative" }}>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as StatusKey)}
                            style={{
                            width: "100%", fontSize: 13, padding: "8px 32px 8px 10px",
                            border: `0.5px solid ${t.borderMd}`, borderRadius: t.radiusSm,
                            fontFamily: "inherit", outline: "none", cursor: "pointer",
                            appearance: "none", WebkitAppearance: "none",
                            //background: STATUS_CONFIG[status].bg,
                            //color: STATUS_CONFIG[status].color,
                            fontWeight: 500,
                            height: 38, boxSizing: "border-box",
                            transition: "background .15s, color .15s",
                            }}
                        >
                            {(Object.entries(STATUS_CONFIG) as [StatusKey, typeof STATUS_CONFIG[StatusKey]][]).map(([key, cfg]) => (
                            <option key={key} value={key}>{cfg.label}</option>
                            ))}
                        </select>
                        <svg
                            width="12" height="12" viewBox="0 0 12 12" fill="none"
                            style={{
                            position: "absolute", right: 10, top: "50%",
                            transform: "translateY(-50%)", pointerEvents: "none",
                            }}
                        >
                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke={STATUS_CONFIG[status].color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        </div>
                    </FormField>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button onClick={onClose} style={{
                        fontSize: 13, padding: "8px 18px", borderRadius: 20,
                        border: `0.5px solid ${t.borderMd}`, background: "transparent",
                        color: t.textMuted, cursor: "pointer", fontFamily: "inherit",
                    }}>Cancel</button>
                    <button onClick={handleCreate} disabled={!valid} style={{
                        fontSize: 13, padding: "8px 20px", borderRadius: 20,
                        border: valid ? "0.5px solid #FF3838" : `0.5px solid ${t.borderMd}`,
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


/*

            {/* Destination *
            <FormField label="Destination" style={{ marginBottom: 14 }}>
              <input value={dest} onChange={(e) => setDest(e.target.value)}
                placeholder="e.g. Tokyo & Kyoto, Japan" style={{width: "100%", fontSize: 13, padding: "8px 10px",
  border: `0.5px solid ${t.border}`, borderRadius: t.radiusSm,
  fontFamily: "inherit", background: t.bg, color: t.text,
  outline: "none", boxSizing: "border-box",}} />
            </FormField>
*/