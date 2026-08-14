import httpx
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from api.config import FRONTEND_ORIGIN, NVIDIA_API_KEY, NVIDIA_ASR_LANGUAGE, NVIDIA_ASR_URL

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_methods=["POST"],
    allow_headers=["*"],
)


@app.post("/api/transcribe")
async def transcribe(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            NVIDIA_ASR_URL,
            headers={"Authorization": f"Bearer {NVIDIA_API_KEY}"},
            data={"language": NVIDIA_ASR_LANGUAGE},
            files={"file": (file.filename or "audio.webm", audio_bytes, file.content_type or "audio/webm")},
        )
        if response.status_code >= 400:
            print(f"NVIDIA ASR error {response.status_code}: {response.text}")
            raise HTTPException(status_code=response.status_code, detail=response.text)
    return {"transcript": response.json().get("text", "")}
