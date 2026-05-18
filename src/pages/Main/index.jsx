import { useState, useEffect } from "react";
import TrackerApp     from "./tracker-app.jsx";
import WelcomeScreen  from "./tracker-welcome.jsx";
import { openDB, dbGetAll, C, BODY } from "./tracker-shared.js";

/**
 * Main — entry point.
 *
 * Flow:
 *   1. Opens IndexedDB and reads categories store.
 *   2. No categories → renders WelcomeScreen.
 *   3. Has categories → renders TrackerApp directly.
 *   4. WelcomeScreen calls onStart() after writing defaults to DB
 *      → switches to TrackerApp.
 */
export default function Main() {
  const [state, setState] = useState("loading"); // "loading" | "welcome" | "app"

  useEffect(() => {
    (async () => {
      try {
        const db   = await openDB();
        const cats = await dbGetAll(db, "categories");
        setState(cats.length > 0 ? "app" : "welcome");
      } catch(_) {
        setState("welcome");
      }
    })();
  }, []);

  if (state === "loading") {
    return (
      <div style={{ background:C.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:BODY, fontSize:15, color:"#9A9A95" }}>
        Loading...
      </div>
    );
  }

  if (state === "welcome") {
    return <WelcomeScreen onStart={() => setState("app")} />;
  }

  return <TrackerApp />;
}