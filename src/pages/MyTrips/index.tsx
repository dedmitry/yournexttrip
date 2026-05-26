import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Header from "@/components/PageHeader";
import Footer from "@/components/PageFooter";
import FilterBar from "@/components/FilterBar";
import EmptyState from "@/components/EmptyState";
import NewTripModal from "@/components/ModalNewTrip";
import StopTypeIcon from "@/components/StopTypeIcon";
import Rating from "@/components/Rating";

import { Trip, TripSort, TripFilter } from "@/types/trip";

import { createTripShareUrl } from "@/utils/tripShare";
import { tripTripRange, calculateTripDays, totalTripBudget, countTripStops, formatBudget } from "@/utils/tripSummary";
import { saveTrip, getAllTrips, editTrip, deleteTrip as deleteTripDB } from "@utils/storage";

import { t, chipStyle } from "@lib/styles";
import { STATUS_CONFIG, STOP_TYPE_CONFIG } from "@lib/config";


// ─── Helpers ──────────────────────────────────────────────────────────────────

function sortTrips(trips: Trip[], sort: TripSort): Trip[] {
    return [...trips].sort((a, b) => {
        if (sort === "Name")     return a.meta.title.localeCompare(b.meta.title);
        //if (sort === "Budget")   return parseFloat(b.budget) - parseFloat(a.budget);
        //if (sort === "Duration") return b.days - a.days;
        return 0;
    });
}


