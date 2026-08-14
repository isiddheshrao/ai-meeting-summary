import { APP_VERSION, FOOTER } from "../lib/copy";
import { SparkleIcon } from "./icons";

export function AppFooter() {
  return (
    <footer className="shrink-0 border-t border-zinc-200 bg-zinc-50">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-5 py-2.5 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5">
          <SparkleIcon className="w-2.5 h-2.5" />
          {FOOTER.badge}
        </span>
        <span className="text-zinc-500">{FOOTER.roadmap}</span>
        <span className="ml-auto flex items-center gap-1.5 text-zinc-400">
          <span>
            {FOOTER.authorPrefix}{" "}
            <a
              href={FOOTER.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-indigo-600 font-medium underline underline-offset-2 decoration-zinc-300 hover:decoration-indigo-400 transition-colors"
            >
              {FOOTER.authorName}
            </a>
          </span>
          <span className="text-zinc-300">·</span>
          <span className="tabular-nums">v{APP_VERSION}</span>
        </span>
      </div>
    </footer>
  );
}
