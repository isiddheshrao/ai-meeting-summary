import { useState } from "react";
import { SignInButton } from "./components/SignInButton";
import { MeetingList } from "./components/MeetingList";
import { MeetingDetail } from "./components/MeetingDetail";
import { NotesPanel } from "./components/NotesPanel";
import { DateStrip } from "./components/DateStrip";
import { AppFooter } from "./components/AppFooter";
import { HowItWorksPanel } from "./components/HowItWorksPanel";
import { SparkleIcon, AlertIcon, CalendarIcon, InfoIcon } from "./components/icons";
import { fetchMeetings, transcribeAudio, generateNotes } from "./lib/api";
import { dayKey } from "./lib/dateGroups";
import { APP_NAME, HEADER, NOTES, TRANSCRIPT_SECTION, MAIN_EMPTY_STATE, ERRORS } from "./lib/copy";
import type { Meeting, MeetingNotes } from "./types";

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [notes, setNotes] = useState<MeetingNotes | null>(null);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  async function handleSignedIn(token: string) {
    setAccessToken(token);
    setError(null);
    try {
      const result = await fetchMeetings(token);
      setMeetings(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : ERRORS.fetchMeetingsFailed);
    }
  }

  function selectMeeting(m: Meeting) {
    setSelectedMeeting(m);
    setTranscript(null);
    setNotes(null);
    setError(null);
  }

  async function handleRecordingReady(blob: Blob) {
    setError(null);
    setIsTranscribing(true);
    setTranscript(null);
    setNotes(null);
    try {
      const text = await transcribeAudio(blob);
      setTranscript(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : ERRORS.transcribeFailed);
    } finally {
      setIsTranscribing(false);
    }
  }

  function handleTranscriptPasted(text: string) {
    setError(null);
    setNotes(null);
    setTranscript(text);
  }

  async function handleGenerateNotes() {
    if (!selectedMeeting || !transcript) return;
    setError(null);
    setIsGeneratingNotes(true);
    try {
      const result = await generateNotes(
        { title: selectedMeeting.title, attendees: selectedMeeting.attendees },
        transcript
      );
      setNotes(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : ERRORS.generateNotesFailed);
    } finally {
      setIsGeneratingNotes(false);
    }
  }

  if (!accessToken) {
    return <SignInButton onSignedIn={handleSignedIn} />;
  }

  const displayedMeetings = selectedDayKey
    ? meetings.filter((m) => dayKey(m.start) === selectedDayKey)
    : meetings;

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="h-14 shrink-0 border-b border-zinc-200 flex items-center px-5 gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
          <SparkleIcon className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-semibold text-zinc-900 tracking-tight">{APP_NAME}</span>
        <button
          onClick={() => setHowItWorksOpen(true)}
          className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-colors"
        >
          <InfoIcon className="w-3.5 h-3.5" />
          {HEADER.howItWorks}
        </button>
      </header>

      <HowItWorksPanel open={howItWorksOpen} onClose={() => setHowItWorksOpen(false)} />

      {error && (
        <div className="flex items-start gap-2 text-sm text-rose-700 bg-rose-50 border-b border-rose-200 px-5 py-2.5">
          <AlertIcon className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex-1 min-h-0 flex">
        <aside className="w-80 shrink-0 border-r border-zinc-200 bg-zinc-50 overflow-y-auto flex flex-col">
          <DateStrip meetings={meetings} selectedKey={selectedDayKey} onSelectDay={setSelectedDayKey} />
          <div className="flex-1 overflow-y-auto">
            <MeetingList
              meetings={displayedMeetings}
              selectedId={selectedMeeting?.id ?? null}
              isFiltered={selectedDayKey !== null}
              onSelect={selectMeeting}
            />
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-linear-to-b from-zinc-50/60 to-white">
          {selectedMeeting ? (
            <div className="max-w-6xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="rounded-2xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-6">
                <MeetingDetail
                  meeting={selectedMeeting}
                  onRecordingReady={handleRecordingReady}
                  onTranscriptPasted={handleTranscriptPasted}
                />

                {isTranscribing && (
                  <p className="text-sm text-zinc-500 mt-4 flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-zinc-300 border-t-indigo-600 animate-spin" />
                    {TRANSCRIPT_SECTION.transcribingLabel}
                  </p>
                )}

                {transcript && (
                  <div className="mt-6 pt-6 border-t border-zinc-100">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">
                      {TRANSCRIPT_SECTION.heading}
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50 p-4 max-h-64 overflow-y-auto">
                      {transcript}
                    </p>
                    <button
                      onClick={handleGenerateNotes}
                      disabled={isGeneratingNotes}
                      className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                    >
                      {isGeneratingNotes ? (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                          {NOTES.generatingButton}
                        </>
                      ) : (
                        <>
                          <SparkleIcon className="w-4 h-4" />
                          {NOTES.generateButton}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="lg:sticky lg:top-8">
                {notes ? (
                  <div className="rounded-2xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-6">
                    <NotesPanel notes={notes} />
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-zinc-200 p-6 min-h-55 flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center mb-3">
                      <SparkleIcon className="w-4 h-4 text-zinc-300" />
                    </div>
                    <p className="text-sm text-zinc-400 max-w-[28ch]">
                      {transcript ? NOTES.placeholderReady : NOTES.placeholderNoTranscript}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
                <CalendarIcon className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-zinc-700">{MAIN_EMPTY_STATE.title}</p>
              <p className="text-xs text-zinc-400 mt-1">{MAIN_EMPTY_STATE.subtitle}</p>
            </div>
          )}
        </main>
      </div>

      <AppFooter />
    </div>
  );
}

export default App;
