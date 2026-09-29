import { Link } from "react-router-dom";

export default function Header() {

      return (
        <header className="border-b border-[#E1E5EC] bg-white">
            <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3.5">
                
                <Link 
                    to="/"
                    className="flex items-start gap-3 sm:items-center"
                >
                    <span
                        aria-hidden="true"
                        className="h-11 w-11 shrink-0 rounded-[10px] bg-[linear-gradient(135deg,#7B6CF6_0%,#FF7E8A_50%,#FFC46B_100%)]"
                    />
                    <div className="flex min-h-11 flex-col sm:h-11 sm:justify-between">
                        <div className="block text-lg font-extrabold leading-6 tracking-[-0.01em] text-[#111827] no-underline hover:text-[#0E6E66] focus-visible:rounded focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0E6E66]">
                            YourNextTrip
                        </div>
                        <p className="m-0 text-sm leading-5 text-[#4A5568]">
                            Plan your perfect trip — every stop, every moment.
                        </p>
                    </div>
                </Link>

            </div>
        </header>
    );
}