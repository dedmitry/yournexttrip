export default function SiteFooter() {
    return (
        <footer className="mt-auto border-t border-[#E1E5EC] bg-white">
            <div className="mx-auto flex max-w-[1240px] items-center justify-center px-4 pb-[calc(20px+env(safe-area-inset-bottom,0px))] pt-5 sm:px-6">
                <p className="m-0 text-center text-[13px] text-[#4A5568]">
                    © 2025 YourNextTrip, Pro. All rights reserved.
                </p>
            </div>
        </footer>
    );
}