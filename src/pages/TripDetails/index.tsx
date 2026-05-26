import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import Header from "@/components/PageHeader";
import Footer from "@/components/PageFooter";
import NewTripModal from "@/components/ModalNewTrip";
import SectionToolbar from "./section-toolbar";
import SectionSummary from "./section-summary";
import SectionPlanner from "./section-planner";
import ChecklistTab from "./tab-checklist";
import NotesTab from "./tab-notes";

import { Trip, initialTrip, TripStop, TripTab, CheckItem, Note } from "@/types/trip";

import { getTrip, editTrip, saveTrip, deleteTrip } from "@/utils/storage";
import { createTripShareUrl, decodeTrip } from "@/utils/tripShare";
import { t } from "@/lib/config";


export default function TripDetail() {
    const { id } = useParams();
    const tripId = Number(id);


    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const importedRef = useRef(false);
    const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [loaded, setLoaded] = useState(false);
    const [trip, setTrip] = useState(initialTrip);
    const [activeTab, setActiveTab] = useState<TripTab>("plan");
    const [showModal, setShowModal]   = useState(false);


    // Load from DB on mount
    useEffect(() => {
        if (!tripId) { setLoaded(true); return; }

        getTrip(tripId)
            .then((trip: Trip | undefined) => {
                if (trip) setTrip(trip);
            }).finally(() => setLoaded(true));
    }, [tripId]);

    // Check for shared trip in URL on load
    useEffect(() => {
        if (!loaded || importedRef.current) return;

        const shared = searchParams.get("trip");
        if (!shared) return;

        const decoded = decodeTrip(shared);
        if (!decoded) return;

        importedRef.current = true;

        const importedTrip: Trip = {
            ...decoded,
            id: Date.now(),
            meta: {
                ...decoded.meta,
                title: decoded.meta.title + " (shared)",
            },
        };

        saveTrip(importedTrip);
        setTrip(importedTrip);

        navigate(`/trip/${importedTrip.id}`, {
            replace: true,
        });

    }, [loaded, searchParams, navigate]);


    // Debounced autosave
    useEffect(() => {
        if (!loaded || !trip?.id) return;

        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current);
        }

        saveTimeout.current = setTimeout(() => {
            saveTrip(trip);
        }, 600);

        return () => {
            if (saveTimeout.current) {
                clearTimeout(saveTimeout.current);
            }
        };
    }, [trip, loaded]);

    // Generic updater
    const updateTrip = useCallback((updates: Partial<Trip>) => {
        setTrip((prev) => ({
            ...prev,
            ...updates,
        }));
    }, []);

    const updateStops = useCallback(
        (stops: TripStop[]) => updateTrip({ stops }),
        [updateTrip]
    );

    const updateChecklist = useCallback(
        (checklist: CheckItem[]) => updateTrip({ checklist }),
        [updateTrip]
    );

    const updateNotes = useCallback(
        (notes: Note[]) => updateTrip({ notes }),
        [updateTrip]
    );


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
        setTrip(copy);

        navigate(`/trip/${copy.id}`, {
            replace: true,
        });
    };

    const handleShareTrip = async (trip: Trip) => {
        navigator.clipboard.writeText(createTripShareUrl(trip));
    };

    const handleEditTrip = async (trip: Trip) => {
        await editTrip(trip.id, trip);
        setTrip(trip)
    };

    const handleDeleteTrip = async (id: number) => {
        await deleteTrip(id);
        navigate(`/`);
    };

    const handleRateTrip = async (rating: number) => {
       updateTrip({
            meta: {
                ...trip.meta,
                rating,
            },
        });
    };



    // Check loading state
    if (!loaded) {
        return (
            <div style={{ padding: "80px 24px", textAlign: "center", color: "#888" }}>
                Loading trip…
            </div>
        );
    }

    // Trip not found
    if (!trip?.id) {
        return (
            <div style={{ padding: "80px 24px", textAlign: "center", color: "#888" }}>
                Trip not found
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
                <SectionToolbar 
                    tripTitle={trip.meta?.title || ""} 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                />

                <div className="w-full max-w-[720px] mx-auto pt-8 pb-10">
                    {activeTab === "plan" &&
                    <>
                    <SectionSummary 
                        trip={trip}
                        onDuplicate={handleDuplicateTrip} 
                        onShareTrip={handleShareTrip}
                        onEdit={() => setShowModal(true)}
                        onDelete={handleDeleteTrip}
                        onRate={handleRateTrip}
                    />
                    <SectionPlanner 
                        meta={trip.meta}
                        stops={trip.stops}
                        updateStops={updateStops}
                    />
                    </>
                    }
                    {activeTab === "checklist" && 
                    <ChecklistTab 
                        checklist={trip.checklist}
                        updateChecklist={updateChecklist}
                    />
                    }
                    {activeTab === "notes" && 
                    <NotesTab 
                        noteslist={trip.notes}
                        updateNotes={updateNotes}
                    />
                    }
                </div>
            </main>

            <Footer />

            {showModal && (
                <NewTripModal 
                    trip={trip}
                    onSave={handleEditTrip} 
                    onClose={() => setShowModal(false)} 
                />
            )}
        </div>
    );
}