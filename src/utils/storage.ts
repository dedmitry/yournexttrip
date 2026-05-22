// src/utils/storage.ts

import { Trip } from "@/types/trip";

const DB_NAME = "yournexttrip";
const DB_VERSION = 1;
const STORE = "trips";
const DB_INIT_KEY = "ynt_db_initialized";

// ─── Internal ─────────────────────────────────────────────────────────────────

export function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            if (!db.objectStoreNames.contains(STORE)) {
                db.createObjectStore(STORE, { keyPath: "id" });
            }
        };

        req.onsuccess = () => {
            localStorage.setItem(DB_INIT_KEY, "true");
            resolve(req.result);
        };

        req.onerror = () => {
            reject(req.error);
        };
    });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

export async function initDB(): Promise<void> {
    await openDB();
    localStorage.setItem(DB_INIT_KEY, "true");
}

export async function checkDBExists(): Promise<boolean> {
    return localStorage.getItem(DB_INIT_KEY) === "true";
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export async function saveTrip(trip: Trip): Promise<void> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");

        tx.objectStore(STORE).put(trip);

        tx.oncomplete = () => resolve();

        tx.onerror = () => {
            reject(tx.error);
        };
    });
}

export async function getTrip(id: number): Promise<Trip | undefined> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const req = db.transaction(STORE).objectStore(STORE).get(id);

        req.onsuccess = () => {
            resolve(req.result as Trip | undefined);
        };

        req.onerror = () => {
            reject(req.error);
        };
    });
}

export async function getAllTrips(): Promise<Trip[]> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const req = db.transaction(STORE).objectStore(STORE).getAll();

        req.onsuccess = () => {
            resolve(req.result as Trip[]);
        };

        req.onerror = () => {
            reject(req.error);
        };
    });
}

export async function deleteTrip(id: number): Promise<void> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");

        tx.objectStore(STORE).delete(id);

        tx.oncomplete = () => resolve();

        tx.onerror = () => {
            reject(tx.error);
        };
    });
}