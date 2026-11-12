import sqlite3
from typing import Any, Dict, List

from config import DB_PATH


CREATE_CONTACT_MESSAGES_TABLE = """
    CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
"""


def init_db() -> None:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(CREATE_CONTACT_MESSAGES_TABLE)
    conn.commit()
    conn.close()


def save_contact_message(name: str, email: str, subject: str, message: str) -> int:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
        (name, email, subject, message),
    )
    conn.commit()
    message_id = cursor.lastrowid
    conn.close()
    return int(message_id)


def fetch_contact_messages() -> List[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, name, email, subject, message, created_at FROM contact_messages ORDER BY id DESC"
    )
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": row[0],
            "name": row[1],
            "email": row[2],
            "subject": row[3],
            "message": row[4],
            "created_at": row[5],
        }
        for row in rows
    ]
