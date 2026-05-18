// ── Design tokens ────────────────────────────────────────────────
export const LOGO = "'Space Grotesk', sans-serif";
export const BODY = "'DM Sans', sans-serif";
export const C = {
  bg:"#F5F5F0", white:"#FFFFFF", ink:"#111110",
  ink2:"#5A5A57", ink3:"#9A9A95",
  blue:"#0A84FF", green:"#30D158", orange:"#FF9F0A",
  red:"#FF453A", purple:"#BF5AF2",
};

// ── IndexedDB ────────────────────────────────────────────────────
export const DB_NAME    = "trackthistnow";
export const DB_VERSION = 1;
export const STORE_CATS = "categories";
export const STORE_LOGS = "logs";

export function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_CATS))
        db.createObjectStore(STORE_CATS, { keyPath: "id" });
      if (!db.objectStoreNames.contains(STORE_LOGS))
        db.createObjectStore(STORE_LOGS, { keyPath: "id" });
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = () => reject(req.error);
  });
}

export function dbGetAll(db, store) {
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(store, "readonly");
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

export function dbPutAll(db, store, items) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    const os = tx.objectStore(store);
    const clearReq = os.clear();
    clearReq.onsuccess = () => {
      items.forEach(item => os.put(item));
      tx.oncomplete = resolve;
      tx.onerror    = () => reject(tx.error);
    };
  });
}

export function dbDelete(db, store, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).delete(id);
    tx.oncomplete = resolve;
    tx.onerror    = () => reject(tx.error);
  });
}

// ── Default data ─────────────────────────────────────────────────
export const DEFAULT_CATS = [
  { id:"alcohol",        name:"Alcohol",        emoji:"🍺", color:C.orange, grad:["#FF9F0A","#FF6B00"], type:"count", subcategories:[] },
  { id:"exercise",       name:"Exercise",       emoji:"🏃", color:C.green,  grad:["#30D158","#00A832"], type:"count", subcategories:[] },
  { id:"weight",         name:"Weight",         emoji:"⚖️", color:C.blue,   grad:["#0A84FF","#0050D0"], type:"value", unit:"kg",  subcategories:[] },
  { id:"blood-pressure", name:"Blood Pressure", emoji:"❤️", color:C.red,    grad:["#FF453A","#C0001A"], type:"dual",  unit1:"sys", unit2:"dia", subcategories:[] },
];

export const PALETTE = [
  {color:C.blue,   grad:["#0A84FF","#0050D0"], label:"Blue"},
  {color:C.green,  grad:["#30D158","#00A832"], label:"Green"},
  {color:C.red,    grad:["#FF453A","#C0001A"], label:"Red"},
  {color:C.orange, grad:["#FF9F0A","#FF6B00"], label:"Orange"},
  {color:C.purple, grad:["#BF5AF2","#8A00C4"], label:"Purple"},
  {color:"#FF375F",grad:["#FF375F","#C0003A"], label:"Pink"},
  {color:"#64D2FF",grad:["#64D2FF","#007DB8"], label:"Teal"},
  {color:"#FFD60A",grad:["#FFD60A","#C09800"], label:"Yellow"},
  {color:"#63E6BE",grad:["#63E6BE","#009F72"], label:"Mint"},
];

export const EMOJI_LIST = [
  "🍺","🍷","🍸","🍹","🥃","☕","🧃","💧","🥤",
  "🏃","🏋️","🚴","🧘","🤸","⚽","🏊","🎾","🥊",
  "⚖️","📏","🌡️","💊","🩺","❤️","🫀","🧬","🩸",
  "😴","🌙","⏰","📅","📊","📈","🎯","✅","🔥",
  "🥗","🍎","🥦","🌿","🧠","💪","🦷","👁️","🫁",
  "🚬","🍕","🍔","🍜","🏠","💼","📚","✈️","📌",
];

export const CAT_TYPES = [
  {value:"count", label:"Counter",      desc:"Tap to count — drinks, cigarettes..."},
  {value:"value", label:"Single value", desc:"Log a number — weight, steps, hrs..."},
  {value:"dual",  label:"Two values",   desc:"Two numbers — like blood pressure"},
];

