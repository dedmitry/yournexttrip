
export type StopType = "transport" | "hotel" | "place" | "restaurant"

export type TripMeta = {
    title: string;
    //flag: string;
    //destination: string;
    //region: string;
    dateFrom: string;
    dateTo: string;
    travelers: number;
    rating: number | null;
    status: string;
};

export const initialTripMeta: TripMeta = {
    title: "",
    dateFrom: "",
    dateTo: "",
    travelers: 1,
    rating: null,
    status: "draft",
};

export type TripStop = {
    id: number;
    day: number;
    type: StopType;
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
    time: "",
    name: "",
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

export type TripTab = "plan" | "checklist" | "notes" | "advice"; 
export type StopId = number;
export type MoveDir = -1 | 1;
