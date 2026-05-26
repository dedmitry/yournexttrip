
export type StopType = "transit" | "stay" | "place" | "food";// | "activity" | "other"
export type TripStatus = | "planning" | "ongoing" | "completed";

export type TripMeta = {
    title: string;
    //flag: string;
    destination: string;
    //region: string;
    dateFrom: string;
    dateTo: string;
    travelers: number;
    rating: number | null;
    status: TripStatus;
};

export const initialTripMeta: TripMeta = {
    title: "",
    destination: "",
    dateFrom: "",
    dateTo: "",
    travelers: 1,
    rating: null,
    status: "planning",
};

export type TripStop = {
    id: number;
    day: number;
    type: StopType;
    subtype: string;
    time: string;
    name: string;
    details: string;
    link: string;
    budget: string;
    duration: string;
    travelNext: string;
    notes: string;
};

export const initialTripStop: TripStop = {
    id: 0,
    day: 0,
    type: "place",
    subtype: "Activities",
    time: "",
    name: "New stop",
    details: "",
    link: "",
    budget: "",
    duration: "",
    travelNext: "", 
    notes: "",
};

export type CheckItem = { 
    id: number; text: 
    string; checked: 
    boolean; category: string; 
};

export type Note = { 
    id: number; 
    title: string; 
    body: string; 
}

export type Trip = {
    id: number;
    meta: TripMeta;
    stops: TripStop[];
    checklist: CheckItem[];
    notes: Note[];
};

export const initialTrip: Trip = {
    id: Date.now(),
    meta: initialTripMeta,
    stops: [],
    checklist: [],
    notes: [],
};

export type TripFilter = "All" | "Planning" | "Ongoing" | "Completed";
export type TripSort = "Date" | "Name" | "Budget" | "Duration";
export type TripTab = "plan" | "checklist" | "notes" | "advice"; 
export type StopId = number;
export type MoveDir = -1 | 1;
