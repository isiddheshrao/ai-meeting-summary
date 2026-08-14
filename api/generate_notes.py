import json

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from api._nvidia import get_nvidia_client
from api.config import FRONTEND_ORIGIN, NVIDIA_NOTES_MODEL

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_methods=["POST"],
    allow_headers=["*"],
)


class MeetingContext(BaseModel):
    title: str
    attendees: list[str] = []


class GenerateNotesRequest(BaseModel):
    meetingContext: MeetingContext
    transcript: str


SYSTEM_PROMPT = """You are a meeting-notes assistant. Given a meeting transcript, \
produce ONLY valid JSON matching exactly this shape, no markdown fences, no commentary:
{"summary": "string", "decisions": ["string"], "actionItems": [{"text": "string", "owner": "string or null"}]}"""

def _call_model(client, user_prompt: str) -> str:
    completion = client.chat.completions.create(
        model=NVIDIA_NOTES_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
        max_tokens=1024,
    )
    return completion.choices[0].message.content


@app.post("/api/generate-notes")
def generate_notes(req: GenerateNotesRequest):
    client = get_nvidia_client()
    user_prompt = (
        f"Meeting: {req.meetingContext.title}\n"
        f"Attendees: {', '.join(req.meetingContext.attendees) or 'unknown'}\n\n"
        f"Transcript:\n{req.transcript}"
    )
    raw = _call_model(client, user_prompt)
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        retry_prompt = (
            user_prompt
            + "\n\nYour previous response was not valid JSON. "
            "Respond with ONLY the JSON object, nothing else."
        )
        raw_retry = _call_model(client, retry_prompt)
        try:
            return json.loads(raw_retry)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=502,
                detail=f"Model did not return valid JSON after retry: {raw_retry[:500]}",
            )
