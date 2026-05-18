import { useState, useEffect } from "react";
import TrackerHome   from "./tracker-home.jsx";
import TrackerDetail from "./tracker-detail.jsx";
import {
  openDB, dbGetAll, dbPutAll,
  DEFAULT_CATS, seedLogs, C, BODY,
} from "./tracker-shared.js";

/**
 * TrackerApp — root component.
 * Owns shared state (cats, logs) and routes between Home and Detail.
 */
export default function TrackerApp() {
  const [cats,      setCats]    = useState([]);
  const [logs,      setLogs]    = useState([]);
  const [loaded,    setLoaded]  = useState(false);
  const [detailId,  setDetailId] = useState(null);

  // ── Load from IndexedDB on mount ──────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const db          = await openDB();
        const storedCats  = await dbGetAll(db, "categories");
        const storedLogs  = await dbGetAll(db, "logs");

        if (storedCats.length > 0) {
          setCats(storedCats);
          if (storedLogs.length > 0) setLogs(storedLogs);
        } else {
          // First run — seed defaults + sample logs
          const seeds = seedLogs();
          await dbPutAll(db, "categories", DEFAULT_CATS);
          await dbPutAll(db, "logs",       seeds);
          setCats(DEFAULT_CATS);
          setLogs(seeds);
        }
      } catch(_) {
        setCats(DEFAULT_CATS);
        setLogs(seedLogs());
      }
      setLoaded(true);
    })();
  }, []);

  // ── Loading screen ────────────────────────────────────────────
  if (!loaded) return (
    <div style={{ background:C.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:BODY, fontSize:15, color:"#9A9A95" }}>
      Loading...
    </div>
  );

  // ── Detail page ───────────────────────────────────────────────
  const detailCat = cats.find(c => c.id === detailId);
  if (detailId && detailCat) {
    return (
      <TrackerDetail
        cat={detailCat}
        cats={cats}
        setCats={setCats}
        logs={logs}
        setLogs={setLogs}
        onBack={() => setDetailId(null)}
      />
    );
  }

  // ── Home page ─────────────────────────────────────────────────
  return (
    <TrackerHome
      cats={cats}
      setCats={setCats}
      logs={logs}
      setLogs={setLogs}
      onOpen={(catId) => setDetailId(catId)}
    />
  );
}