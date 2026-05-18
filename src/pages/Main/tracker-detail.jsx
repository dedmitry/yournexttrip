import { useState, useCallback } from "react";
import {
  C, LOGO, BODY,
  openDB, dbDelete,
  rgba, todayKey, fmtDate, fmtTime, getTodayCount,
  useInjectStyles, Sheet, Nav, Footer, SLabel, TInput, PrimaryBtn,
} from "./tracker-shared.js";

/**
 * TrackerDetail — renders the category detail page.
 *
 * Props:
 *   cat      {Object}   — the category object
 *   cats     {Array}    — full category list (for updating subcategories)
 *   setCats  {Function} — update cats
 *   logs     {Array}    — all log entries
 *   setLogs  {Function} — update logs
 *   onBack   {Function} — called when user goes back to the list
 */
export default function TrackerDetail({ cat, cats, setCats, logs, setLogs, onBack }) {
  useInjectStyles();

  const [showAddSub, setShowAddSub] = useState(false);
  const [newSub,     setNewSub]     = useState("");
  const [flash,      setFlash]      = useState(null);
  const [val,        setVal]        = useState({});

  // ── DB helpers ──────────────────────────────────────────────────
  const saveCats = useCallback(async (c) => {
    try { const db = await openDB(); const tx = db.transaction("categories","readwrite"); c.forEach(item=>tx.objectStore("categories").put(item)); } catch(_) {}
  }, []);

  const saveLog = useCallback(async (entry) => {
    try { const db = await openDB(); const tx = db.transaction("logs","readwrite"); tx.objectStore("logs").put(entry); } catch(_) {}
  }, []);

  const removeLog = useCallback(async (id) => {
    try { const db = await openDB(); await dbDelete(db, "logs", id); } catch(_) {}
  }, []);

  // ── Actions ─────────────────────────────────────────────────────
  function track(subId) {
    const e = { id:Date.now(), categoryId:cat.id, subcategoryId:subId, date:todayKey(), ts:Date.now() };
    const n = [...logs, e]; setLogs(n); saveLog(e);
    setFlash(cat.id+"-"+subId); setTimeout(()=>setFlash(null), 400);
  }

  function trackVal() {
    const v1=val[cat.id+"_1"], v2=val[cat.id+"_2"]; if (!v1) return;
    const e = { id:Date.now(), categoryId:cat.id, date:todayKey(), ts:Date.now(),
      ...(cat.type==="value" ? {value:parseFloat(v1)||v1} : {value1:parseFloat(v1)||v1,value2:parseFloat(v2)||v2}) };
    const n = [...logs, e]; setLogs(n); saveLog(e);
    setVal(p=>({...p,[cat.id+"_1"]:"",[cat.id+"_2"]:""}));
  }

  function delLog(id) {
    const n = logs.filter(l=>l.id!==id); setLogs(n); removeLog(id);
  }

  function addSub() {
    if (!newSub.trim()) return;
    const sub = { id:newSub.toLowerCase().replace(/\s+/g,"-")+"-"+Date.now(), name:newSub.trim() };
    const n = cats.map(c=>c.id===cat.id ? {...c, subcategories:[...c.subcategories,sub]} : c);
    setCats(n); saveCats(n); setNewSub(""); setShowAddSub(false);
  }

  function delCat() {
    const nc = cats.filter(c=>c.id!==cat.id);
    const nl = logs.filter(l=>l.categoryId!==cat.id);
    setCats(nc); setLogs(nl);
    // remove from DB
    openDB().then(db => {
      const tx = db.transaction("categories","readwrite"); tx.objectStore("categories").delete(cat.id);
      logs.filter(l=>l.categoryId===cat.id).forEach(l=>dbDelete(db,"logs",l.id));
    }).catch(()=>{});
    onBack();
  }

  // ── Computed ────────────────────────────────────────────────────
  const today    = todayKey();
  const catLogs  = [...logs].filter(l=>l.categoryId===cat.id).sort((a,b)=>b.ts-a.ts);
  const grouped  = {};
  catLogs.forEach(l=>{ if(!grouped[l.date]) grouped[l.date]=[]; grouped[l.date].push(l); });
  const days     = Object.keys(grouped).sort((a,b)=>b.localeCompare(a));
  const gradStr  = "linear-gradient(145deg,"+cat.grad[0]+","+cat.grad[1]+")";

  return (
    <div style={{fontFamily:BODY,background:C.bg,minHeight:"100vh",color:C.ink,display:"flex",flexDirection:"column"}}>

      {/* Nav */}
      <Nav
        left={
          <button onClick={onBack}
            style={{background:"none",border:"none",cursor:"pointer",fontFamily:LOGO,fontSize:24,fontWeight:700,letterSpacing:"-.5px",color:C.ink,padding:0}}>
            TrackThisNow
          </button>
        }
        center=""
        right={
          <button onClick={onBack}
            style={{background:C.ink,border:"none",borderRadius:99,padding:"9px 18px",fontSize:14,fontWeight:600,color:"#fff",fontFamily:BODY,cursor:"pointer",display:"flex",alignItems:"center",gap:6,letterSpacing:"-.1px"}}>
            <svg width="9" height="15" viewBox="0 0 9 15" fill="none"><path d="M7.5 1.5L1.5 7.5L7.5 13.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to My tracks
          </button>
        }
      />

      {/* Hero */}
      <div style={{padding:"0"}}>
        <div style={{background:gradStr,position:"relative",overflow:"hidden",padding:"80px 0 32px",boxShadow:"0 8px 40px "+rgba(cat.grad[0],.35),maxWidth:1080,width:"100%",margin:"0 auto",borderRadius:22}}>
          <div style={{position:"absolute",top:-50,right:-50,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,.13)",pointerEvents:"none"}} />
          <div style={{position:"absolute",bottom:-70,left:-40,width:180,height:180,borderRadius:"50%",background:"rgba(0,0,0,.1)",pointerEvents:"none"}} />
          <div style={{maxWidth:1080,margin:"0 auto",padding:"0 24px"}}>
            <div style={{fontSize:52,lineHeight:1,marginBottom:8,marginTop:24}}>{cat.emoji}</div>
            <div style={{fontFamily:LOGO,fontSize:30,fontWeight:700,letterSpacing:"-1px",color:"#fff",lineHeight:1.1}}>{cat.name}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{flex:1,maxWidth:1080,margin:"0 auto",width:"100%",padding:"28px 24px 0"}}>

        {/* Log entry */}
        <h2 style={{fontFamily:LOGO,fontSize:18,fontWeight:700,letterSpacing:"-.5px",color:C.ink,marginBottom:16,marginTop:24}}>Log entry</h2>

        {/* Counter */}
        {cat.type==="count" && (
          <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:28}}>
            {cat.subcategories.map(sub => {
              const tc = getTodayCount(logs, cat.id, sub.id);
              const fk = cat.id+"-"+sub.id, fl = flash===fk;
              return (
                <button key={sub.id} onClick={()=>track(sub.id)}
                  onMouseEnter={e=>{ e.currentTarget.style.background=C.ink; e.currentTarget.style.color="#fff"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 6px 16px rgba(0,0,0,.18)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=fl?C.ink:C.white; e.currentTarget.style.color=fl?"#fff":C.ink; e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,.07)"; }}
                  style={{border:"1px solid rgba(0,0,0,.08)",borderRadius:99,padding:"8px 22px",fontSize:15,fontWeight:600,fontFamily:BODY,cursor:"pointer",
                    background:fl?C.ink:C.white, color:fl?"#fff":C.ink,
                    boxShadow:"0 1px 4px rgba(0,0,0,.07)",
                    display:"flex",alignItems:"center",gap:10,transition:"all .18s"}}>
                  <span style={{fontSize:18,opacity:.8}}>+</span>
                  {sub.name}
                </button>
              );
            })}
            <button onClick={()=>setShowAddSub(true)}
              onMouseEnter={e=>{ e.currentTarget.style.background=C.ink; e.currentTarget.style.color="#fff"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 6px 16px rgba(0,0,0,.18)"; e.currentTarget.style.border="1.5px solid "+C.ink; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.ink3; e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.border="1.5px dashed rgba(0,0,0,.2)"; }}
              style={{border:"1.5px dashed rgba(0,0,0,.2)",borderRadius:99,padding:"8px 22px",fontSize:15,fontWeight:500,fontFamily:BODY,cursor:"pointer",background:"transparent",color:C.ink3,display:"flex",alignItems:"center",gap:8,transition:"all .18s"}}>
              + Add type
            </button>
          </div>
        )}

        {/* Single value */}
        {cat.type==="value" && (
          <div style={{background:C.white,borderRadius:20,padding:"22px 20px 18px",marginBottom:28,boxShadow:"0 2px 16px rgba(0,0,0,.06)",border:"1px solid rgba(0,0,0,.05)"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                <input type="number" placeholder="0.0" autoFocus
                  value={val[cat.id+"_1"]||""} onChange={e=>setVal(p=>({...p,[cat.id+"_1"]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&trackVal()}
                  style={{background:"transparent",border:"none",outline:"none",fontSize:72,fontWeight:300,color:C.ink,fontFamily:BODY,letterSpacing:"-3px",textAlign:"center",width:"auto",minWidth:80,maxWidth:220}} />
                <span style={{fontSize:24,color:C.ink3,fontWeight:400,paddingBottom:8}}>{cat.unit}</span>
              </div>
            </div>
            <PrimaryBtn label="Save" grad={cat.grad} onClick={trackVal} />
          </div>
        )}

        {/* Dual value */}
        {cat.type==="dual" && (
          <div style={{background:C.white,borderRadius:20,padding:"22px 20px 18px",marginBottom:28,boxShadow:"0 2px 16px rgba(0,0,0,.06)",border:"1px solid rgba(0,0,0,.05)"}}>
            <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:16}}>
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"flex-end"}}>
                <div style={{fontSize:11,fontWeight:600,color:C.ink3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>{cat.unit1}</div>
                <input type="number" placeholder="120" autoFocus
                  value={val[cat.id+"_1"]||""} onChange={e=>setVal(p=>({...p,[cat.id+"_1"]:e.target.value}))}
                  style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:64,fontWeight:300,color:C.ink,fontFamily:BODY,letterSpacing:"-3px",textAlign:"right"}} />
              </div>
              <span style={{fontSize:56,color:"rgba(0,0,0,.15)",fontWeight:200,padding:"0 10px",lineHeight:1,flexShrink:0,marginTop:20}}>/</span>
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
                <div style={{fontSize:11,fontWeight:600,color:C.ink3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>{cat.unit2}</div>
                <input type="number" placeholder="80"
                  value={val[cat.id+"_2"]||""} onChange={e=>setVal(p=>({...p,[cat.id+"_2"]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&trackVal()}
                  style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:64,fontWeight:300,color:C.ink,fontFamily:BODY,letterSpacing:"-3px",textAlign:"left"}} />
              </div>
            </div>
            <PrimaryBtn label="Save" grad={cat.grad} onClick={trackVal} />
          </div>
        )}

        {/* History */}
        {days.length > 0 && (
          <div style={{marginBottom:32}}>
            <h2 style={{fontFamily:LOGO,fontSize:18,fontWeight:700,letterSpacing:"-.5px",color:C.ink,marginBottom:16,marginTop:24}}>History</h2>
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              {days.map(day=>(
                <div key={day}>
                  <div style={{fontSize:12,fontWeight:600,color:C.ink3,marginBottom:8}}>{fmtDate(day)}</div>
                  <div style={{background:C.white,borderRadius:16,overflow:"hidden",boxShadow:"0 1px 8px rgba(0,0,0,.05)",border:"1px solid rgba(0,0,0,.05)"}}>
                    {grouped[day].map((l,i)=>{
                      const sub = cat.subcategories?.find(s=>s.id===l.subcategoryId);
                      return (
                        <div key={l.id}
                          style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 16px",borderBottom:i===grouped[day].length-1?"none":"1px solid rgba(0,0,0,.05)"}}>
                          <div style={{display:"flex",alignItems:"center",gap:12}}>
                            <span style={{fontSize:12,color:C.ink3,minWidth:44}}>{fmtTime(l.ts)}</span>
                            <span style={{fontSize:12,color:C.ink3,padding:"2px 8px",background:"rgba(0,0,0,.05)",borderRadius:99,whiteSpace:"nowrap"}}>
                              {new Date(l.date+"T12:00:00").toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"})}
                            </span>
                            {cat.type==="count"&&sub&&<span style={{fontSize:16,color:C.ink,fontWeight:500}}>{sub.name}</span>}
                            {cat.type==="value"&&<span style={{fontSize:16,fontWeight:500,color:day===today?cat.color:C.ink}}>{l.value}<span style={{fontSize:13,color:C.ink3,fontWeight:400}}> {cat.unit}</span></span>}
                            {cat.type==="dual"&&<span style={{fontSize:16,fontWeight:500,color:day===today?cat.color:C.ink}}>{l.value1}<span style={{fontSize:12,color:C.ink3}}> {cat.unit1} </span>/<span> </span>{l.value2}<span style={{fontSize:12,color:C.ink3}}> {cat.unit2}</span></span>}
                          </div>
                          <button onClick={()=>delLog(l.id)}
                            style={{background:"none",border:"none",cursor:"pointer",padding:"4px 6px",color:C.ink3,opacity:.4,display:"flex"}}>
                            <svg width="15" height="16" viewBox="0 0 15 16" fill="none"><path d="M1 3.5h13M5.5 3.5V2.5a1 1 0 011-1h2a1 1 0 011 1v1M12.5 3.5l-.9 10a1 1 0 01-1 .9H4.4a1 1 0 01-1-.9L2.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {catLogs.length===0 && (
          <div style={{textAlign:"center",padding:"3rem 1rem",color:C.ink3,fontSize:15}}>No entries yet.</div>
        )}

        <button onClick={delCat}
          style={{width:"100%",border:"none",borderRadius:16,padding:"15px 0",fontSize:16,fontWeight:600,color:C.red,fontFamily:BODY,cursor:"pointer",background:rgba(C.red,.07),marginBottom:32}}>
          Delete track
        </button>
      </div>

      <Footer />

      {showAddSub && (
        <Sheet onClose={()=>setShowAddSub(false)}>
          <div style={{padding:"24px 20px 32px"}}>
            <div style={{fontFamily:LOGO,fontSize:22,fontWeight:700,color:C.ink,marginBottom:20}}>New type</div>
            <TInput autoFocus placeholder="e.g. Beer, Run, Espresso" value={newSub}
              onChange={e=>setNewSub(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addSub()} style={{marginBottom:16}} />
            <PrimaryBtn label="Add type" grad={cat.grad} onClick={addSub} />
          </div>
        </Sheet>
      )}
    </div>
  );
}