import { useState, useEffect, useRef, useCallback } from "react";

import { IconBag, IconClose } from "@/components/Icons";

import { Trip } from "@/types/trip";

import { plural } from "@/utils/tripSummary";

const dayMs = 24 * 60 * 60 * 1000;
const CLOSE_MS = 280;

const toUTC = (date: string) => {
    const [year, month, day] = date.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
};

const tripDays = (t: { start: string; end: string }) =>
    Math.round((toUTC(t.end) - toUTC(t.start)) / dayMs) + 1;

type FieldKey = "name" | "start" | "end" | "people";
type Errors = Partial<Record<FieldKey, string>>;

const fieldId = (key: FieldKey) => `trip-${key}`;
const errorId = (key: FieldKey) => `trip-${key}-error`;

const FIELD_BASE =
    "h-[46px] w-full rounded-xl border px-3.5 text-base text-[#111827] transition placeholder:text-[#8A94A6] focus:bg-white focus:outline-none focus:ring-4";

const FIELD_OK =
    "border-transparent bg-[#F4F6FA] hover:border-[#B8C1CE] focus:border-[#0E6E66] focus:ring-[#E3F2EF]";

const FIELD_ERROR =
    "border-[#D92D20] bg-[#FFF5F4] hover:border-[#B42318] focus:border-[#D92D20] focus:ring-[#FDE8E5]";

const fieldClass = (hasError: boolean) =>
    `${FIELD_BASE} ${hasError ? FIELD_ERROR : FIELD_OK}`;

function FieldError({
    id,
    message,
}: {
    id: string;
    message?: string;
}) {
    if (!message) return null;

    return (
        <span
            id={id}
            className="text-[13px] font-medium leading-snug text-[#B42318]"
        >
            {message}
        </span>
    );
}

