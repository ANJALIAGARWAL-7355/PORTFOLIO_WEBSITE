import re
from typing import Any, Dict, Tuple

EMAIL_REGEX = re.compile(r"^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$")


def normalize_contact_payload(data: Dict[str, Any]) -> Tuple[Dict[str, str], Dict[str, str]]:
    payload = data or {}
    name = str(payload.get("name", "")).strip()
    email = str(payload.get("email", "")).strip()
    subject = str(payload.get("subject", "Portfolio Inquiry")).strip()
    message = str(payload.get("message", "")).strip()

    normalized = {
        "name": name,
        "email": email,
        "subject": subject or "Portfolio Inquiry",
        "message": message,
    }

    errors: Dict[str, str] = {}
    if not normalized["name"] or len(normalized["name"]) < 2:
        errors["name"] = "Name must be at least 2 characters long."
    if not normalized["email"] or not EMAIL_REGEX.match(normalized["email"]):
        errors["email"] = "Please provide a valid email address."
    if not normalized["message"] or len(normalized["message"]) < 5:
        errors["message"] = "Message must be at least 5 characters long."

    return normalized, errors
