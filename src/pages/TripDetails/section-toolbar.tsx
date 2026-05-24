import { Link } from "react-router-dom";

import { t } from "@/lib/styles";

import { TripTab } from "@/types/trip";

 
export default function PageToolbar({ tripTitle, activeTab, onTabChange }: {
    tripTitle: string;
    activeTab: TripTab;
    onTabChange: (tab: TripTab) => void;
}) {
    const tabs: { id: TripTab; label: string }[] = [
        { id: "plan",      label: "Plan"      },
        { id: "checklist", label: "Checklist" },
        { id: "notes",     label: "Notes"     },
        //{ id: "advice",    label: "Advice"    },
    ];
 
    return (
        <div style={{ maxWidth: 1120, width: "100%", margin: "0 auto" }}>
            <style>{`
                @media (max-width: 600px) {
                .toolbar-row  { flex-direction: column; align-items: flex-start !important; gap: 12px !important; }
                .tab-control  { width: 100% !important; border-radius: 12px !important; }
                .tab-control button { flex: 1; justify-content: center; border-radius: 10px !important; }
                }
            `}</style>
            <div className="toolbar-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <h1 style={{
                    fontSize: 26, fontWeight: 800, 
                    //fontFamily: "Georgia, 'Times New Roman', serif", 
                    color: t.text,
                    letterSpacing: "-0.4px", margin: 0,
                    display: "flex", alignItems: "center", gap: 8,
                    maxWidth: "100%", minWidth: 0, overflow: "hidden", flex: 1,
                }}>
                    <Link to="/" style={{ color: t.textMuted, textDecoration: "none", fontWeight: 800, flexShrink: 0 }}
                        onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = t.text}
                        onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = t.textMuted}
                    >My Trips</Link>
                    <span style={{ color: t.textHint, fontWeight: 800, flexShrink: 0 }}>›</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{tripTitle}</span>
                </h1>
                
                {/* Segmented pill control */}
                <div className="tab-control" style={{
                    display: "inline-flex", alignItems: "center",
                    background: t.bgSecondary,
                    border: `0.5px solid ${t.border}`,
                    borderRadius: 24, padding: 3, gap: 1,
                    flexShrink: 0,
                }}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            style={{
                            display: "inline-flex", alignItems: "center",
                            padding: "5px 14px", fontSize: 13, fontFamily: "inherit",
                            borderRadius: 20, cursor: "pointer",
                            border: isActive ? `0.5px solid ${t.borderMd}` : "0.5px solid transparent",
                            background: isActive ? t.bg : "transparent",
                            color: isActive ? t.text : t.textMuted,
                            fontWeight: 500,
                            boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.07)" : "none",
                            transition: "background .15s, color .15s, border-color .15s, box-shadow .15s",
                            whiteSpace: "nowrap",
                            }}
                            onMouseEnter={(e) => {
                            if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = t.text;
                            }}
                            onMouseLeave={(e) => {
                            if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = t.textMuted;
                            }}
                        >{tab.label}</button>
                    );
                })}
                </div>
            </div>
    
        </div>
    );
}