import os
from typing import Optional

try:
    from pydantic_settings import BaseSettings
    class Settings(BaseSettings):
        MONGO_DETAILS: str = "mongodb://localhost:27017/student_db"
        SECRET_KEY: str = "supersecretjwtkey_change_this_for_production_1234567890"
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
        GEMINI_API_KEY: Optional[str] = ""
        GROQ_API_KEY: Optional[str] = ""
        PORT: int = 8000
        HOST: str = "0.0.0.0"

        class Config:
            env_file = ".env"
            extra = "allow"
    settings = Settings()
except ImportError:
    # Resilient standard library & Pydantic v1/v2 fallback
    class Settings:
        def __init__(self):
            self.MONGO_DETAILS = os.getenv("MONGO_DETAILS", "mongodb://localhost:27017/student_db")
            self.SECRET_KEY = os.getenv("SECRET_KEY", "supersecretjwtkey_change_this_for_production_1234567890")
            self.ALGORITHM = os.getenv("ALGORITHM", "HS256")
            self.ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
            self.GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
            self.GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
            self.PORT = int(os.getenv("PORT", "8000"))
            self.HOST = os.getenv("HOST", "0.0.0.0")

    settings = Settings()
