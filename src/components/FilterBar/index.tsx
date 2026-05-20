import React from "react";


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
  borderHeavy: "var(--color-border-primary,        #999997)",
  radiusSm:    8,
  radiusMd:    12,
  radiusLg:    16,
};

const FILTER_OPTIONS = [
  { key: "all",       label: "All" },
  { key: "ongoing",   label: "Today" },
  //{ key: "upcoming",  label: "Upcoming" },
  { key: "planning",  label: "Planning" },
  { key: "completed", label: "Completed" },
];

const SORT_OPTIONS = ["Date", "Name", "Budget", "Duration"];


// ─── FilterBar ────────────────────────────────────────────────────────────────
interface FilterBarProps {
  activeFilter: string;
  onFilter: React.Dispatch<React.SetStateAction<string>>;

  activeSort: string;
  onSort: React.Dispatch<React.SetStateAction<string>>;

  search: string;
  onSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function FilterBar({
  activeFilter, onFilter,
  activeSort, onSort,
  search, onSearch,
}: FilterBarProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>

            {/* Row 1 — Search full width */}
            <div style={{ position: "relative", width: "100%" }}>
                <span style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                fontSize: 13, color: t.textHint, pointerEvents: "none",
                }}>⌕</span>
                <input
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search trips…"
                style={{
                    fontSize: 13, padding: "0 12px 0 32px", width: "100%", height: 40,
                    border: `0.5px solid ${t.border}`, borderRadius: 20,
                    background: t.bg, color: t.text, outline: "none", fontFamily: "inherit",
                    boxSizing: "border-box",
                }}
                />
            </div>

            {/* Row 2 — Filters + Sort */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {/* Status filters — full width */}
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", width: "100%" }}>
                <span style={{ fontSize: 12, color: t.textHint, marginRight: 2, flexShrink: 0 }}>Filter by</span>
                {FILTER_OPTIONS.map(({ key, label }) => (
                    <button
                    key={key}
                    onClick={() => onFilter(key)}
                    style={{
                        fontSize: 12, padding: "5px 13px", borderRadius: 20, cursor: "pointer",
                        fontFamily: "inherit",
                        border: activeFilter === key ? `0.5px solid ${t.borderHeavy}` : `0.5px solid ${t.border}`,
                        background: activeFilter === key ? t.text : t.bg,
                        color: activeFilter === key ? t.bg : t.textMuted,
                    }}
                    >{label}</button>
                ))}
                </div>

                {/* Sort */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, color: t.textHint }}>Sort by</span>
                {SORT_OPTIONS.map((s) => (
                    <button
                    key={s}
                    onClick={() => onSort(s)}
                    style={{
                        fontSize: 12, padding: "5px 11px", borderRadius: 20, cursor: "pointer",
                        fontFamily: "inherit",
                        border: activeSort === s ? `0.5px solid ${t.borderHeavy}` : `0.5px solid ${t.border}`,
                        background: activeSort === s ? t.text : t.bg,
                        color: activeSort === s ? t.bg : t.textMuted,
                    }}
                    >{s}</button>
                ))}
                </div>
            </div>
        </div>
    );
}