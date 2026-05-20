import React from "react";
import { Link } from "react-router-dom";


import { t } from "@lib/config";


export default function Header() {

    return (
        <header style={{
            position: "sticky", top: 0, zIndex: 100,
            background: t.bg,
            borderBottom: `0.5px solid ${t.border}`,
        }}>
            <div style={{
                maxWidth: 1120, margin: "0 auto",
                padding: "0 24px",
                display: "flex", alignItems: "center",
                height: 56, gap: 32,
            }}>
                {/* Logo */}
                <Link 
                    to="/"
                    style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0 }}
                >
                    <div style={{
                        width: 30, height: 30, borderRadius: 8,
                        background: t.accentGrad,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 15, color: "#fff", fontWeight: 500, letterSpacing: "-0.5px",
                    }}></div>
                    <span style={{ fontSize: 15, fontWeight: 500, color: t.text, letterSpacing: "-0.3px" }}>
                        YourNextTrip
                    </span>
                </Link>

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Right actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <button style={{
                        fontSize: 13, padding: "6px 14px", borderRadius: 20,
                        border: `0.5px solid ${t.border}`, background: "transparent",
                        color: t.textMuted, cursor: "pointer", fontFamily: "inherit",
                        whiteSpace: "nowrap",
                    }}>Account</button>
                </div>
            </div>
        </header>
    );
}