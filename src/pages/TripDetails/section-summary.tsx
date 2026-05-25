import { useState } from "react";

import Rating from "@components/Rating";
import Chip from "@components/Chip";
import StopTypeIcon from "@components/StopTypeIcon";

import { Trip } from "@/types/trip";

import { tripTripRange, calculateTripDays, totalTripBudget, formatBudget, countTripStops } from "@/utils/tripSummary";

import { t } from "@lib/styles";
import { STOP_TYPE_CONFIG } from "@/lib/config";


export default function TripHeaderCard({ 
    trip,
    onRate
} : {
    trip: Trip;
    onRate: (rating: number) => void;
}) {
    const [menuOpen, setMenuOpen] = useState(false);

    const menuItems = [
        { label: "Share",      icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49"/></svg> },
        { label: "Export PDF", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/></svg> },
        { label: "Duplicate",  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> },
        null,
        { label: "Delete",     icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6l-1 14H6L5 6"/><path d="M8 6V4h8v2"/></svg>, danger: true },
    ];
    
    const tripDays = calculateTripDays(trip.meta.dateFrom, trip.meta.dateTo);
    const tripStats = countTripStops(trip.stops);
    const totalBudget = totalTripBudget(trip.stops);

    type StopType = keyof typeof STOP_TYPE_CONFIG;

    return (
        <div style={{
            background: t.bgSecondary, border: `0.5px solid ${t.border}`,
            borderRadius: t.radiusMd, padding: "20px 20px 16px", marginBottom: 16,
        }}>
            {/* Top: stars + menu */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
                <Rating
                    rating={trip.meta.rating ?? undefined}
                    onRate={(r) => onRate(r)}
                    interactive={trip.meta.status === "completed" || trip.meta.status === "ongoing"}
                />
                {/* ··· context menu */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                <button
                    onClick={() => setMenuOpen((o) => !o)}
                    style={{
                    width: 28, height: 28, borderRadius: 8, cursor: "pointer",
                    border: `0.5px solid ${t.border}`, background: t.bg,
                    color: t.textHint, fontFamily: "inherit", fontSize: 14,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                >···</button>
        
                {menuOpen && (
                    <div
                    onMouseLeave={() => setMenuOpen(false)}
                    style={{
                        position: "absolute", top: 34, right: 0, zIndex: 20,
                        background: t.bg, border: `0.5px solid ${t.border}`,
                        borderRadius: t.radiusMd, padding: "4px 0", minWidth: 152,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                    }}
                    >
                    {menuItems.map((item, i) =>
                        item === null ? (
                        <div key={i} style={{ height: 0.5, background: t.border, margin: "4px 0" }} />
                        ) : (
                        <button
                            key={item.label}
                            onClick={() => setMenuOpen(false)}
                            style={{
                            display: "flex", alignItems: "center", gap: 9,
                            width: "100%", padding: "8px 14px",
                            background: "transparent", border: "none", cursor: "pointer",
                            fontSize: 13, fontFamily: "inherit",
                            color: item.danger ? "#A32D2D" : t.text,
                            textAlign: "left",
                            }}
                            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = item.danger ? "#FCEBEB" : t.bgSecondary}
                            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
                        >
                            <span style={{ flexShrink: 0 }}>{item.icon}</span>
                            {item.label}
                        </button>
                        )
                    )}
                    </div>
                )}
                </div>
            </div>


            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>

                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Title */}
                    <div style={{
                    fontSize: 22, fontWeight: 500, color: t.text,
                    letterSpacing: "-0.3px", lineHeight: 1.25,
                    marginBottom: 10,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>{trip.meta.title}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <Chip>📅 {tripTripRange(trip.meta.dateFrom, trip.meta.dateTo)}</Chip>
                        <Chip>⏱ {tripDays} days</Chip>
                        {trip.meta?.destination &&
                        <Chip>📍 {trip.meta.destination}</Chip>
                        }
                        <Chip>👥 {trip.meta.travelers} travelers</Chip>
                        <Chip>💰 {formatBudget(totalBudget)}</Chip>
                    </div>
                </div>
                
            </div>

            <div style={{
                display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8,
                borderTop: `1px solid ${t.borderMd}`, paddingTop: 14,
            }}>
                {(Object.keys(STOP_TYPE_CONFIG) as StopType[]).map((type) => {
                    const cfg = STOP_TYPE_CONFIG[type];
                    return (
                    <div key={type} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 500, color: t.text }}>{tripStats[type]}</div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, fontSize: 11, color: t.textMuted, marginTop: 2 }}>
                            <StopTypeIcon label={cfg.label} /> 
                            {cfg.label}
                        </div>
                    </div>
                );
                })}
            </div>
        </div>
    );
}