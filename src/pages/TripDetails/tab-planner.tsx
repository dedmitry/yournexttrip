import React, { useState, useEffect, useCallback, useRef } from "react";

import { IconClock, IconGrip, IconLink, IconOpen, IconClose, IconTrash } from "@/components/Icons";

import { TripStop, initialTripStop, TripMeta, StopId, StopType } from "@/types/trip";


/* ---------- types ---------- */
type ItemType = "transit" | "stay" | "place" | "food";
type Item = {
  id: StopId;
  type: ItemType;
  sub: string;
  start: string; // "HH:MM" or ""
  dur: number; // minutes
  name: string;
  details: string;
  cost: number | null;
  link: string;
  notes: string;
  travelNext: string;
};
type Day = { items: Item[] };
type DropTarget = { day: number; beforeId: string | null };
type DragState = { id: StopId; target: DropTarget | null };
type IconProps = { className?: string };
type TypeDef = { label: string; c: string; cb: string; icon: React.ComponentType<IconProps>; subs: string[] };


/* ---------- icons that are not in @/components/Icons ---------- */
const makeIcon = (paths: React.ReactNode) =>
  function Icon({ className }: IconProps) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
        {paths}
      </svg>
    );
  };
const IconTransit = makeIcon(<><rect x="5" y="3" width="14" height="13" rx="3" /><path d="M5 10h14M8 20l2-4M16 20l-2-4" /></>);
const IconStay = makeIcon(<><path d="M3 18V7M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3" /><circle cx="7" cy="10" r="1.5" /></>);
const IconPlace = makeIcon(<><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>);
const IconFood = makeIcon(<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 1-3 3-3 6v3h3v9" />);
const IconRoute = makeIcon(<><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h7a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h7" /></>);


/* ---------- activity types ----------
 * Defined here because the shape of STOP_TYPE_CONFIG isn't visible from this file.
 * If your config already holds label / colors / subtypes, build TYPES from it instead.
 */
const TYPES: Record<ItemType, TypeDef> = {
  transit: { label: "Transit", c: "#2F5BD3", cb: "#E8EEFC", icon: IconTransit, subs: ["Flight", "Train", "Bus", "Metro", "Taxi", "Car", "Ferry", "Walk"] },
  stay: { label: "Stay", c: "#7A3FC4", cb: "#F1EAFB", icon: IconStay, subs: ["Hotel", "Apartment", "Hostel", "Guesthouse", "Camping"] },
  place: { label: "Place", c: "#0E6E66", cb: "#E3F2EF", icon: IconPlace, subs: ["Landmarks", "ViewPoint", "Photo Spots", "Outdoor Activities", "Museum", "Local Store", "Market" ] },
  food: { label: "Food", c: "#B45309", cb: "#FDF0E1", icon: IconFood, subs: ["Restaurant", "Cafe", "Bar", "Street food", "Market"] },
};
const TYPE_KEYS = Object.keys(TYPES) as ItemType[];


/* ---------- date & format helpers ---------- */
const isISODate = (s?: string | null): s is string => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);
const todayISO = () => new Date().toISOString().slice(0, 10);
const toUTC = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};
const tripLength = (start: string, end: string) => Math.max(1, Math.round((toUTC(end) - toUTC(start)) / 864e5) + 1);
const addDaysUTC = (start: string, i: number) => new Date(toUTC(start) + i * 864e5);
const fdate = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-US", { timeZone: "UTC", ...o });
const money = (v: number | null | undefined) => "$" + Number(v || 0).toLocaleString("en-US");
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "") || "Link";
  } catch {
    return "Link";
  }
};


