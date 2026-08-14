import type { Meeting, MeetingNotes } from "../types";

// Local dev: each FastAPI function runs on its own uvicorn port.
// In Vercel production, all three live under /api/* on the same origin as the frontend,
// so the base is empty and fetches resolve as relative same-origin paths.
const MEETINGS_BASE =
  import.meta.env.VITE_MEETINGS_API_BASE ?? (import.meta.env.DEV ? "http://localhost:8001" : "");
const TRANSCRIBE_BASE =
  import.meta.env.VITE_TRANSCRIBE_API_BASE ?? (import.meta.env.DEV ? "http://localhost:8002" : "");
const NOTES_BASE =
  import.meta.env.VITE_NOTES_API_BASE ?? (import.meta.env.DEV ? "http://localhost:8003" : "");

export async function fetchMeetings(accessToken: string): Promise<Meeting[]> {
  const res = await fetch(`${MEETINGS_BASE}/api/meetings?access_token=${encodeURIComponent(accessToken)}`);
  if (!res.ok) throw new Error(`fetchMeetings failed: ${res.status}`);
  return res.json();
}

export async function transcribeAudio(blob: Blob): Promise<string> {
  const form = new FormData();
  form.append("file", blob, "audio.wav");
  const res = await fetch(`${TRANSCRIBE_BASE}/api/transcribe`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`transcribeAudio failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.transcript;
}

export async function generateNotes(
  meetingContext: { title: string; attendees: string[] },
  transcript: string
): Promise<MeetingNotes> {
  const res = await fetch(`${NOTES_BASE}/api/generate-notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meetingContext, transcript }),
  });
  if (!res.ok) throw new Error(`generateNotes failed: ${res.status} ${await res.text()}`);
  return res.json();
}
