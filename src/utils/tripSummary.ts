
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


export function parseBudgetValue(budget?: string): number | null {
  if (!budget) return null;

  const lower = budget.toLowerCase().trim();

  if (lower === "free") return 0;

  // remove commas, extract first numeric value
  const match = budget.replace(/,/g, "").match(/[\d.]+/);

  if (!match) return null;

  const value = Number(match[0]);

  return isNaN(value) ? null : value;
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
  | "transport"
  | "hotel"
  | "place"
  | "restaurant"
  | "activity"
  | "other";

export type TripStop = {
  id?: string | number;
  type?: StopType;
};

export type StopCounts = {
  total: number;

  transport: number;
  hotel: number;
  place: number;
  restaurant: number;

  activities: number;
  other: number;
};

/**
 * Counts stops by category.
 */
export function countTripStops(stops: TripStop[]): StopCounts {
  const counts: StopCounts = {
    total: stops.length,

    transport: 0,
    hotel: 0,
    place: 0,
    restaurant: 0,

    activities: 0,
    other: 0,
  };

  for (const stop of stops) {
    switch (stop.type) {
      case "transport":
        counts.transport++;
        break;

      case "hotel":
        counts.hotel++;
        break;

      case "place":
        counts.place++;
        break;

      case "restaurant":
        counts.restaurant++;
        break;

      case "activity":
        counts.activities++;
        break;

      default:
        counts.other++;
        break;
    }
  }

  return counts;
}