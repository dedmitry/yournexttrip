import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Header from "@components/PageHeader";
import Footer from "@components/PageFooter";
import FilterBar from "@components/FilterBar";
import EmptyState from "@components/EmptyState";
import NewTripModal from "@components/ModalNewTrip";

import { tripTripRange, calculateTripDays, totalTripBudget, countTripStops } from "@/utils/tripSummary";
import { saveTrip, getAllTrips, deleteTrip as deleteTripDB } from "@utils/storage";

import { t, chipStyle } from "@lib/styles";
import { STATUS_CONFIG, STOP_TYPE_CONFIG } from "@lib/config";



// ─── Helpers ──────────────────────────────────────────────────────────────────

function sortTrips(trips, sort) {
    return [...trips].sort((a, b) => {
        if (sort === "Name")     return a.title.localeCompare(b.title);
        if (sort === "Budget")   return parseFloat(b.budget) - parseFloat(a.budget);
        if (sort === "Duration") return b.days - a.days;
        return 0; // Date — keep insertion order (already sorted)
    });
}

 
// ─── StarRating ───────────────────────────────────────────────────────────────
 
function StarRating({ rating, onRate, interactive }) {
  const [hovered, setHovered] = useState(null);
  const active = hovered ?? rating ?? 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(null)}
          style={{
            fontSize: 13,
            color: star <= active ? "#F5A623" : t.borderMd,
            cursor: interactive ? "pointer" : "default",
            transition: "color .1s",
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ─── Item ─────────────────────────────────────────────────────────────

function Item({ trip, onDelete, onDuplicate, onRate }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const status = STATUS_CONFIG[trip.meta.status];

    const tripDays = calculateTripDays(trip.meta.dateFrom, trip.meta.dateTo);
    const tripStats = countTripStops(trip.stops);

    // Distribute stops evenly across the 4 types for display purposes
    const perType = Math.floor(trip.meta.stops / 4);
    const rem     = trip.meta.stops % 4;
    const stopCounts = {
        transport: perType + (rem > 0 ? 1 : 0),
        hotel:     perType + (rem > 1 ? 1 : 0),
        place:     perType + (rem > 2 ? 1 : 0),
        food:      perType,
    };

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
                <StarRating
                    rating={trip.rating}
                    onRate={(r) => onRate(trip.id, r)}
                    interactive={trip.status === "completed" || trip.status === "ongoing"}
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
                        style={{
                        position: "absolute", top: 30, right: 0, zIndex: 20,
                        background: t.bg, border: `0.5px solid ${t.border}`,
                        borderRadius: t.radiusMd, padding: "4px 0", minWidth: 148,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                        }}
                        onMouseLeave={() => setMenuOpen(false)}
                    >
                        {[
                        { label: "Open trip",  icon: "↗", action: () => setMenuOpen(false) },
                        { label: "Duplicate",  icon: "⧉", action: () => { onDuplicate(trip.id); setMenuOpen(false); } },
                        { label: "Export PDF", icon: "⬇", action: () => setMenuOpen(false) },
                        { label: "Share",      icon: "⤴", action: () => setMenuOpen(false) },
                        null,
                        { label: "Delete", icon: "×", action: () => { onDelete(trip.id); setMenuOpen(false); }, danger: true },
                        ].map((item, i) =>
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
                <span style={chipStyle}>💰 {totalTripBudget(trip.stops)}</span>
            </div>

            {/* Stop-type stats — mirrors TripHeaderCard */}
            <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            borderTop: `0.5px solid ${t.border}`, paddingTop: 12, gap: 0,
            }}>
            {Object.keys(STOP_TYPE_CONFIG).map((type, i, arr) => {
                const cfg = STOP_TYPE_CONFIG[type];
                return (
                <div key={type} style={{
                    textAlign: "center",
                    borderRight: i < arr.length - 1 ? `0.5px solid ${t.border}` : "none",
                    padding: "0 4px",
                }}>
                    <div style={{ fontSize: 17, fontWeight: 500, color: t.text }}>{tripStats[type]}</div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>
                    {cfg.icon} {cfg.label}
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
    const [loading, setLoading] = useState(true);
    const [trips, setTrips]           = useState([]);

    const [filter, setFilter]         = useState("all");
    const [sort, setSort]             = useState("Date");
    const [search, setSearch]         = useState("");

    const [showModal, setShowModal]   = useState(false);


    useEffect(() => {
        getAllTrips().then((saved) => {
            setTrips(saved.length > 0 ? saved : []);//INITIAL_TRIPS
            setLoading(false);
        });
    }, []);


    const createTrip = async (trip) => {
        console.log(trip)
        await saveTrip(trip);
        setTrips((prev) => [trip, ...prev])
    };

    const duplicateTrip = async (id) => {
        const src = trips.find((t) => t.id === id);
        if (!src) return;
        const copy = { ...src, id: Date.now(), title: src.title + " (copy)", status: "planning" };
        await saveTrip(copy);
        setTrips((prev) => [...prev, copy]);
    };

    const deleteTrip = async (id) => {
        await deleteTripDB(id);
        setTrips((prev) => prev.filter((t) => t.id !== id))
    };

    const rateTrip = async (id, rating) => {
        const trip = trips.find((t) => t.id === id);
        if (!trip) return;
        const updated = { ...trip, meta: { ...trip.meta, rating } };
        await saveTrip(updated);
        setTrips((prev) => prev.map((t) => t.id === id ? updated : t));
    };

    const filtered = sortTrips(
        trips.filter((trip) => {
            const matchesFilter = filter === "all" || trip.meta.status === filter;
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
                            onDelete={deleteTrip}
                            onDuplicate={duplicateTrip}
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
                    onClose={() => setShowModal(false)} 
                    onCreate={createTrip} 
                />
            )}
        </div>
    );
}

