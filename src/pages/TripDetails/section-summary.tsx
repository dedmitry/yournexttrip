import { useState, useCallback, useRef } from "react";

import { IconCalendar, IconSun, IconPeople, IconWallet, IconStar, IconDots } from "@/components/Icons";

import { Trip, TripTab } from "@/types/trip";

import { tripTripRange, calculateTripDays, totalTripBudget, formatBudget, countTripStops, plural } from "@/utils/tripSummary";


export default function TripHeaderCard({ 
    trip, 
    activeTab, 
    onTabChange, 
    onDuplicate, 
    onShareTrip,
    onEdit,
    onDelete,
    onRate
} : {
    trip: Trip;
    activeTab: TripTab;
    onTabChange: (tab: TripTab) => void;
    onDuplicate: (trip: Trip) => void;
    onShareTrip: (trip: Trip) => void;
    onEdit: (trip: Trip) => void;
    onDelete: (id: number) => void;
    onRate: (rating: number) => void;
}) {
const [rating, setRating] = useState(trip?.meta.rating || 0);
const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);
const moreRef = useRef<HTMLButtonElement>(null);
const [menuOpen, setMenuOpen] = useState(false);


const menuItems = [
    { label: "Edit", action: () => onEdit(trip), icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
    { label: "Share", action: () => onShareTrip(trip), icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49"/></svg> },
    //{ label: "Export PDF", action: () => setMenuOpen(false), icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/></svg> },
    { label: "Duplicate", action: () => onDuplicate(trip), icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> },
    null,
    { label: "Delete", action: () => onDelete(trip.id), icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6l-1 14H6L5 6"/><path d="M8 6V4h8v2"/></svg>, danger: true },
];

const rate = (n: number) => {
    const v = rating === n ? 0 : n;
    setRating(v);
    onRate?.(v);
};

const closeMenu = useCallback((refocus: boolean) => {
    setMenuAnchor(null);

    if (refocus) {
        moreRef.current?.focus();
    }
}, []);

    
    const tripDays = calculateTripDays(trip.meta.dateFrom, trip.meta.dateTo);
    const tripStats = countTripStops(trip.stops);
    const totalBudget = totalTripBudget(trip.stops);


    const TABS = [
        { key: "plan", label: "Plan" },
        { key: "checklist", label: "Checklist" },
        { key: "notes", label: "Notes" },
   ] satisfies { key: TripTab; label: string }[];

    const facts = [
        { icon: IconCalendar, label: "From – to", value: tripTripRange(trip.meta.dateFrom, trip.meta.dateTo) },
        { icon: IconSun, label: "Days", value: plural(tripDays ?? 0, "day", "days") },
        { icon: IconPeople, label: "Travelers", value: plural(trip.meta.travelers, "traveler", "travelers") },
        { icon: IconWallet, label: "Budget", value: formatBudget(totalBudget) },
    ];


    return (
        <div className="px-3 pb-1 pt-3 sm:px-6 sm:pt-5">
            <div className="relative mx-auto max-w-[1240px] rounded-[20px] bg-white shadow-[0_0_0_1px_#E1E5EC,0_12px_32px_rgba(17,24,39,.06)] sm:rounded-3xl">
                <div className="flex items-start gap-4 px-[18px] pt-5 sm:px-7 sm:pt-[26px]">
                    <div className="min-w-0 flex-1">
                        <h1 className="m-0 text-[27px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-4xl">{trip?.meta.title}</h1>
                        <div role="radiogroup" aria-label="Trip rating" className="-ml-[3px] mt-2 flex">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <button
                            key={n}
                            type="button"
                            role="radio"
                            aria-checked={rating === n}
                            aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
                            onClick={() => rate(n)}
                            className={`grid h-7 w-[23px] place-items-center rounded-md hover:text-[#E0A100] hover:opacity-80 ${n <= rating ? "text-[#E0A100]" : "text-[#C9D0DB]"}`}
                            >
                            <IconStar className="h-[22px] w-[22px]" />
                            </button>
                        ))}
                        </div>
                    </div>
                    <button
                        ref={moreRef}
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={menuOpen}
                        aria-label={`Actions for ${trip.meta.title}`}
                        onClick={() => setMenuOpen((o) => !o)}
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-[14px] border transition ${menuAnchor ? "border-[#111827] bg-[#111827] text-white" : "border-[#B8C1CE] bg-white text-[#111827] hover:border-[#111827] hover:bg-[#111827] hover:text-white"}`}
                    >
                        <IconDots /> 
                    </button>
                    {menuOpen && (
                        <div
                            onMouseLeave={() => setMenuOpen(false)}
                            style={{
                                position: "absolute", top: 30, right: 0, zIndex: 20,
                                background: "var(--color-background-primary,   #ffffff)", border: `0.5px solid var(--color-border-tertiary, #e5e5e3)`,
                                borderRadius: 12, padding: "4px 0", minWidth: 148,
                                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                            }}
                        >
                            {menuItems.map((item, i) =>
                            item === null ? (
                                <div key={i} style={{ height: 0.5, background: "var(--color-border-tertiary, #e5e5e3)", margin: "4px 0" }} />
                            ) : (
                                <button
                                key={item.label}
                                onClick={item.action}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    width: "100%", padding: "7px 14px",
                                    background: "transparent", border: "none", cursor: "pointer",
                                    fontSize: 14, fontFamily: "inherit",
                                    color: item?.danger ? "#A32D2D" : "var(--color-text-primary, #111111)",
                                    textAlign: "left",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = item?.danger ? "#FCEBEB" : "var(--color-background-secondary, #f9f9f8)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                <span style={{ width: 14, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
                                {item.label}
                                </button>
                            )
                            )}
                        </div>
                    )}
                </div>
        
                <ul className="m-0 grid list-none grid-cols-2 gap-x-3 gap-y-3.5 px-[18px] pb-5 pt-[18px] sm:flex sm:flex-wrap sm:gap-y-3.5 sm:px-7 sm:pb-6 sm:pt-[22px]">
                {facts.map(({ icon: Icon, label, value }, i) => (
                    <li key={label} className={`flex items-center gap-2.5 sm:gap-3 sm:px-7 ${i === 0 ? "sm:pl-0" : "sm:border-l sm:border-[#E1E5EC]"}`}>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#E3F2EF] text-[#0E6E66] sm:h-10 sm:w-10">
                        <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="text-base font-bold sm:whitespace-nowrap sm:text-lg">
                        <span className="sr-only">{label}: </span>
                        {value}
                    </span>
                    </li>
                ))}
                </ul>
        
                {/* tear line with notches */}
                <div
                aria-hidden="true"
                className="relative mx-[18px] border-t-2 border-dashed border-[#B8C1CE] sm:mx-6
                            before:absolute before:-left-[30px] before:-top-[13px] before:h-6 before:w-6 before:rounded-full before:bg-[#F4F6FA] before:[clip-path:inset(0_0_0_calc(50%_-_1.5px))] before:content-['']
                            after:absolute after:-right-[30px] after:-top-[13px] after:h-6 after:w-6 after:rounded-full after:bg-[#F4F6FA] after:[clip-path:inset(0_calc(50%_-_1.5px)_0_0)] after:content-['']
                            sm:before:-left-9 sm:after:-right-9"
                />
        
                <div className="px-[18px] pb-4 pt-3.5 sm:px-7 sm:pb-[18px] sm:pt-4">
                    <nav aria-label="Trip sections" className="grid w-full grid-cols-3 gap-[3px] rounded-[11px] bg-[#F4F6FA] p-[3px] sm:inline-grid sm:w-auto sm:min-w-[360px]">
                        {TABS.map((t) => {
                            const on = t.key === activeTab;
                            return (
                                <button
                                key={t.key}
                                type="button"
                                aria-current={on ? "page" : undefined}
                                onClick={() => !on && onTabChange?.(t.key)}
                                className={`min-h-[34px] whitespace-nowrap rounded-lg px-4 text-[15px] ${on ? "bg-white font-extrabold text-[#111827] shadow-[0_1px_2px_rgba(17,24,39,.12),0_0_0_1px_rgba(17,24,39,.04)]" : "font-semibold text-[#2F3A4D] hover:text-[#111827]"}`}
                                >
                                {t.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>
        

        </div>
    );
}