import { Link } from "react-router-dom";


import Header from "@components/PageHeader";
import Footer from "@components/PageFooter";


import { t } from "@lib/config";


// ─── 404 Page ─────────────────────────────────────────────────────────────────

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F4F6FA] font-['system-ui',_'Segoe_UI',_sans-serif]">
        <style>{`
            @keyframes fadeUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `}</style>

      <Header />

      <main className="flex flex-1 items-center justify-center px-6 py-[60px]">
        <div
            className="
                w-full max-w-[480px]
                text-center
                animate-[fadeUp_.4s_ease_both]
            "
        >

          {/* 404 number */}
            <div
                className="
                    mb-3
                    text-[96px]
                    font-semibold
                    leading-none
                    tracking-[-4px]
                    bg-[#111111]
                    bg-clip-text
                    text-transparent
                "
            >404</div>

            {/* Heading */}
            <h1 style={{
                fontSize: 22, fontWeight: 500, color: t.text,
                letterSpacing: "-0.3px", marginBottom: 10,
            }}>
                Looks like this page got lost in transit
            </h1>

            {/* Message */}
            <p className="mb-9 text-[14px] leading-[1.7] text-[#6B7280]">
                The page you're looking for doesn't exist or may have moved.
                <br />
                Let's get you back on track.
            </p>

          {/* Action */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link
                to="/"
                className="
                    inline-flex h-[46px] min-w-[180px]
                    items-center justify-center gap-2 
                    rounded-[14px]
                    bg-[linear-gradient(135deg,#BD75C0_0%,#FF7E8A_50%,#FFA17A_100%)] 
                    px-[22px] py-2.5
                    text-[15px] font-extrabold text-white [text-shadow:0_1px_2px_rgba(60,30,80,.4)] shadow-[0_8px_22px_rgba(255,126,138,.38)] transition 
                    cursor-pointer
                "
            >Go to My trips →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}