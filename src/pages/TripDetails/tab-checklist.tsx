import { useState } from "react";

import { t, inputStyle, saveBtnStyle, cancelBtnStyle } from "@/lib/styles";
 
interface CheckItem { id: number; text: string; checked: boolean; category: string; }
 
const CHECKLIST_CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Documents:    { bg: "#E6F1FB", text: "#0C447C" },
  Money:        { bg: "#FAEEDA", text: "#633806" },
  Connectivity: { bg: "#EEEDFE", text: "#3C3489" },
  Clothing:     { bg: "#EAF3DE", text: "#27500A" },
  Health:       { bg: "#FCEBEB", text: "#A32D2D" },
  Activities:   { bg: "#EAF3DE", text: "#27500A" },
};
 
 
export default function ChecklistTab({ 
    checklist, 
    updateChecklist 
} : { 
    checklist: CheckItem[]; 
    updateChecklist: (checklist: CheckItem[]) => void 
}) {
    //const [items, setItems] = useState<CheckItem[]>(checklist);
    const [nextId, setNextId] = useState(checklist.length + 1);
    const [newText, setNewText] = useState("");
    const [newCat, setNewCat] = useState("Documents");
    const [addOpen, setAddOpen] = useState(false);
    
    const toggle = (id: number) => {
        //setItems((prev) => prev.map((it) => it.id === id ? { ...it, checked: !it.checked } : it));
            const next = checklist.map(it =>
            it.id === id ? { ...it, checked: !it.checked } : it
        );
        updateChecklist(next);
        }
    
        const remove = (id: number) => {
            //setItems((prev) => prev.filter((it) => it.id !== id));
            updateChecklist(checklist.filter((s) => s.id !== id));
        }
    
    const addItem = () => {
        if (!newText.trim()) return;
        /*setItems((prev) => [
            ...prev, 
            { 
                id: nextId, 
                text: newText.trim(), 
                checked: false, 
                category: newCat 
            }
        ]);*/
        const newStop: CheckItem = { id: nextId, text: newText.trim(), checked: false, category: newCat };
        const next = [...checklist, newStop];
        updateChecklist(next);

        setNextId((n) => n + 1);
        setNewText("");
        setAddOpen(false);
    };
    
    const categories = Array.from(new Set(checklist.map((it) => it.category)));
    const total = checklist.length;
    const done = checklist.filter((it) => it.checked).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    
    return (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0px 0px 40px" }}>
        {/* Progress bar */}
        <div style={{
            background: t.bgSecondary, border: `1px solid ${t.border}`,
            borderRadius: t.radiusMd, padding: "14px 18px", marginBottom: 20,
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Pack progress</span>
            <span style={{ fontSize: 13, color: t.textMuted }}>{done} / {total} — {pct}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 6, background: t.bgTertiary, overflow: "hidden" }}>
            <div style={{
                height: "100%", borderRadius: 6,
                background: pct === 100 ? "#97C459" : t.accentGrad,
                width: `${pct}%`, transition: "width .3s ease",
            }} />
            </div>
        </div>
    
        {/* Items by category */}
        {categories.map((cat) => {
            const catItems = checklist.filter((it) => it.category === cat);
            const col = CHECKLIST_CATEGORY_COLORS[cat] ?? { bg: t.bgSecondary, text: t.textMuted };
            return (
            <div key={cat} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{
                    fontSize: 11, fontWeight: 500, borderRadius: 20, padding: "2px 10px",
                    background: col.bg, color: col.text,
                }}>{cat}</span>
                <span style={{ fontSize: 11, color: t.textHint }}>
                    {catItems.filter((i) => i.checked).length}/{catItems.length}
                </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {catItems.map((item) => (
                    <div key={item.id} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 12px",
                    background: item.checked ? t.bgSecondary : t.bg,
                    border: `1px solid ${t.border}`, borderRadius: t.radiusSm,
                    transition: "background .15s",
                    }}>
                    <button
                        onClick={() => toggle(item.id)}
                        style={{
                        width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                        border: `1px solid ${item.checked ? "#97C459" : t.borderMd}`,
                        background: item.checked ? "#97C459" : "transparent",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 11, transition: "all .15s",
                        }}
                    >{item.checked ? "✓" : ""}</button>
                    <span style={{
                        flex: 1, fontSize: 13, color: item.checked ? t.textMuted : t.text,
                        textDecoration: item.checked ? "line-through" : "none",
                        transition: "color .15s",
                    }}>{item.text}</span>
                    <button
                        onClick={() => remove(item.id)}
                        title="Remove"
                        style={{
                        width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                        border: `1px solid ${t.border}`, background: "transparent",
                        cursor: "pointer", color: t.textHint, fontSize: 12,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                        onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = "#FCEBEB";
                        el.style.color = "#A32D2D";
                        el.style.borderColor = "#F7C1C1";
                        }}
                        onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = "transparent";
                        el.style.color = t.textHint;
                        el.style.borderColor = t.border;
                        }}
                    >×</button>
                    </div>
                ))}
                </div>
            </div>
            );
        })}
    
        {/* Add item */}
        {addOpen ? (
            <div style={{
            background: t.bgSecondary, border: `1px solid ${t.border}`,
            borderRadius: t.radiusMd, padding: "12px 14px", marginTop: 8,
            display: "flex", flexDirection: "column", gap: 9,
            }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                <input
                autoFocus
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItem()}
                placeholder="Item description…"
                style={inputStyle}
                />
                <select value={newCat} onChange={(e) => setNewCat(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
                {["Documents","Money","Connectivity","Clothing","Health","Activities"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
                </select>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
                <button onClick={addItem} style={saveBtnStyle}>Add item</button>
                <button onClick={() => { setAddOpen(false); setNewText(""); }} style={cancelBtnStyle}>Cancel</button>
            </div>
            </div>
        ) : (
            <button
            onClick={() => setAddOpen(true)}
  className="
    flex items-center justify-center gap-[7px]
    w-full mt-2
    px-3 py-[9px]
    border border-dashed
    rounded-md
    cursor-pointer
    text-[13px]
    transition-colors duration-100
  "
  style={{
    borderWidth: "0.5px",
    borderColor: t.borderMd,
    borderRadius: t.radiusMd,
    background:
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 639px)").matches
        ? t.bgSecondary
        : "transparent",
    color:
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 639px)").matches
        ? t.text
        : t.textMuted,
  }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = t.bgSecondary;
                (e.currentTarget as HTMLButtonElement).style.color = t.text;
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = t.textMuted;
            }}
            >+ Add item</button>
        )}
        </div>
    );
}