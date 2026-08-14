from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from api.config import FRONTEND_ORIGIN, MEETINGS_WINDOW_DAYS

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/api/meetings")
def get_meetings(access_token: str = Query(...)):
    creds = Credentials(token=access_token)
    try:
        service = build("calendar", "v3", credentials=creds)
        now = datetime.now(timezone.utc)
        time_min = (now - timedelta(days=MEETINGS_WINDOW_DAYS)).isoformat()
        time_max = (now + timedelta(days=MEETINGS_WINDOW_DAYS)).isoformat()
        events_result = (
            service.events()
            .list(
                calendarId="primary",
                timeMin=time_min,
                timeMax=time_max,
                singleEvents=True,
                orderBy="startTime",
            )
            .execute()
        )
    except HttpError as e:
        raise HTTPException(status_code=e.resp.status, detail=e.reason)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

    meetings = []
    for event in events_result.get("items", []):
        meetings.append(
            {
                "id": event.get("id"),
                "title": event.get("summary", "(no title)"),
                "start": event.get("start", {}).get("dateTime") or event.get("start", {}).get("date"),
                "end": event.get("end", {}).get("dateTime") or event.get("end", {}).get("date"),
                "attendees": [a.get("email") for a in event.get("attendees", [])],
            }
        )
    return meetings
