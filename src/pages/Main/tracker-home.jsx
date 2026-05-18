import { useState, useEffect, useCallback } from "react";
import {
  C, LOGO, BODY,
  openDB, dbGetAll, dbPutAll, dbDelete,
  DEFAULT_CATS, PALETTE, EMOJI_LIST, CAT_TYPES, seedLogs,
  fmtDate, getLatest, rgba,
  useInjectStyles, Sheet, Nav, Footer, SLabel, TInput, PrimaryBtn,
} from "./tracker-shared.js";

/**
 * TrackerHome — renders the home grid of category cards.
 *
 * Props:
 *   cats     {Array}    — category list (shared state)
 *   setCats  {Function} — update cats
 *   logs     {Array}    — all log entries (shared state)
 *   setLogs  {Function} — update logs
 *   onOpen   {Function} — called with (catId) when user taps a card
 */
export default function TrackerHome({ cats, setCats, logs, setLogs, onOpen }) {
  useInjectStyles();

  const [showAdd,   setShowAdd]   = useState(false);
  const [newName,   setNewName]   = useState("");
  const [newEmoji,  setNewEmoji]  = useState("📌");
  const [newPal,    setNewPal]    = useState(PALETTE[0]);
  const [newType,   setNewType]   = useState("count");
  const [newUnit,   setNewUnit]   = useState("");
  const [newUnit2,  setNewUnit2]  = useState("");

  const saveCats = useCallback(async (c) => {
    try { const db = await openDB(); await dbPutAll(db, "categories", c); } catch(_) {}
  }, []);

  function addCat() {
    if (!newName.trim()) return;
    const id = newName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    const cat = {
      id, name: newName.trim(), emoji: newEmoji,
      color: newPal.color, grad: newPal.grad, type: newType, subcategories: [],
      ...(newType==="value" ? {unit: newUnit.trim()||"unit"} : {}),
      ...(newType==="dual"  ? {unit1: newUnit.trim()||"v1", unit2: newUnit2.trim()||"v2"} : {}),
    };
    const n = [...cats, cat];
    setCats(n); saveCats(n);
    setNewName(""); setNewEmoji("📌"); setNewPal(PALETTE[0]);
    setNewType("count"); setNewUnit(""); setNewUnit2("");
    setShowAdd(false);
  }

  return (
    <div style={{fontFamily:BODY,background:C.bg,minHeight:"100vh",color:C.ink,display:"flex",flexDirection:"column"}}>

      {/* Nav */}
      <Nav
        left={<span style={{fontFamily:LOGO,fontSize:24,fontWeight:700,letterSpacing:"-.5px",color:C.ink}}>TrackThisNow</span>}
        center=""
        right={
          <button onClick={()=>setShowAdd(true)}
            style={{background:C.ink,color:"#fff",padding:"10px 22px",borderRadius:99,fontSize:14,fontWeight:600,border:"none",cursor:"pointer",fontFamily:BODY,letterSpacing:"-.2px"}}>
            + Add new track
          </button>
        }
      />

      {/* Hero */}
      <div style={{position:"relative",overflow:"hidden",padding:"120px 0 60px",textAlign:"center"}}>
        <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",filter:"blur(80px)",opacity:.28,background:C.blue,  top:-160,right:-100,pointerEvents:"none"}} />
        <div style={{position:"absolute",width:380,height:380,borderRadius:"50%",filter:"blur(80px)",opacity:.28,background:C.orange,bottom:-100,left:-80, pointerEvents:"none"}} />
        <div style={{position:"absolute",width:260,height:260,borderRadius:"50%",filter:"blur(80px)",opacity:.15,background:C.green, top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"}} />
        <div style={{maxWidth:1080,margin:"0 auto",padding:"0 24px",position:"relative",zIndex:1}}>
          <h1 style={{fontFamily:LOGO,fontSize:"clamp(40px,7vw,72px)",fontWeight:700,letterSpacing:"-2px",lineHeight:1.05,color:C.ink}}>
            Track<span style={{background:"linear-gradient(135deg,"+C.blue+","+C.purple+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>anything</span>.
          </h1>
          <p style={{fontFamily:LOGO,fontSize:"clamp(40px,7vw,72px)",fontWeight:700,letterSpacing:"-2px",lineHeight:1.05,color:C.ink,marginBottom:36}}>Anytime.</p>
          <button onClick={()=>setShowAdd(true)}
            style={{border:"none",borderRadius:99,padding:"15px 34px",fontSize:16,fontWeight:600,color:"#fff",fontFamily:BODY,cursor:"pointer",background:C.ink,boxShadow:"0 4px 20px rgba(0,0,0,.18)",display:"inline-flex",alignItems:"center",gap:10,letterSpacing:"-.2px",transition:"transform .18s,box-shadow .18s"}}>
            + Add new track
          </button>
        </div>
      </div>

      {/* Category grid */}
      {cats.length > 0 && (
        <div style={{maxWidth:1080,margin:"0 auto",width:"100%",padding:"0 24px"}}>
          <h2 style={{fontFamily:LOGO,fontSize:18,fontWeight:700,letterSpacing:"-.5px",lineHeight:1.1,color:C.ink,marginBottom:20,marginTop:24}}>My tracks</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
            {cats.map(cat => {
              const latest    = getLatest(logs, cat.id);
              const latestSub = latest ? cat.subcategories?.find(s=>s.id===latest.subcategoryId) : null;
              const latestDate = latest ? fmtDate(latest.date) : null;
              const gradStr   = "linear-gradient(145deg,"+cat.grad[0]+","+cat.grad[1]+")";

              let stat=null, dateLine=null;
              if (!latest) {
                stat = <span style={{fontSize:13,color:"rgba(255,255,255,.5)"}}>No entries</span>;
              } else if (cat.type==="count") {
                stat     = <span style={{fontSize:26,fontWeight:300,letterSpacing:"-.8px",color:"#fff"}}>{latestSub?latestSub.name:"—"}</span>;
                dateLine = <span style={{fontSize:12,color:"rgba(255,255,255,.65)",marginTop:4,display:"block"}}>{latestDate}</span>;
              } else if (cat.type==="value") {
                stat     = <span style={{fontSize:34,fontWeight:200,letterSpacing:"-1.5px",color:"#fff"}}>{latest.value} <span style={{fontSize:14,opacity:.75}}>{cat.unit}</span></span>;
                dateLine = <span style={{fontSize:12,color:"rgba(255,255,255,.65)",marginTop:4,display:"block"}}>{latestDate}</span>;
              } else if (cat.type==="dual") {
                stat     = <span style={{fontSize:26,fontWeight:200,letterSpacing:"-1px",color:"#fff"}}>{latest.value1}<span style={{fontSize:17,opacity:.45}}>/</span>{latest.value2} <span style={{fontSize:12,opacity:.65}}>mmHg</span></span>;
                dateLine = <span style={{fontSize:12,color:"rgba(255,255,255,.65)",marginTop:4,display:"block"}}>{latestDate}</span>;
              }

              return (
                <button key={cat.id} className="track-card"
                  onClick={() => onOpen(cat.id)}
                  style={{border:"none",borderRadius:22,padding:"20px 18px 18px",cursor:"pointer",background:gradStr,textAlign:"left",position:"relative",overflow:"hidden",boxShadow:"0 8px 28px "+rgba(cat.grad[0],.38),minHeight:148,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                  <div style={{position:"absolute",top:-28,right:-28,width:90,height:90,borderRadius:"50%",background:"rgba(255,255,255,.16)",pointerEvents:"none"}} />
                  <div>
                    <div style={{fontSize:30,lineHeight:1,marginBottom:7}}>{cat.emoji}</div>
                    <div style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,.9)",lineHeight:1.2,fontFamily:BODY}}>{cat.name}</div>
                  </div>
                  <div style={{marginTop:10}}>{stat}{dateLine}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {cats.length === 0 && (
        <div style={{textAlign:"center",padding:"3rem 2rem",color:C.ink3,fontSize:15}}>
          No tracks yet — tap "Add new track" to get started.
        </div>
      )}

      <Footer />

      {/* Add track sheet */}
      {showAdd && (
        <Sheet onClose={()=>setShowAdd(false)}>
          <div style={{padding:"24px 20px 0"}}>
            <div style={{fontFamily:LOGO,fontSize:22,fontWeight:700,color:C.ink,marginBottom:20}}>New track</div>
            <TInput autoFocus placeholder="Track name" value={newName} onChange={e=>setNewName(e.target.value)} style={{marginBottom:18}} />
            <SLabel>Icon</SLabel>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20,padding:"14px",background:"rgba(0,0,0,.03)",borderRadius:16}}>
              {EMOJI_LIST.map(em=>(
                <button key={em} onClick={()=>setNewEmoji(em)}
                  style={{width:38,height:38,borderRadius:10,border:newEmoji===em?"2px solid "+newPal.color:"2px solid transparent",background:newEmoji===em?rgba(newPal.color,.1):"transparent",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",outline:"none"}}>
                  {em}
                </button>
              ))}
            </div>
            <SLabel>Type</SLabel>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
              {CAT_TYPES.map(t=>(
                <div key={t.value} onClick={()=>setNewType(t.value)}
                  style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:newType===t.value?rgba(newPal.color,.08):"rgba(0,0,0,.03)",borderRadius:14,padding:"13px 16px",cursor:"pointer",border:newType===t.value?"1.5px solid "+rgba(newPal.color,.5):"1.5px solid transparent",transition:"all .15s"}}>
                  <div>
                    <div style={{fontSize:15,fontWeight:600,color:C.ink}}>{t.label}</div>
                    <div style={{fontSize:13,color:C.ink3,marginTop:2}}>{t.desc}</div>
                  </div>
                  {newType===t.value && (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill={newPal.color}/><path d="M6 11l4 4 6-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </div>
              ))}
            </div>
            {newType==="value" && <TInput placeholder="Unit (e.g. kg, steps, hrs)" value={newUnit} onChange={e=>setNewUnit(e.target.value)} style={{marginBottom:18}} />}
            {newType==="dual" && (
              <div style={{display:"flex",gap:10,marginBottom:18}}>
                <TInput placeholder="Label 1 (e.g. sys)" value={newUnit}  onChange={e=>setNewUnit(e.target.value)} />
                <TInput placeholder="Label 2 (e.g. dia)" value={newUnit2} onChange={e=>setNewUnit2(e.target.value)} />
              </div>
            )}
            <SLabel>Color</SLabel>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:26}}>
              {PALETTE.map(p=>(
                <button key={p.color} onClick={()=>setNewPal(p)}
                  style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,"+p.grad[0]+","+p.grad[1]+")",border:newPal.color===p.color?"3px solid #fff":"3px solid transparent",cursor:"pointer",padding:0,outline:"none",boxShadow:newPal.color===p.color?"0 0 0 2px "+p.color:"none",transition:"box-shadow .15s"}}
                  aria-label={p.label} />
              ))}
            </div>
            <PrimaryBtn label="Create track" grad={newPal.grad} onClick={addCat} style={{marginBottom:0}} />
          </div>
        </Sheet>
      )}
    </div>
  );
}