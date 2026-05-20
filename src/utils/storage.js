// src/utils/storage.js

const DB_NAME = "yournexttrip";
const DB_VERSION = 1;
const STORE = "trips";
const DB_INIT_KEY = "ynt_db_initialized";


// ─── Internal ─────────────────────────────────────────────────────────────────

export function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE, { keyPath: "id" });
    };
    req.onsuccess = () => {
      localStorage.setItem(DB_INIT_KEY, "true");
      resolve(req.result)
    };
    req.onerror  = () => reject(req.error);
  });
}


// ─── Init ─────────────────────────────────────────────────────────────────────

export async function initDB() {
  await openDB(); // creates the store if it doesn't exist
  localStorage.setItem(DB_INIT_KEY, "true");
}

export async function checkDBExists() {
  return localStorage.getItem(DB_INIT_KEY) === "true";
}


// ─── CRUD ─────────────────────────────────────────────────────────────────────

export async function saveTrip(trip) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(trip);
    tx.oncomplete = resolve;
    tx.onerror    = () => reject(tx.error);
  });
}

export async function getTrip(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE).objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

export async function getAllTrips() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE).objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

export async function deleteTrip(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = resolve;
    tx.onerror    = () => reject(tx.error);
  });
}