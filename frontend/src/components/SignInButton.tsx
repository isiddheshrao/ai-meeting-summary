import { requestAccessToken } from "../lib/googleAuth";
import { APP_NAME, APP_VERSION, FOOTER, SIGNIN } from "../lib/copy";
import { GoogleIcon, CalendarIcon, MicIcon, SparkleIcon } from "./icons";

export function SignInButton({ onSignedIn }: { onSignedIn: (token: string) => void }) {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-600/30">
            <SparkleIcon className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-zinc-900">{APP_NAME}</span>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.12)] p-8">
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight text-center">
            {SIGNIN.tagline}
          </h1>
          <p className="mt-2 text-sm text-zinc-500 text-center leading-relaxed">
            {SIGNIN.description}
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                <CalendarIcon className="w-4 h-4 text-zinc-500" />
              </div>
              <p className="text-sm text-zinc-600 leading-snug">{SIGNIN.featureCalendar}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                <MicIcon className="w-4 h-4 text-zinc-500" />
              </div>
              <p className="text-sm text-zinc-600 leading-snug">{SIGNIN.featureCapture}</p>
            </div>
          </div>

          <button
            onClick={() => requestAccessToken(onSignedIn)}
            className="mt-7 w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 active:bg-zinc-950 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
          >
            <GoogleIcon className="w-4.5 h-4.5" />
            {SIGNIN.signInButton}
          </button>
          <p className="mt-3 text-xs text-zinc-400 text-center">{SIGNIN.privacyNote}</p>
        </div>

        <p className="mt-5 text-xs text-zinc-400 text-center">
          {FOOTER.authorPrefix}{" "}
          <a
            href={FOOTER.authorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-indigo-600 font-medium underline underline-offset-2 decoration-zinc-300 hover:decoration-indigo-400 transition-colors"
          >
            {FOOTER.authorName}
          </a>
          <span className="text-zinc-300"> · </span>
          <span className="tabular-nums">v{APP_VERSION}</span>
        </p>
      </div>
    </div>
  );
}
