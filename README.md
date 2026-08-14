# Notewell: AI Meeting Notes Companion

An AI meeting companion: sign in with Google, see your real meetings in a ±7 day window, capture
a call's audio straight from your browser tab, and get a structured summary (decisions + action
items) without typing a single note during the meeting.

**Status: early prototype (v0.5.0).** Built as a timed exercise, not a finished product. See
[Known limitations](#known-limitations) and [Roadmap](#roadmap) before relying on this for
anything real.

## How it works

1. Sign in with Google (read-only Calendar access via Google Identity Services).
2. See your meetings from 7 days ago to 7 days from now.
3. Pick a meeting:
   - **Upcoming or in-progress:** capture the call's tab audio live (`getDisplayMedia`), stop
     when done, get a transcript back.
   - **Already ended:** paste in a transcript from wherever you have one instead (capture only
     works for calls that haven't finished yet).
4. Generate notes. An LLM turns the transcript into a summary, decisions, and action items.

Nothing is persisted. Close the tab and it's gone. See [Roadmap](#roadmap) for why that's
temporary, not a design philosophy.

### What capture actually records

`getDisplayMedia` tab-audio capture records whatever plays **out of** the tab you pick, meaning
what you'd hear through your speakers. Most call platforms, including Google Meet, don't echo
your own microphone back into the tab, so **your own voice usually isn't in the recording**. The
transcript mainly reflects what other participants said. This is also explained in-app under the
"How it works" popup in the header.

Audio is recorded as raw PCM and encoded to WAV entirely in the browser via the Web Audio API,
since the NVIDIA transcription endpoint expects a clean audio container it can read directly.

## Architecture

- **Frontend:** Vite + React + TypeScript + Tailwind CSS v4, in `frontend/`.
- **Backend:** three independent FastAPI apps in `api/` (`meetings.py`, `transcribe.py`,
  `generate_notes.py`), each deployed as its own Vercel serverless function. Locally they run as
  three separate `uvicorn` processes on different ports.
- **Auth:** Google Identity Services token client, `calendar.readonly` scope, client-side only.
  The access token is passed to the backend per-request, never stored.
- **Transcription:** NVIDIA NIM hosted Parakeet ASR, called via a dedicated invocation URL tied to
  your NVIDIA account and the specific ASR model you pick.
- **Notes generation:** NVIDIA NIM hosted LLM via the OpenAI-compatible
  `https://integrate.api.nvidia.com/v1` endpoint, defaulting to `meta/llama-3.1-8b-instruct` for
  fast, reliable structured JSON output.
- **Persistence:** none. All state is in-memory React state for the session.

## Setup

### Prerequisites

- Node.js, Python 3.10+
- A Google Cloud project with the **Calendar API enabled** and an OAuth Client ID (Web
  application type, `http://localhost:5173` as an authorized JavaScript origin)
- An NVIDIA NIM API key from [build.nvidia.com](https://build.nvidia.com), plus the specific
  invocation URL for whichever Parakeet ASR model you pick from your account's model page

### Environment variables

Root `.env` (backend, never commit this file):

```dotenv
NVIDIA_API_KEY=your-nvidia-nim-api-key
NVIDIA_ASR_URL=https://<your-function-id>.invocation.api.nvcf.nvidia.com/v1/audio/transcriptions
NVIDIA_NOTES_MODEL=meta/llama-3.1-8b-instruct   # optional, this is the default
FRONTEND_ORIGIN=http://localhost:5173            # optional, this is the default
MEETINGS_WINDOW_DAYS=7                           # optional, this is the default
```

`frontend/.env.local` (frontend, never commit this file):

```dotenv
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

### Run it

Backend (three separate terminals, or three background processes):

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

uvicorn api.meetings:app --port 8001
uvicorn api.transcribe:app --port 8002
uvicorn api.generate_notes:app --port 8003
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in **Chrome or Edge** (tab-audio capture doesn't work in
Firefox/Safari).

### Trying it without a live call

Pick a meeting that's already ended and paste in one of the sample transcripts in
[`docs/demo-transcripts.md`](docs/demo-transcripts.md), fictional transcripts written for
testing the paste-and-summarize flow without needing a real recording.

## Deploying to Vercel

The repo ships with a `vercel.json` that builds the frontend as a static site and each file in
`api/` as its own Python serverless function, all served from one deployment.

1. Push the repo to GitHub (or your Git provider of choice) and import it in Vercel, or run
   `vercel` from the project root with the [Vercel CLI](https://vercel.com/docs/cli) installed.
2. Leave the project root as the repository root. `vercel.json` handles routing the frontend
   build and the three API functions itself.
3. In the Vercel project's environment variables, set the same backend variables as the local
   `.env` file (`NVIDIA_API_KEY`, `NVIDIA_ASR_URL`, and optionally `NVIDIA_NOTES_MODEL`,
   `MEETINGS_WINDOW_DAYS`), plus `VITE_GOOGLE_CLIENT_ID` for the frontend build.
4. In Google Cloud Console, add the deployed Vercel domain as an authorized JavaScript origin on
   the OAuth Client ID (in addition to `http://localhost:5173` for local dev).
5. Deploy. Frontend and API end up on the same origin, so no CORS configuration is needed in
   production; `FRONTEND_ORIGIN` only matters for local dev, where the frontend and the three API
   servers run on different ports.

## Known limitations

- **Chrome/Edge only.** Tab-audio capture is not supported elsewhere.
- **Only captures what plays through the tab**, not your own microphone directly. See
  [What capture actually records](#what-capture-actually-records).
- **Session-only.** No database, no accounts beyond Google sign-in, nothing survives a page
  refresh.
- **NVIDIA free-tier variability.** Response latency and model availability on NVIDIA's hosted
  catalog can vary. `NVIDIA_NOTES_MODEL` defaults to a smaller, faster model chosen for
  reliability over a larger one that was intermittently timing out during development.
- **No production auth hardening.** This is a prototype OAuth flow with a client-side token, not
  a production-grade session/auth system.

## Roadmap

Ranked by what a real user hitting this after one meeting would ask for next:

1. **Meeting history & goals.** Right now closing the tab throws everything away. Persisting past
   summaries (and letting users attach goals to a meeting or a series of meetings) is the single
   biggest gap between a cute demo and a tool people actually keep open.
2. **Goal-based reminders.** Once goals exist, surface them back proactively (for example,
   flagging that you said you'd follow up on pricing by Monday) instead of leaving action items
   to sit unread in a summary no one reopens.
3. **Meeting grouping/segmentation.** Group recurring meetings (weekly 1:1s, a standing project
   sync) so notes accumulate as a timeline per relationship or project, not as dozens of
   disconnected entries in a flat list.
4. **Bot-based capture for non-browser calls.** Tab-audio capture only works for in-browser calls.
   A Zoom/Meet bot-based capture integration (Otter/Fireflies-style) would cover native desktop
   app calls, at the cost of real integration complexity with each platform's bot APIs.

Deliberately **not** on this list (cut during scoping, not overlooked): booking-link creation,
multi-calendar support, team-shared notes, and action-item sync to external task tools. All
reasonable ideas, but each expands scope in a direction this prototype isn't trying to prove yet.
