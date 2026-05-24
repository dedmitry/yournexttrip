
import { t } from "@lib/styles";

export default function Chip({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: t.bg, border: `0.5px solid ${t.border}`,
            borderRadius: 20, padding: "4px 11px", fontSize: 12, color: t.textMuted, ...style,
        }}>{children}</span>
    );
}
