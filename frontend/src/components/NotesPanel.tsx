import type { MeetingNotes } from "../types";
import { NOTES } from "../lib/copy";
import { SparkleIcon } from "./icons";

export function NotesPanel({ notes }: { notes: MeetingNotes }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <SparkleIcon className="w-4 h-4 text-indigo-600" />
        <h3 className="text-sm font-semibold text-zinc-900">{NOTES.heading}</h3>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] divide-y divide-zinc-100">
        <div className="p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1.5">
            {NOTES.summaryLabel}
          </h4>
          <p className="text-sm text-zinc-700 leading-relaxed">{notes.summary}</p>
        </div>

        <div className="p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1.5">
            {NOTES.decisionsLabel}
          </h4>
          {notes.decisions.length > 0 ? (
            <ul className="space-y-1.5">
              {notes.decisions.map((d, i) => (
                <li key={i} className="text-sm text-zinc-700 flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-zinc-400 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-400">{NOTES.noneRecorded}</p>
          )}
        </div>

        <div className="p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1.5">
            {NOTES.actionItemsLabel}
          </h4>
          {notes.actionItems.length > 0 ? (
            <ul className="space-y-2">
              {notes.actionItems.map((a, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-0.5 w-4 h-4 rounded border border-zinc-300 shrink-0" />
                  <span className="text-sm text-zinc-700 leading-snug">
                    {a.text}
                    {a.owner && (
                      <span className="ml-1.5 text-xs text-indigo-600 font-medium">{a.owner}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-400">{NOTES.noneRecorded}</p>
          )}
        </div>
      </div>
    </div>
  );
}
