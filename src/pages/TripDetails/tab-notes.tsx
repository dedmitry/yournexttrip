import { useState } from "react";

import { t, inputStyle, cancelBtnStyle } from "@/lib/styles";
 
interface Note { id: number; title: string; body: string; }
  

export default function NotesTab({
    noteslist, 
    updateNotes
} : {
    noteslist: Note[]; 
    updateNotes: (notes: Note[]) => void
}) {
    //const [notes, setNotes] = useState<Note[]>(noteslist);
    const [nextId, setNextId] = useState(noteslist.length + 1);
    const [openId, setOpenId] = useState<number | null>(null);
    
    const addNote = () => {
        const id = nextId;
        setNextId((n) => n + 1);
        //setNotes((prev) => [...prev, { id, title: "Untitled note", body: "" }]);
        const next = [...noteslist, { id, title: "Untitled note", body: "" }];
        updateNotes(next);
        setOpenId(id);
    };
    
    const updateNote = (id: number, patch: Partial<Note>) => {
        //setNotes((prev) => prev.map((n) => n.id === id ? { ...n, ...patch } : n));
        const next = noteslist.map((n) => n.id === id ? { ...n, ...patch } : n);
        updateNotes(next);
    };
    
    const deleteNote = (id: number) => {
        //setNotes((prev) => prev.filter((n) => n.id !== id));
        const next = noteslist.filter((n) => n.id !== id);
        updateNotes(next);
        if (openId === id) setOpenId(null);
    };
    
    return (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0px 0px 40px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {noteslist.map((note) => {
                const isOpen = openId === note.id;
                return (
                    <div key={note.id} style={{
                    background: t.bg, border: `0.5px solid ${isOpen ? t.borderHeavy : t.border}`,
                    borderRadius: t.radiusMd, overflow: "hidden", transition: "border-color .15s",
                    }}>
                    {/* Header row */}
                    <div
                        onClick={() => setOpenId(isOpen ? null : note.id)}
                        style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "11px 14px", cursor: "pointer", userSelect: "none",
                        }}
                    >
                        <span style={{ fontSize: 14, flexShrink: 0, color: t.textMuted }}>✎</span>
                        <span style={{
                        flex: 1, fontSize: 14, fontWeight: 500, color: t.text,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>{note.title || "Untitled note"}</span>
                        <span style={{ fontSize: 11, color: t.textHint, flexShrink: 0 }}>
                        {note.body.split("\n").filter(Boolean).length} lines
                        </span>
                        <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 16, height: 16,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s",
                        }}>
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                            <path d="M1 1L5 5L9 1" stroke={t.textHint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        </span>
                    </div>
        
                    {/* Body */}
                    {isOpen && (
                        <div style={{ borderTop: `0.5px solid ${t.border}`, padding: "12px 14px" }}>
                        <input
                            value={note.title}
                            onChange={(e) => updateNote(note.id, { title: e.target.value })}
                            placeholder="Note title"
                            style={{ ...inputStyle, fontSize: 14, fontWeight: 500, marginBottom: 9 }}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <textarea
                            value={note.body}
                            onChange={(e) => updateNote(note.id, { body: e.target.value })}
                            placeholder="Write anything… packing ideas, phrases, wish lists, reminders."
                            style={{ ...inputStyle, resize: "vertical", minHeight: 120, lineHeight: 1.7, marginBottom: 10 }}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button
                            onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                            style={{ ...cancelBtnStyle, color: "#A32D2D", borderColor: "#F7C1C1", fontSize: 12 }}
                            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = "#FCEBEB"}
                            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
                            >Delete note</button>
                        </div>
                        </div>
                    )}
                    </div>
                );
                })}
            </div>
        
            <button
                onClick={addNote}
                style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                width: "100%", marginTop: 12, padding: "9px 12px",
                background: "transparent", border: `0.5px dashed ${t.borderMd}`,
                borderRadius: t.radiusMd, cursor: "pointer", fontFamily: "inherit",
                fontSize: 13, color: t.textMuted, transition: "background .12s, color .12s",
                }}
                onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = t.bgSecondary;
                (e.currentTarget as HTMLButtonElement).style.color = t.text;
                }}
                onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = t.textMuted;
                }}
            >+ New note</button>
        </div>
    );
}