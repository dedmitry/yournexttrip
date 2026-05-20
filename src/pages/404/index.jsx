import { Link } from "react-router-dom";


import Header from "@components/PageHeader";
import Footer from "@components/PageFooter";


import { t } from "@lib/config";


// ─── 404 Page ─────────────────────────────────────────────────────────────────

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", background: t.bg,
      fontFamily: "system-ui, -apple-system, sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px) }
          to   { opacity: 1; transform: translateY(0) }
        }
      `}</style>

      <Header />

      <main style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "60px 24px",
      }}>
        <div style={{
          textAlign: "center", maxWidth: 480,
          animation: "fadeUp .4s ease both",
        }}>

          {/* 404 number */}
          <div style={{
            fontSize: 96, fontWeight: 600, lineHeight: 1,
            letterSpacing: "-4px", marginBottom: 12,
            background: t.accentGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>404</div>

          {/* Heading */}
          <h1 style={{
            fontSize: 22, fontWeight: 500, color: t.text,
            letterSpacing: "-0.3px", marginBottom: 10,
          }}>
            Looks like this page got lost in transit
          </h1>

          {/* Message */}
          <p style={{
            fontSize: 14, color: t.textMuted, lineHeight: 1.7,
            marginBottom: 36,
          }}>
            The page you're looking for doesn't exist or may have moved.<br />
            Let's get you back on track.
          </p>

          {/* Action */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link
              to="/"
              style={{
                fontSize: 14, padding: "10px 22px", borderRadius: 24,
                border: "0.5px solid #FF3838", background: t.accentGrad,
                color: "#fff", cursor: "pointer", fontFamily: "inherit",
                fontWeight: 500, textDecoration: "none",
                display: "inline-flex", alignItems: "center",
              }}
            >Go to My trips →</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}