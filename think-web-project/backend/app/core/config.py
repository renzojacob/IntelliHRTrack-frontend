"""
Application Configuration
"""
from pydantic_settings import BaseSettings
from typing import List
import os
from pathlib import Path

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Think Web"
    ENVIRONMENT: str = "development"  # development, staging, production
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production-use-env-variable"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    # Use SQLite for demonstration, PostgreSQL for production
    DATABASE_URL: str = "sqlite:///./thinkweb.db"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Biometric Settings
    FACE_RECOGNITION_MODEL_PATH: str = "./models/insightface"
    FINGERPRINT_SDK_PATH: str = "./sdk/fingerprint"
    BIOMETRIC_ENCRYPTION_KEY: str = "your-biometric-encryption-key-32-bytes-long!"
    FACE_MATCH_THRESHOLD: float = 0.6
    LIVENESS_THRESHOLD: float = 0.7
    
    # File Upload
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_DIR: Path = Path("./uploads")
    
    # Redis (for caching and real-time features)
    REDIS_URL: str = "redis://localhost:6379"
    
    # Email (for notifications)
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# Create upload directory if it doesn't exist
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


