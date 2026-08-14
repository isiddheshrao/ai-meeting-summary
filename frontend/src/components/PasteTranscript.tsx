import { useState } from "react";
import { PASTE_TRANSCRIPT } from "../lib/copy";
import { SparkleIcon } from "./icons";

export function PasteTranscript({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={PASTE_TRANSCRIPT.placeholder}
        rows={5}
        className="w-full text-sm text-zinc-700 rounded-xl border border-zinc-200 bg-zinc-50 p-3 placeholder:text-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus:bg-white resize-y"
      />
      <button
        onClick={() => onSubmit(value.trim())}
        disabled={value.trim().length === 0}
        className="mt-2.5 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-500"
      >
        <SparkleIcon className="w-4 h-4" />
        {PASTE_TRANSCRIPT.submitButton}
      </button>
    </div>
  );
}
