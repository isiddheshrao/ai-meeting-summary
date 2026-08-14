import os

from dotenv import load_dotenv

load_dotenv()

NVIDIA_API_KEY = os.environ["NVIDIA_API_KEY"]
NVIDIA_CHAT_BASE_URL = os.environ.get("NVIDIA_CHAT_BASE_URL", "https://integrate.api.nvidia.com/v1")
NVIDIA_ASR_URL = os.environ["NVIDIA_ASR_URL"]
NVIDIA_ASR_LANGUAGE = os.environ.get("NVIDIA_ASR_LANGUAGE", "en-US")
NVIDIA_NOTES_MODEL = os.environ.get("NVIDIA_NOTES_MODEL", "meta/llama-3.1-8b-instruct")
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")
MEETINGS_WINDOW_DAYS = int(os.environ.get("MEETINGS_WINDOW_DAYS", "7"))
