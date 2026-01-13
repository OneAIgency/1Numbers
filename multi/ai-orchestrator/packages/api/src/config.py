"""
Application Configuration

Centralized configuration using Pydantic Settings.
"""

from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Application
    app_name: str = "AI Orchestrator API"
    app_version: str = "2.0.0"
    debug: bool = False
    environment: Literal["development", "staging", "production"] = "development"

    # Server
    host: str = "127.0.0.1"
    port: int = 8000

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/orchestrator"
    db_pool_size: int = 5
    db_max_overflow: int = 10

    # Redis
    redis_url: str = "redis://localhost:6379/0"
    redis_cache_ttl: int = 3600

    # AI Providers
    anthropic_api_key: str = ""
    claude_default_model: str = "claude-3-5-sonnet-20241022"
    claude_temperature: float = 0.7
    claude_max_tokens: int = 4096

    ollama_base_url: str = "http://localhost:11434"
    ollama_default_model: str = "codellama:7b"
    ollama_timeout: int = 300

    # Orchestration
    default_mode: str = "QUALITY"
    max_workers: int = 4
    task_timeout: int = 600000  # 10 minutes in ms

    # Project
    project_path: str = ""

    # Security
    secret_key: str = "change-me-in-production"
    cors_origins: list[str] = ["*"]

    # Logging
    log_level: str = "INFO"
    log_format: str = "json"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


# Global settings instance
settings = get_settings()
