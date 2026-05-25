import LZString from "lz-string";
import { Trip } from "@/types/trip";

// PACK
const packTrip = (trip: Trip) => ({
    i: trip.id,

    m: {
        t: trip.meta.title,
        d: trip.meta.destination,
        f: trip.meta.dateFrom,
        to: trip.meta.dateTo,
        tr: trip.meta.travelers,
        r: trip.meta.rating,
        s: trip.meta.status,
    },

    s: trip.stops.map((x) => ({
        i: x.id,
        d: x.day,
        t: x.type,
        st: x.subtype,
        ti: x.time,
        n: x.name,
        de: x.details,
        l: x.link,
        b: x.budget,
        du: x.duration,
        tn: x.travelNext,
        no: x.notes,
    })),

    c: trip.checklist.map((x) => ({
        i: x.id,
        t: x.text,
        ch: x.checked ? 1 : 0,
        ca: x.category,
    })),

    n: trip.notes.map((x) => ({
        i: x.id,
        t: x.title,
        b: x.body,
    })),
});

// UNPACK
const unpackTrip = (data: any): Trip => ({
    id: data.i ?? 0,

    meta: {
        title: data.m?.t ?? "",
        destination: data.m?.d ?? "",
        dateFrom: data.m?.f ?? "",
        dateTo: data.m?.to ?? "",
        travelers: data.m?.tr ?? 1,
        rating: data.m?.r ?? null,
        status: data.m?.s ?? "draft",
    },

    stops:
        data.s?.map((x: any) => ({
            id: x.i,
            day: x.d,
            type: x.t,
            subtype: x.st,
            time: x.ti,
            name: x.n,
            details: x.de,
            link: x.l,
            budget: x.b,
            duration: x.du,
            travelNext: x.tn,
            notes: x.no,
        })) ?? [],

    checklist:
        data.c?.map((x: any) => ({
            id: x.i,
            text: x.t,
            checked: !!x.ch,
            category: x.ca,
        })) ?? [],

    notes:
        data.n?.map((x: any) => ({
            id: x.i,
            title: x.t,
            body: x.b,
        })) ?? [],
});


// ENCODE
export const encodeTrip = (trip: Trip) => {
    const packed = packTrip(trip);

    return LZString.compressToEncodedURIComponent(
        JSON.stringify(packed)
    );
};

// DECODE
export const decodeTrip = (value: string): Trip | null => {
    try {
        const json =
            LZString.decompressFromEncodedURIComponent(value);

        if (!json) return null;

        return unpackTrip(JSON.parse(json));
    } catch {
        return null;
    }
};

// SHARE URL
export const createTripShareUrl = (trip: Trip) => {
    const encoded = encodeTrip(trip);

    return `${window.location.origin}/trip/shared?trip=${encoded}`;
};