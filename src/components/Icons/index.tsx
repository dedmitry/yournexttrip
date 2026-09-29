import type { ReactNode } from "react";

export type IconProps = {
    className?: string;
};

type SvgProps = IconProps & {
    children: ReactNode;
    strokeWidth?: number;
};

const Svg = ({
    children,
    className = "h-4 w-4",
    strokeWidth = 2,
}: SvgProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={className}
    >
        {children}
    </svg>
);

export const IconCalendar = (p: IconProps) => (
    <Svg {...p}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
    </Svg>
);

export const IconSun = (p: IconProps) => (
    <Svg {...p}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Svg>
);

export const IconPeople = (p: IconProps) => (
    <Svg {...p}>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" />
    </Svg>
);

export const IconWallet = (p: IconProps) => (
    <Svg {...p}>
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M3 10h18M16 15h2" />
    </Svg>
);

export const IconArrow = (p: IconProps) => (
    <Svg {...p}>
        <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
);

export const IconPlus = (p: IconProps) => (
    <Svg {...p}>
        <path d="M12 5v14M5 12h14" />
    </Svg>
);

export const IconEdit = (p: IconProps) => (
    <Svg {...p}>
        <path d="M4 20h4L19 9l-4-4L4 16z" />
        <path d="M13.5 6.5l4 4" />
    </Svg>
);

export const IconCopy = (p: IconProps) => (
    <Svg {...p}>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </Svg>
);

export const IconTrash = (p: IconProps) => (
    <Svg {...p}>
        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </Svg>
);

export const IconDots = ({
    className = "h-5 w-5",
}: IconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className={className}
    >
        <circle cx="5" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
    </svg>
);

export const IconStar = ({
    className = "h-4 w-4",
}: IconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className={className}
    >
        <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" />
    </svg>
);

export const IconBag = (p: IconProps) => (
    <Svg {...p}>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18" />
    </Svg>
);

export const IconClose = (p: IconProps) => (
    <Svg {...p}>
        <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
);

export const IconNote = (p: IconProps) => (
    <Svg {...p}>
        <path d="M5 4h14v11l-5 5H5z" />
        <path d="M14 20v-5h5M8 9h8M8 13h5" />
    </Svg>
);

export const IconCheck = (p: IconProps) => (
    <Svg {...p} strokeWidth={2.4}>
        <path d="M5 12l5 5 9-10" />
    </Svg>
);

export const IconGrip = (p: IconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className={p.className ?? "h-3.5 w-3.5"}
    >
        <circle cx="9" cy="5" r="1.8" />
        <circle cx="15" cy="5" r="1.8" />
        <circle cx="9" cy="12" r="1.8" />
        <circle cx="15" cy="12" r="1.8" />
        <circle cx="9" cy="19" r="1.8" />
        <circle cx="15" cy="19" r="1.8" />
    </svg>
);

export const IconLink = (p: IconProps) => (
    <Svg {...p}>
        <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </Svg>
);

export const IconOpen = (p: IconProps) => (
    <Svg {...p}>
        <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </Svg>
);

export const IconClock = (p: IconProps) => (
    <Svg {...p} strokeWidth={2.2}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
    </Svg>
);

export const IconPin = (p: IconProps) => (
    <Svg {...p}>
        <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
        <circle cx="12" cy="10" r="2.2" />
    </Svg>
);

export const IconShare = (p: IconProps) => (
    <Svg {...p}>
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <circle cx="18" cy="18" r="2.5" />
        <path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6" />
    </Svg>
);

export const IconBack = (p: IconProps) => (
    <Svg {...p} strokeWidth={2.2}>
        <path d="M15 6l-6 6 6 6" />
    </Svg>
);