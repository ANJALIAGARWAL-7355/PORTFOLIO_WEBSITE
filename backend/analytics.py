from datetime import date, datetime, timedelta
from typing import Dict, Optional, Tuple

if __package__:
    from .database import (
        delete_analytics_before,
        fetch_analytics_summary,
        record_analytics_event,
    )
else:
    from database import (
        delete_analytics_before,
        fetch_analytics_summary,
        record_analytics_event,
    )

EVENT_TYPES = frozenset(
    {"page_view", "project_view", "contact_submit", "navigation", "download"}
)
MAX_PAGE_LENGTH = 180
MAX_PROJECT_SLUG_LENGTH = 80


class AnalyticsValidationError(ValueError):
    pass


def _validate_text(value: object, field: str, max_length: int) -> str:
    if not isinstance(value, str):
        raise AnalyticsValidationError(f"{field} must be a string")
    cleaned = value.strip()
    if not cleaned:
        raise AnalyticsValidationError(f"{field} is required")
    if len(cleaned) > max_length:
        raise AnalyticsValidationError(f"{field} exceeds {max_length} characters")
    if "\x00" in cleaned:
        raise AnalyticsValidationError(f"{field} contains an invalid character")
    return cleaned


def validate_event(payload: object) -> Dict[str, Optional[str]]:
    if not isinstance(payload, dict):
        raise AnalyticsValidationError("JSON body must be an object")

    event_type = _validate_text(payload.get("event_type"), "event_type", 40)
    if event_type not in EVENT_TYPES:
        allowed = ", ".join(sorted(EVENT_TYPES))
        raise AnalyticsValidationError(f"event_type must be one of: {allowed}")

    page = _validate_text(payload.get("page"), "page", MAX_PAGE_LENGTH)
    if not page.startswith("/") or page.startswith("//"):
        raise AnalyticsValidationError("page must be a local path")

    project_slug = payload.get("project_slug")
    if project_slug is not None:
        project_slug = _validate_text(
            project_slug, "project_slug", MAX_PROJECT_SLUG_LENGTH
        )
        if any(character not in "abcdefghijklmnopqrstuvwxyz0123456789-" for character in project_slug):
            raise AnalyticsValidationError("project_slug contains invalid characters")

    if event_type == "project_view" and not project_slug:
        raise AnalyticsValidationError("project_slug is required for project_view events")

    return {
        "event_type": event_type,
        "page": page,
        "project_slug": project_slug,
    }


def record_event(payload: object, db_path: Optional[str] = None) -> int:
    event = validate_event(payload)
    arguments = (
        event["event_type"],
        event["page"],
        event["project_slug"],
    )
    if db_path is None:
        return record_analytics_event(*arguments)
    return record_analytics_event(*arguments, db_path=db_path)


def parse_start_date(value: Optional[str]) -> Optional[str]:
    if value is None or value == "":
        return None
    try:
        parsed_date = date.fromisoformat(value)
    except ValueError as exc:
        raise AnalyticsValidationError("since must use YYYY-MM-DD format") from exc
    return datetime.combine(parsed_date, datetime.min.time()).isoformat(sep=" ")


def get_summary(
    since: Optional[str] = None, db_path: Optional[str] = None
) -> Tuple[Dict[str, object], Optional[str]]:
    start_date = parse_start_date(since)
    if db_path is None:
        summary = fetch_analytics_summary(start_date)
    else:
        summary = fetch_analytics_summary(start_date, db_path=db_path)
    return summary, start_date


def purge_old_events(
    days: int, today: Optional[date] = None, db_path: Optional[str] = None
) -> int:
    if days < 1:
        raise ValueError("retention days must be greater than zero")
    reference_date = today or date.today()
    cutoff = reference_date - timedelta(days=days)
    cutoff_timestamp = datetime.combine(
        cutoff, datetime.min.time()
    ).isoformat(sep=" ")
    if db_path is None:
        return delete_analytics_before(cutoff_timestamp)
    return delete_analytics_before(cutoff_timestamp, db_path=db_path)
