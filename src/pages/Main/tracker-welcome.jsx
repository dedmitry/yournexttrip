import { useState, useEffect } from "react";
import { openDB, dbPutAll, DEFAULT_CATS, C, LOGO, BODY } from "./tracker-shared.js";

const PREVIEW = [
  { emoji:"🍺", name:"Alcohol",        grad:["#FF9F0A","#FF6B00"], glow:"rgba(255,159,10,.4)" },
  { emoji:"🏃", name:"Exercise",       grad:["#30D158","#00A832"], glow:"rgba(48,209,88,.4)"  },
  { emoji:"⚖️", name:"Weight",         grad:["#0A84FF","#0050D0"], glow:"rgba(10,132,255,.4)" },
  { emoji:"❤️", name:"Blood Pressure", grad:["#FF453A","#C0001A"], glow:"rgba(255,69,58,.4)"  },
];

function useStyles() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap";
    document.head.appendChild(l);
    const s = document.createElement("style");
    s.textContent = [
      "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}",
      "body{background:#F5F5F0;-webkit-font-smoothing:antialiased}",
      "@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}",
      "@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(48,209,88,.4)}70%{box-shadow:0 0 0 10px rgba(48,209,88,0)}}",
      "@keyframes spin{to{transform:rotate(360deg)}}",
      ".welcome-badge{animation:fadeUp .5s ease both}",
      ".welcome-title{animation:fadeUp .6s .1s ease both}",
      ".welcome-sub{animation:fadeUp .6s .2s ease both}",
      ".welcome-cards{animation:fadeUp .7s .3s ease both}",
      ".welcome-cta{animation:fadeUp .6s .45s ease both}",
      ".start-btn{transition:transform .18s,box-shadow .18s}",
      ".start-btn:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(0,0,0,.22)!important}",
      ".preview-card{transition:transform .22s ease,box-shadow .22s ease}",
      ".preview-card:hover{transform:translateY(-5px) scale(1.02)}",
    ].join("");
    document.head.appendChild(s);
  }, []);
}

/**
 * WelcomeScreen
 *
 * Props:
 *   onStart {Function} — called after DEFAULT_CATS are written to IndexedDB
 */
export default function WelcomeScreen({ onStart }) {
  const [starting, setStarting] = useState(false);
  useStyles();

  async function handleStart() {
    if (starting) return;
    setStarting(true);
    try {
      const db = await openDB();
      await dbPutAll(db, "categories", DEFAULT_CATS);
    } catch(_) {}
    onStart();
  }

  return (
    <div style={{ fontFamily:BODY, background:C.bg, minHeight:"100vh", display:"flex", flexDirection:"column" }}>

      {/* Nav */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 48px", background:"rgba(245,245,240,.9)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderBottom:"1px solid rgba(0,0,0,.07)" }}>
        <span style={{ fontFamily:LOGO, fontSize:24, fontWeight:700, letterSpacing:"-.5px", color:C.ink }}>TrackThisNow</span>
      </nav>

      {/* Hero */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"120px 24px 80px", position:"relative", overflow:"hidden", textAlign:"center" }}>

        {/* Blobs */}
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", filter:"blur(90px)", opacity:.22, background:C.blue,   top:-160, right:-80,  pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", filter:"blur(90px)", opacity:.22, background:C.orange, bottom:-80, left:-60,  pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:280, height:280, borderRadius:"50%", filter:"blur(90px)", opacity:.15, background:C.green,  top:"50%",  left:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none" }} />

        {/* Badge */}
        <div className="welcome-badge" style={{ display:"inline-flex", alignItems:"center", gap:8, background:C.white, border:"1px solid rgba(0,0,0,.08)", borderRadius:99, padding:"6px 16px 6px 10px", fontSize:13, fontWeight:500, color:C.ink2, marginBottom:28, boxShadow:"0 2px 12px rgba(0,0,0,.06)", position:"relative", zIndex:1 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:C.green, display:"inline-block", animation:"pulse 2s ease infinite" }} />
          Ready to start tracking
        </div>

        {/* Title */}
        <h1 className="welcome-title" style={{ fontFamily:LOGO, fontSize:"clamp(40px,7vw,80px)", fontWeight:700, letterSpacing:"-2px", lineHeight:1.05, color:C.ink, marginBottom:0, position:"relative", zIndex:1 }}>
          Track<span style={{ background:"linear-gradient(135deg,"+C.blue+","+C.purple+")", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>anything</span>.
        </h1>
        <h1 className="welcome-title" style={{ fontFamily:LOGO, fontSize:"clamp(40px,7vw,80px)", fontWeight:700, letterSpacing:"-2px", lineHeight:1.05, color:C.ink, marginBottom:20, position:"relative", zIndex:1 }}>
          Anytime.
        </h1>

        <p className="welcome-sub" style={{ fontSize:18, color:C.ink2, fontWeight:300, maxWidth:460, lineHeight:1.6, marginBottom:44, position:"relative", zIndex:1 }}>
          4 default tracks are ready for you — alcohol, exercise, weight, and blood pressure. Add your own anytime.
        </p>

        {/* Preview cards */}
        <div className="welcome-cards" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, width:"100%", maxWidth:640, marginBottom:48, position:"relative", zIndex:1 }}>
          {PREVIEW.map((p, i) => (
            <div key={i} className="preview-card"
              style={{ background:"linear-gradient(145deg,"+p.grad[0]+","+p.grad[1]+")", borderRadius:22, padding:"18px 16px 16px", minHeight:120, display:"flex", flexDirection:"column", justifyContent:"space-between", boxShadow:"0 8px 24px "+p.glow, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-20, right:-20, width:70, height:70, borderRadius:"50%", background:"rgba(255,255,255,.16)", pointerEvents:"none" }} />
              <div style={{ fontSize:28, lineHeight:1, marginBottom:6 }}>{p.emoji}</div>
              <div style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.9)", lineHeight:1.2, fontFamily:BODY }}>{p.name}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="welcome-cta" style={{ position:"relative", zIndex:1 }}>
          <button className="start-btn" onClick={handleStart} disabled={starting}
            style={{ background:C.ink, color:"#fff", border:"none", borderRadius:99, padding:"18px 52px", fontSize:18, fontWeight:700, cursor:"pointer", fontFamily:BODY, letterSpacing:"-.3px", boxShadow:"0 6px 24px rgba(0,0,0,.18)", opacity:starting ? .7 : 1, display:"inline-flex", alignItems:"center", gap:12 }}>
            {starting
              ? <><span style={{ width:18, height:18, border:"2.5px solid rgba(255,255,255,.4)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }} />Starting...</>
              : "Get started →"
            }
          </button>
          <div style={{ marginTop:14, fontSize:13, color:C.ink3, fontWeight:300 }}>
            Free · No account · No setup
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop:"1px solid rgba(0,0,0,.07)", padding:"28px 48px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <span style={{ fontFamily:LOGO, fontSize:24, fontWeight:700, letterSpacing:"-.5px", color:C.ink }}>TrackThisNow</span>
        <span style={{ fontSize:13, color:C.ink3 }}>{"© "+new Date().getFullYear()+" TrackThisNow · Track anything. Anytime."}</span>
      </footer>
    </div>
  );
}