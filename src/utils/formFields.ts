export const FIELD_BASE =
    "h-[46px] w-full rounded-xl border px-3.5 text-base text-[#111827] transition placeholder:text-[#8A94A6] focus:bg-white focus:outline-none focus:ring-4";

export const FIELD_OK =
    "border-transparent bg-[#F4F6FA] hover:border-[#B8C1CE] focus:border-[#0E6E66] focus:ring-[#E3F2EF]";

export const FIELD_ERROR =
    "border-[#D92D20] bg-[#FFF5F4] hover:border-[#B42318] focus:border-[#D92D20] focus:ring-[#FDE8E5]";

export const fieldClass = (hasError: boolean) =>
    `${FIELD_BASE} ${hasError ? FIELD_ERROR : FIELD_OK}`;

export function FieldError({
    id,
    message,
}: {
    id: string;
    message?: string;
}) {
    if (!message) return null;

    return (
        <span
            id={id}
            className="text-[13px] font-medium leading-snug text-[#B42318]"
        >
            {message}
        </span>
    );
}

export const formLabel =
    "text-[13px] font-semibold text-[#2F3A4D]";

export const formSection =
    "flex flex-col gap-3.5 border-b border-[#E1E5EC] py-5 last:border-b-0";

export const formHeading =
    "m-0 text-[15px] font-extrabold text-[#111827]";