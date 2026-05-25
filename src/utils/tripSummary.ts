
export function parseDate(dateStr?: string) {
    if (!dateStr) return null;

    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d); // LOCAL date, no shift
}

export function tripTripRange(
    dateFrom?: string,
    dateTo?: string
): string {
    const start = parseDate(dateFrom);
    const end = parseDate(dateTo);

    if (!start || !end) return "";

    const startMonth = start.toLocaleString("en-US", { month: "short" });
    const endMonth = end.toLocaleString("en-US", { month: "short" });

    const sameMonth = start.getMonth() === end.getMonth();

    if (sameMonth) {
        return `${startMonth} ${start.getDate()}–${end.getDate()}`;
    }

    return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${end.getFullYear()}`
}

export function calculateTripDays(
    dateFrom: string,
    dateTo: string
): number | null {
    if (!dateFrom || !dateTo) return null;

    const start = new Date(dateFrom);
    const end = new Date(dateTo);

    // guard against invalid dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    const diff = end.getTime() - start.getTime();

    // +1 because both start and end days are inclusive
    return Math.max(1, Math.floor(diff / MS_PER_DAY) + 1);
}


export function parseBudgetValue(budget?: unknown): number | null {
  if (typeof budget !== "string") return null;

  const match = budget.replace(/,/g, "").match(/[\d.]+/);

  if (!match) return null;

  const value = Number(match[0]);

  return Number.isNaN(value) ? null : value;
}

export function calculateTotalBudget(
    stops: { budget?: string }[]
): number | null {
    let sum = 0;
    let hasAny = false;

    for (const stop of stops) {
        const value = parseBudgetValue(stop.budget);

        if (value === null) continue;

        sum += value;
        hasAny = true;
    }

    return hasAny ? sum : null;
}

export function formatBudget(value?: number | string | null): string {
    if (value == null || value === "") return "-";

    const amount =
      typeof value === "string" ? Number(value.replace(/,/g, "")) : value;

    if (Number.isNaN(amount)) return "-";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
}

export type BudgetFormatMode = "raw" | "formatted";

export function totalTripBudget(
  stops: { budget?: string }[],
  mode: BudgetFormatMode = "formatted"
): number | string | null {
  const total = calculateTotalBudget(stops);

  if (total === null) return "—";

  if (mode === "raw") return total;

  return total >= 1000
    ? `$${(total / 1000).toFixed(1)}k`
    : `$${Math.round(total)}`;
}




// utils/stops.ts
export type StopType =
  | "transit"
  | "stay"
  | "place"
  | "food";
//  | "other";
//  | "activity"

export type TripStop = {
    id?: string | number;
    type?: StopType;
};

export type StopCounts = {
    total: number;

    transit: number;
    stay: number;
    place: number;
    food: number;
};

/**
 * Counts stops by category.
 */
export function countTripStops(stops: TripStop[]): StopCounts {
    const counts: StopCounts = {
        total: stops.length,

        transit: 0,
        stay: 0,
        place: 0,
        food: 0,
    };

    for (const stop of stops) {
        switch (stop.type) {
        case "transit":
            counts.transit++;
            break;

        case "stay":
            counts.stay++;
            break;

        case "place":
            counts.place++;
            break;

        case "food":
            counts.food++;
            break;

        /*case "activity":
            counts.activities++;
            break;

        default:
            counts.other++;
            break;*/
        }
    }

    return counts;
}




export function getDayLabel(day: number, dateFrom: string | Date) {
    try {
        const start = new Date(dateFrom);
        if (isNaN(start.getTime())) throw new Error();
        const d = new Date(start);
        d.setDate(start.getDate() + (day));
        const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
        const month   = d.toLocaleDateString("en-US", { month: "short" });
        return `Day ${day} · ${weekday} ${month} ${d.getDate()}`;
    } catch {
        return `Day ${day}`;
    }
}