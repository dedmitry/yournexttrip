
export const t = {
    bg:          "var(--color-background-primary,   #ffffff)",
    bgSecondary: "var(--color-background-secondary, #f9f9f8)",
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

export const STATUS_CONFIG = {
    upcoming:  { label: "Upcoming",  bg: "#E6F1FB", color: "#0C447C", dotColor: "#85B7EB", badgeBg: "#E6F1FB", badgeText: "#0C447C", iconBg: "#E6F1FB", iconColor: "#0C447C" },
    planning:  { label: "Planning",  bg: "#EEEDFE", color: "#3C3489", dotColor: "#AFA9EC", badgeBg: "#EEEDFE", badgeText: "#3C3489", iconBg: "#EEEDFE", iconColor: "#3C3489" },
    ongoing:   { label: "Today",     bg: "#EAF3DE", color: "#27500A", dotColor: "#97C459", badgeBg: "#EAF3DE", badgeText: "#27500A", iconBg: "#EAF3DE", iconColor: "#27500A" },
    completed: { label: "Completed", bg: "#F1EFE8", color: "#5F5E5A", dotColor: "#EF9F27", badgeBg: "#FAEEDA", badgeText: "#633806", iconBg: "#FAEEDA", iconColor: "#633806" },
};

export const STOP_TYPE_CONFIG = {
    transport: { icon: "✈", label: "Flights",     bg: "#E6F1FB", color: "#0C447C" },
    hotel:     { icon: "⌂", label: "Stays",       bg: "#EEEDFE", color: "#3C3489" },
    place:     { icon: "◎", label: "Places",      bg: "#EAF3DE", color: "#27500A" },
    food:      { icon: "⊕", label: "Restaurants", bg: "#FAEEDA", color: "#633806" },
};