import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";

import Header from "@/components/PageHeader";
import Footer from "@components/PageFooter";
import SectionToolbar from "./section-toolbar";
import SectionSummary from "./section-summary";
import SectionPlanner from "./section-planner";
import ChecklistTab from "./tab-checklist";
import NotesTab from "./tab-notes";

import { Trip, initialTrip, TripStop, TripMeta, TripTab, CheckItem, Note } from "@/types/trip";

import { getTrip, saveTrip } from "@/utils/storage";
import { t } from "@/lib/config";


export default function TripDetail() {
    const { id } = useParams();
    const tripId = Number(id);


    const [loaded, setLoaded] = useState(false);
    const [trip, setTrip] = useState(initialTrip);
    const [activeTab, setActiveTab] = useState<TripTab>("plan");

    // Load from DB on mount
    useEffect(() => {
        if (!tripId) { setLoaded(true); return; }

        getTrip(tripId)
            .then((trip: Trip | undefined) => {
                if (trip) {
                    setTrip(trip);
                }
                setLoaded(true);
            }).catch(() => setLoaded(true));
    }, [tripId]);


    // Debounced save — waits 600ms after last change
    const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (saveTimeout.current) {
                clearTimeout(saveTimeout.current);
            }
        };
    }, []);

    const updateTrip = useCallback(
        (
            updatedStops: TripStop[], 
            updatedMeta: TripMeta, 
            updatedChecklist: CheckItem[], 
            updatedNotes: Note[]
        ) => {
            setTrip((prev) => ({
                ...prev,
                stops: updatedStops,
                meta: updatedMeta,
                checklist: updatedChecklist,
                notes: updatedNotes,
            }));
            
            if (saveTimeout.current) {
                clearTimeout(saveTimeout.current);
            }

            saveTimeout.current = setTimeout(() => {
                saveTrip({
                    id: trip.id,
                    meta: updatedMeta,
                    stops: updatedStops,
                    checklist: updatedChecklist,
                    notes: updatedNotes,
                });
            }, 600);
        }, [trip.id]
    );

    /*const updateMeta = useCallback(
        (updatedMeta: TripMeta) => {
            updateTrip(trip.stops, updatedMeta, trip.checklist, trip.notes);
        },[trip, updateTrip]
    );*/

    const updateStops = useCallback(
        (updatedStops: TripStop[]) => {
            updateTrip(updatedStops, trip.meta, trip.checklist, trip.notes);
        }, [trip, updateTrip]
    );

    const updateChecklist = useCallback(
        (updatedChecklist: CheckItem[]) => {
            updateTrip(trip.stops, trip.meta, updatedChecklist, trip.notes);
        }, [trip, updateTrip]
    );

    const updateNotes = useCallback(
        (updatedNotes: Note[]) => {
            updateTrip(trip.stops, trip.meta, trip.checklist, updatedNotes);
        }, [trip, updateTrip]
    );

    const rateTrip = async (rating: number) => {
        const updatedMeta = { ...trip.meta, rating };
        updateTrip(trip.stops, updatedMeta, trip.checklist, trip.notes);;
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
                        onRate={rateTrip}
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
        </div>
    );
}