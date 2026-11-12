"""Lightweight input sanitization helpers."""


def sanitize_text(value: str, max_length: int = 2000) -> str:
    cleaned = (value or "").strip()
    cleaned = cleaned.replace("\r", "").replace("\n", " ")
    cleaned = " ".join(cleaned.split())
    if len(cleaned) > max_length:
        return cleaned[: max_length - 3].rstrip() + "..."
    return cleaned


def safe_subject(value: str) -> str:
    subject = sanitize_text(value, max_length=140)
    return subject if subject else "Portfolio Inquiry"
