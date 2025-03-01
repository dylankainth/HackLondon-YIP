from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    MONGO_URI: Optional[str] = ""
    GEMINI_FLASH_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()
