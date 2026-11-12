import os
from dataclasses import dataclass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.environ.get(
    "CONTACTS_DB_PATH", os.path.join(BASE_DIR, "contacts.db")
)


def _origins_from_environment() -> tuple[str, ...]:
    configured = os.environ.get("CORS_ORIGINS", "*")
    origins = tuple(origin.strip() for origin in configured.split(",") if origin.strip())
    return origins or ("*",)


@dataclass(frozen=True)
class AppSettings:
    service_name: str = "Anjali Agarwal Portfolio API"
    host: str = os.environ.get("HOST", "127.0.0.1")
    port: int = int(os.environ.get("PORT", "5000"))
    db_path: str = DB_PATH
    allowed_origins: tuple[str, ...] = _origins_from_environment()
    admin_token: str = os.environ.get("CONTACT_ADMIN_TOKEN", "")
    contact_rate_limit: int = int(os.environ.get("CONTACT_RATE_LIMIT", "5"))
    contact_rate_window: int = int(os.environ.get("CONTACT_RATE_WINDOW", "60"))


settings = AppSettings()
