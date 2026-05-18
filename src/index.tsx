import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Workbox } from "workbox-window";

import App from "./App";
import "./index.css";

// ── PWA Service Worker ───────────────────────────────────────────────────────
if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
  const wb = new Workbox("/service-worker.js");

  wb.addEventListener("installed", (event) => {
    if (event.isUpdate) {
      if (confirm("New version available! Reload to update?")) {
        window.location.reload();
      }
    }
  });

  wb.register();
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element #root not found in the DOM.");
}

const root = createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
