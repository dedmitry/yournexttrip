import { t } from "@lib/styles";


export default function EmptyState({ 
    onNew 
}: {
    onNew: () => void;
}) {
    return (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", maxWidth: 380 }}>
                <p style={{
                fontSize: 17, color: t.textMuted, lineHeight: 1.7,
                marginBottom: 28,
                }}>
                Your next great adventure is waiting. ✨<br />
                Every journey starts with a single plan — make yours
                unforgettable, one stop at a time.
                </p>

                <button
                onClick={onNew}
                style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    fontSize: 16, padding: "13px 28px", borderRadius: 24,
                    border: "none", background: t.accentGrad,
                    color: t.bg, cursor: "pointer", fontFamily: "inherit",
                    fontWeight: 500,
                }}
                >+ Plan a new trip</button>
            </div>
        </div>
    );
}