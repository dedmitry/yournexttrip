export default function EmptyState({ 
    onNew 
}: {
    onNew: () => void;
}) {
    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="max-w-[380px] text-center">

                {/* Heading */}
                <h1 className="mb-2.5 text-[22px] font-medium tracking-[-0.3px] text-[#111827]">
                    Your next great adventure is waiting. ✨
                </h1>
                {/* Message */}
                <p className="mb-9 text-[14px] leading-[1.7] text-[#6B7280]">
                    Every journey starts with a single plan — make yours
                    unforgettable, one stop at a time.
                </p>

                <button 
                    onClick={onNew}
                    className="
                        inline-flex h-[54px] w-full min-w-[240px] sm:w-auto 
                        items-center justify-center gap-2 
                        rounded-[14px] 
                        bg-[linear-gradient(135deg,#BD75C0_0%,#FF7E8A_50%,#FFA17A_100%)] 
                        border-0 
                        px-7 py-[13px] 
                        font-extrabold text-white [text-shadow:0_1px_2px_rgba(60,30,80,.4)] shadow-[0_8px_22px_rgba(255,126,138,.38)] transition  cursor-pointer
                    "
                >+ Plan a new trip</button>
            </div>
        </div>
    );
}