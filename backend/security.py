"""Input normalization and constant-time bearer-token checks."""

import hmac
import re
from typing import Optional


def sanitize_text(value: str, max_length: int = 2000) -> str:
    cleaned = value.strip().replace("\r", "").replace("\n", " ")
    cleaned = " ".join(cleaned.split())
    if len(cleaned) > max_length:
        return cleaned[:max_length]
    return cleaned


def safe_subject(value: str) -> str:
    return sanitize_text(value, max_length=140) or "Portfolio Inquiry"


def is_admin_authorized(
    authorization_header: Optional[str], configured_token: str
) -> bool:
    if not configured_token or not authorization_header:
        return False
    match = re.fullmatch(r"Bearer\s+([^\s]+)", authorization_header, re.IGNORECASE)
    if not match:
        return False
    return hmac.compare_digest(match.group(1), configured_token)
