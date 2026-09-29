import { useCallback, useEffect, useRef, useState } from "react";

/* ---------- toast ---------- */
type ToastState = { message: string; undo?: () => void; duration: number; key: number };

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const removeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Slide out, then remove.
  const dismiss = useCallback(() => {
    clearTimeout(timer.current);
    setVisible(false);
    clearTimeout(removeTimer.current);
    removeTimer.current = setTimeout(() => setToast(null), 250);
  }, []);

  const show = useCallback(
    (message: string, undo?: () => void) => {
      clearTimeout(timer.current);
      clearTimeout(removeTimer.current);
      const duration = undo ? 6000 : 3000;
      setToast({ message, undo, duration, key: Date.now() });
      setVisible(false);
      // Two frames so the browser paints the hidden state before sliding in.
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      timer.current = setTimeout(dismiss, duration);
    },
    [dismiss]
  );

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      clearTimeout(removeTimer.current);
    },
    []
  );

  const node = toast && (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-[calc(24px+env(safe-area-inset-bottom,0px))] left-1/2 z-[60] w-max max-w-[calc(100vw-32px)] -translate-x-1/2 overflow-hidden rounded-2xl bg-[#111827] text-white shadow-[0_18px_40px_rgba(17,24,39,.35),0_0_0_1px_rgba(255,255,255,.08)] transition-all duration-300 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none ${
        visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0"
      }`}
    >
      <div className="flex items-center gap-3 py-2.5 pl-3 pr-2">
        {/* icon: check for a finished action, arrow for something that can be undone */}
        <span
          aria-hidden="true"
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full shadow-[0_4px_12px_rgba(0,0,0,.25)] ${
            toast.undo ? "bg-white/15" : "bg-[linear-gradient(135deg,#13795B_0%,#3AA873_100%)]"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            {toast.undo ? <path d="M9 14L4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /> : <path d="M5 12.5l4.5 4.5L19 7.5" />}
          </svg>
        </span>

        <span className="min-w-0 pr-1 text-[15px] font-semibold leading-snug">{toast.message}</span>

        {toast.undo && (
          <button
            type="button"
            onClick={() => {
              const u = toast.undo;
              dismiss();
              u?.();
            }}
            className="min-h-9 shrink-0 rounded-[10px] bg-white/15 px-3.5 text-sm font-bold hover:bg-white/25"
          >
            Undo
          </button>
        )}

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] text-[#AEB7C4] hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" className="h-4 w-4">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {/* time left, in the Dawn sky colors */}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
        <span
          key={toast.key}
          className="block h-full bg-[linear-gradient(90deg,#7B6CF6_0%,#FF7E8A_50%,#FFC46B_100%)]"
          style={{
            width: visible ? "0%" : "100%",
            transition: visible ? `width ${toast.duration}ms linear` : "none",
          }}
        />
      </span>
    </div>
  );

  return [show, dismiss, node] as const;
}