from openai import OpenAI

from api.config import NVIDIA_API_KEY, NVIDIA_CHAT_BASE_URL


def get_nvidia_client() -> OpenAI:
    return OpenAI(base_url=NVIDIA_CHAT_BASE_URL, api_key=NVIDIA_API_KEY)
