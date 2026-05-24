import React, { useState } from "react";

import { t } from "@lib/styles";


export default function StarRating({ 
    rating, 
    onRate, 
    interactive 
}: {
    rating?: number;
    onRate?: (rating: number) => void;
    interactive?: boolean;
}) {
    const [hovered, setHovered] = useState<number | null>(null);
    const active = hovered ?? rating ?? 0;

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((star) => (
            <span
                key={star}
                onClick={() => interactive && onRate?.(star)}
                onMouseEnter={() => interactive && setHovered(star)}
                onMouseLeave={() => interactive && setHovered(null)}
                style={{
                    fontSize: 13,
                    color: star <= active ? "#F5A623" : t.borderMd,
                    cursor: interactive ? "pointer" : "default",
                    transition: "color .1s",
                    lineHeight: 1,
                }}
            >
            ★
            </span>
        ))}
        </div>
    );
}