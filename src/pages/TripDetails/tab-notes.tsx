import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import {
  IconNote,
  IconStar,
  IconTrash,
  IconCheck,
  IconClose,
} from "@/components/Icons";

import { useToast } from "@/components/ToastMessage"

import { plural } from "@/utils/tripSummary";
import { Note } from "@/types/trip";


    const section =
        "flex flex-col gap-3.5 border-b border-[#E1E5EC] py-5 last:border-b-0";

type NotePanelProps = {
  note: Note;
  isNew: boolean;
  onChange: (patch: Partial<Note>) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
};

function NotePanel({
  note,
  isNew,
  onChange,
  onDelete,
  onClose,
}: NotePanelProps) {
  const [shown, setShown] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setShown(true);
    });

    const timer = setTimeout(() => {
      const ref = isNew ? titleRef : contentRef;
      ref.current?.focus();
    }, 60);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
    };
  }, [isNew, onClose]);

  const field =
    "w-full rounded-xl border border-transparent bg-[#F4F6FA] px-3.5 text-base text-[#111827] transition placeholder:text-[#8A94A6] hover:border-[#B8C1CE] focus:border-[#0E6E66] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#E3F2EF]";

  const label =
    "text-[13px] font-semibold text-[#2F3A4D]";

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-[rgba(17,24,39,.28)] backdrop-blur-[2px] transition-opacity duration-200 ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-panel-title"
        className={`fixed inset-0 z-50 flex flex-col overflow-hidden bg-white transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)]
          sm:inset-auto sm:bottom-3 sm:right-3 sm:top-3 sm:w-[min(500px,calc(100vw-24px))] sm:rounded-3xl sm:shadow-[0_0_0_1px_#E1E5EC,0_30px_80px_rgba(17,24,39,.22)]
          ${
            shown
              ? "translate-x-0 translate-y-0"
              : "translate-y-full sm:translate-y-0 sm:translate-x-[calc(100%+32px)]"
          }`}
      >
        <header className="flex items-center gap-3.5 bg-[#E3F2EF] pb-3.5 pl-[18px] pr-3.5 pt-[calc(14px+env(safe-area-inset-top,0px))] sm:pb-[18px] sm:pl-[22px] sm:pr-[18px] sm:pt-5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0E6E66] text-white shadow-[0_6px_16px_rgba(14,110,102,.35)] sm:h-[46px] sm:w-[46px] sm:rounded-[14px]">
            <IconNote className="h-[22px] w-[22px]" />
          </span>

          <div className="min-w-0 flex-1">
            <span className="block text-[13px] font-bold text-[#0E6E66]">
              {isNew ? "New note" : "Edit note"}
            </span>

            <h2
              id="note-panel-title"
              className="m-0 mt-0.5 truncate text-[19px] font-extrabold leading-[1.2] tracking-[-0.015em] sm:text-[21px]"
            >
              {note.title.trim() || "New note"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close editor"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/75 text-[#111827] hover:bg-white"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-[18px] py-2 sm:px-[22px]">
          <label className="flex flex-col gap-1.5">
            <span className={label}>Title</span>

            <input
              ref={titleRef}
              className={`${field} h-[46px]`}
              value={note.title}
              onChange={(event) =>
                onChange({ title: event.target.value })
              }
              placeholder="Tokyo transportation tips"
              autoComplete="off"
            />
          </label>

          <label className="flex flex-1 flex-col gap-1.5">
            <span className={label}>Content</span>

            <textarea
              ref={contentRef}
              className={`${field} min-h-[240px] flex-1 resize-y py-3 leading-normal sm:min-h-[320px]`}
              value={note.body}
              onChange={(event) =>
                onChange({ body: event.target.value })
              }
              placeholder="Addresses, instructions, ideas, anything you want to keep"
            />
          </label>


            {!isNew && (
            <section
              className={section}
              aria-labelledby="h-trip"
            >
                  <button
                  type="button"
                  onClick={() => onDelete(note.id)}
                  className="
                      inline-flex h-11 
                      flex items-center justify-center gap-[7px] 
                      rounded-xl border border-[#F3C4BE] hover:border-[#B42318] 
                      bg-[#FFF5F4] hover:bg-[#FDE8E5] 
                      text-sm font-bold text-[#B42318] 
                      px-4 
                  ">
                  <IconTrash className="h-4 w-4" />Delete
                  </button>
                </section>
            )}

          
        </div>

        <footer 
            className="
                flex items-center -gap-2.5 
                border-t border-[#E1E5EC] 
                bg-white  
                px-[18px] sm:px-[22px]  pt-3 sm:pt-3.5   pb-10 md:pb-5 sm:pb-5
            "
        >
            <button 
                type="button" 
                onClick={onClose} 
                className="
                    w-[100%] h-[52px]  
                    rounded-xl 
                    bg-[#111827] 
                    text-[15px] font-bold text-white hover:bg-black
                    px-[22px] "
            >
                Done
            </button>
        </footer>
      </aside>
    </>
  );
}

type NotesTabProps = {
  noteslist: Note[];
  updateNotes: (notes: Note[]) => void;
};

export default function NotesTab({
  noteslist,
  updateNotes,
}: NotesTabProps) {
  const [editing, setEditing] = useState<{
    id: number;
    isNew: boolean;
  } | null>(null);

  const [active, setActive] = useState<number | null>(null);

  const [showToast, , toastNode] = useToast();

  const lastFocus = useRef<HTMLButtonElement | null>(null);

  const notesRef = useRef<Note[]>(noteslist);
  const editingRef = useRef<typeof editing>(editing);

  useEffect(() => {
    notesRef.current = noteslist;
  }, [noteslist]);

  useEffect(() => {
    editingRef.current = editing;
  }, [editing]);

  const pinnedCount = noteslist.filter((note) => note.pin).length;

  const current = editing
    ? noteslist.find((note) => note.id === editing.id)
    : undefined;

  const updateNote = useCallback(
    (id: number, patch: Partial<Note>) => {
      updateNotes(
        noteslist.map((note) =>
          note.id === id
            ? {
                ...note,
                ...patch,
              }
            : note
        )
      );
    },
    [noteslist, updateNotes]
  );

  const deleteNote = useCallback(
    (id: number) => {
      const next = noteslist.filter((note) => note.id !== id);

      updateNotes(next);

      if (editingRef.current?.id === id) {
        setEditing(null);
      }

      showToast("Note deleted");
    },
    [noteslist, updateNotes, showToast]
  );

  const changeNote = useCallback(
    (patch: Partial<Note>) => {
      const id = editingRef.current?.id;

      if (!id) return;

      updateNote(id, patch);

      showToast("Note updated");
    },
    [updateNote]
  );

  const openNote = useCallback(
    (id: number, isNew = false) => {
      setEditing({
        id,
        isNew,
      });
    },
    []
  );

  const addNote = useCallback(() => {
    const maxId = noteslist.reduce(
      (max, note) => Math.max(max, note.id),
      0
    );

    const id = maxId + 1;

    const newNote: Note = {
      id,
      title: "",
      body: "",
      pin: false,
    };

    updateNotes([...noteslist, newNote]);

    setEditing({
      id,
      isNew: true,
    });

    //showToast("Note created");
  }, [noteslist, updateNotes]);

  const closeEditor = useCallback(() => {
    const ed = editingRef.current;

    if (ed?.isNew) {
      const note = notesRef.current.find(
        (item) => item.id === ed.id
      );

      if (
        note &&
        !note.title.trim() &&
        !note.body.trim()
      ) {
        updateNotes(
          notesRef.current.filter(
            (item) => item.id !== ed.id
          )
        );
      }
    }

    setEditing(null);

    setTimeout(() => {
      lastFocus.current?.focus();
    }, 0);
  }, [updateNotes]);

  const togglePin = useCallback(
    (id: number) => {
      const note = noteslist.find(
        (item) => item.id === id
      );

      if (!note) return;

      updateNotes(
        noteslist.map((item) =>
          item.id === id
            ? {
                ...item,
                pin: !item.pin,
              }
            : item
        )
      );

      showToast("Note pinned");
    },
    [noteslist, updateNotes]
  );

  return (
    <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-9 px-3 pb-12 pt-3 min-[901px]:grid-cols-[250px_minmax(0,1fr)] sm:px-6">
      <nav
        aria-label="Notes"
        className="sticky top-4 hidden max-h-[calc(100vh-32px)] flex-col gap-1 self-start overflow-y-auto p-1 min-[901px]:flex"
      >
        <h2 className="mb-2 ml-2.5 mt-0 text-base font-bold text-[#2F3A4D]">
          Notes
        </h2>

        {noteslist.map((note) => (
          <a
            key={note.id}
            href={`#note-${note.id}`}
            onClick={() => setActive(note.id)}
            aria-current={
              active === note.id ? "true" : undefined
            }
            className={`group grid grid-cols-[40px_minmax(0,1fr)] items-center gap-2.5 rounded-xl px-2.5 py-2 text-[#111827] no-underline hover:bg-white ${
              active === note.id
                ? "bg-white shadow-[0_0_0_1px_#E1E5EC,0_12px_32px_rgba(17,24,39,.06)]"
                : ""
            }`}
          >
            <span
              className={`grid h-8 w-8 place-items-center justify-self-center rounded-[10px] ${
                active === note.id
                  ? "bg-[#0E6E66] text-white"
                  : "bg-[#E3F2EF] text-[#0E6E66]"
              }`}
            >
              <IconNote className="h-[18px] w-[18px]" />
            </span>

            <span className="min-w-0 leading-[1.3]">
              <b className="block truncate text-base font-bold">
                {note.title || "Untitled note"}
              </b>

              <span className="block truncate text-[15px] text-[#4A5568]">
                {note.pin
                  ? "Pinned"
                  : `Edited`}
              </span>
            </span>
          </a>
        ))}
      </nav>

      <main className="flex min-w-0 flex-col gap-5">
        <section
          aria-labelledby="notes-h"
          className="flex flex-wrap items-end justify-between gap-4 rounded-[20px] bg-white px-[18px] py-[18px] shadow-[0_0_0_1px_#E1E5EC,0_12px_32px_rgba(17,24,39,.06)] sm:rounded-3xl sm:px-7 sm:py-[22px]"
        >
          <div>
            <h2
              id="notes-h"
              className="m-0 text-[22px] font-extrabold tracking-[-0.01em]"
            >
              Trip notes
            </h2>

            <p className="mb-0 mt-0.5 text-[15px] text-[#4A5568]">
              {noteslist.length
                ? `${plural(
                    noteslist.length,
                    "note",
                    "notes"
                  )}${
                    pinnedCount
                      ? `, ${pinnedCount} pinned`
                      : ""
                  }`
                : "No notes yet"}
            </p>
          </div>

          <span
            aria-hidden="true"
            className="text-[32px] font-extrabold leading-none tracking-[-0.03em] sm:text-[40px]"
          >
            {noteslist.length}
          </span>
        </section>

        <button
          type="button"
          onClick={addNote}
          className="flex min-h-[58px] w-full items-center rounded-[14px] border border-dashed border-[#B8C1CE] bg-[#F4F6FA] px-4 text-left text-[15px] font-bold text-[#2F3A4D] transition hover:border-solid hover:border-[#0E6E66] hover:bg-[#E3F2EF] hover:text-[#0E6E66]"
        >
          + Add note
        </button>

        {noteslist.length ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            {noteslist.map((note) => (
              <article
                key={note.id}
                id={`note-${note.id}`}
                className={`relative flex scroll-mt-4 flex-col gap-2 rounded-2xl bg-white px-4 pb-3.5 pt-4 transition sm:min-h-[180px] sm:rounded-[20px] sm:px-[22px] sm:pb-[18px] sm:pt-5 ${
                  current?.id === note.id
                    ? "shadow-[0_0_0_2px_#0E6E66]"
                    : "shadow-[0_0_0_1px_#E1E5EC,0_8px_24px_rgba(17,24,39,.05)] hover:shadow-[0_12px_28px_rgba(17,24,39,.08)]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => openNote(note.id)}
                  className="text-left text-lg font-extrabold leading-[1.3] text-[#111827] outline-none [overflow-wrap:anywhere] after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:after:outline focus-visible:after:outline-[3px] focus-visible:after:outline-offset-2 focus-visible:after:outline-[#0E6E66] sm:text-[19px] sm:after:rounded-[20px]"
                >
                  {note.title || "Untitled note"}
                </button>

                <p
                  className={`m-0 line-clamp-6 whitespace-pre-line text-[15px] leading-[1.55] [overflow-wrap:anywhere] ${
                    note.body
                      ? "text-[#2F3A4D]"
                      : "text-[#4A5568]"
                  }`}
                >
                  {note.body || "Nothing written yet."}
                </p>

                <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-[13px] text-[#4A5568]">
                  <button
                    type="button"
                    aria-pressed={note.pin}
                    aria-label={`${
                      note.pin ? "Unpin" : "Pin"
                    } ${note.title || "note"}`}
                    title={
                      note.pin ? "Unpin" : "Pin to top"
                    }
                    onClick={() => togglePin(note.id)}
                    className={`relative z-[2] grid h-8 w-8 place-items-center rounded-[10px] hover:bg-[#F4F6FA] ${
                      note.pin
                        ? "text-[#E0A100]"
                        : "text-[#AEB7C4] hover:text-[#111827]"
                    }`}
                  >
                    <IconStar className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[20px] border border-dashed border-[#B8C1CE] px-6 py-10 text-center text-base text-[#4A5568]">
            Keep transport tips, addresses, confirmation numbers
            and ideas here. Add your first note above.
          </div>
        )}
      </main>

      {current && editing && (
        <NotePanel
          note={current}
          isNew={editing.isNew}
          onChange={changeNote}
          onDelete={deleteNote}
          onClose={closeEditor}
        />
      )}

      {toastNode}
    </div>
  );
}