export default function TripModal({
    trip,
    onSave,
    onEdit,
    onClose,
}: {
    trip: Trip | null;
    onSave: (trip: Trip) => void;
    onEdit: (trip: Trip) => void;
    onClose: () => void;
}) {
    const [name, setName] = useState(trip?.meta?.title ?? "");
    const [start, setStart] = useState(trip?.meta?.dateFrom ?? "");
    const [end, setEnd] = useState(trip?.meta?.dateTo ?? "");
    const [people, setPeople] = useState(String(trip?.meta?.travelers ?? 2));

    const [errors, setErrors] = useState<Errors>({});
    const [shown, setShown] = useState(false);
    const [saving, setSaving] = useState(false);

    const firstRef = useRef<HTMLInputElement>(null);

    // Prevent multiple close requests.
    const closing = useRef(false);

    // Keep track of the delayed unmount callback.
    const closeTimer = useRef<number | null>(null);

    // Keep the latest onClose without making requestClose change.
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    /**
     * Close flow:
     *
     * 1. Prevent another close request.
     * 2. Start the slide-out animation.
     * 3. Wait for the animation.
     * 4. Tell the parent to unmount the modal.
     */
    const requestClose = useCallback(() => {
        if (closing.current) return;

        closing.current = true;

        setShown(false);

        closeTimer.current = window.setTimeout(() => {
            closeTimer.current = null;
            onCloseRef.current();
        }, CLOSE_MS);
    }, []);

    /**
     * Open animation + initial focus.
     *
     * This must only run when the modal is mounted.
     * It should NOT run again when the parent rerenders after onSave().
     */
    useEffect(() => {
        const raf = requestAnimationFrame(() => {
            if (!closing.current) {
                setShown(true);
            }
        });

        const focusTimer = window.setTimeout(() => {
            if (!closing.current) {
                firstRef.current?.focus();
            }
        }, 60);

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                requestClose();
            }
        };

        document.addEventListener("keydown", onKey);

        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(focusTimer);
            document.removeEventListener("keydown", onKey);

            if (closeTimer.current !== null) {
                window.clearTimeout(closeTimer.current);
                closeTimer.current = null;
            }
        };
    }, [requestClose]);

    const length =
        start && end && end >= start
            ? tripDays({ start, end })
            : null;

    /**
     * Clears validation errors for the specified fields.
     */
    const clearErrors = (...keys: FieldKey[]) =>
        setErrors((prev) => {
            if (!keys.some((key) => prev[key])) {
                return prev;
            }

            const next = { ...prev };

            keys.forEach((key) => {
                delete next[key];
            });

            return next;
        });

    /**
     * Generic input change handler.
     */
    const change =
        (
            setter: React.Dispatch<React.SetStateAction<string>>,
            ...keys: FieldKey[]
        ) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setter(e.target.value);
            clearErrors(...keys);
        };

    /**
     * Validate form.
     */
    const validate = (): Errors => {
        const errs: Errors = {};
        const p = parseInt(people, 10);

        if (!name.trim()) {
            errs.name = "Give the trip a name.";
        }

        if (!start) {
            errs.start = "Choose the first day.";
        }

        if (!end) {
            errs.end = "Choose the last day.";
        } else if (start && end < start) {
            errs.end =
                "The last day needs to be on or after the first day.";
        }

        if (!(p >= 1)) {
            errs.people = "Travelers needs to be 1 or more.";
        }

        return errs;
    };

    /**
     * Submit.
     *
     * onSave() only saves/updates the trip.
     * requestClose() owns the closing animation.
     */
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (saving || closing.current) {
            return;
        }

        const errs = validate();

        setErrors(errs);

        const firstInvalid = (
            ["name", "start", "end", "people"] as FieldKey[]
        ).find((key) => errs[key]);

        if (firstInvalid) {
            document
                .getElementById(fieldId(firstInvalid))
                ?.focus();

            return;
        }

        const meta = {
            title: name.trim(),
            dateFrom: start,
            dateTo: end,
            travelers: parseInt(people, 10) || 1,
        };

        const nextTrip: Trip = trip
            ? {
                  ...trip,
                  meta: {
                      ...trip.meta,
                      ...meta,
                  },
              }
            : {
                  id: Date.now(),
                  meta: {
                      ...meta,
                      destination: "",
                      rating: null,
                      status: "planning",
                  },
                  stops: [],
                  checklist: [],
                  notes: [],
              };

        setSaving(true);

        if(trip){
            onEdit(nextTrip);
        } else {
            onSave(nextTrip);
        }
        
        // Then close.
        requestClose();
    };

    /**
     * Accessibility props shared by inputs.
     */
    const a11y = (key: FieldKey) => ({
        id: fieldId(key),
        "aria-invalid": errors[key] ? true : undefined,
        "aria-describedby": errors[key]
            ? errorId(key)
            : undefined,
    });

    const label =
        "text-[13px] font-semibold text-[#2F3A4D]";

    const section =
        "flex flex-col gap-3.5 border-b border-[#E1E5EC] py-5 last:border-b-0";

    const heading =
        "m-0 text-[15px] font-extrabold text-[#111827]";

    return (
        <>
            <div
                aria-hidden="true"
                onClick={requestClose}
                className={`fixed inset-0 z-40 bg-[rgba(17,24,39,.28)] backdrop-blur-[2px] transition-opacity duration-200 ${
                    shown ? "opacity-100" : "opacity-0"
                }`}
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="trip-panel-title"
                className={`fixed inset-0 z-50 flex flex-col overflow-hidden bg-white transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)]
                    sm:inset-auto sm:bottom-3 sm:right-3 sm:top-3 sm:w-[min(500px,calc(100vw-24px))] sm:rounded-3xl sm:shadow-[0_0_0_1px_#E1E5EC,0_30px_80px_rgba(17,24,39,.22)]
                    ${
                        shown
                            ? "translate-x-0 translate-y-0"
                            : "translate-y-full sm:translate-y-0 sm:translate-x-[calc(100%+32px)]"
                    }`}
            >
                <form
                    onSubmit={submit}
                    noValidate
                    className="flex h-full min-h-0 flex-col"
                >
                    {/* Header */}
                    <header className="flex items-center gap-3.5 bg-[#E3F2EF] pb-3.5 pl-[18px] pr-3.5 pt-[calc(14px+env(safe-area-inset-top,0px))] sm:pb-[18px] sm:pl-[22px] sm:pr-[18px] sm:pt-5">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0E6E66] text-white shadow-[0_6px_16px_rgba(14,110,102,.35)] sm:h-[46px] sm:w-[46px] sm:rounded-[14px]">
                            <IconBag className="h-[22px] w-[22px]" />
                        </span>

                        <div className="min-w-0 flex-1">
                            <span className="block text-[13px] font-bold text-[#0E6E66]">
                                {trip ? "Edit trip" : "New trip"}
                            </span>

                            <h2
                                id="trip-panel-title"
                                className="m-0 mt-0.5 truncate text-[19px] font-extrabold leading-[1.2] tracking-[-0.015em] sm:text-[21px]"
                            >
                                {name.trim() || "Untitled trip"}
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={requestClose}
                            aria-label="Close"
                            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/75 text-[#111827] hover:bg-white"
                        >
                            <IconClose className="h-5 w-5" />
                        </button>
                    </header>

                    {/* Content */}
                    <div className="min-h-0 flex-1 overflow-y-auto px-[18px] pb-2 sm:px-[22px]">
                        <section
                            className={section}
                            aria-labelledby="h-trip"
                        >
                            <h3
                                id="h-trip"
                                className={heading}
                            >
                                Trip
                            </h3>

                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor={fieldId("name")}
                                    className={label}
                                >
                                    Trip name
                                </label>

                                <input
                                    ref={firstRef}
                                    {...a11y("name")}
                                    className={fieldClass(
                                        !!errors.name
                                    )}
                                    value={name}
                                    onChange={change(
                                        setName,
                                        "name"
                                    )}
                                    placeholder="Portugal, Lisbon and Porto"
                                    autoComplete="off"
                                />

                                <FieldError
                                    id={errorId("name")}
                                    message={errors.name}
                                />
                            </div>
                        </section>

                        {/* When */}
                        <section
                            className={section}
                            aria-labelledby="h-when"
                        >
                            <h3
                                id="h-when"
                                className={heading}
                            >
                                When
                            </h3>

<div className="grid grid-cols-2 gap-3">
    <div className="min-w-0 overflow-hidden">
                                    <label
                                        htmlFor={fieldId("start")}
                                        className={label}
                                    >
                                        First day
                                    </label>
<div className="mt-1.5 w-full min-w-0 overflow-hidden">
                                    <input
                                        type="date"
                                        {...a11y("start")}
                                        className={`${fieldClass(!!errors.start)} block w-full min-w-0 max-w-full`}
                                            style={{
                                                        height: "42px",
        lineHeight: "42px",
        paddingTop: 0,
        paddingBottom: 0,
        boxSizing: "border-box",
        textAlign: "left",
        WebkitAppearance: "none",
    }}
                                        value={start}
                                        onChange={change(setStart, "start", "end")}
                                    />
</div>
                                    <FieldError
                                        id={errorId("start")}
                                        message={errors.start}
                                    />
                                </div>

                                <div className="min-w-0 overflow-hidden">
                                    <label
                                        htmlFor={fieldId("end")}
                                        className={label}
                                    >
                                        Last day
                                    </label>
<div className="mt-1.5 w-full min-w-0 overflow-hidden">
                                    <input
                                        type="date"
                                        {...a11y("end")}
                                        className={`${fieldClass(!!errors.end)} block w-full min-w-0 max-w-full`}
                                        value={end}
                                        onChange={change(setEnd, "start", "end")}
                                    />
</div>
                                    <FieldError
                                        id={errorId("end")}
                                        message={errors.end}
                                    />
                                </div>
                            </div>

                            {length && (
                                <p className="-mt-0.5 mb-0 text-sm font-bold text-[#111827]">
                                    {plural(
                                        length,
                                        "day",
                                        "days"
                                    )}
                                </p>
                            )}
                        </section>

                        {/* Who */}
                        <section
                            className={section}
                            aria-labelledby="h-who"
                        >
                            <h3
                                id="h-who"
                                className={heading}
                            >
                                Who
                            </h3>

                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor={fieldId("people")}
                                    className={label}
                                >
                                    Travelers
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    max="99"
                                    inputMode="numeric"
                                    {...a11y("people")}
                                    className={fieldClass(
                                        !!errors.people
                                    )}
                                    value={people}
                                    onChange={change(
                                        setPeople,
                                        "people"
                                    )}
                                />

                                <FieldError
                                    id={errorId("people")}
                                    message={errors.people}
                                />
                            </div>
                        </section>
                    </div>

                    {/* Footer */}
                    <footer 
                        className="
                            flex items-center -gap-2.5 
                            border-t border-[#E1E5EC] 
                            bg-white  
                            px-[18px] sm:px-[22px]  pt-3 sm:pt-3.5   pb-10 md:pb-5 sm:pb-5
                        "
                    >
                        <button
                            type="submit"
                            disabled={saving}
                            className="
                                w-[100%] h-[52px]  
                                rounded-xl 
                                bg-[#111827] 
                                text-[15px] font-bold text-white hover:bg-black
                                px-[22px] "
                        >
                            {trip ? "Save trip" : "Create trip"}
                        </button>
                    </footer>
                </form>
            </aside>
        </>
    );
}

/*
                        <span className="flex-1" />

                        <button
                            type="button"
                            onClick={requestClose}
                            disabled={saving}
                            className="h-10 rounded-xl border border-[#B8C1CE] bg-white px-3.5 text-sm font-semibold hover:border-[#2F3A4D] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>

{trip && (
    <button
        type="button"
        onClick={() => onDelete(trip)}
        className="inline-flex h-11 items-center gap-[7px] rounded-xl border border-[#F3C4BE] bg-[#FFF5F4] px-4 text-sm font-bold text-[#B42318] hover:border-[#B42318] hover:bg-[#FDE8E5]"
    >
        <IconTrash className="h-4 w-4" />
        Delete
    </button>
)}
*/