// ─── Item ─────────────────────────────────────────────────────────────

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
}) {1
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

    const tripDays = calculateTripDays(trip.meta.dateFrom, trip.meta.dateTo);
    const tripStats = countTripStops(trip.stops);
    const totalBudget = totalTripBudget(trip.stops);

    type StopType = keyof typeof STOP_TYPE_CONFIG;

    return (
        <div
            className="
                flex flex-col overflow-visible 
                border border-zinc-200 rounded-md 
                
                transition-colors duration-150 
            "
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = t.borderMd)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = t.border)}
        >
        <div style={{ background: t.bgSecondary, padding: "16px 16px 14px" }}>

            {/* Top: stars + menu */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
                <Rating
                    rating={trip.meta.rating ?? undefined}
                    onRate={(r) => onRate(trip.id, r)}
                    interactive={trip.meta.status === "completed" || trip.meta.status === "ongoing"}
                />

                {/* Context menu */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                    <button
                        onClick={() => setMenuOpen((o) => !o)}
                        style={{
                            width: 26, height: 26, borderRadius: 6, cursor: "pointer",
                            border: `0.5px solid ${t.border}`, background: t.bg,
                            color: t.textHint, fontFamily: "inherit", fontSize: 14,
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                    >···</button>

                    {menuOpen && (
                        <div
                            onMouseLeave={() => setMenuOpen(false)}
                            style={{
                                position: "absolute", top: 30, right: 0, zIndex: 20,
                                background: t.bg, border: `0.5px solid ${t.border}`,
                                borderRadius: t.radiusMd, padding: "4px 0", minWidth: 148,
                                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                            }}
                        >
                            {menuItems.map((item, i) =>
                            item === null ? (
                                <div key={i} style={{ height: 0.5, background: t.border, margin: "4px 0" }} />
                            ) : (
                                <button
                                key={item.label}
                                onClick={item.action}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    width: "100%", padding: "7px 14px",
                                    background: "transparent", border: "none", cursor: "pointer",
                                    fontSize: 13, fontFamily: "inherit",
                                    color: item?.danger ? "#A32D2D" : t.text,
                                    textAlign: "left",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = item?.danger ? "#FCEBEB" : t.bgSecondary)}
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
            </div>

            {/* Title */}
            <div style={{
                fontSize: 18, fontWeight: 500, color: t.text,
                letterSpacing: "-0.3px", lineHeight: 1.25,
                marginBottom: 10,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{trip.meta.title}</div>

            {/* Meta chips */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                <span style={chipStyle}>📅 {tripTripRange(trip.meta.dateFrom, trip.meta.dateTo)}</span>
                <span style={chipStyle}>⏱ {tripDays} days</span>
                {trip.meta.destination &&
                <span style={chipStyle}>📍 {trip.meta.destination}</span>
                }
                <span style={chipStyle}>👥 {trip.meta.travelers}</span>
                <span style={chipStyle}>💰 {formatBudget(totalBudget)}</span>
            </div>

            {/* Stop-type stats — mirrors TripHeaderCard */}
            <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            borderTop: `1px solid ${t.borderWhite}`, paddingTop: 12, gap: 0,
            }}>
            {(Object.keys(STOP_TYPE_CONFIG) as StopType[]).map((type, i, arr) => {
                const cfg = STOP_TYPE_CONFIG[type];
                return (
                <div key={type} style={{
                    textAlign: "center",
                    borderRight: i < arr.length - 1 ? `1px solid ${t.borderWhite}` : "none",
                    padding: "0 4px",
                }}>
                    <div style={{ fontSize: 17, fontWeight: 500, color: t.text }}>{tripStats[type]}</div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, fontSize: 10, color: t.textMuted, marginTop: 2 }}>
                    <StopTypeIcon label={cfg.label} /> {cfg.label}
                    </div>
                </div>
                );
            })}
            </div>
        </div>

        {/* Footer: status + open */}
        <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 16px", borderTop: `0.5px solid ${t.border}`,
            background: t.bg, borderRadius: `0 0 ${t.radiusMd}px ${t.radiusMd}px`,
        }}>
            <span style={{
            fontSize: 11, fontWeight: 500, borderRadius: 20, padding: "3px 10px",
            background: status.bg, color: status.color,
            }}>{status.label}</span>
            <Link 
                to={`/trip/${trip.id}`} 
                style={{
                    fontSize: 12, padding: "5px 14px", borderRadius: 20,
                    border: `0.5px solid ${t.borderMd}`, background: "transparent",
                    color: t.text, cursor: "pointer", fontFamily: "inherit",
                    fontWeight: 500,
                }}
            >Open →</Link>
        </div>
        </div>
    );
}


// ─── Page root ────────────────────────────────────────────────────────────────

export default function MyTrips() {
    const [loading, setLoading] = useState<boolean>(true);
    const [trips, setTrips]           = useState<Trip[]>([]);

    const [filter, setFilter] = useState<TripFilter>("All");
    const [sort, setSort] = useState<TripSort>("Date");
    const [search, setSearch] = useState<string>("");

    const [showModal, setShowModal]   = useState<boolean>(false);


    useEffect(() => {
        getAllTrips().then((saved) => {
            setTrips(saved.length > 0 ? saved : []);//INITIAL_TRIPS
            setLoading(false);
        });
    }, []);


    const createTrip = async (trip: Trip) => {
        await saveTrip(trip);
        setTrips((prev) => [trip, ...prev])
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

    const handleEditTrip = async (trip: Trip) => {
        await editTrip(trip.id, trip);
        setTrips((prev) => prev.map((t) => t.id === trip.id ? trip : t));
    };

    const deleteTrip = async (id: number) => {
        await deleteTripDB(id);
        setTrips((prev) => prev.filter((t) => t.id !== id))
    };

    const rateTrip = async (id: number, rating: number) => {
        const trip = trips.find((t) => t.id === id);
        if (!trip) return;
        const updated = { ...trip, meta: { ...trip.meta, rating } };
        await saveTrip(updated);
        setTrips((prev) => prev.map((t) => t.id === id ? updated : t));
    };

    const filtered = sortTrips(
        trips.filter((trip) => {
            const matchesFilter = filter === "All" ||  trip.meta.status.charAt(0).toUpperCase() + trip.meta.status.slice(1) === filter;
            const matchesSearch = !search || trip.meta.title.toLowerCase().includes(search.toLowerCase()) || trip.meta.destination.toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        }),
        sort
    );


    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 14, color: "#888" }}>Loading your trips…</div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: t.bg }}
        >
            <Header />

            <main className="flex-1 flex flex-col w-full max-w-[1120px] mx-auto px-3 py-6">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
                    <h1 style={{
                        fontSize: 26, fontWeight: 800, 
                        //fontFamily: "Georgia, 'Times New Roman', serif", 
                        color: t.text, letterSpacing: "-0.4px", 
                        margin: 0,
                    }}>My Trips</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{
                            fontSize: 13, padding: "6px 14px", borderRadius: 20,
                            border: "none", background: t.accentGrad,
                            color: t.bg, cursor: "pointer", fontFamily: "inherit",
                        }}
                    >+ New trip</button>
                </div>

                {filtered.length === 0 ? (
                <EmptyState 
                    onNew={() => setShowModal(true)} 
                /> 
                ) : (
                <>
                    <FilterBar
                        countTrips={trips.length}
                        activeFilter={filter} 
                        onFilter={setFilter}
                        activeSort={sort}     
                        onSort={setSort}
                        search={search}       
                        onSearch={setSearch}
                    />

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: 14,
                    }}>
                        {filtered.map((trip) => (
                        <Item
                            key={trip.id}
                            trip={trip}
                            onDuplicate={handleDuplicateTrip}
                            onShareTrip={handleShareTrip}
                            onEdit={handleEditTrip}
                            onDelete={deleteTrip}
                            onRate={rateTrip}
                        />
                        ))}
                    </div>
                </>
                )}

            </main>

            <Footer />

            {showModal && (
                <NewTripModal 
                    onSave={createTrip} 
                    onClose={() => setShowModal(false)} 
                />
            )}
        </div>
    );
}

