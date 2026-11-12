import sqlite3
from contextlib import contextmanager
from typing import Any, Dict, Iterator, List, Optional

if __package__:
    from .config import DB_PATH
else:
    from config import DB_PATH


CREATE_CONTACT_MESSAGES_TABLE = """
    CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new'
            CHECK (status IN ('new', 'read', 'replied', 'archived')),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
"""

CREATE_ANALYTICS_EVENTS_TABLE = """
    CREATE TABLE IF NOT EXISTS analytics_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        page TEXT NOT NULL,
        project_slug TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
"""


@contextmanager
def get_connection(db_path: str = DB_PATH) -> Iterator[sqlite3.Connection]:
    connection = sqlite3.connect(db_path, timeout=10)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def init_db(db_path: str = DB_PATH) -> None:
    with get_connection(db_path) as connection:
        connection.execute(CREATE_CONTACT_MESSAGES_TABLE)
        columns = {
            row["name"]
            for row in connection.execute("PRAGMA table_info(contact_messages)")
        }
        if "status" not in columns:
            connection.execute(
                "ALTER TABLE contact_messages ADD COLUMN status TEXT NOT NULL DEFAULT 'new'"
            )
        if "updated_at" not in columns:
            connection.execute(
                "ALTER TABLE contact_messages ADD COLUMN updated_at TEXT"
            )
            connection.execute(
                "UPDATE contact_messages "
                "SET updated_at = COALESCE(created_at, CURRENT_TIMESTAMP) "
                "WHERE updated_at IS NULL"
            )

        connection.execute(CREATE_ANALYTICS_EVENTS_TABLE)
        connection.execute(
            "CREATE INDEX IF NOT EXISTS idx_contact_status_created "
            "ON contact_messages(status, created_at DESC)"
        )
        connection.execute(
            "CREATE INDEX IF NOT EXISTS idx_analytics_type_created "
            "ON analytics_events(event_type, created_at DESC)"
        )
        connection.execute(
            "CREATE INDEX IF NOT EXISTS idx_analytics_project "
            "ON analytics_events(project_slug, created_at DESC)"
        )


def save_contact_message(
    name: str, email: str, subject: str, message: str, db_path: str = DB_PATH
) -> int:
    with get_connection(db_path) as connection:
        cursor = connection.execute(
            """
            INSERT INTO contact_messages (name, email, subject, message)
            VALUES (?, ?, ?, ?)
            """,
            (name, email, subject, message),
        )
        return int(cursor.lastrowid)


def fetch_contact_messages(
    limit: int = 20,
    offset: int = 0,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db_path: str = DB_PATH,
) -> List[Dict[str, Any]]:
    conditions = []
    values: List[Any] = []
    if status:
        conditions.append("status = ?")
        values.append(status)
    if search:
        conditions.append(
            "(name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)"
        )
        pattern = f"%{search}%"
        values.extend([pattern] * 4)

    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    values.extend([limit, offset])
    with get_connection(db_path) as connection:
        rows = connection.execute(
            f"""
            SELECT id, name, email, subject, message, status, created_at, updated_at
            FROM contact_messages
            {where_clause}
            ORDER BY id DESC
            LIMIT ? OFFSET ?
            """,
            values,
        ).fetchall()
    return [dict(row) for row in rows]


def count_contact_messages(
    status: Optional[str] = None,
    search: Optional[str] = None,
    db_path: str = DB_PATH,
) -> int:
    query = "SELECT COUNT(*) FROM contact_messages"
    conditions = []
    values: List[Any] = []
    if status:
        conditions.append("status = ?")
        values.append(status)
    if search:
        conditions.append(
            "(name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)"
        )
        values.extend([f"%{search}%"] * 4)
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    with get_connection(db_path) as connection:
        return int(connection.execute(query, values).fetchone()[0])


def update_contact_status(
    message_id: int, status: str, db_path: str = DB_PATH
) -> bool:
    with get_connection(db_path) as connection:
        cursor = connection.execute(
            """
            UPDATE contact_messages
            SET status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (status, message_id),
        )
        return cursor.rowcount == 1


def record_analytics_event(
    event_type: str,
    page: str,
    project_slug: Optional[str] = None,
    db_path: str = DB_PATH,
) -> int:
    with get_connection(db_path) as connection:
        cursor = connection.execute(
            """
            INSERT INTO analytics_events (event_type, page, project_slug)
            VALUES (?, ?, ?)
            """,
            (event_type, page, project_slug),
        )
        return int(cursor.lastrowid)


def fetch_analytics_summary(
    start_date: Optional[str] = None, db_path: str = DB_PATH
) -> Dict[str, Any]:
    date_filter = "WHERE created_at >= ?" if start_date else ""
    parameters = [start_date] if start_date else []
    with get_connection(db_path) as connection:
        total = connection.execute(
            f"SELECT COUNT(*) FROM analytics_events {date_filter}", parameters
        ).fetchone()[0]
        by_type = connection.execute(
            f"""
            SELECT event_type, COUNT(*) AS count
            FROM analytics_events {date_filter}
            GROUP BY event_type ORDER BY count DESC, event_type
            """,
            parameters,
        ).fetchall()
        top_pages = connection.execute(
            f"""
            SELECT page, COUNT(*) AS count
            FROM analytics_events {date_filter}
            GROUP BY page ORDER BY count DESC, page LIMIT 10
            """,
            parameters,
        ).fetchall()
        top_projects = connection.execute(
            f"""
            SELECT project_slug, COUNT(*) AS count
            FROM analytics_events
            {date_filter + ' AND' if date_filter else 'WHERE'} project_slug IS NOT NULL
            GROUP BY project_slug ORDER BY count DESC, project_slug LIMIT 10
            """,
            parameters,
        ).fetchall()

    return {
        "total_events": int(total),
        "by_type": {row["event_type"]: int(row["count"]) for row in by_type},
        "top_pages": [dict(row) for row in top_pages],
        "top_projects": [dict(row) for row in top_projects],
    }


def delete_analytics_before(cutoff: str, db_path: str = DB_PATH) -> int:
    with get_connection(db_path) as connection:
        cursor = connection.execute(
            "DELETE FROM analytics_events WHERE created_at < ?", (cutoff,)
        )
        return cursor.rowcount
