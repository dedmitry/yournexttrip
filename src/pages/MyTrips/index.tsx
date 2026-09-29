import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Header from "@/components/PageHeader";
import Footer from "@/components/PageFooter";
import EmptyState from "@/components/EmptyState";
import NewTripModal from "@/components/ModalNewTrip";
import Rating from "@/components/Rating";
import Perforation from "@/components/Perforation";
import Fact from '@/components/TripFact'
import { IconCalendar, IconSun, IconPeople, IconWallet } from "@/components/Icons";
import { useToast } from "@/components/ToastMessage"

import { Trip } from "@/types/trip";

import { createTripShareUrl } from "@/utils/tripShare";
import { tripTripRange, calculateTripDays, totalTripBudget, countTripStops, formatBudget, plural } from "@/utils/tripSummary";
import { saveTrip, getAllTrips, editTrip, deleteTrip as deleteTripDB } from "@utils/storage";

import { STATUS_CONFIG } from "@lib/config";


function Item({ 
    trip, 
    onDuplicate, 
    onShareTrip,
    onEdit,
    onDelete,
    onRate
} : {
    trip: Trip;
    onDuplicate: (trip: Trip) => void;
    onShareTrip: (trip: Trip) => void;
    onEdit: (trip: Trip) => void;
    onDelete: (id: number) => void;
    onRate: (id: number, rating: number) => void;
}) {
    const [menuOpen, setMenuOpen] = useState(false);

    const menuItems = [
        { label: "Edit", action: () => onEdit(trip), icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
        { label: "Share", action: () => onShareTrip(trip), icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49"/></svg> },
        //{ label: "Export PDF", action: () => setMenuOpen(false), icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/></svg> },
        { label: "Duplicate", action: () => onDuplicate(trip), icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> },
        null,
        { label: "Delete", action: () => onDelete(trip.id), icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6l-1 14H6L5 6"/><path d="M8 6V4h8v2"/></svg>, danger: true },
    ];

    const status = STATUS_CONFIG[trip.meta.status];
    const past = trip.meta.dateTo

    const tripDays = calculateTripDays(trip.meta.dateFrom, trip.meta.dateTo);
    const tripStats = countTripStops(trip.stops);
    const totalBudget = totalTripBudget(trip.stops);


    return (
        <article className="relative flex flex-col rounded-[20px] bg-white shadow-[0_0_0_1px_#E1E5EC,0_12px_32px_rgba(17,24,39,.06)] transition -hover:-translate-y-0.5 -hover:shadow-[0_18px_40px_rgba(17,24,39,.1)] sm:rounded-3xl">
            <div className="flex flex-col gap-2.5 px-[18px] pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-[22px]">
                <div className="flex items-start justify-between gap-3">
                    <div
                        className="whitespace-nowrap overflow-hidden text-ellipsis text-left text-[21px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#111827] outline-none sm:text-2xl"
                    >
                        {trip.meta.title}
                    </div>
                    <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={menuOpen}
                        aria-label={`Actions for ${trip.meta.title}`}
                        onClick={() => setMenuOpen((o) => !o)}
                        className={`relative z-[2] -mr-2 -mt-1.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border text-[24px] font-semibold text-[#111827] transition ${
                        menuOpen ? "border-[#E1E5EC] bg-[#F4F6FA]" : "border-transparent hover:border-[#E1E5EC] hover:bg-[#F4F6FA]"
                        }`}
                    >
                        ···
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

                <Rating
                    rating={trip.meta.rating ?? undefined}
                    onRate={(r) => onRate(trip.id, r)}
                    interactive={trip.meta.status === "completed" || trip.meta.status === "ongoing"}
                />
        
                <ul className="mt-1 grid grid-cols-2 gap-x-4 gap-y-2.5">
                    <Fact icon={IconCalendar} srLabel="Dates">{tripTripRange(trip.meta.dateFrom, trip.meta.dateTo)}</Fact>
                    <Fact icon={IconSun}>{plural(tripDays ?? 0, "day", "days")}</Fact>
                    <Fact icon={IconPeople}>{plural(trip.meta.travelers, "traveler", "travelers")}</Fact>
                    <Fact icon={IconWallet} srLabel="Budget">{formatBudget(totalBudget)}</Fact>
                </ul>
            </div>
        
            <Perforation />
        
            <div className="flex items-center justify-between gap-3 px-[18px] pb-4 pt-3 sm:px-6 sm:pb-[18px] sm:pt-3.5">
                {tripStats && tripStats.total > 0 ? (
                <Link 
                    to={`/trip/${trip.id}`}
                    className="inline-flex items-center gap-1.5 text-[15px] font-bold text-[#1D5FD6]">
                    Open plan →
                </Link>
                ) : (
                <Link 
                    to={`/trip/${trip.id}`}
                    className="inline-flex items-center gap-1.5 text-[15px] font-bold text-[#1D5FD6]">
                    Let’s start →
                </Link>
                )}

                <span
                    className={`inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-[13px] font-bold ${
                        past ? "bg-[#F2F7F4] text-[#2F3A4D]" : "bg-[#F4F6FA] text-[#111827]"
                    }`}
                >
                    <i className={`h-2 w-2 rounded-full ${status.dot}`} />
                    {status.label}
                </span>
            </div>
        </article>
    );
}


export default function MyTrips() {
    const [loading, setLoading] = useState<boolean>(true);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [trip, setTrip] = useState<Trip | null>(null)

    const [showModal, setShowModal]   = useState<boolean>(false);
    const [showToast, , toastNode] = useToast();


    useEffect(() => {
        getAllTrips().then((saved) => {
            setTrips(saved.length > 0 ? saved : []);//INITIAL_TRIPS
            setLoading(false);
        });
    }, []);


    const createTrip = async (trip: Trip) => {
        console.log(trip)
        await saveTrip(trip);
        setTrips((prev) => [trip, ...prev])
        showToast(`“${trip.meta.title}” created`);
    };


    const changeTrip = async (trip: Trip) => {
        await editTrip(trip.id, trip);
        setTrips((prev) => prev.map((t) => t.id === trip.id ? trip : t));
        showToast(`“${trip.meta.title}” changed`);
    };



    const handleEditTrip = async (trip: Trip) => {
        setTrip(trip)
        setShowModal(true)
    };

    const handleDuplicateTrip = async (trip: Trip) => {
        const copy = { 
            ...trip, 
            id: Date.now(), 
            meta: { 
                ...trip.meta, 
                title: trip.meta.title + " (copy)" 
            }, 
            status: "planning" 
        }
        await saveTrip(copy);
        setTrips((prev) => [copy, ...prev]);
    };

    const handleShareTrip = async (trip: Trip) => {
        navigator.clipboard.writeText(createTripShareUrl(trip));
    };

    const handleDeleteTrip = async (id: number) => {
        const index = trips.findIndex((t) => t.id === id);
        const removed = trips[index];
        if (!removed) return;

        await deleteTripDB(id);
        setTrips((prev) => prev.filter((t) => t.id !== id))

        showToast(`“${removed.meta.title}” deleted`, async () => {
            await saveTrip(removed);
            setTrips((prev) => {
                if (prev.some((t) => t.id === removed.id)) return prev;
                const next = [...prev];
                next.splice(Math.min(index, next.length), 0, removed);
                return next;
            });
        });
    };

    const rateTrip = async (id: number, rating: number) => {
        const trip = trips.find((t) => t.id === id);
        if (!trip) return;
        const updated = { ...trip, meta: { ...trip.meta, rating } };
        await saveTrip(updated);
        setTrips((prev) => prev.map((t) => t.id === id ? updated : t));
    };


    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 14, color: "#888" }}>Loading your trips…</div>
            </div>
        );
    }

    return (
        <div className="
            flex min-h-screen min-h-[100dvh] flex-col 
            bg-[#F4F6FA] 
            font-['Schibsted_Grotesk',_'Segoe_UI',_system-ui,_sans-serif] text-[#111827] antialiased
        ">
            <Header />

            <div className="
                flex flex-1 flex-col
                bg-[#F4F6FA] 
                font-['Schibsted_Grotesk',_'Segoe_UI',_system-ui,_sans-serif] text-[#111827] antialiased [font-variant-numeric:tabular-nums]
            ">
                <main className="
                    mx-auto flex w-full max-w-[1240px] 
                    flex-1 flex-col 
                    px-3 pb-10 pt-5 sm:px-6 sm:pb-14 sm:pt-7
                ">
                    {trips.length === 0 ? (
                        <EmptyState 
                            onNew={() => setShowModal(true)} 
                        /> 
                    ) : (
                    <>
                        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                            <h1 className="m-0 text-[32px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[40px]">
                                My trips
                            </h1>
                            <button
                                type="button"
                                onClick={() => setShowModal(true)}
                                className="
                                    inline-flex h-[46px] w-full min-w-[160px] sm:w-auto 
                                    items-center justify-center gap-2 
                                    rounded-[14px] 
                                    bg-[linear-gradient(135deg,#BD75C0_0%,#FF7E8A_50%,#FFA17A_100%)] 
                                    text-[15px] font-extrabold text-white [text-shadow:0_1px_2px_rgba(60,30,80,.4)] shadow-[0_8px_22px_rgba(255,126,138,.38)] transition 
                                    hover:-translate-y-px hover:brightness-105 hover:saturate-[1.1] hover:shadow-[0_12px_28px_rgba(255,126,138,.48)] 
                                    focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0E6E66] 
                                    px-5 
                                "
                            >
                                + New trip
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 md:gap-5">
                            {trips.map((trip) => (
                            <Item
                                key={trip.id}
                                trip={trip}
                                onDuplicate={handleDuplicateTrip}
                                onShareTrip={handleShareTrip}
                                onEdit={handleEditTrip}
                                onDelete={handleDeleteTrip}
                                onRate={rateTrip}
                            />
                            ))}
                        </div>
                    </>
                    )}
                </main>
            </div>

            <Footer />

            {showModal && (
            <NewTripModal 
                trip={trip}
                onSave={createTrip} 
                onEdit={changeTrip}
                onClose={() => setShowModal(false)} 
            />
            )}

            {toastNode}
        </div>
    );
}

