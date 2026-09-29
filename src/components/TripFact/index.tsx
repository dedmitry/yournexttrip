import type { ReactNode, ComponentType } from "react";

type IconProps = {
  className?: string;
};

type FactProps = {
  icon: ComponentType<IconProps>;
  children: ReactNode;
  srLabel?: string;
};

export default function Fact({
  icon: Icon,
  children,
  srLabel,
}: FactProps) {
    return (
        <li className="flex items-center gap-2 text-[15px] font-semibold text-[#111827]">
            <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-[#E3F2EF] text-[#0E6E66]">
                <Icon className="h-4 w-4" />
            </span>
            <span>
                {srLabel && <span className="sr-only">{srLabel} </span>}
                {children}
            </span>
        </li>
    );
}