import React, { ReactNode } from "react";

import { t } from "@/lib/styles";

export default function FormField({ 
    label, 
    children, 
    style 
} : {
    label: ReactNode;
    children: ReactNode;
    style?: React.CSSProperties;
}) {
    return (
        <div style={style}>
            <label 
                style={{ fontSize: 11, color: t.textMuted, display: "block", marginBottom: 3 }}
            >{label}</label>
            {children}
        </div>
    );
}