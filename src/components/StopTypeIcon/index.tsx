import type { FC } from "react";

type Props = {
  label: string;
  size?: number;
};

const StopTypeIcon: FC<Props> = ({ label, size = 10 }) => {
  const common = {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (label) {
    case "Transits":
      return (
        <svg {...common}>
          <circle cx="6" cy="19" r="3" />
          <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
          <circle cx="18" cy="5" r="3" />
        </svg>
      );

    case "Stays":
      return (
        <svg {...common}>
          <path d="M10 22v-6.57" />
          <path d="M12 11h.01" />
          <path d="M12 7h.01" />
          <path d="M14 15.43V22" />
          <path d="M15 16a5 5 0 0 0-6 0" />
          <path d="M16 11h.01" />
          <path d="M16 7h.01" />
          <path d="M8 11h.01" />
          <path d="M8 7h.01" />
          <rect x="4" y="2" width="16" height="20" rx="2" />
        </svg>
      );

    case "Places":
      return (
        <svg {...common}>
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );

    case "Food":
      return (
        <svg {...common}>
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      );

    default:
      return null;
  }
};

export default StopTypeIcon;