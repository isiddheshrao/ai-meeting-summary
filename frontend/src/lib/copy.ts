export const APP_NAME = "Notewell";
export const APP_VERSION = "0.5.0";

export const SIGNIN = {
  tagline: "Meeting notes, without the notes",
  description:
    "Connect your calendar, capture the call, and walk away with a summary. Never type during a meeting again.",
  featureCalendar: "See your real meetings, ±7 days, from Google Calendar",
  featureCapture: "Capture the call's audio straight from your browser tab",
  signInButton: "Sign in with Google",
  privacyNote: "Read-only calendar access. Nothing is saved after you close this tab.",
};

export const HEADER = {
  howItWorks: "How it works",
};

export const HOW_IT_WORKS = {
  title: "How capture actually works",
  points: [
    {
      title: "Pick the right tab",
      body: "Chrome asks you to pick a tab or window to share. Choose the tab your call is running in and check \"Share tab audio\": that's what actually gets recorded.",
    },
    {
      title: "You're capturing what you hear",
      body: "Captured audio is whatever plays out of that tab's speaker output, meaning everyone else's voice in the call. Most video-call platforms, including Google Meet, don't echo your own microphone back into the tab.",
    },
    {
      title: "Your own voice usually isn't included",
      body: "The transcript and notes mainly reflect what other participants said. That's normally enough for a useful summary, but write your own commitments down separately if they matter word-for-word.",
    },
    {
      title: "Already-ended meetings work differently",
      body: "Capture only works for calls happening now or in the future. For a meeting that's already over, paste in a transcript from wherever you have one instead.",
    },
  ],
};

export const MEETING_LIST = {
  emptyTitleDefault: "No meetings nearby",
  emptySubtitleDefault: "Nothing in the 7 days behind or ahead of today.",
  emptyTitleFiltered: "Nothing on this day",
  emptySubtitleFiltered: "Try another day on the strip above.",
};

export const CAPTURE = {
  startButton: "Capture Call Audio",
  stopButton: "Stop & Transcribe",
  noAudioTrackError: "No audio track captured. Make sure to check \"Share tab audio\" in the picker.",
  genericError: "Failed to start capture",
  caveat: "Captures other participants' voices from the tab, not your own microphone.",
};

export const PASTE_TRANSCRIPT = {
  placeholder: "Paste the transcript from this meeting...",
  submitButton: "Use This Transcript",
};

export const NOTES = {
  heading: "Notes",
  summaryLabel: "Summary",
  decisionsLabel: "Decisions",
  actionItemsLabel: "Action items",
  noneRecorded: "None recorded.",
  placeholderNoTranscript: "Notes will appear here once there's a transcript to work from.",
  placeholderReady: "Click “Generate Notes” to summarize this transcript.",
  generateButton: "Generate Notes",
  generatingButton: "Generating...",
};

export const TRANSCRIPT_SECTION = {
  heading: "Transcript",
  transcribingLabel: "Transcribing...",
};

export const MAIN_EMPTY_STATE = {
  title: "Select a meeting",
  subtitle: "Pick one from the list to capture and summarize it.",
};

export const ERRORS = {
  fetchMeetingsFailed: "Failed to load meetings",
  transcribeFailed: "Failed to transcribe audio",
  generateNotesFailed: "Failed to generate notes",
};

export const FOOTER = {
  badge: "Prototype",
  roadmap: "Up next: meeting history & goals, goal-based reminders, meeting grouping",
  authorPrefix: "Built by",
  authorName: "Siddhesh Rao",
  authorUrl: "https://www.siddheshrao.dev",
};
