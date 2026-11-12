import os
from dataclasses import dataclass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "contacts.db")


@dataclass(frozen=True)
class AppSettings:
    service_name: str = "Anjali Agarwal Portfolio API"
    host: str = os.environ.get("HOST", "127.0.0.1")
    port: int = int(os.environ.get("PORT", "5000"))
    db_path: str = DB_PATH
    allowed_origins: tuple[str, ...] = ("*",)


settings = AppSettings()
