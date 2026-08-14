import { useEffect, useRef } from "react";
import { HOW_IT_WORKS } from "../lib/copy";
import { MicIcon } from "./icons";

export function HowItWorksPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-it-works-title"
        className="w-full max-w-md rounded-2xl bg-white border border-zinc-200 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.25)] max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-start gap-3 px-6 pt-6 pb-4 border-b border-zinc-100">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
            <MicIcon className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 id="how-it-works-title" className="text-base font-semibold text-zinc-900 tracking-tight">
              {HOW_IT_WORKS.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="ml-auto shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <ol className="px-6 py-5 space-y-5">
          {HOW_IT_WORKS.points.map((point, i) => (
            <li key={i} className="flex gap-3.5">
              <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold flex items-center justify-center tabular-nums">
                {i + 1}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-sm font-medium text-zinc-900">{point.title}</p>
                <p className="text-sm text-zinc-500 leading-relaxed mt-0.5">{point.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
