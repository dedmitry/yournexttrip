import { useState, useEffect } from "react";

const LOGO = "'Space Grotesk', sans-serif";
const BODY = "'DM Sans', sans-serif";
const C = {
  bg: "#F5F5F0", white: "#FFFFFF", ink: "#111110",
  ink2: "#5A5A57", ink3: "#9A9A95",
  blue: "#0A84FF", green: "#30D158", orange: "#FF9F0A",
  red: "#FF453A", purple: "#BF5AF2",
};

const SUGGESTIONS = [
  { emoji: "🍺", name: "Alcohol",        color: "#FF9F0A", grad: ["#FF9F0A","#FF6B00"] },
  { emoji: "🏃", name: "Exercise",       color: "#30D158", grad: ["#30D158","#00A832"] },
  { emoji: "⚖️", name: "Weight",         color: "#0A84FF", grad: ["#0A84FF","#0050D0"] },
  { emoji: "❤️", name: "Blood Pressure", color: "#FF453A", grad: ["#FF453A","#C0001A"] },
];

function rgba(h, a) {
  const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

export default function NotFound() {
  const [tick, setTick] = useState(0);

  /* inject fonts */
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap";
    document.head.appendChild(l);

    const s = document.createElement("style");
    s.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: ${C.bg}; -webkit-font-smoothing: antialiased; }

      @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      @keyframes scaleIn { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
      @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }

      .fade-1  { animation: fadeUp .6s .1s ease both; }
      .fade-2  { animation: fadeUp .6s .25s ease both; }
      .fade-3  { animation: fadeUp .6s .4s ease both; }
      .fade-4  { animation: fadeUp .6s .55s ease both; }
      .scale-in{ animation: scaleIn .7s ease both; }

      .home-btn { transition: transform .18s, box-shadow .18s; }
      .home-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(0,0,0,.2) !important; }


      .shimmer-text {
        background: linear-gradient(90deg, ${C.ink} 0%, ${C.ink3} 40%, ${C.ink} 60%, ${C.ink} 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: shimmer 3s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { document.head.removeChild(s); };
  }, []);

  /* subtle digit animation */
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ fontFamily: BODY, background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 48px", background: "rgba(245,245,240,.9)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,.07)" }}>
        <span style={{ fontFamily: LOGO, fontSize: 24, fontWeight: 700, letterSpacing: "-.5px", color: C.ink }}>TrackThisNow</span>
        <a href="/" style={{ background: C.ink, color: "#fff", padding: "10px 22px", borderRadius: 99, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: BODY, letterSpacing: "-.2px", textDecoration: "none", transition: "transform .18s, box-shadow .18s" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,.18)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
          Go home
        </a>
      </nav>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 60px", position: "relative", overflow: "hidden", textAlign: "center" }}>

        {/* Background blobs */}
        <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", filter: "blur(90px)", opacity: .22, background: C.blue, top: -160, right: -80, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", filter: "blur(90px)", opacity: .22, background: C.orange, bottom: -80, left: -60, pointerEvents: "none" }} />

        {/* 404 number */}
        <div className="scale-in" style={{ position: "relative", zIndex: 1, marginBottom: 24 }}>
          <div style={{ fontFamily: LOGO, fontSize: "clamp(100px,20vw,180px)", fontWeight: 700, letterSpacing: "-8px", lineHeight: 1, color: C.ink, userSelect: "none" }}>
            4
            <span className="shimmer-text">0</span>
            4
          </div>
        </div>

        {/* Message */}
        <h1 className="fade-1" style={{ fontFamily: LOGO, fontSize: "clamp(24px,4vw,40px)", fontWeight: 700, letterSpacing: "-1px", color: C.ink, marginBottom: 14, position: "relative", zIndex: 1 }}>
          This track doesn't exist.
        </h1>
        <p className="fade-2" style={{ fontSize: 17, color: C.ink2, fontWeight: 300, maxWidth: 420, lineHeight: 1.6, marginBottom: 40, position: "relative", zIndex: 1 }}>
          Looks like you wandered off the path. The page you're looking for isn't tracked — yet.
        </p>

        {/* CTA */}
        <div className="fade-3" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <a href="/" className="home-btn"
            style={{ background: C.ink, color: "#fff", padding: "15px 34px", borderRadius: 99, fontSize: 16, fontWeight: 600, textDecoration: "none", letterSpacing: "-.3px", fontFamily: BODY, boxShadow: "0 4px 20px rgba(0,0,0,.15)", display: "inline-block" }}>
            Back to My tracks →
          </a>

        </div>
      </main>

      {/* Footer */}
      <footer className="fade-4" style={{ borderTop: "1px solid rgba(0,0,0,.07)", padding: "28px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: LOGO, fontSize: 24, fontWeight: 700, letterSpacing: "-.5px", color: C.ink }}>TrackThisNow</span>
        <span style={{ fontSize: 13, color: C.ink3 }}>{"© " + new Date().getFullYear() + " TrackThisNow · Track anything. Anytime."}</span>
      </footer>
    </div>
  );
}