import React, { useState } from "react";

import { StopType, TripMeta, TripStop, Trip } from "@/types/trip";

import { tripTripRange, calculateTripDays, totalTripBudget, formatBudget, countTripStops } from "@/utils/tripSummary";

import { t } from "@lib/styles";
import { STOP_TYPE_CONFIG } from "@/lib/config";


// ─── Helpers ──────────────────────────────────────────────────────────────────

function Chip({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: t.bg, border: `0.5px solid ${t.border}`,
      borderRadius: 20, padding: "4px 11px", fontSize: 12, color: t.textMuted, ...style,
    }}>{children}</span>
  );
}

 
// ─── StarRating ───────────────────────────────────────────────────────────────
 
function StarRating({ rating, onRate, interactive }: {
  rating?: number;
  onRate?: (rating: number) => void;
  interactive?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? rating ?? 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(null)}
          style={{
            fontSize: 13,
            color: star <= active ? "#F5A623" : t.borderMd,
            cursor: interactive ? "pointer" : "default",
            transition: "color .1s",
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════════════
//  TRIP HEADER CARD (internal)
// ════════════════════════════════════════════════════════════════════════════

export default function TripHeaderCard({ 
    trip,
    onRate
} : {
    trip: Trip;
    onRate: (rating: number) => void;
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    
    const tripDays = calculateTripDays(trip.meta.dateFrom, trip.meta.dateTo);
    const tripStats = countTripStops(trip.stops);
    const totalBudget = totalTripBudget(trip.stops);

    return (
        <div style={{
            background: t.bgSecondary, border: `0.5px solid ${t.border}`,
            borderRadius: t.radiusMd, padding: "20px 20px 16px", marginBottom: 16,
        }}>
            {/* Top: stars + menu */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
                <StarRating
                    rating={trip.meta.rating}
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
                    {trip.meta.flag && trip.meta.region &&
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                        width: 28, height: 28, borderRadius: "50%", background: t.bg,
                        border: `0.5px solid ${t.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, flexShrink: 0,
                        }}>{trip.meta.flag}</div>
                        <span style={{ fontSize: 13, color: t.textMuted }}>{trip.meta.region}</span>     
                    </div>
                    }       
                    <input
                        value={trip.meta.title}
                        //onChange={(e) => onTitleChange(e.target.value)}
                        aria-label="Trip title"
                        style={{
                        fontSize: 22, fontWeight: 500, color: t.text,
                        border: "none", background: "transparent", outline: "none",
                        width: "100%", fontFamily: "inherit", padding: 0,
                        lineHeight: 1.2, marginTop: 6, marginBottom: 8, display: "block",
                        }}
                    />
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <Chip>📅 {tripTripRange(trip.meta.dateFrom, trip.meta.dateTo)}</Chip>
                        <Chip>⏱ {tripDays} days</Chip>
                        {trip.meta.destination &&
                        <Chip>📍 {trip.meta.destination}</Chip>
                        }
                        <Chip>👥 {trip.meta.travelers} travelers</Chip>
                        <Chip>💰 {formatBudget(totalBudget)}</Chip>
                    </div>
                </div>
                
            </div>

            <div style={{
                display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8,
                borderTop: `0.5px solid ${t.border}`, paddingTop: 14,
            }}>
                {Object.keys(STOP_TYPE_CONFIG).map((type, i, arr) => {
                    const cfg = STOP_TYPE_CONFIG[type];
                    return (
                    <div key={type} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 500, color: t.text }}>{tripStats[type]}</div>
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