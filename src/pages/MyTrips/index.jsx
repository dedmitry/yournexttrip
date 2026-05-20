import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


import Header from "@components/PageHeader";
import Footer from "@components/PageFooter";
import FilterBar from "@components/FilterBar";
import EmptyState from "@components/EmptyState";
import NewTripModal from "@components/ModalNewTrip";

//import { INITIAL_TRIPS } from "@lib/data";
import { t, STATUS_CONFIG, STOP_TYPE_CONFIG } from "@lib/config";

import { saveTrip, getAllTrips, deleteTrip as deleteTripDB } from "../../utils/storage";



// ─── Helpers ──────────────────────────────────────────────────────────────────

function sortTrips(trips, sort) {
  return [...trips].sort((a, b) => {
    if (sort === "Name")     return a.title.localeCompare(b.title);
    if (sort === "Budget")   return parseFloat(b.budget) - parseFloat(a.budget);
    if (sort === "Duration") return b.days - a.days;
    return 0; // Date — keep insertion order (already sorted)
  });
}



// ─── Item ─────────────────────────────────────────────────────────────

function Item({ trip, onDelete, onDuplicate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = STATUS_CONFIG[trip.status];

  // Distribute stops evenly across the 4 types for display purposes
  const perType = Math.floor(trip.stops / 4);
  const rem     = trip.stops % 4;
  const stopCounts = {
    transport: perType + (rem > 0 ? 1 : 0),
    hotel:     perType + (rem > 1 ? 1 : 0),
    place:     perType + (rem > 2 ? 1 : 0),
    food:      perType,
  };

  return (
    <div
      style={{
        background: t.bgSecondary, border: `0.5px solid ${t.border}`,
        borderRadius: t.radiusMd, overflow: "visible",
        transition: "border-color .15s", display: "flex", flexDirection: "column",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = t.borderMd)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = t.border)}
    >
      <div style={{ padding: "16px 16px 14px" }}>

        {/* Top: flag + region + menu */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: trip.coverColor, border: `0.5px solid ${t.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, flexShrink: 0,
            }}>{trip.flag}</div>
            <span style={{ fontSize: 12, color: t.textMuted }}>{trip.region}</span>
          </div>

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
        }}>{trip.title}</div>

        {/* Meta chips */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          <span style={chipStyle}>📅 {trip.dates}</span>
          <span style={chipStyle}>⏱ {trip.days} days</span>
          <span style={chipStyle}>📍 {trip.destination}</span>
          <span style={chipStyle}>👥 {trip.travelers}</span>
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
                <div style={{ fontSize: 17, fontWeight: 500, color: t.text }}>{stopCounts[type]}</div>
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

const chipStyle = {
  display: "inline-flex", alignItems: "center", gap: 4,
  fontSize: 11, color: t.textMuted,
  background: t.bgSecondary, border: `0.5px solid ${t.border}`,
  borderRadius: 20, padding: "2px 9px", whiteSpace: "nowrap",
};

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
    

    const filtered = sortTrips(
        trips.filter((trip) => {
            const matchesFilter = filter === "all" || trip.status === filter;
            const matchesSearch = !search || trip.title.toLowerCase().includes(search.toLowerCase()) || trip.destination.toLowerCase().includes(search.toLowerCase());
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
        <div style={{ 
            minHeight: "100vh", background: t.bg, 
            fontFamily: "system-ui, -apple-system, sans-serif", 
            display: "flex", flexDirection: "column",
        }}>
            <Header />

            <main style={{ 
                flex: 1, display: "flex", flexDirection: "column",
                width: "100%", maxWidth: 1120, margin: "0 auto", padding: "40px 12px" 
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 40 }}>
                    <h1 style={{
                        fontSize: 26, fontWeight: 700, fontFamily: "Georgia, 'Times New Roman', serif", 
                        color: t.text, letterSpacing: "-0.4px", 
                        margin: 0,
                    }}>My trips</h1>
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
