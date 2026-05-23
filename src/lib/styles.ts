 
 export const t = {
     bg:          "var(--color-background-primary,   #ffffff)",
     bgSecondary: "var(--color-background-secondary, #f3f3f1)",
     bgTertiary:  "var(--color-background-tertiary,  #f3f3f1)",
     text:        "var(--color-text-primary,          #111111)",
     textMuted:   "var(--color-text-secondary,        #666666)",
     textHint:    "var(--color-text-tertiary,         #bbbbbb)",
     border:      "var(--color-border-tertiary,       #e5e5e3)",
     borderMd:    "var(--color-border-secondary,      #ccccca)",
     borderHeavy: "var(--color-border-primary,        #999997)",
     accentGrad:  "linear-gradient(135deg, #FF3838 0%, #FFB347 100%)",
     radiusSm:    8,
     radiusMd:    12,
     radiusLg:    16,
 };
 
 export const inputStyle = {
    width: "100%", fontSize: 13, padding: "6px 10px",
    border: `0.5px solid ${t.border}`, borderRadius: t.radiusSm,
    fontFamily: "inherit", background: t.bg, color: t.text, outline: "none",
  };
 
 export const saveBtnStyle = {
   fontSize: 13, padding: "5px 14px", borderRadius: t.radiusSm,
   border: `0.5px solid ${t.borderHeavy}`, background: t.text, color: t.bg,
   cursor: "pointer", fontFamily: "inherit",
 };
  
 export const cancelBtnStyle = {
    fontSize: 13, padding: "5px 12px", borderRadius: t.radiusSm,
    border: `0.5px solid ${t.border}`, background: "transparent",
    color: t.textMuted, cursor: "pointer", fontFamily: "inherit",
  };