export default function Perforation() {
    return (
        <div
            aria-hidden="true"
            className="relative mx-[18px] border-t-2 border-dashed border-[#B8C1CE] sm:mx-[22px]
                        before:absolute before:-left-[30px] before:-top-[13px] before:h-6 before:w-6 before:rounded-full before:bg-[#F4F6FA] before:[clip-path:inset(0_0_0_calc(50%_-_1.5px))] before:content-['']
                        after:absolute after:-right-[30px] after:-top-[13px] after:h-6 after:w-6 after:rounded-full after:bg-[#F4F6FA] after:[clip-path:inset(0_calc(50%_-_1.5px)_0_0)] after:content-['']
                        sm:before:-left-[34px] sm:after:-right-[34px]"
        />
    );
}