// ── Seed data ────────────────────────────────────────────────────
export function seedLogs() {
  const now = Date.now();
  const day = 86400000;
  const d = (offset, h, m) => {
    const dt = new Date(now - offset * day);
    dt.setHours(h, m, 0, 0);
    return { date: dt.toISOString().slice(0,10), ts: dt.getTime() };
  };
  return [
    { id:1,  categoryId:"alcohol", subcategoryId:"beer",     ...d(0, 20, 15) },
    { id:2,  categoryId:"alcohol", subcategoryId:"beer",     ...d(0, 22, 30) },
    { id:3,  categoryId:"alcohol", subcategoryId:"cocktail", ...d(1, 19, 45) },
    { id:4,  categoryId:"alcohol", subcategoryId:"wine",     ...d(1, 21,  0) },
    { id:5,  categoryId:"alcohol", subcategoryId:"wine",     ...d(2, 20, 10) },
    { id:6,  categoryId:"alcohol", subcategoryId:"beer",     ...d(3, 18, 50) },
    { id:7,  categoryId:"alcohol", subcategoryId:"cocktail", ...d(3, 22,  5) },
    { id:8,  categoryId:"alcohol", subcategoryId:"cocktail", ...d(3, 23, 20) },
    { id:9,  categoryId:"alcohol", subcategoryId:"wine",     ...d(5, 20, 30) },
    { id:10, categoryId:"alcohol", subcategoryId:"beer",     ...d(6, 19,  0) },
    { id:11, categoryId:"alcohol", subcategoryId:"beer",     ...d(6, 21, 15) },
  ];
}

// ── Utility functions ────────────────────────────────────────────
export function todayKey() { return new Date().toISOString().slice(0,10); }

export function fmtDate(d) {
  const t=todayKey(), y=new Date(Date.now()-86400000).toISOString().slice(0,10);
  if(d===t) return "Today";
  if(d===y) return "Yesterday";
  return new Date(d+"T12:00:00").toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric"});
}

export function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
}

export function getTodayCount(logs,cid,sid) {
  return logs.filter(l=>l.categoryId===cid&&l.subcategoryId===sid&&l.date===todayKey()).length;
}

export function getLatest(logs,cid) {
  return [...logs].filter(l=>l.categoryId===cid).sort((a,b)=>b.ts-a.ts)[0]||null;
}

export function rgba(h,a) {
  const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);
  return "rgba("+r+","+g+","+b+","+a+")";
}

// ── Shared UI components ──────────────────────────────────────────
import { useEffect } from "react";

export function useInjectStyles() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap";
    document.head.appendChild(l);
    const s = document.createElement("style");
    s.textContent = [
      "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}",
      "body{background:#F5F5F0;-webkit-font-smoothing:antialiased}",
      "input[type=number]{-moz-appearance:textfield}",
      "input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}",
      ".log-btn{transition:all .18s ease}",
      ".add-type-btn{transition:all .18s ease}",
      ".track-card{transition:transform .2s ease,box-shadow .2s ease}",
      ".track-card:hover{transform:translateY(-4px) scale(1.01)}",
    ].join("");
    document.head.appendChild(s);
  }, []);
}

export function Sheet({ onClose, children }) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{position:"fixed",inset:0,background:"rgba(17,17,16,.55)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{width:"100%",maxWidth:640,maxHeight:"92vh",overflowY:"auto",background:C.white,borderRadius:"24px 24px 0 0",paddingBottom:36,boxShadow:"0 -8px 40px rgba(0,0,0,.12)"}}>
        <div style={{width:40,height:4,background:"rgba(0,0,0,.12)",borderRadius:99,margin:"12px auto 0"}} />
        {children}
      </div>
    </div>
  );
}

export function Nav({ left, center, right }) {
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 48px",background:"rgba(245,245,240,.9)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,0,0,.07)"}}>
      <div style={{minWidth:120}}>{left}</div>
      <div style={{fontFamily:LOGO,fontSize:18,fontWeight:700,letterSpacing:"-.4px",color:C.ink}}>{center}</div>
      <div style={{minWidth:120,display:"flex",justifyContent:"flex-end"}}>{right}</div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer style={{borderTop:"1px solid rgba(0,0,0,.07)",padding:"32px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginTop:"auto"}}>
      <span style={{fontFamily:LOGO,fontSize:24,fontWeight:700,letterSpacing:"-.5px",color:C.ink}}>TrackThisNow</span>
      <span style={{fontSize:13,color:C.ink3}}>{"© "+new Date().getFullYear()+" TrackThisNow · Track anything. Anytime."}</span>
    </footer>
  );
}

export function SLabel({ children }) {
  return <div style={{fontSize:12,fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",color:C.ink3,marginBottom:12,fontFamily:BODY}}>{children}</div>;
}

export function TInput({ style, ...props }) {
  return <input {...props} style={{background:"rgba(0,0,0,.05)",border:"1px solid rgba(0,0,0,.07)",borderRadius:14,padding:"13px 16px",fontSize:16,color:C.ink,fontFamily:BODY,outline:"none",width:"100%",boxSizing:"border-box",...style}} />;
}

export function PrimaryBtn({ label, grad, onClick, style }) {
  return (
    <button onClick={onClick}
      style={{width:"100%",border:"none",borderRadius:99,padding:"16px 0",fontSize:16,fontWeight:600,color:"#fff",fontFamily:BODY,cursor:"pointer",background:"linear-gradient(135deg,"+grad[0]+","+grad[1]+")",boxShadow:"0 4px 20px "+rgba(grad[0],.4),letterSpacing:"-.2px",...style}}>
      {label}
    </button>
  );
}