/* ---------- time helpers ---------- */
const toMin = (t?: string | null): number | null => {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
};
const fmtT = (m: number) => {
  m = Math.max(0, Math.min(m, 1439));
  return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
};
const t12 = (m: number) => {
  m = ((m % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  return `${h % 12 || 12}:${String(m % 60).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};
const fmtD = (m: number) => {
  if (!m || m <= 0) return "";
  const h = Math.floor(m / 60), r = m % 60;
  return h ? (r ? `${h}h ${r}m` : `${h}h`) : `${r} min`;
};
const durOf = (it: Item) => Number(it.dur) || 0;
/** End minute of an item, or null when it has no start time. */
const endOf = (it: Item): number | null => {
  const s = toMin(it.start);
  return s === null ? null : s + durOf(it);
};
const hasCost = (c: unknown): c is number => c !== null && c !== undefined && c !== "";
const byTime = (a: Item, b: Item) => (toMin(a.start) ?? 9999) - (toMin(b.start) ?? 9999);
const dayCost = (d: Day) => d.items.reduce((s, i) => s + (Number(i.cost) || 0), 0);
const makeId = (days: Day[]): number =>
  days.reduce((m, d) => d.items.reduce((mm, it) => Math.max(mm, Number(it.id) || 0), m), 0) + 1;


/* ---------- parsers (exported for imports / tests) ---------- */
const STOP_TYPES: Record<string, ItemType> = {
  transit: "transit", transport: "transit", travel: "transit",
  stay: "stay", hotel: "stay", accommodation: "stay", lodging: "stay",
  place: "place", activity: "place", sight: "place",
  food: "food", restaurant: "food", meal: "food",
};
const normType = (t: unknown): ItemType => STOP_TYPES[String(t || "").toLowerCase()] || "place";

/** "14:25", "2:25 PM", "2pm", "9.30" → "HH:MM" (24h), or "" */
export function parseTime(v: unknown): string {
  const m = String(v || "").trim().match(/^(\d{1,2})(?:[:.h](\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?$/i);
  if (!m) return "";
  let h = Number(m[1]);
  const min = Number(m[2] || 0);
  const ap = (m[3] || "").toLowerCase();
  if (ap.startsWith("p") && h < 12) h += 12;
  if (ap.startsWith("a") && h === 12) h = 0;
  if (h > 23 || min > 59) return "";
  return String(h).padStart(2, "0") + ":" + String(min).padStart(2, "0");
}
/** "2h 15m", "1h", "45 min", "135", "1:30", "1.5h" → minutes */
export function parseDuration(v: unknown): number {
  const s = String(v || "").trim().toLowerCase();
  if (!s) return 0;
  if (/^\d+$/.test(s)) return Number(s);
  const hm = s.match(/^(\d+):(\d{2})$/);
  if (hm) return Number(hm[1]) * 60 + Number(hm[2]);
  const h = s.match(/(\d+(?:[.,]\d+)?)\s*h/);
  const m = s.match(/(\d+)\s*m/);
  return Math.round((h ? parseFloat(h[1].replace(",", ".")) * 60 : 0) + (m ? Number(m[1]) : 0));
}
/** "$1,240", "130", "Free", "" → number | null */
export function parseBudget(v: unknown): number | null {
  const s = String(v ?? "").trim();
  if (!s) return null;
  if (/^free$/i.test(s)) return 0;
  const n = parseFloat(s.replace(/[^\d.,-]/g, "").replace(/,(?=\d{3}\b)/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}


/* ---------- adapters between TripMeta / TripStop[] and the internal day model ---------- */
export function metaToTrip(meta: TripMeta) {
  return {
    name: meta.title,
    destination: meta.destination,
    status: meta.status,
    start: meta.dateFrom,
    end: meta.dateTo,
    people: meta.travelers,
    rating: meta.rating ?? 0,
  };
}

/** TripStop[] → days. TripStop.day is 1-based (1 = first day of the trip). */
export function stopsToDays(stops: TripStop[], meta: TripMeta): Day[] {
  const oneBased = !stops.some((s) => Number(s.day) === 0);
  const len = isISODate(meta?.dateFrom) && isISODate(meta?.dateTo) ? tripLength(meta.dateFrom, meta.dateTo) : 1;
  const idx = (s: TripStop) => Math.max(0, (Number(s.day) || 0) - (oneBased ? 1 : 0));
  const maxDay = stops.reduce((m, s) => Math.max(m, idx(s)), -1);
  const days: Day[] = Array.from({ length: Math.max(len, maxDay + 1, 1) }, () => ({ items: [] }));
  stops.forEach((st) => {
    days[idx(st)].items.push({
      id: st.id,
      type: normType(st.type),
      sub: st.subtype || "",
      start: parseTime(st.time),
      dur: parseDuration(st.duration),
      name: st.name || "",
      details: st.details || "",
      cost: parseBudget(st.budget),
      link: st.link || "",
      notes: st.notes || "",
      travelNext: st.travelNext || "",
    });
  });
  return days;
}

/**
 * days → TripStop[] (day 1-based, time "HH:MM", duration like "2h 15m", budget like "130").
 * Fields this component doesn't know about are carried over from the previous stops.
 */
export function daysToStops(days: Day[], prev: TripStop[] = []): TripStop[] {
  const base = new Map(prev.map((s) => [String(s.id), s]));
  const out: TripStop[] = [];
  days.forEach((d, i) =>
    [...d.items].sort(byTime).forEach((it) => {
      out.push({
        ...initialTripStop,
        ...base.get(String(it.id)),
        id: it.id,
        day: i + 1,
        type: it.type as StopType,
        subtype: it.sub || "",
        time: it.start || "",
        name: it.name || "",
        details: it.details || "",
        link: it.link || "",
        budget: hasCost(it.cost) ? String(it.cost) : "",
        duration: it.dur ? fmtD(it.dur) : "",
        travelNext: it.travelNext || "",
        notes: it.notes || "",
      });
    })
  );
  return out;
}


/* ---------- sample data ---------- */
export const SAMPLE_META = {
  title: "Japan, Tokyo and Kyoto",
  destination: "Tokyo & Kyoto, Japan",
  dateFrom: "2026-10-10",
  dateTo: "2026-10-20",
  travelers: 2,
  rating: 4,
  status: "upcoming",
};
const sample = (p: Partial<TripStop>): TripStop => ({ ...initialTripStop, ...p });
export const SAMPLE_STOPS: TripStop[] = [
  sample({ id: 1, day: 1, type: "transit" as StopType, subtype: "Flight", time: "10:30", name: "Flight to Tokyo Haneda", duration: "13h", budget: "1240" }),
  sample({ id: 2, day: 2, type: "stay" as StopType, subtype: "Hotel", time: "15:00", name: "Hotel check-in, Shinjuku", details: "Show passport at the front desk", budget: "620" }),
  sample({ id: 3, day: 2, type: "food" as StopType, subtype: "Restaurant", time: "19:00", name: "Dinner in Omoide Yokocho", duration: "1h 30m", budget: "60" }),
  sample({ id: 4, day: 5, type: "transit" as StopType, subtype: "Train", time: "10:00", name: "Tokyo Station → Kyoto Station", duration: "2h 15m", budget: "130" }),
  sample({ id: 5, day: 5, type: "place" as StopType, subtype: "Sight", time: "14:00", name: "Fushimi Inari Shrine", duration: "2h", budget: "Free" }),
];


/* ---------- toast ---------- */
function useToast() {
  const [toast, setToast] = useState<{ message: string; undo?: () => void } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const show = useCallback((message: string, undo?: () => void) => {
    clearTimeout(timer.current);
    setToast({ message, undo });
    timer.current = setTimeout(() => setToast(null), undo ? 6000 : 2500);
  }, []);
  const dismiss = useCallback(() => {
    clearTimeout(timer.current);
    setToast(null);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  const node = toast && (
    <div role="status" aria-live="polite" className="fixed bottom-[calc(24px+env(safe-area-inset-bottom,0px))] left-1/2 z-[60] flex max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-3.5 rounded-[14px] bg-[#111827] py-2.5 pl-[18px] pr-2.5 text-base text-white shadow-[0_12px_30px_rgba(17,24,39,.3)]">
      <span>{toast.message}</span>
      {toast.undo && (
        <button type="button" onClick={() => { const u = toast.undo; setToast(null); u?.(); }} className="min-h-10 rounded-[10px] bg-white/15 px-3.5 font-bold">
          Undo
        </button>
      )}
    </div>
  );
  return [show, dismiss, node] as const;
}


/* ---------- plan: card ---------- */
function ActionCard({ it, selected, dragging, onOpen, onGripDown }: {
    it: Item;
    selected: boolean;
    dragging: boolean;
    onOpen: () => void;
    onGripDown: (e: React.PointerEvent<HTMLButtonElement>) => void;
    }) {
    const T = TYPES[it.type];
    const Icon = T.icon;
    const s = toMin(it.start);
    const e = endOf(it);
    const dur = durOf(it);
    return (
        <article
            data-card={String(it.id)}
            style={{ "--c": T.c, "--cb": T.cb } as React.CSSProperties}
            className={`relative mb-2.5 rounded-[14px] bg-white px-3 py-[11px] transition sm:px-4 sm:py-3 ${dragging ? "opacity-35" : ""} ${
                selected ? "shadow-[0_0_0_2px_#0E6E66]" : "shadow-[0_0_0_1px_#B8C1CE] hover:bg-[#FAFBFD]"
            }`}
        >
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap text-[15px] font-bold text-[var(--c)]">
                <i className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-[var(--cb)]"><Icon className="h-3 w-3" /></i>
                {T.label}
                {it.sub && <em className="font-medium not-italic text-[#4A5568]">/ {it.sub}</em>}
            </span>
            <span className="order-3 basis-full whitespace-nowrap text-[15px] text-[#2F3A4D] sm:order-none sm:basis-auto sm:border-l sm:border-[#B8C1CE] sm:pl-2.5">
                {s !== null ? `${t12(s)}${dur && e !== null ? ` – ${t12(e)}` : ""}` : "No time"}
                {dur > 0 && <span className="text-[#4A5568]"><span className="mx-1.5">·</span>{fmtD(dur)}</span>}
            </span>
            <span className="ml-auto flex shrink-0 items-center gap-2.5 sm:gap-3.5">
            {it.link && (
                <a href={it.link} target="_blank" rel="noopener noreferrer" className="relative z-[2] inline-flex max-w-[160px] items-center gap-[5px] text-[15px] font-semibold text-[#1D5FD6] no-underline hover:text-[#174CAB] hover:underline">
                <IconLink className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{hostOf(it.link)}</span>
                </a>
            )}
            <span className={`whitespace-nowrap text-[15px] ${hasCost(it.cost) ? "font-bold text-[#111827]" : "font-medium text-[#4A5568]"}`}>
                <span className="sr-only">Budget </span>
                {hasCost(it.cost) ? (Number(it.cost) === 0 ? "Free" : money(it.cost)) : "No price"}
            </span>
            <button
                type="button"
                aria-label={`Drag to move ${it.name || "action"}`}
                title="Drag to move"
                onPointerDown={onGripDown}
                className="relative z-[2] -my-[5px] -mr-2.5 -ml-1 grid h-[30px] w-[30px] shrink-0 cursor-grab touch-none place-items-center rounded-lg text-[#AEB7C4] hover:bg-[#F4F6FA] hover:text-[#111827]"
            >
                <IconGrip />
            </button>
            </span>
        </div>
        {/* stretched button: the whole card opens the editor */}
        <button
            type="button"
            onClick={onOpen}
            className="mt-1 block text-left text-base font-bold leading-[1.3] text-[#111827] outline-none after:absolute after:inset-0 after:z-[1] after:rounded-[14px] after:content-[''] focus-visible:after:outline focus-visible:after:outline-[3px] focus-visible:after:outline-offset-2 focus-visible:after:outline-[#0E6E66] sm:text-[18px]"
        >
            {it.name || "Untitled action"}
        </button>
        {it.details && <div title={it.details} className="mt-0.5 truncate text-sm leading-[1.45] text-[#2F3A4D]">{it.details}</div>}
        {it.notes && (
            <div title={it.notes} className="mt-0.5 -truncate -text-sm -leading-[1.45] text-[#4A5568] text-[15px]">
                <b className="font-semibold text-[#2F3A4D]">Note: </b>{it.notes}
            </div>
        )}
        </article>
    );
}


/**
 * Between two stops:
 *  - travelNext set on the first stop            → show it (click to edit)
 *  - a transit stop on either side, both timed   → "Next in 35 min"
 *  - otherwise                                   → "+ Add transit time"
 */
function GapConnector({ prev, next, editing, onStartEdit, onCancelEdit, onSaveTravel }: {
  prev: Item;
  next: Item;
  editing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveTravel: (text: string) => void;
}) {
  const prevEnd = endOf(prev);
  const nextStart = toMin(next.start);
  const gap = prevEnd !== null && nextStart !== null ? nextStart - prevEnd : null;
  const transitNear = prev.type === "transit" || next.type === "transit";
  const wrap = "-mt-1 mb-1.5 flex min-h-[30px] items-center gap-2.5 sm:ml-[22px] sm:before:mr-1 sm:before:self-stretch sm:before:border-l-2 sm:before:border-dashed sm:before:border-[#B8C1CE] sm:before:content-['']";
  if (editing) {
    return (
      <div className={wrap}>
        <InlineForm
          initial={prev.travelNext || ""}
          allowEmpty={!!prev.travelNext}
          label={`Travel from ${prev.name || "this stop"} to ${next.name || "the next stop"}`}
          placeholder="e.g. Metro to Shibuya, 25 min, $3"
          onSave={onSaveTravel}
          onCancel={onCancelEdit}
          compact
          className="w-full max-w-[520px] flex-1"
        />
      </div>
    );
  }
  if (prev.travelNext) {
    return (
      <div className={wrap}>
        <button
          type="button"
          onClick={onStartEdit}
          title="Edit travel to the next stop"
          className="inline-flex h-[26px] max-w-full items-center gap-1.5 rounded-full bg-[#E8EEFC] pl-2 pr-3 text-[13px] font-semibold text-[#2F5BD3] hover:shadow-[inset_0_0_0_1px_#2F5BD3]"
        >
          <IconRoute className="h-[13px] w-[13px] shrink-0" />
          <span className="truncate">{prev.travelNext}</span>
        </button>
      </div>
    );
  }
  if (transitNear && gap !== null) {
    return (
      <div className={wrap}>
        <span role="note" className={`inline-flex h-[26px] items-center gap-1.5 rounded-full pl-2 pr-2.5 text-[13px] font-semibold ${gap < 0 ? "bg-[#FFF1E3] text-[#A64A06]" : "bg-[#F4F6FA] text-[#2F3A4D]"}`}>
          <IconClock className="h-[13px] w-[13px]" />
          {gap > 0 ? `Next in ${fmtD(gap)}` : gap === 0 ? "Right after" : `Overlaps by ${fmtD(-gap)}`}
        </span>
      </div>
    );
  }
  return (
    <div className={wrap}>
      <button
        type="button"
        onClick={onStartEdit}
        className="inline-flex h-[26px] items-center rounded-full border border-dashed border-[#B8C1CE] bg-white px-3 text-[13px] font-bold leading-none text-[#2F5BD3] hover:border-solid hover:border-[#2F5BD3] hover:bg-[#E8EEFC]"
      >
        + Add transit time
      </button>
    </div>
  );
}


/** Text field with Save / Cancel. Enter saves, Escape cancels. */
function InlineForm({ initial = "", allowEmpty = false, placeholder, label, onSave, onCancel, className = "", compact }: {
  initial?: string;
  allowEmpty?: boolean;
  placeholder?: string;
  label: string;
  onSave: (v: string) => void;
  onCancel: () => void;
  className?: string;
  compact?: boolean;
}) {
  const [value, setValue] = useState(initial);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
    if (initial) ref.current?.select();
  }, [initial]);
  const h = compact ? "h-[26px] text-[13px] rounded-full" : "h-10 text-base rounded-xl";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const v = value.trim();
        if (!v && !allowEmpty) return ref.current?.focus();
        onSave(v);
      }}
      className={`flex items-center gap-1.5 ${className}`}
    >
      <input
        ref={ref}
        aria-label={label}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); onCancel(); }
        }}
        className={`${h} min-w-0 flex-1 border border-[#2F5BD3] bg-white px-3 text-[#111827] outline-none shadow-[0_0_0_3px_#E8EEFC]`}
      />
      <button type="submit" className={`${h} shrink-0 border-0 bg-[#2F5BD3] px-3 font-bold text-white hover:brightness-95`}>Save</button>
      <button type="button" onClick={onCancel} className={`${h} shrink-0 border border-dashed border-[#B8C1CE] bg-white px-3 font-bold text-[#2F3A4D] hover:border-solid`}>Cancel</button>
    </form>
  );
}


function AddActionBlock({ onAdd }: { onAdd: (type: ItemType) => void }) {
  return (
    <div role="group" aria-label="Add an action" className="flex flex-wrap items-center gap-3 rounded-[14px] border border-dashed border-[#B8C1CE] bg-[#F4F6FA] p-2.5 sm:py-2.5 sm:pl-4 sm:pr-3">
      <span className="text-[15px] font-bold text-[#2F3A4D]">+ Add an action</span>
      <span className="grid w-full grid-cols-4 gap-1.5 sm:ml-auto sm:flex sm:w-auto">
        {TYPE_KEYS.map((k) => {
          const T = TYPES[k];
          const Icon = T.icon;
          return (
            <button
              key={k}
              type="button"
              onClick={() => onAdd(k)}
              style={{ "--c": T.c, "--cb": T.cb } as React.CSSProperties}
              className="inline-flex h-[26px] items-center justify-center gap-[5px] rounded-full border border-dashed border-[#B8C1CE] bg-white px-1 text-[13px] font-bold leading-none text-[var(--c)] hover:border-solid hover:border-[var(--c)] hover:bg-[var(--cb)] sm:px-2.5"
            >
              <Icon className="h-3.5 w-3.5" />
              {T.label}
            </button>
          );
        })}
      </span>
    </div>
  );
}


/* ---------- plan: action editor ---------- */
function ActionPanel({ it, dayIndex, dayCount, dayLabel, dayOptionLabel, onChange, onMoveDay, onDelete, onClose }: {
  it: Item;
  dayIndex: number;
  dayCount: number;
  dayLabel: string;
  dayOptionLabel: (i: number) => string;
  onChange: (patch: Partial<Item>) => void;
  onMoveDay: (day: number) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}) {
  const [shown, setShown] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);
  const [otherVal, setOtherVal] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const otherOpenRef = useRef(otherOpen);
  otherOpenRef.current = otherOpen;
  const T = TYPES[it.type];
  const TIcon = T.icon;
  const custom = !!it.sub && !T.subs.includes(it.sub);
  const startMin = toMin(it.start);
  const endValue = startMin !== null && it.dur ? fmtT((startMin + it.dur) % 1440) : "";

  /* mount: slide in and focus the name — runs once */
  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    const t = setTimeout(() => nameRef.current?.focus(), 60);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, []);

  /* Escape closes the panel, unless the "Other" subtype input is open */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !otherOpenRef.current) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const setEnd = (v: string) => {
    const e = toMin(v);
    if (!v || e === null || startMin === null) return onChange({ dur: 0 });
    onChange({ dur: (e - startMin + 1440) % 1440 }); // an end before the start means "next day"
  };

  const field = "h-[46px] w-full rounded-xl border border-transparent bg-[#F4F6FA] px-3.5 text-base text-[#111827] transition placeholder:text-[#8A94A6] hover:border-[#B8C1CE] focus:border-[#0E6E66] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#E3F2EF] disabled:cursor-not-allowed disabled:opacity-60";
  const label = "text-[13px] font-semibold text-[#2F3A4D]";
  const section = "flex flex-col gap-3.5 border-b border-[#E1E5EC] py-5 last:border-b-0";
  const heading = "m-0 text-[15px] font-extrabold text-[#111827]";
  const saveOther = () => {
    const v = otherVal.trim();
    if (v) onChange({ sub: v });
    setOtherOpen(false);
  };

  return (
    <>
      <div aria-hidden="true" onClick={onClose} className={`fixed inset-0 z-40 bg-[rgba(17,24,39,.28)] backdrop-blur-[2px] transition-opacity duration-200 ${shown ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-panel-title"
        style={{ "--c": T.c, "--cb": T.cb } as React.CSSProperties}
        className={`
            fixed inset-0 z-50 flex flex-col overflow-hidden bg-white transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none
          sm:inset-auto sm:bottom-3 sm:right-3 sm:top-3 sm:w-[min(500px,calc(100vw-24px))] sm:rounded-3xl sm:shadow-[0_0_0_1px_#E1E5EC,0_30px_80px_rgba(17,24,39,.22)]
          ${shown ? "translate-x-0 translate-y-0" : "translate-y-full sm:translate-y-0 sm:translate-x-[calc(100%+32px)]"}`}
      >
        <header className="flex items-center gap-3.5 bg-[var(--cb)] pb-3.5 pl-[18px] pr-3.5 pt-[calc(14px+env(safe-area-inset-top,0px))] transition-colors sm:pb-[18px] sm:pl-[22px] sm:pr-[18px] sm:pt-5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--c)] text-white sm:h-[46px] sm:w-[46px] sm:rounded-[14px]">
            <TIcon className="h-[22px] w-[22px]" />
          </span>
          <div className="min-w-0 flex-1">
            <span className="block text-[13px] font-bold text-[var(--c)]">{dayLabel}</span>
            <h2 id="action-panel-title" className="m-0 mt-0.5 truncate text-[19px] font-extrabold leading-[1.2] tracking-[-0.015em] sm:text-[21px]">
              {it.name || `New ${T.label.toLowerCase()}`}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close editor" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/75 text-[#111827] hover:bg-white">
            <IconClose className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-[18px] pb-2 sm:px-[22px]">
          <section className={section}>
            <h3 className={heading}>What</h3>
            <div role="group" aria-label="Activity type" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TYPE_KEYS.map((k) => {
                const X = TYPES[k];
                const XI = X.icon;
                const on = k === it.type;
                return (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={on}
                    onClick={() => !on && onChange({ type: k, sub: "" })}
                    style={{ "--tc": X.c } as React.CSSProperties}
                    className={`flex h-[46px] items-center justify-center gap-2 rounded-[14px] border px-2 text-[13px] font-bold transition sm:h-12 ${
                      on ? "border-[var(--tc)] bg-[var(--tc)] text-white" : "border-[#E1E5EC] bg-white text-[#2F3A4D] hover:border-[var(--tc)] hover:text-[var(--tc)]"
                    }`}
                  >
                    <span className={on ? "text-white" : "text-[var(--tc)]"}><XI className="h-[18px] w-[18px]" /></span>
                    {X.label}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col gap-2">
              <span className={label}>Subtype</span>
              <div role="group" aria-label="Subtype" className="flex flex-wrap gap-1.5">
                {T.subs.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={it.sub === s}
                    onClick={() => onChange({ sub: it.sub === s ? "" : s })}
                    className={`h-8 rounded-full border px-[13px] text-[13px] font-semibold ${
                      it.sub === s ? "border-[var(--c)] bg-[var(--cb)] text-[var(--c)] shadow-[inset_0_0_0_1px_var(--c)]" : "border-[#B8C1CE] bg-white text-[#2F3A4D] hover:border-[var(--c)] hover:text-[var(--c)]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
                {custom && !otherOpen && (
                  <button type="button" aria-pressed="true" onClick={() => onChange({ sub: "" })} className="h-8 rounded-full border border-[var(--c)] bg-[var(--cb)] px-[13px] text-[13px] font-semibold text-[var(--c)] shadow-[inset_0_0_0_1px_var(--c)]">
                    {it.sub}
                  </button>
                )}
                {!otherOpen && (
                  <button type="button" onClick={() => { setOtherVal(custom ? it.sub : ""); setOtherOpen(true); }} className="h-8 rounded-full border border-dashed border-[#B8C1CE] bg-white px-[13px] text-[13px] font-semibold text-[#4A5568]">
                    {custom ? "Edit" : "+ Other"}
                  </button>
                )}
              </div>
              {otherOpen && (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    aria-label="Your own subtype"
                    value={otherVal}
                    onChange={(e) => setOtherVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); saveOther(); }
                      if (e.key === "Escape") { e.preventDefault(); setOtherOpen(false); }
                    }}
                    placeholder="Your own subtype"
                    className="h-10 min-w-0 flex-1 rounded-xl border border-[#B8C1CE] bg-white px-3 text-[15px] focus:border-[#0E6E66] focus:outline-none focus:ring-4 focus:ring-[#E3F2EF]"
                  />
                  <button type="button" onClick={saveOther} className="h-10 rounded-xl border border-[#0E6E66] bg-[#E3F2EF] px-3.5 text-sm font-bold text-[#0E6E66]">Save</button>
                  <button type="button" onClick={() => setOtherOpen(false)} className="h-10 rounded-xl border border-[#B8C1CE] bg-white px-3.5 text-sm font-bold text-[#2F3A4D]">Cancel</button>
                </div>
              )}
            </div>
            <label className="flex flex-col gap-1.5">
              <span className={label}>Name</span>
              <input ref={nameRef} className={field} value={it.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="Name of the place, booking or activity" autoComplete="off" />
            </label>
          </section>

          <section className={section}>
            <h3 className={heading}>When</h3>
            <label className="flex flex-col gap-1.5">
              <span className={label}>Day</span>
              <select className={field} value={dayIndex} onChange={(e) => onMoveDay(Number(e.target.value))}>
                {Array.from({ length: dayCount }, (_, i) => (
                  <option key={i} value={i}>{dayOptionLabel(i)}</option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                    <span className={label}>Start</span>
                    <input 
                        type="time" 
                        className={field} 
style={{
    height: "46px",
    lineHeight: "46px",
    paddingTop: 0,
    paddingBottom: 0,
    boxSizing: "border-box",
      textAlign: "left",
        textAlignLast: "left",
    WebkitAppearance: "none",
}}
                        value={it.start} 
                        onChange={(e) => onChange({ start: e.target.value })} 
                    />
                </label>
                <label className="flex flex-col gap-1.5">
                    <span className={label}>Duration</span>
                    <span className="relative">
                        <input 
                            type="number" 
                            min="0" 
                            step="5" 
                            inputMode="numeric" 
                            placeholder="0" 
                            className={`${field} pr-[52px]`} value={it.dur || ""} 
style={{
    height: "46px",
    lineHeight: "46px",
    paddingTop: 0,
    paddingBottom: 0,
    boxSizing: "border-box",
      textAlign: "left",
        textAlignLast: "left",
    WebkitAppearance: "none",
}}
                            onChange={(e) => onChange({ dur: Math.max(0, Number(e.target.value) || 0) })} 
                        />
                        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[15px] text-[#4A5568]">min</span>
                    </span>
                </label>
            </div>
            
            {!it.start && <p className="m-0 rounded-[10px] bg-[#FFF1E3] px-3 py-2 text-sm text-[#A64A06]">Add a start time to place this action in the day.</p>}
            <label className="flex flex-col gap-1.5">
              <span className={label}>Travel to the next stop</span>
              <input className={field} value={it.travelNext || ""} onChange={(e) => onChange({ travelNext: e.target.value })} placeholder="e.g. Metro to Shibuya, 25 min, $3" autoComplete="off" />
            </label>
          </section>

          <section className={section}>
            <h3 className={heading}>Where</h3>
            <label className="flex flex-col gap-1.5">
              <span className={label}>Address or details</span>
              <textarea rows={2} className={`${field} h-auto min-h-[84px] resize-y py-3 leading-normal`} value={it.details} onChange={(e) => onChange({ details: e.target.value })} />
            </label>
            <div className="flex flex-col gap-1.5">
              <span className={label}>Link</span>
              <div className="grid grid-cols-[minmax(0,1fr)_46px] overflow-hidden rounded-xl border border-transparent bg-[#F4F6FA] transition hover:border-[#B8C1CE] focus-within:border-[#0E6E66] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#E3F2EF]">
                <input aria-label="Link address" type="url" placeholder="https://" value={it.link} onChange={(e) => onChange({ link: e.target.value.trim() })} className="h-11 min-w-0 bg-transparent px-3.5 outline-none" />
                <a href={it.link || undefined} target="_blank" rel="noopener noreferrer" aria-label="Open link" aria-disabled={!it.link} className={`grid place-items-center border-l border-[#B8C1CE] ${it.link ? "text-[#1D5FD6] hover:bg-[#E8EEFC]" : "pointer-events-none text-[#B8C1CE]"}`}>
                  <IconOpen className="h-4 w-4" />
                </a>
              </div>
            </div>
          </section>

          <section className={section}>
            <h3 className={heading}>Budget and notes</h3>
            <label className="flex flex-col gap-1.5">
              <span className={label}>Budget</span>
              <span className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-[#4A5568]">$</span>
                <input type="number" min="0" step="1" inputMode="decimal" placeholder="Not set" className={`${field} pl-[30px]`} value={hasCost(it.cost) ? it.cost : ""} onChange={(e) => onChange({ cost: e.target.value === "" ? null : Number(e.target.value) })} />
              </span>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={label}>Notes</span>
              <textarea rows={5} className={`${field} h-auto min-h-[84px] resize-y py-3 leading-normal`} value={it.notes} onChange={(e) => onChange({ notes: e.target.value })} placeholder="Reminders, confirmation numbers, tips" />
            </label>
          </section>

          <section className={section}>
            <button 
                type="button" 
                onClick={() => onDelete(it.id)} 
                className="
                    inline-flex h-11 
                    flex items-center justify-center gap-[7px] 
                    rounded-xl border border-[#F3C4BE] hover:border-[#B42318] 
                    bg-[#FFF5F4] hover:bg-[#FDE8E5] 
                    text-sm font-bold text-[#B42318] 
                    px-4 
                ">
                <IconTrash className="h-4 w-4" />Delete
            </button>
          </section>
        </div>

        <footer 
            className="
                flex items-center -gap-2.5 
                border-t border-[#E1E5EC] 
                bg-white  
                px-[18px] sm:px-[22px]  pt-3 sm:pt-3.5   pb-10 md:pb-5 sm:pb-5
            "
        >
            <button 
                type="button" 
                onClick={onClose} 
                className="
                    w-[100%] h-[52px]  
                    rounded-xl 
                    bg-[#111827] 
                    text-[15px] font-bold text-white hover:bg-black
                    px-[22px] "
            >
                Done
            </button>
        </footer>
      </aside>
    </>
  );
}


// ════════════════════════════════════════════════════════════════════════════
//  TRIP PLANNER
// ════════════════════════════════════════════════════════════════════════════

const SAVE_DELAY = 400; // ms — debounce for writing back to the parent

export default function TripPlanner({
  meta,
  stops,
  updateStops,
  updateMeta,
}: {
  meta: TripMeta;
  stops: TripStop[];
  updateStops: (updatedStops: TripStop[]) => void;
  /** Optional. When given, "+ Add day" extends meta.dateTo so the new day is saved. */
  updateMeta?: (updatedMeta: TripMeta) => void;
}) {
  const [days, setDays] = useState<Day[]>(() => stopsToDays(stops, meta));
  const [sel, setSel] = useState<StopId | null>(null);
  const [addingGap, setAddingGap] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [toast, dismissToast, toastNode] = useToast();

  const daysRef = useRef(days);
  daysRef.current = days;
  const stopsRef = useRef(stops);
  stopsRef.current = stops;
  const metaRef = useRef(meta);
  metaRef.current = meta;
  const updateStopsRef = useRef(updateStops);
  updateStopsRef.current = updateStops;

  const pinned = useRef<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  /* ---- saving: local state updates instantly, parent gets a debounced copy ---- */
  const syncKey = (s: TripStop[], m: TripMeta) => JSON.stringify([s, m.dateFrom, m.dateTo]);
  const lastSync = useRef(syncKey(stops, meta));
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    if (!pending.current) return;
    clearTimeout(pending.current);
    pending.current = null;
    const out = daysToStops(daysRef.current, stopsRef.current);
    lastSync.current = syncKey(out, metaRef.current);
    updateStopsRef.current(out);
  }, []);

  const update = useCallback((next: Day[]) => {
    daysRef.current = next;
    setDays(next);
    dismissToast(); // an older "Undo" would now revert this change too
    if (pending.current) clearTimeout(pending.current);
    pending.current = setTimeout(flush, SAVE_DELAY);
  }, [flush, dismissToast]);

  /* save anything pending when the planner unmounts */
  useEffect(() => () => flush(), [flush]);

  /* pick up changes that come from outside (initial load, date edits, other views) */
  useEffect(() => {
    const key = syncKey(stops, meta);
    if (key === lastSync.current) return;
    if (pending.current) { clearTimeout(pending.current); pending.current = null; }
    lastSync.current = key;
    const next = stopsToDays(stops, meta);
    daysRef.current = next;
    setDays(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops, meta.dateFrom, meta.dateTo]);

  /* ---- lookup helpers ---- */
  const find = (id: StopId | null, list: Day[] = daysRef.current) => {
    if (id === null) return null;
    for (let d = 0; d < list.length; d++) {
      const i = list[d].items.findIndex((x) => x.id === id);
      if (i > -1) return { d, i, it: list[d].items[i] };
    }
    return null;
  };
  const withItems = (list: Day[], d: number, items: Item[]) => list.map((day, k) => (k === d ? { ...day, items } : day));

  /* ---- dates (safe when meta dates are missing) ---- */
  const startISO = isISODate(meta.dateFrom) ? meta.dateFrom : todayISO();
  const dateOf = (i: number) => addDaysUTC(startISO, i);
  const firstWeekday = (dateOf(0).getUTCDay() + 6) % 7;

  /* sticky offset for the mobile calendar */
  useEffect(() => {
    const el = barRef.current;
    if (!el || !("ResizeObserver" in window)) return;
    const ro = new ResizeObserver(() => rootRef.current?.style.setProperty("--barH", (el.offsetParent ? el.offsetHeight : 0) + "px"));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* which day is on screen */
  useEffect(() => {
    let raf = 0;
    const spy = () => {
      raf = 0;
      if (pinned.current !== null) return setActiveDay(pinned.current);
      const line = (barRef.current?.offsetParent ? barRef.current.offsetHeight : 0) + 120;
      let a = 0;
      rootRef.current?.querySelectorAll<HTMLElement>("[data-day-section]").forEach((s) => {
        if (s.getBoundingClientRect().top <= line) a = Number(s.dataset.daySection);
      });
      setActiveDay(a);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(spy); };
    const release = () => { pinned.current = null; };
    window.addEventListener("scroll", onScroll, { passive: true });
    (["wheel", "touchstart", "mousedown"] as const).forEach((ev) => window.addEventListener(ev, release, { passive: true }));
    spy();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      (["wheel", "touchstart", "mousedown"] as const).forEach((ev) => window.removeEventListener(ev, release));
    };
  }, []);
  const jump = (i: number) => {
    pinned.current = i;
    setActiveDay(i);
    document.getElementById(`day-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ---- actions ---- */
  const addAction = (d: number, type: ItemType) => {
    const list = daysRef.current;
    const day = list[d];
    const ends = day.items.map(endOf).filter((x): x is number => x !== null);
    const st = Math.min(1380, Math.ceil((ends.length ? Math.max(...ends) : 540) / 15) * 15);
    const it: Item = { id: makeId(list), type, sub: "", start: fmtT(st), dur: type === "transit" ? 30 : 60, name: "", details: "", cost: null, link: "", notes: "", travelNext: "" };
    update(withItems(list, d, [...day.items, it]));
    setSel(it.id);
  };

  const changeAction = (patch: Partial<Item>) => {
    const list = daysRef.current;
    const f = find(sel, list);
    if (!f) return;
    update(withItems(list, f.d, list[f.d].items.map((x) => (x.id === sel ? { ...x, ...patch } : x))));
  };

  const moveToDay = (target: number) => {
    const list = daysRef.current;
    const f = find(sel, list);
    if (!f || f.d === target || !list[target]) return;
    let out = withItems(list, f.d, list[f.d].items.filter((x) => x.id !== f.it.id));
    out = withItems(out, target, [...out[target].items, f.it]);
    update(out);
    toast(`Moved to Day ${target + 1}`, () => update(list));
  };

  const deleteAction = (id: number) => {
    const list = daysRef.current;

    const dayIndex = list.findIndex(day =>
        day.items.some(item => item.id === id)
    );

    if (dayIndex === -1) return;

    const day = list[dayIndex];
    const item = day.items.find(item => item.id === id);

    if (!item) return;

    
    // If this is the last action in the day, remove the whole day
    if (day.items.length === 1) {
        const nextDays = list.filter((_, index) => index !== dayIndex);

        // Keep at least one day
        if (nextDays.length === 0) {
            update([{ items: [] }]);
        } else {
            update(nextDays);

            // Update trip end date
            if (updateMeta && isISODate(meta.dateFrom)) {
                flush();

                updateMeta({
                    ...meta,
                    dateTo: dateOf(nextDays.length - 1)
                        .toISOString()
                        .slice(0, 10),
                });
            }
        }

        setSel(null);

        // Move to a valid day after deleting
        const nextIndex = Math.min(dayIndex, nextDays.length - 1);

        if (nextDays.length > 0) {
            setTimeout(() => jump(nextIndex), 0);
        }

        return;
    }

    // Normal action deletion
    update(
        list.map((day, index) =>
            index === dayIndex
                ? {
                      ...day,
                      items: day.items.filter(item => item.id !== id),
                  }
                : day
        )
    );

    setSel(null);

     toast(`Deleted “${item.name || "action"}”`, () => update(list));
  };

  const saveTravel = (d: number, prev: Item, text: string) => {
    const list = daysRef.current;
    update(withItems(list, d, list[d].items.map((x) => (x.id === prev.id ? { ...x, travelNext: text } : x))));
    setAddingGap(null);
    toast(text ? "Travel saved" : "Travel removed");
  };

    const addDay = () => {
        const list = daysRef.current;
        const newIndex = list.length;

        const newPlace: Item = {
            id: makeId(list),
            type: "place",
            sub: "",
            start: "09:00",
            dur: 60,
            name: "",
            details: "",
            cost: null,
            link: "",
            notes: "",
            travelNext: "",
        };

        const nextDays = [
            ...list,
            { items: [newPlace] },
        ];

        //update([...list, { items: [] }]);
        update(nextDays);

        // Open the newly created Place in the editor
        setSel(newPlace.id);

        if (updateMeta && isISODate(meta.dateFrom)) {
            // Save the new day immediately so the parent knows about the
            // extended trip before its date props come back down.
            flush(); // send pending stop edits first so nothing is lost when props come back
            updateMeta({ ...meta, dateTo: dateOf(newIndex).toISOString().slice(0, 10) });
        }
        setTimeout(() => jump(newIndex), 0);
    };

  /* ---- drag and drop (mouse and touch) ---- */
  const placeAction = (id: StopId, day: number, beforeId: string | null) => {
    const list = daysRef.current;
    const f = find(id, list);
    if (!f || !list[day]) return;
    const it = f.it;
    const others = list[day].items.filter((x) => x.id !== id).sort(byTime);
    let idx = beforeId === null ? others.length : others.findIndex((x) => String(x.id) === beforeId);
    if (idx < 0) idx = others.length;
    if (day === f.d && [...list[day].items].sort(byTime).findIndex((x) => x.id === id) === idx) return;
    const prev = others[idx - 1], next = others[idx];
    let st = toMin(it.start);
    const prevEnd = prev ? endOf(prev) : null;
    const nextStart = next ? toMin(next.start) : null;
    if (prevEnd !== null) st = prevEnd;
    else if (nextStart !== null) st = Math.max(0, nextStart - (durOf(it) || 30));
    const moved: Item = { ...it, start: st !== null ? fmtT(st) : it.start };
    let out = withItems(list, f.d, list[f.d].items.filter((x) => x.id !== id));
    out = withItems(out, day, [...out[day].items, moved]);
    update(out);
    const tm = toMin(moved.start);
    toast(`Moved to Day ${day + 1}${tm !== null ? ", " + t12(tm) : ""}`, () => update(list));
  };

  const startDrag = (id: StopId) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button > 0) return;
    e.preventDefault();
    const card = e.currentTarget.closest<HTMLElement>("[data-card]");
    if (!card) return;
    const idStr = String(id);
    const r = card.getBoundingClientRect();
    const ghost = card.cloneNode(true) as HTMLElement;
    Object.assign(ghost.style, { position: "fixed", left: r.left + "px", top: r.top + "px", width: r.width + "px", zIndex: "60", pointerEvents: "none", margin: "0", transform: "rotate(1.2deg)", boxShadow: "0 18px 40px rgba(17,24,39,.25)" });
    document.body.appendChild(ghost);
    document.body.style.cursor = "grabbing";
    const dx = e.clientX - r.left, dy = e.clientY - r.top;
    let x = e.clientX, y = e.clientY;
    let target: DropTarget | null = null;
    let lastKey = "";
    setDrag({ id, target: null });

    /* re-render only when the drop target actually changes */
    const retarget = () => {
      const sec = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-day-section]");
      if (!sec) {
        target = null;
      } else {
        const cards = [...sec.querySelectorAll<HTMLElement>("[data-card]")].filter((c) => c.dataset.card !== idStr);
        const before = cards.find((c) => { const b = c.getBoundingClientRect(); return y < b.top + b.height / 2; });
        target = { day: Number(sec.dataset.daySection), beforeId: before?.dataset.card ?? null };
      }
      const key = target ? `${target.day}|${target.beforeId}` : "";
      if (key !== lastKey) {
        lastKey = key;
        setDrag({ id, target });
      }
    };

    /* auto-scroll keeps running while the pointer rests near an edge */
    let raf = 0;
    const scrollLoop = () => {
      const edge = y < 90 ? -14 : y > window.innerHeight - 90 ? 14 : 0;
      if (edge) { window.scrollBy(0, edge); retarget(); }
      raf = requestAnimationFrame(scrollLoop);
    };
    raf = requestAnimationFrame(scrollLoop);

    const move = (ev: PointerEvent) => {
      x = ev.clientX;
      y = ev.clientY;
      ghost.style.left = x - dx + "px";
      ghost.style.top = y - dy + "px";
      retarget();
    };
    const end = (cancel: boolean) => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancelFn);
      window.removeEventListener("keydown", esc);
      ghost.remove();
      document.body.style.cursor = "";
      setDrag(null);
      if (!cancel && target) placeAction(id, target.day, target.beforeId);
    };
    const up = () => end(false);
    const cancelFn = () => end(true);
    const esc = (ev: KeyboardEvent) => { if (ev.key === "Escape") end(true); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancelFn);
    window.addEventListener("keydown", esc);
  };

  const selected = find(sel, days);
  const closePanel = useCallback(() => {
    setSel(null);
    flush();
  }, [flush]);
  const dropLine = <div aria-hidden="true" className="mb-2.5 h-1 rounded-sm bg-[#0E6E66] shadow-[0_0_0_3px_#E3F2EF]" />;

  return (
    <div ref={rootRef} className="w-full">
      {/* mobile: whole trip as a week calendar */}
      <div ref={barRef} className="sticky top-0 z-[5] border-b border-[#E1E5EC] bg-[rgba(244,246,250,.96)] px-3 py-2.5 backdrop-blur-md min-[901px]:hidden">
        <nav aria-label="All days" className="grid grid-cols-7 gap-[5px]">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((w) => (
            <span key={w} aria-hidden="true" className="pb-0.5 text-center text-xs font-bold text-[#4A5568]">{w}</span>
          ))}
          {Array.from({ length: firstWeekday }).map((_, i) => <span key={"pad" + i} aria-hidden="true" className="min-h-11" />)}
          {days.map((_, i) => {
            const on = i === activeDay;
            return (
              <button
                key={i}
                type="button"
                onClick={() => jump(i)}
                aria-current={on ? "true" : undefined}
                aria-label={`Day ${i + 1}, ${fdate(dateOf(i), { weekday: "long", month: "long", day: "numeric" })}`}
                className={`flex min-h-11 flex-col items-center justify-center rounded-[10px] py-0.5 leading-[1.2] ${on ? "bg-[#111827] text-white" : "bg-white text-[#111827] shadow-[0_0_0_1px_#B8C1CE]"}`}
              >
                <b className="text-base font-extrabold leading-[1.1]">{fdate(dateOf(i), { day: "numeric" })}</b>
                <span className={`text-[11px] ${on ? "text-[#D5DAE3]" : "text-[#4A5568]"}`}>{fdate(dateOf(i), { month: "short" })}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-9 px-3 pb-12 pt-3 min-[901px]:grid-cols-[250px_minmax(0,1fr)] sm:px-6">
        {/* laptop: list of days */}
        <nav aria-label="Jump to a day" className="sticky top-4 hidden max-h-[calc(100vh-32px)] flex-col gap-1 self-start overflow-y-auto p-1 min-[901px]:flex">
          <h2 className="mb-2 ml-2.5 mt-0 text-base font-bold text-[#2F3A4D]">Days</h2>
          {days.map((d, i) => {
            const on = i === activeDay;
            return (
              <button
                key={i}
                type="button"
                onClick={() => jump(i)}
                aria-current={on ? "true" : undefined}
                className={`grid grid-cols-[40px_minmax(0,1fr)] items-center gap-2.5 rounded-xl px-2.5 py-[9px] text-left text-[#111827] hover:bg-white ${on ? "bg-white shadow-[0_0_0_1px_#E1E5EC,0_12px_32px_rgba(17,24,39,.06)]" : ""}`}
              >
                <span className="text-center text-[22px] font-extrabold leading-none">{i + 1}</span>
                <span className="min-w-0 leading-[1.3]">
                  <b className="block text-base font-bold">{fdate(dateOf(i), { weekday: "short", month: "short", day: "numeric" })}</b>
                  <span className="mt-1.5 flex gap-[3px]" aria-hidden="true">
                    {[...d.items].sort(byTime).map((it) => (
                      <i key={String(it.id)} className="h-1 max-w-4 flex-1 rounded-sm" style={{ background: TYPES[it.type].c }} />
                    ))}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <main className="flex min-w-0 flex-col gap-7">
          {days.map((d, i) => {
            const items = [...d.items].sort(byTime);
            const unpriced = items.filter((x) => !hasCost(x.cost)).length;
            const target = drag?.target?.day === i ? drag.target : null;
            return (
              <section
                key={i}
                id={`day-${i}`}
                data-day-section={i}
                aria-label={`Day ${i + 1}`}
                className={`scroll-mt-[calc(var(--barH,0px)+12px)] rounded-[20px] bg-white shadow-[0_0_0_1px_#E1E5EC,0_12px_32px_rgba(17,24,39,.06)] sm:rounded-3xl ${target ? "outline outline-2 outline-offset-[3px] outline-dashed outline-[#0E6E66]" : ""}`}
              >
                <div className="sticky top-[var(--barH,0px)] z-[4] rounded-t-[20px] border-b border-[#E1E5EC] bg-white px-[18px] pb-3.5 pt-[18px] sm:rounded-t-3xl sm:px-7 sm:pb-4 sm:pt-[22px]">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-[34px] font-extrabold leading-none tracking-[-0.03em] sm:min-w-14 sm:text-[44px]">{i + 1}</span>
                    <span className="flex flex-col leading-[1.25]">
                      <b className="text-[19px] font-extrabold sm:text-[22px]">{fdate(dateOf(i), { weekday: "long" })}</b>
                      <span className="text-[17px] text-[#4A5568]">{fdate(dateOf(i), { month: "long", day: "numeric", year: "numeric" })}</span>
                    </span>
                    <span className="ml-auto text-right leading-[1.3]">
                      <b className="block text-[19px] font-extrabold sm:text-[22px]">{money(dayCost(d))}</b>
                      <span className="text-base text-[#4A5568]">{plural(items.length, "action", "actions")}{unpriced ? `, ${unpriced} unpriced` : ""}</span>
                    </span>
                  </div>
                  <div aria-hidden="true" className="relative mt-3.5 h-1.5 overflow-hidden rounded-[3px] bg-[#F4F6FA]">
                    {items.map((x) => {
                      const s = toMin(x.start);
                      if (s === null) return null;
                      const e = Math.min(1440, Math.max(s + durOf(x), s + 20));
                      return <i key={String(x.id)} className="absolute inset-y-0 rounded-sm" style={{ left: `${(s / 1440) * 100}%`, width: `${Math.max(0.8, ((e - s) / 1440) * 100)}%`, background: TYPES[x.type].c }} />;
                    })}
                  </div>
                  <div aria-hidden="true" className="mt-1 flex justify-between text-[11px] text-[#4A5568]">
                    <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>12 AM</span>
                  </div>
                </div>

                <div className="px-3 pb-0.5 pt-3.5 sm:px-7 sm:pb-1 sm:pt-[18px]">
                  {!items.length && !target && <p className="mb-3.5 mt-0 text-base text-[#4A5568]">Nothing planned yet. Add the first action below.</p>}
                  {items.map((it, k) => {
                    const gapKey = k > 0 ? `${items[k - 1].id}|${it.id}` : "";
                    return (
                      <div key={String(it.id)}>
                        {k > 0 && (
                          <GapConnector
                            prev={items[k - 1]}
                            next={it}
                            editing={addingGap === gapKey}
                            onStartEdit={() => setAddingGap(gapKey)}
                            onCancelEdit={() => setAddingGap(null)}
                            onSaveTravel={(text) => saveTravel(i, items[k - 1], text)}
                          />
                        )}
                        {target?.beforeId === String(it.id) && dropLine}
                        <ActionCard it={it} selected={sel === it.id} dragging={drag?.id === it.id} onOpen={() => setSel(it.id)} onGripDown={startDrag(it.id)} />
                      </div>
                    );
                  })}
                  {target && target.beforeId === null && dropLine}
                </div>

                <div className="px-3 pb-5 pt-1 sm:px-7 sm:pb-[26px]">
                  <AddActionBlock onAdd={(type) => addAction(i, type)} />
                </div>
              </section>
            );
          })}
          <button type="button" onClick={addDay} className="min-h-16 rounded-[20px] border-2 border-dashed border-[#B8C1CE] bg-transparent text-lg font-bold text-[#2F3A4D] hover:border-[#0E6E66] hover:text-[#0E6E66]">
            + Add day
          </button>
        </main>
      </div>

      {selected && (
        <ActionPanel
          it={selected.it}
          dayIndex={selected.d}
          dayCount={days.length}
          dayLabel={`Day ${selected.d + 1}, ${fdate(dateOf(selected.d), { weekday: "long", month: "short", day: "numeric" })}`}
          dayOptionLabel={(i) => `Day ${i + 1}, ${fdate(dateOf(i), { weekday: "short", month: "short", day: "numeric" })}`}
          onChange={changeAction}
          onMoveDay={moveToDay}
          onDelete={deleteAction} 
          onClose={closePanel}
        />
      )}

      {toastNode}
    </div>
  );
}