import React from "react";

import { StopType, TripMeta, TripStop, Trip } from "@/types/trip";

import { t, STOP_TYPE_CONFIG } from "@/lib/config";
import { calculateTripDays, countTripStops } from "@utils/tripSummary";


// ─── Helpers ──────────────────────────────────────────────────────────────────

function countByType(stops: TripStop[]) {
    return stops.reduce<Record<StopType, number>>(
        (acc, s) => ({
            ...acc,
            [s.type]: acc[s.type] + 1,
        }),
        {
            transport: 0,
            hotel: 0,
            place: 0,
            restaurant: 0,
        }
    );
}

function totalBudget(stops: TripStop[]) {
    const sum = stops.reduce(
        (acc, stop) => acc + stop.budget,
        0
    );

    if (sum === 0) return "—";

    return sum >= 1000
        ? `$${(sum / 1000).toFixed(1)}k`
        : `$${Math.round(sum)}`;
}

function Chip({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
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

export default function TripHeaderCard({ 
    trip
} : {
    trip: Trip;
}) {

    const tripDays = calculateTripDays(trip.meta.dateFrom, trip.meta.dateTo);
    const tripStats = countTripStops(trip.stops);

    const counts = countByType(trip.stops);
    const budget = totalBudget(trip.stops);

    return (
        <div style={{
            background: t.bgSecondary, border: `0.5px solid ${t.border}`,
            borderRadius: t.radiusMd, padding: "20px 20px 16px", marginBottom: 16,
        }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                {trip.meta?.flag &&
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
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Chip>📅 {trip.meta.dates}</Chip>
                <Chip>⏱ {tripDays} days</Chip>
                <Chip style={{ background: t.bg, borderColor: t.border, color: t.textMuted }}>
                {budget}
                </Chip>
                {trip.meta.cities &&
                <Chip>📍 {trip.meta.cities}</Chip>
                }
                <Chip>👥 {trip.meta.travelers} travelers</Chip>
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